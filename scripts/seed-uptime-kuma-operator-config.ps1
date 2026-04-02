Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$containerName = "hylono-uptime-kuma"
$baseUrl = "http://localhost:3002"
$statusPageSlug = "hylono-local"
$operatorUsername = "Hylono"
$operatorPassword = "HylonoKuma123!"
$operatorTimezone = "Europe/Warsaw"
$bootstrapResultPrefix = "__KUMA_BOOTSTRAP__"

$monitorDefinitions = @(
  [pscustomobject]@{ Name = "Main Site"; Url = "http://host.docker.internal:3000"; Group = "Core surfaces"; GroupWeight = 100; Tag = "core"; TagColor = "#06b6d4"; TagValue = "public" }
  [pscustomobject]@{ Name = "Control Panel"; Url = "http://host.docker.internal:3005/admin"; Group = "Core surfaces"; GroupWeight = 200; Tag = "ops"; TagColor = "#0f172a"; TagValue = "operator" }
  [pscustomobject]@{ Name = "Uptime Kuma"; Url = "http://host.docker.internal:3002"; Group = "Core surfaces"; GroupWeight = 300; Tag = "ops"; TagColor = "#0f172a"; TagValue = "monitoring" }
  [pscustomobject]@{ Name = "MinIO Console"; Url = "http://host.docker.internal:9001"; Group = "Commerce and operations"; GroupWeight = 100; Tag = "storage"; TagColor = "#d97706"; TagValue = "s3" }
  [pscustomobject]@{ Name = "n8n"; Url = "http://host.docker.internal:5678"; Group = "App layer"; GroupWeight = 100; Tag = "automation"; TagColor = "#0f766e"; TagValue = "workflow" }
  [pscustomobject]@{ Name = "Medusa Health"; Url = "http://host.docker.internal:8100/app/login"; Group = "Commerce and operations"; GroupWeight = 200; Tag = "commerce"; TagColor = "#0891b2"; TagValue = "catalog" }
  [pscustomobject]@{ Name = "Lago Front"; Url = "http://host.docker.internal:8102"; Group = "Commerce and operations"; GroupWeight = 300; Tag = "commerce"; TagColor = "#0891b2"; TagValue = "billing" }
  [pscustomobject]@{ Name = "Snipe-IT"; Url = "http://host.docker.internal:8104/login"; Group = "Commerce and operations"; GroupWeight = 400; Tag = "ops"; TagColor = "#0f172a"; TagValue = "assets" }
  [pscustomobject]@{ Name = "Cal.com"; Url = "http://host.docker.internal:8106"; Group = "App layer"; GroupWeight = 200; Tag = "booking"; TagColor = "#7c3aed"; TagValue = "calendar" }
  [pscustomobject]@{ Name = "Twenty CRM"; Url = "http://host.docker.internal:8107"; Group = "App layer"; GroupWeight = 300; Tag = "crm"; TagColor = "#2563eb"; TagValue = "pipeline" }
  [pscustomobject]@{ Name = "Documenso"; Url = "http://host.docker.internal:8108"; Group = "App layer"; GroupWeight = 400; Tag = "docs"; TagColor = "#475569"; TagValue = "signing" }
  [pscustomobject]@{ Name = "Zitadel Health"; Url = "http://host.docker.internal:8109/ui/console?login_hint=root@zitadel.localhost"; Group = "App layer"; GroupWeight = 500; Tag = "iam"; TagColor = "#9333ea"; TagValue = "identity" }
  [pscustomobject]@{ Name = "Novu Dashboard"; Url = "http://host.docker.internal:8110"; Group = "App layer"; GroupWeight = 600; Tag = "notifications"; TagColor = "#db2777"; TagValue = "delivery" }
)

function Test-HttpReady {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$TimeoutSec = 8
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec $TimeoutSec -MaximumRedirection 5
    return ($response.StatusCode -ge 200 -and $response.StatusCode -le 399)
  } catch {
    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      return ($statusCode -ge 200 -and $statusCode -le 399)
    }

    return $false
  }
}

function Invoke-DockerCommandCapture {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)

  $stdoutFile = [System.IO.Path]::GetTempFileName()
  $stderrFile = [System.IO.Path]::GetTempFileName()
  $argumentString = (
    $Arguments | ForEach-Object {
      if ($_ -match '[\s"]') {
        '"' + ($_ -replace '"', '\"') + '"'
      } else {
        $_
      }
    }
  ) -join " "

  try {
    $process = Start-Process -FilePath "docker.exe" -ArgumentList $argumentString -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
    $output = @()
    foreach ($path in @($stdoutFile, $stderrFile)) {
      if (Test-Path $path) {
        $output += Get-Content $path
      }
    }

    return @{
      ExitCode = $process.ExitCode
      Output = $output
    }
  } finally {
    Remove-Item $stdoutFile, $stderrFile -Force -ErrorAction SilentlyContinue
  }
}

function Get-ContainerVolumeName {
  param(
    [Parameter(Mandatory = $true)][string]$ContainerName,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  $format = "{{range .Mounts}}{{if eq .Destination `"$Destination`"}}{{.Name}}{{end}}{{end}}"
  $result = Invoke-DockerCommandCapture -Arguments @("inspect", $ContainerName, "--format", $format)
  if ($result.ExitCode -ne 0) {
    return $null
  }

  $volumeName = (($result.Output | Out-String).Trim())
  if ([string]::IsNullOrWhiteSpace($volumeName)) {
    return $null
  }

  return $volumeName
}

function Test-KumaReady {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/setup-database-info" -TimeoutSec 8
    return (
      $response.StatusCode -ge 200 -and
      $response.StatusCode -le 399 -and
      $response.Content -match '"needSetup"\s*:\s*false'
    )
  } catch {
    if ($_.Exception.Response) {
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $reader.Dispose()
        return ($body -match '"needSetup"\s*:\s*false')
      } catch {
        return $false
      }
    }

    return $false
  }
}

function Wait-KumaReady {
  param([int]$TimeoutSec = 120)

  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    if (Test-KumaReady) {
      return
    }

    Start-Sleep -Seconds 2
  }

  throw "Timed out waiting for Uptime Kuma to leave setup mode and expose the seeded runtime."
}

function Wait-KumaHealthy {
  param([int]$TimeoutSec = 120)

  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    $inspectResult = Invoke-DockerCommandCapture -Arguments @("inspect", $containerName, "--format", "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}")
    if ($inspectResult.ExitCode -eq 0) {
      $status = (($inspectResult.Output | Out-String).Trim())
      if ($status -eq "healthy") {
        return
      }
    }

    if (Test-KumaReady) {
      return
    }

    Start-Sleep -Seconds 2
  }

  throw "Timed out waiting for Uptime Kuma to become healthy after bootstrapping."
}

function Invoke-KumaBootstrap {
  $monitorDefinitionsJson = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(($monitorDefinitions | ConvertTo-Json -Compress -Depth 5)))

  $nodeScript = @'
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const Database = require("/app/server/database");
const passwordHash = require("/app/server/password-hash");
const { initJWTSecret } = require("/app/server/util-server");
const { R } = require("/app/node_modules/redbean-node");

const resultPrefix = process.env.KUMA_RESULT_PREFIX || "__KUMA_BOOTSTRAP__";
const statusPageSlug = process.env.KUMA_STATUS_PAGE_SLUG;
const operatorUsername = process.env.KUMA_OPERATOR_USERNAME;
const operatorPassword = process.env.KUMA_OPERATOR_PASSWORD;
const operatorTimezone = process.env.KUMA_OPERATOR_TIMEZONE;
const monitorDefinitions = JSON.parse(Buffer.from(process.env.KUMA_MONITORS_JSON_B64, "base64").toString("utf8"));

const groupDefinitions = [
  { Name: "Core surfaces", Weight: 100 },
  { Name: "App layer", Weight: 200 },
  { Name: "Commerce and operations", Weight: 300 },
];

function emitResult(payload) {
  console.log(resultPrefix + JSON.stringify(payload));
}

function normalize(value) {
  if (value === true) {
    return "1";
  }

  if (value === false) {
    return "0";
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function equivalent(currentValue, desiredValue) {
  return normalize(currentValue) === normalize(desiredValue);
}

function cleanupBootstrapDatabaseFiles(dataDir) {
  for (const relativePath of ["kuma.db", "kuma.db-shm", "kuma.db-wal", "db-config.json"]) {
    const fullPath = path.join(dataDir, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

async function upsertBean(tableName, whereSql, whereValues, desiredValues) {
  let bean = await R.findOne(tableName, whereSql, whereValues);
  let changed = false;

  if (!bean) {
    bean = R.dispense(tableName);
    changed = true;
  } else {
    for (const [key, value] of Object.entries(desiredValues)) {
      if (!equivalent(bean[key], value)) {
        changed = true;
        break;
      }
    }
  }

  if (changed) {
    bean.import(desiredValues);
    await R.store(bean);
  }

  return { bean, changed };
}

async function main() {
  const bootstrapResult = {
    needsRestart: false,
    createdUser: false,
    updatedUser: false,
    changedMonitors: [],
  };

  Database.initDataDir({});

  const dataDir = "/app/data";
  const dbConfigPath = path.join(dataDir, "db-config.json");
  const dbPath = path.join(dataDir, "kuma.db");
  const dbWalPath = path.join(dataDir, "kuma.db-wal");
  const dbShmPath = path.join(dataDir, "kuma.db-shm");
  const sqliteDbConfig = JSON.stringify({ type: "sqlite", ssl: false }, null, 4);

  let mustRecreateDatabase = false;

  try {
    const parsedConfig = JSON.parse(fs.readFileSync(dbConfigPath, "utf8"));
    if (parsedConfig.type !== "sqlite") {
      fs.writeFileSync(dbConfigPath, sqliteDbConfig);
      bootstrapResult.needsRestart = true;
    }
  } catch {
    fs.writeFileSync(dbConfigPath, sqliteDbConfig);
    bootstrapResult.needsRestart = true;
  }

  if (fs.existsSync(dbPath) && fs.statSync(dbPath).size === 0) {
    mustRecreateDatabase = true;
  }

  if (!fs.existsSync(dbPath) && (fs.existsSync(dbWalPath) || fs.existsSync(dbShmPath))) {
    mustRecreateDatabase = true;
  }

  if (!mustRecreateDatabase && fs.existsSync(dbPath)) {
    try {
      const hasSettingTable = execFileSync(
        "sqlite3",
        [dbPath, "select name from sqlite_master where type='table' and name='setting';"],
        { encoding: "utf8" }
      ).trim() === "setting";

      if (!hasSettingTable) {
        mustRecreateDatabase = true;
      }
    } catch {
      mustRecreateDatabase = true;
    }
  }

  if (mustRecreateDatabase) {
    cleanupBootstrapDatabaseFiles(dataDir);
    bootstrapResult.needsRestart = true;
  }

  if (!fs.existsSync(dbPath)) {
    fs.copyFileSync("/app/db/kuma.db", dbPath);
    bootstrapResult.needsRestart = true;
  }

  await Database.connect(false, true, true);
  await Database.patch();

  let jwtSecretBean = await R.findOne("setting", " `key` = ? ", ["jwtSecret"]);
  if (!jwtSecretBean) {
    await initJWTSecret();
    bootstrapResult.needsRestart = true;
  }

  let user = await R.findOne("user", " username = ? ", [operatorUsername]);
  if (!user) {
    user = R.dispense("user");
    user.username = operatorUsername;
    user.password = await passwordHash.generate(operatorPassword);
    user.active = 1;
    user.timezone = operatorTimezone;
    await R.store(user);
    bootstrapResult.createdUser = true;
    bootstrapResult.needsRestart = true;
  } else {
    let userChanged = false;

    if (!passwordHash.verify(operatorPassword, user.password) || passwordHash.needRehash(user.password)) {
      user.password = await passwordHash.generate(operatorPassword);
      userChanged = true;
    }

    if (!equivalent(user.active, 1)) {
      user.active = 1;
      userChanged = true;
    }

    if (!equivalent(user.timezone, operatorTimezone)) {
      user.timezone = operatorTimezone;
      userChanged = true;
    }

    if (userChanged) {
      await R.store(user);
      bootstrapResult.updatedUser = true;
    }
  }

  const seededUser = await R.findOne("user", " username = ? ", [operatorUsername]);
  const statusPageUpsert = await upsertBean("status_page", " slug = ? ", [statusPageSlug], {
    slug: statusPageSlug,
    title: "Hylono Local Stack",
    description: "Local operator status page for the Hylono browser-facing stack.",
    icon: "",
    theme: "light",
    published: 1,
    search_engine_index: 0,
    show_tags: 1,
    footer_text: "Local-only status page seeded from launch-local-stack.ps1.",
    show_powered_by: 0,
    show_only_last_heartbeat: 1,
    auto_refresh_interval: 120,
  });

  const statusPageId = statusPageUpsert.bean.id
  const groupIds = new Map();
  for (const groupDefinition of groupDefinitions) {
    const groupUpsert = await upsertBean("group", " status_page_id = ? AND name = ? ", [statusPageId, groupDefinition.Name], {
      status_page_id: statusPageId,
      name: groupDefinition.Name,
      public: 1,
      active: 1,
      weight: groupDefinition.Weight,
    });

    groupIds.set(groupDefinition.Name, groupUpsert.bean.id);
  }

  const tagIds = new Map();
  for (const definition of monitorDefinitions) {
    if (!tagIds.has(definition.Tag)) {
      const tagUpsert = await upsertBean("tag", " name = ? ", [definition.Tag], {
        name: definition.Tag,
        color: definition.TagColor,
      });

      tagIds.set(definition.Tag, tagUpsert.bean.id);
    }

    let monitorBean = await R.findOne("monitor", " name = ? AND user_id = ? ", [definition.Name, seededUser.id]);
    let monitorChanged = false;

    if (!monitorBean) {
      monitorBean = R.dispense("monitor");
      monitorChanged = true;
    }

    const desiredMonitor = {
      name: definition.Name,
      type: "http",
      url: definition.Url,
      interval: 60,
      retryInterval: 60,
      resendInterval: 0,
      maxretries: 0,
      accepted_statuscodes_json: "[\"200-399\"]",
      method: "GET",
      ignoreTls: false,
      upsideDown: false,
      maxredirects: 10,
      expiryNotification: false,
      domainExpiryNotification: false,
      timeout: 15,
      active: true,
      description: `Local operator monitor for ${definition.Name}.`,
    };

    if (!equivalent(monitorBean.user_id, seededUser.id)) {
      monitorChanged = true;
    } else {
      for (const [key, value] of Object.entries(desiredMonitor)) {
        if (!equivalent(monitorBean[key], value)) {
          monitorChanged = true;
          break;
        }
      }
    }

    if (monitorChanged) {
      monitorBean.import(desiredMonitor);
      monitorBean.user_id = seededUser.id;
      monitorBean.validate();
      await R.store(monitorBean);
      bootstrapResult.changedMonitors.push(definition.Name);
      bootstrapResult.needsRestart = true;
    }

    const tagId = tagIds.get(definition.Tag);
    const groupId = groupIds.get(definition.Group);

    await R.exec(
      `
      INSERT INTO monitor_tag (monitor_id, tag_id, value)
      SELECT ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM monitor_tag WHERE monitor_id = ? AND tag_id = ?
      )
      `,
      [monitorBean.id, tagId, definition.TagValue, monitorBean.id, tagId]
    );
    await R.exec("UPDATE monitor_tag SET value = ? WHERE monitor_id = ? AND tag_id = ?", [
      definition.TagValue,
      monitorBean.id,
      tagId,
    ]);

    await R.exec(
      `
      INSERT INTO monitor_group (monitor_id, group_id, weight, send_url)
      SELECT ?, ?, ?, 0
      WHERE NOT EXISTS (
        SELECT 1 FROM monitor_group WHERE monitor_id = ? AND group_id = ?
      )
      `,
      [monitorBean.id, groupId, definition.GroupWeight, monitorBean.id, groupId]
    );
    await R.exec("UPDATE monitor_group SET weight = ? WHERE monitor_id = ? AND group_id = ?", [
      definition.GroupWeight,
      monitorBean.id,
      groupId,
    ]);
  }

  emitResult(bootstrapResult);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@

  $hostScriptPath = Join-Path $root ".tmp-kuma-bootstrap.js"
  $helperScriptPath = "/tmp/hylono-kuma-bootstrap.js"
  $volumeName = Get-ContainerVolumeName -ContainerName $containerName -Destination "/app/data"
  if ([string]::IsNullOrWhiteSpace($volumeName)) {
    throw "Could not resolve the Kuma data volume from $containerName."
  }

  try {
    Write-Host "Kuma bootstrap: preparing helper script"
    Set-Content -Path $hostScriptPath -Value $nodeScript -Encoding UTF8

    Write-Host "Kuma bootstrap: running helper container"
    $bootstrapCommand = Invoke-DockerCommandCapture -Arguments @(
      "run",
      "--rm",
      "-v", "${volumeName}:/app/data",
      "-v", "${hostScriptPath}:${helperScriptPath}:ro",
      "-e", "KUMA_RESULT_PREFIX=$bootstrapResultPrefix",
      "-e", "KUMA_STATUS_PAGE_SLUG=$statusPageSlug",
      "-e", "KUMA_OPERATOR_USERNAME=$operatorUsername",
      "-e", "KUMA_OPERATOR_PASSWORD=$operatorPassword",
      "-e", "KUMA_OPERATOR_TIMEZONE=$operatorTimezone",
      "-e", "KUMA_MONITORS_JSON_B64=$monitorDefinitionsJson",
      "louislam/uptime-kuma:2",
      "node",
      $helperScriptPath
    )
    $output = $bootstrapCommand.Output
    $bootstrapExitCode = $bootstrapCommand.ExitCode
  } finally {
    Remove-Item $hostScriptPath -Force -ErrorAction SilentlyContinue
  }

  if ($bootstrapExitCode -ne 0) {
    $combinedOutput = (($output | ForEach-Object { $_.ToString() }) -join "`n")
    throw "Failed to bootstrap the Uptime Kuma operator state.`n$combinedOutput"
  }

  $resultLine = $output | Where-Object { $_ -like "$bootstrapResultPrefix*" } | Select-Object -Last 1
  if (-not $resultLine) {
    $combinedOutput = (($output | ForEach-Object { $_.ToString() }) -join "`n")
    throw "Uptime Kuma bootstrap did not emit a structured result.`n$combinedOutput"
  }

  Write-Host "Kuma bootstrap: helper container finished"
  $resultJson = $resultLine.Substring($bootstrapResultPrefix.Length)
  return ($resultJson | ConvertFrom-Json)
}

Write-Host "Kuma bootstrap: starting"
$bootstrapResult = Invoke-KumaBootstrap
if ($bootstrapResult.needsRestart) {
  Write-Host "Kuma bootstrap: restarting Kuma"
  $restartResult = Invoke-DockerCommandCapture -Arguments @("restart", $containerName)
  if ($restartResult.ExitCode -ne 0) {
    throw "Failed to restart Uptime Kuma after bootstrapping its local operator state."
  }
}

Write-Host "Kuma bootstrap: waiting for healthy runtime"
Wait-KumaHealthy

$resolvedStatusPageUrl = "$baseUrl/status/${statusPageSlug}"

Write-Host "Kuma bootstrap: complete"
Write-Host "Uptime Kuma operator configuration seeded." -ForegroundColor Green
Write-Host "Status page: $resolvedStatusPageUrl"
