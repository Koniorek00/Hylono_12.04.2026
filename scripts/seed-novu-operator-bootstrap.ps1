param(
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSVersion.Major -ge 7) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stateDir = Join-Path $root "output\novu-bootstrap"
$stateFile = Join-Path $stateDir "operator-bootstrap-state.json"
$notificationPackPath = Join-Path $root "scripts\novu\operator-notification-pack.json"

function Parse-EnvFile {
  param([Parameter(Mandatory = $true)][string]$Path)

  $result = @{}
  if (-not (Test-Path $Path)) {
    return $result
  }

  foreach ($line in Get-Content -Path $Path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith("#")) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf("=")
    if ($separatorIndex -lt 0) {
      continue
    }

    $key = $trimmed.Substring(0, $separatorIndex).Trim()
    $value = $trimmed.Substring($separatorIndex + 1).Trim()
    if ($key) {
      $result[$key] = $value
    }
  }

  return $result
}

function Merge-EnvMaps {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Base,
    [Parameter(Mandatory = $true)][hashtable]$Overrides
  )

  foreach ($key in $Overrides.Keys) {
    $Base[$key] = $Overrides[$key]
  }

  return $Base
}

function Set-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Key,
    [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Value
  )

  $lines = [System.Collections.Generic.List[string]]::new()
  if (Test-Path $Path) {
    foreach ($line in Get-Content -Path $Path) {
      $lines.Add($line)
    }
  }

  $updatedLine = "$Key=$Value"
  $keyPattern = "^\s*$([System.Text.RegularExpressions.Regex]::Escape($Key))="
  $replaced = $false

  for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index] -match $keyPattern) {
      $lines[$index] = $updatedLine
      $replaced = $true
      break
    }
  }

  if (-not $replaced) {
    if ($lines.Count -gt 0 -and $lines[$lines.Count - 1] -ne "") {
      $lines.Add("")
    }

    $lines.Add($updatedLine)
  }

  Set-Content -Path $Path -Value $lines -Encoding UTF8
}

function New-JsonRequestParameters {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PUT")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Uri,
    [hashtable]$Headers,
    [object]$Body,
    [int]$TimeoutSec = 30
  )

  $requestParams = @{
    Method = $Method
    Uri = $Uri
    TimeoutSec = $TimeoutSec
  }

  if ($Headers) {
    $requestParams["Headers"] = $Headers
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $requestParams["Body"] = ($Body | ConvertTo-Json -Depth 10)
    $requestParams["ContentType"] = "application/json"
  }

  return $requestParams
}

function Invoke-RestJsonRaw {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PUT")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Uri,
    [hashtable]$Headers,
    [object]$Body,
    [int]$TimeoutSec = 30
  )

  $requestParams = New-JsonRequestParameters @PSBoundParameters
  return Invoke-RestMethod @requestParams
}

function Get-HttpErrorDetails {
  param([Parameter(Mandatory = $true)][System.Management.Automation.ErrorRecord]$ErrorRecord)

  $statusCode = 0
  $message = $ErrorRecord.Exception.Message
  $body = $null

  if ($ErrorRecord.Exception.Response) {
    try {
      $statusCode = [int]$ErrorRecord.Exception.Response.StatusCode
    } catch {
      $statusCode = 0
    }

    try {
      $stream = $ErrorRecord.Exception.Response.GetResponseStream()
      if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        try {
          $body = $reader.ReadToEnd()
        } finally {
          $reader.Dispose()
          $stream.Dispose()
        }
      }
    } catch {
      $body = $null
    }
  }

  return @{
    StatusCode = $statusCode
    Message = $message
    Body = $body
  }
}

function Invoke-JsonRequest {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PUT")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Uri,
    [hashtable]$Headers,
    [object]$Body,
    [int]$TimeoutSec = 30
  )

  try {
    return Invoke-RestJsonRaw @PSBoundParameters
  } catch {
    $details = Get-HttpErrorDetails -ErrorRecord $_
    $statusLabel = if ($details.StatusCode -gt 0) {
      "HTTP $($details.StatusCode)"
    } else {
      "request failure"
    }
    $bodyText = if ($details.Body) { $details.Body } else { $details.Message }
    throw "$Method $Uri failed ($statusLabel): $bodyText"
  }
}

function Invoke-NovuJson {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PUT")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Path,
    [object]$Body
  )

  $headers = @{
    Authorization = "ApiKey $script:NovuApiSecret"
  }

  $request = @{
    Method = $Method
    Uri = "$script:NovuBaseUrl/$($Path.TrimStart('/'))"
    Headers = $headers
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $request["Body"] = $Body
  }

  return Invoke-JsonRequest @request
}

function Invoke-NovuUserJson {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Token,
    [object]$Body
  )

  $headers = @{
    Authorization = "Bearer $Token"
  }

  $request = @{
    Method = $Method
    Uri = "$script:NovuBaseUrl/$($Path.TrimStart('/'))"
    Headers = $headers
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $request["Body"] = $Body
  }

  return Invoke-JsonRequest @request
}

function Test-NovuApiAccess {
  param([AllowNull()][string]$ApiSecret)

  if (-not $ApiSecret) {
    return $false
  }

  try {
    $null = Invoke-JsonRequest -Method GET -Uri "$script:NovuBaseUrl/v2/workflows?limit=1" -Headers @{
      Authorization = "ApiKey $ApiSecret"
    }

    return $true
  } catch {
    return $false
  }
}

function Get-NovuEncryptedApiKeyFromDatabase {
  if (-not $script:MongoRootPassword) {
    return $null
  }

  $javascript = @"
const dbx = db.getSiblingDB('novu-db');
const env = dbx.environments.findOne({ type: 'dev' }) || dbx.environments.findOne();
if (env && env.apiKeys && env.apiKeys.length > 0 && env.apiKeys[0].key) {
  print(env.apiKeys[0].key);
}
"@

  $output = & docker exec hylono-mongo mongosh --quiet --username hylono --password $script:MongoRootPassword --authenticationDatabase admin --eval $javascript 2>&1
  if ($LASTEXITCODE -ne 0) {
    return $null
  }

  $key = @(
    $output |
      ForEach-Object { $_.ToString().Trim() } |
      Where-Object { $_ }
  ) | Select-Object -Last 1

  if (-not $key) {
    return $null
  }

  return [string]$key
}

function Get-NovuApiKeyFromDatabase {
  param([AllowNull()][string]$EncryptedApiKey)

  if (-not $EncryptedApiKey) {
    return $null
  }

  $output = & docker exec `
    -e NODE_OPTIONS=--no-warnings `
    -e NEW_RELIC_ENABLED=false `
    -e NEW_RELIC_NO_CONFIG_FILE=true `
    hylono-novu-api `
    node `
    -e "const { decryptApiKey } = require('@novu/application-generic'); console.log(decryptApiKey(process.argv[1]));" `
    -- `
    $EncryptedApiKey 2>&1

  if ($LASTEXITCODE -ne 0) {
    return $null
  }

  $candidates = @(
    $output |
      ForEach-Object { $_.ToString().Trim() } |
      Where-Object { $_ -match '^[a-f0-9]{32}$' }
  )

  if ($candidates.Count -eq 0) {
    return $null
  }

  return [string]$candidates[0]
}

function Get-NovuBootstrapTokenFromLogin {
  $body = @{
    email = $script:NovuBootstrapEmail
    password = $script:NovuBootstrapPassword
  }

  try {
    $response = Invoke-RestJsonRaw -Method POST -Uri "$script:NovuBaseUrl/v1/auth/login" -Body $body
    return [string]$response.data.token
  } catch {
    $details = Get-HttpErrorDetails -ErrorRecord $_
    if ($details.StatusCode -eq 401) {
      return $null
    }

    throw "Novu bootstrap login failed: $(if ($details.Body) { $details.Body } else { $details.Message })"
  }
}

function Register-NovuBootstrapUser {
  $body = @{
    email = $script:NovuBootstrapEmail
    firstName = $script:NovuBootstrapFirstName
    lastName = $script:NovuBootstrapLastName
    password = $script:NovuBootstrapPassword
    organizationName = $script:NovuBootstrapOrganizationName
  }

  try {
    $response = Invoke-RestJsonRaw -Method POST -Uri "$script:NovuBaseUrl/v1/auth/register" -Body $body
    return [string]$response.data.token
  } catch {
    $details = Get-HttpErrorDetails -ErrorRecord $_
    if ($details.StatusCode -eq 400 -and $details.Body -match "User already exists") {
      return $null
    }

    throw "Novu bootstrap registration failed: $(if ($details.Body) { $details.Body } else { $details.Message })"
  }
}

function Get-NovuDevApiKeyFromUserToken {
  param([Parameter(Mandatory = $true)][string]$Token)

  $environmentResponse = Invoke-NovuUserJson -Method GET -Path "v1/environments" -Token $Token
  $environments = @($environmentResponse.data)
  $environment = $environments | Where-Object { $_.type -eq "dev" } | Select-Object -First 1
  if (-not $environment) {
    $environment = $environments | Select-Object -First 1
  }

  if (-not $environment) {
    throw "Novu bootstrap user has no accessible environments."
  }

  $apiKeys = @($environment.apiKeys)
  if ($apiKeys.Count -eq 0 -or -not $apiKeys[0].key) {
    throw "Novu environment '$($environment.name)' does not expose an API key."
  }

  return [string]$apiKeys[0].key
}

function Ensure-NovuApiKey {
  param([Parameter(Mandatory = $true)][string]$LocalEnvPath)

  if ($script:NovuApiSecret -and (Test-NovuApiAccess -ApiSecret $script:NovuApiSecret)) {
    return $script:NovuApiSecret
  }

  Write-Warning "NOVU_API_SECRET is missing or invalid. Recovering local Novu API access."

  $existingApiKey = Get-NovuApiKeyFromDatabase -EncryptedApiKey (Get-NovuEncryptedApiKeyFromDatabase)
  if ($existingApiKey -and (Test-NovuApiAccess -ApiSecret $existingApiKey)) {
    $script:NovuApiSecret = $existingApiKey
    Set-EnvValue -Path $LocalEnvPath -Key "NOVU_API_SECRET" -Value $existingApiKey
    Set-EnvValue -Path $LocalEnvPath -Key "NOVU_API_BASE_URL" -Value $script:NovuBaseUrl
    return $script:NovuApiSecret
  }

  $token = Get-NovuBootstrapTokenFromLogin
  if (-not $token) {
    $token = Register-NovuBootstrapUser
  }

  if (-not $token) {
    throw "Unable to recover a working Novu API key from the local stack."
  }

  $freshApiKey = Get-NovuDevApiKeyFromUserToken -Token $token
  if (-not (Test-NovuApiAccess -ApiSecret $freshApiKey)) {
    throw "Recovered Novu API key could not access the local Novu API."
  }

  $script:NovuApiSecret = $freshApiKey
  Set-EnvValue -Path $LocalEnvPath -Key "NOVU_API_SECRET" -Value $freshApiKey
  Set-EnvValue -Path $LocalEnvPath -Key "NOVU_API_BASE_URL" -Value $script:NovuBaseUrl
  return $script:NovuApiSecret
}

function New-NovuWorkflow {
  param([Parameter(Mandatory = $true)][string]$WorkflowId)

  $response = Invoke-NovuJson -Method POST -Path "v2/workflows" -Body @{
    name = "Hylono Operator Notifications"
    workflowId = $WorkflowId
    description = "Local operator notification workflow bootstrapped by seed-novu-operator-bootstrap.ps1."
    active = $true
    steps = @(
      @{
        name = "Inbox Notification"
        stepId = "operator-inbox"
        type = "in_app"
        controlValues = @{
          body = "{{payload.title}}`n{{payload.message}}"
        }
      }
    )
  }

  $workflow = Get-PropertyValue -Target $response -Name "data"
  if ($null -eq $workflow) {
    $workflow = $response
  }

  return $workflow
}

function Ensure-NovuWorkflow {
  param([Parameter(Mandatory = $true)][string]$WorkflowId)

  $workflowResponse = Invoke-NovuJson -Method GET -Path "v2/workflows?limit=100"
  $workflow = @($workflowResponse.data.workflows) | Where-Object { $_.workflowId -eq $WorkflowId } | Select-Object -First 1

  if (-not $workflow) {
    $workflow = New-NovuWorkflow -WorkflowId $WorkflowId
  }

  if (-not $workflow) {
    throw "Expected Novu workflow '$WorkflowId' was not found."
  }

  if ($workflow.status -ne "ACTIVE") {
    throw "Novu workflow '$WorkflowId' exists but is not ACTIVE."
  }

  return $workflow
}

function Get-StringHash {
  param([Parameter(Mandatory = $true)][string]$InputText)

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($InputText)
  $sha1 = [System.Security.Cryptography.SHA1]::Create()
  try {
    $hashBytes = $sha1.ComputeHash($bytes)
  } finally {
    $sha1.Dispose()
  }

  return ([System.BitConverter]::ToString($hashBytes)).Replace("-", "").ToLowerInvariant()
}

function Get-SubscriberId {
  param([Parameter(Mandatory = $true)][string]$Email)

  $normalized = $Email.Trim().ToLowerInvariant()
  $hex = Get-StringHash -InputText $normalized
  return "hylono-$($hex.Substring(0, 12))"
}

function Get-PropertyValue {
  param(
    [Parameter(Mandatory = $true)][AllowNull()][object]$Target,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if ($null -eq $Target) {
    return $null
  }

  if ($Target -is [hashtable]) {
    if ($Target.ContainsKey($Name)) {
      return $Target[$Name]
    }

    return $null
  }

  $matches = $Target.PSObject.Properties.Match($Name)
  if ($matches.Count -gt 0) {
    return $Target.$Name
  }

  return $null
}

function Get-State {
  $emptyState = @{
    notifications = @{}
    eventSeeds = @{}
    packVersion = $null
    workflowId = $null
    registryPath = $null
    seededAt = $null
  }

  if (-not (Test-Path $stateFile)) {
    return $emptyState
  }

  $raw = Get-Content -Path $stateFile -Raw
  if (-not $raw.Trim()) {
    return $emptyState
  }

  $parsed = $raw | ConvertFrom-Json
  $state = $emptyState.Clone()

  if ($parsed -and $parsed.PSObject.Properties.Match("notifications").Count -gt 0 -and $parsed.notifications) {
    foreach ($property in $parsed.notifications.PSObject.Properties) {
      $state.notifications[$property.Name] = @{
        email = Get-PropertyValue -Target $property.Value -Name "email"
        role = Get-PropertyValue -Target $property.Value -Name "role"
        notifiedAt = Get-PropertyValue -Target $property.Value -Name "notifiedAt"
        previouslyExisted = Get-PropertyValue -Target $property.Value -Name "previouslyExisted"
        team = Get-PropertyValue -Target $property.Value -Name "team"
        packVersion = Get-PropertyValue -Target $property.Value -Name "packVersion"
      }
    }
  }

  if ($parsed -and $parsed.PSObject.Properties.Match("eventSeeds").Count -gt 0 -and $parsed.eventSeeds) {
    foreach ($property in $parsed.eventSeeds.PSObject.Properties) {
      $state.eventSeeds[$property.Name] = @{
        eventName = Get-PropertyValue -Target $property.Value -Name "eventName"
        templateKey = Get-PropertyValue -Target $property.Value -Name "templateKey"
        email = Get-PropertyValue -Target $property.Value -Name "email"
        role = Get-PropertyValue -Target $property.Value -Name "role"
        transactionId = Get-PropertyValue -Target $property.Value -Name "transactionId"
        seededAt = Get-PropertyValue -Target $property.Value -Name "seededAt"
        source = Get-PropertyValue -Target $property.Value -Name "source"
        severity = Get-PropertyValue -Target $property.Value -Name "severity"
      }
    }
  }

  $state.packVersion = Get-PropertyValue -Target $parsed -Name "packVersion"
  $state.workflowId = Get-PropertyValue -Target $parsed -Name "workflowId"
  $state.registryPath = Get-PropertyValue -Target $parsed -Name "registryPath"
  $state.seededAt = Get-PropertyValue -Target $parsed -Name "seededAt"

  return $state
}

function Save-State {
  param([Parameter(Mandatory = $true)][hashtable]$State)

  New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
  ($State | ConvertTo-Json -Depth 8) | Set-Content -Path $stateFile -Encoding UTF8
}

function Find-ExistingSubscriber {
  param(
    [Parameter(Mandatory = $true)][object[]]$Subscribers,
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$SubscriberId
  )

  $normalizedEmail = $Email.Trim().ToLowerInvariant()
  foreach ($subscriber in $Subscribers) {
    if ($subscriber.subscriberId -eq $SubscriberId) {
      return $subscriber
    }

    if ($subscriber.PSObject.Properties.Match("email").Count -gt 0) {
      $existingEmail = ""
      if ($null -ne $subscriber.email) {
        $existingEmail = [string]$subscriber.email
      }

      if ($existingEmail.Trim().ToLowerInvariant() -eq $normalizedEmail) {
        return $subscriber
      }
    }
  }

  return $null
}

function Get-NotificationPack {
  if (-not (Test-Path $notificationPackPath)) {
    throw "Notification pack file not found: $notificationPackPath"
  }

  $pack = Get-Content -Path $notificationPackPath -Raw | ConvertFrom-Json
  if (-not $pack.packVersion) {
    throw "Notification pack is missing packVersion."
  }

  if (-not $pack.workflow -or -not $pack.workflow.defaultWorkflowId) {
    throw "Notification pack is missing workflow.defaultWorkflowId."
  }

  $subscribers = @($pack.subscribers)
  if ($subscribers.Count -eq 0) {
    throw "Notification pack must define at least one subscriber."
  }

  $roles = @{}
  foreach ($subscriber in $subscribers) {
    if (-not $subscriber.role) {
      throw "Notification pack subscriber is missing role."
    }

    if (-not $subscriber.email) {
      throw "Notification pack subscriber '$($subscriber.role)' is missing email."
    }

    if ($roles.ContainsKey($subscriber.role)) {
      throw "Notification pack subscriber role '$($subscriber.role)' is duplicated."
    }

    $roles[$subscriber.role] = $true
  }

  $events = @($pack.events)
  if ($events.Count -eq 0) {
    throw "Notification pack must define at least one event."
  }

  $eventNames = @{}
  foreach ($event in $events) {
    if (-not $event.eventName) {
      throw "Notification pack event is missing eventName."
    }

    if (-not $event.templateKey) {
      throw "Notification pack event '$($event.eventName)' is missing templateKey."
    }

    if (-not $event.source) {
      throw "Notification pack event '$($event.eventName)' is missing source."
    }

    if (-not $event.titleTemplate) {
      throw "Notification pack event '$($event.eventName)' is missing titleTemplate."
    }

    if (-not $event.messageTemplate) {
      throw "Notification pack event '$($event.eventName)' is missing messageTemplate."
    }

    if ($eventNames.ContainsKey($event.eventName)) {
      throw "Notification pack event '$($event.eventName)' is duplicated."
    }

    $eventNames[$event.eventName] = $true

    $audienceRoles = @($event.audienceRoles)
    if ($audienceRoles.Count -eq 0) {
      throw "Notification pack event '$($event.eventName)' must define audienceRoles."
    }

    foreach ($role in $audienceRoles) {
      if (-not $roles.ContainsKey([string]$role)) {
        throw "Notification pack event '$($event.eventName)' references unknown role '$role'."
      }
    }

    if (-not $event.samplePayload) {
      throw "Notification pack event '$($event.eventName)' is missing samplePayload."
    }

    $requiredFields = @()
    if ($event.payloadSchema -and $event.payloadSchema.required) {
      $requiredFields = @($event.payloadSchema.required)
    }

    foreach ($requiredField in $requiredFields) {
      if ($event.samplePayload.PSObject.Properties.Match([string]$requiredField).Count -eq 0) {
        throw "Notification pack event '$($event.eventName)' is missing required samplePayload field '$requiredField'."
      }
    }
  }

  return $pack
}

function Get-ContextPathValue {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Context,
    [Parameter(Mandatory = $true)][string]$Path
  )

  $current = $Context
  foreach ($segment in $Path.Split(".")) {
    $current = Get-PropertyValue -Target $current -Name $segment
    if ($null -eq $current) {
      return $null
    }
  }

  return $current
}

function Resolve-Template {
  param(
    [Parameter(Mandatory = $true)][string]$Template,
    [Parameter(Mandatory = $true)][hashtable]$Context
  )

  return [System.Text.RegularExpressions.Regex]::Replace(
    $Template,
    "\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}",
    {
      param($match)

      $path = $match.Groups[1].Value
      $value = Get-ContextPathValue -Context $Context -Path $path
      if ($null -eq $value) {
        return ""
      }

      if ($value -is [string]) {
        return $value
      }

      if ($value -is [bool]) {
        return $value.ToString().ToLowerInvariant()
      }

      if ($value -is [System.ValueType]) {
        return [string]$value
      }

      return ($value | ConvertTo-Json -Compress -Depth 10)
    }
  )
}

function Merge-SamplePayload {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Payload,
    [Parameter(Mandatory = $true)][object]$SamplePayload
  )

  foreach ($property in $SamplePayload.PSObject.Properties) {
    $Payload[$property.Name] = $property.Value
  }

  return $Payload
}

function New-EventSeedKey {
  param(
    [Parameter(Mandatory = $true)][string]$EventName,
    [Parameter(Mandatory = $true)][string]$SubscriberId
  )

  return "$EventName::$SubscriberId"
}

function New-TransactionId {
  param(
    [Parameter(Mandatory = $true)][string]$SeedKey,
    [switch]$Force
  )

  $hash = Get-StringHash -InputText $SeedKey
  if ($Force) {
    $stamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmss")
    return "bootstrap-$($hash.Substring(0, 10))-$stamp"
  }

  return "bootstrap-$($hash.Substring(0, 18))"
}

function Invoke-SeedEvent {
  param(
    [Parameter(Mandatory = $true)][string]$WorkflowId,
    [Parameter(Mandatory = $true)][object]$Notification,
    [Parameter(Mandatory = $true)][object]$Subscriber,
    [Parameter(Mandatory = $true)][string]$PackVersion,
    [Parameter(Mandatory = $true)][hashtable]$State,
    [switch]$Force
  )

  $subscriberId = Get-SubscriberId -Email $Subscriber.email
  $seedKey = New-EventSeedKey -EventName $Notification.eventName -SubscriberId $subscriberId
  if (-not $Force -and $State.eventSeeds.ContainsKey($seedKey)) {
    return $false
  }

  $context = @{
    payload = $Notification.samplePayload
    subscriber = $Subscriber
  }

  $title = Resolve-Template -Template $Notification.titleTemplate -Context $context
  $message = Resolve-Template -Template $Notification.messageTemplate -Context $context

  $payload = @{
    title = $title
    message = $message
    source = $Notification.source
    eventName = $Notification.eventName
    templateKey = $Notification.templateKey
    severity = $Notification.severity
    mailbox = $Subscriber.email
    operatorRole = $Subscriber.role
    operatorTeam = $Subscriber.team
    packVersion = $PackVersion
  }

  $payload = Merge-SamplePayload -Payload $payload -SamplePayload $Notification.samplePayload
  $transactionId = New-TransactionId -SeedKey $seedKey -Force:$Force
  $triggerResponse = Invoke-NovuJson -Method POST -Path "v1/events/trigger" -Body @{
    name = $WorkflowId
    to = @{
      subscriberId = $subscriberId
    }
    transactionId = $transactionId
    payload = $payload
  }

  $triggerResult = Get-PropertyValue -Target $triggerResponse -Name "data"
  if ($null -eq $triggerResult) {
    $triggerResult = $triggerResponse
  }

  $acknowledged = Get-PropertyValue -Target $triggerResult -Name "acknowledged"
  $status = Get-PropertyValue -Target $triggerResult -Name "status"
  $errors = Get-PropertyValue -Target $triggerResult -Name "error"

  if (-not $acknowledged) {
    throw "Novu did not acknowledge trigger '$($Notification.eventName)' for '$($Subscriber.email)'."
  }

  if ($status -ne "processed") {
    $errorText = if ($errors) {
      @($errors) -join "; "
    } else {
      "unknown trigger status"
    }

    throw "Novu trigger '$($Notification.eventName)' for '$($Subscriber.email)' returned status '$status': $errorText"
  }

  $seededAt = (Get-Date).ToUniversalTime().ToString("o")
  $State.eventSeeds[$seedKey] = @{
    eventName = $Notification.eventName
    templateKey = $Notification.templateKey
    email = $Subscriber.email
    role = $Subscriber.role
    transactionId = $transactionId
    seededAt = $seededAt
    source = $Notification.source
    severity = $Notification.severity
  }

  if ($State.notifications.ContainsKey($subscriberId)) {
    $State.notifications[$subscriberId].notifiedAt = $seededAt
  }

  return $true
}

$notificationPack = Get-NotificationPack
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
$localEnvPath = Join-Path $root ".env.local"
if (Test-Path $localEnvPath) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path $localEnvPath)
}

$script:NovuBaseUrl = if ($envMap["NOVU_API_BASE_URL"]) {
  $envMap["NOVU_API_BASE_URL"].TrimEnd("/")
} else {
  "http://localhost:18110"
}

$script:MongoRootPassword = $envMap["MONGO_ROOT_PASSWORD"]
$script:NovuBootstrapEmail = if ($envMap["NOVU_BOOTSTRAP_EMAIL"]) {
  [string]$envMap["NOVU_BOOTSTRAP_EMAIL"]
} else {
  "operator-bootstrap@hylono.local"
}
$script:NovuBootstrapPassword = if ($envMap["NOVU_BOOTSTRAP_PASSWORD"]) {
  [string]$envMap["NOVU_BOOTSTRAP_PASSWORD"]
} else {
  "LocalBootstrap123!"
}
$script:NovuBootstrapFirstName = if ($envMap["NOVU_BOOTSTRAP_FIRST_NAME"]) {
  [string]$envMap["NOVU_BOOTSTRAP_FIRST_NAME"]
} else {
  "Operator"
}
$script:NovuBootstrapLastName = if ($envMap["NOVU_BOOTSTRAP_LAST_NAME"]) {
  [string]$envMap["NOVU_BOOTSTRAP_LAST_NAME"]
} else {
  "Bootstrap"
}
$script:NovuBootstrapOrganizationName = if ($envMap["NOVU_BOOTSTRAP_ORGANIZATION"]) {
  [string]$envMap["NOVU_BOOTSTRAP_ORGANIZATION"]
} else {
  "Hylono Local"
}
$script:NovuApiSecret = $envMap["NOVU_API_SECRET"]

$workflowId = if ($envMap["NOVU_WORKFLOW_ID"]) {
  $envMap["NOVU_WORKFLOW_ID"]
} else {
  [string]$notificationPack.workflow.defaultWorkflowId
}

$script:NovuApiSecret = Ensure-NovuApiKey -LocalEnvPath $localEnvPath
$workflow = Ensure-NovuWorkflow -WorkflowId $workflowId

$integrationsResponse = Invoke-NovuJson -Method GET -Path "v1/integrations?limit=20"
$inAppIntegration = @($integrationsResponse.data) | Where-Object {
  $_.channel -eq "in_app" -and $_.active -eq $true
} | Select-Object -First 1

if (-not $inAppIntegration) {
  throw "No active in_app integration was found in Novu."
}

$subscriberResponse = Invoke-NovuJson -Method GET -Path "v2/subscribers?limit=100"
$existingSubscribers = @($subscriberResponse.data)
$state = Get-State
$subscribersByRole = @{}
$subscriberCount = 0

foreach ($subscriber in @($notificationPack.subscribers)) {
  $subscribersByRole[[string]$subscriber.role] = $subscriber
  $subscriberId = Get-SubscriberId -Email $subscriber.Email
  $existing = Find-ExistingSubscriber -Subscribers $existingSubscribers -Email $subscriber.Email -SubscriberId $subscriberId
  $subscribedEvents = @(
    $notificationPack.events |
      Where-Object { @($_.audienceRoles) -contains $subscriber.role } |
      ForEach-Object { $_.eventName }
  )

  $body = @{
    subscriberId = $subscriberId
    email = $subscriber.Email
    firstName = $subscriber.FirstName
    lastName = $subscriber.LastName
    data = @{
      source = "operator:bootstrap"
      role = $subscriber.Role
      team = $subscriber.Team
      canonical = $true
      mailbox = $subscriber.Email
      syncedFrom = "seed-novu-operator-bootstrap.ps1"
      packVersion = $notificationPack.packVersion
      notificationEvents = $subscribedEvents
    }
  }

  Invoke-NovuJson -Method POST -Path "v2/subscribers" -Body $body | Out-Null

  $existingState = if ($state.notifications.ContainsKey($subscriberId)) {
    $state.notifications[$subscriberId]
  } else {
    $null
  }

  $state.notifications[$subscriberId] = @{
    email = $subscriber.Email
    role = $subscriber.Role
    notifiedAt = if ($existingState) { $existingState.notifiedAt } else { $null }
    previouslyExisted = if ($existingState) {
      [bool]($existingState.previouslyExisted -or $existing)
    } else {
      [bool]$existing
    }
    team = $subscriber.Team
    packVersion = $notificationPack.packVersion
  }

  $subscriberCount++
}

$seededEventCount = 0
foreach ($notification in @($notificationPack.events)) {
  foreach ($role in @($notification.audienceRoles)) {
    if (-not $subscribersByRole.ContainsKey([string]$role)) {
      throw "Notification '$($notification.eventName)' references subscriber role '$role' that was not loaded."
    }

    $didSeed = Invoke-SeedEvent `
      -WorkflowId $workflowId `
      -Notification $notification `
      -Subscriber $subscribersByRole[[string]$role] `
      -PackVersion $notificationPack.packVersion `
      -State $state `
      -Force:$Force

    if ($didSeed) {
      $seededEventCount++
    }
  }
}

$state.packVersion = $notificationPack.packVersion
$state.workflowId = $workflowId
$state.registryPath = $notificationPackPath
$state.seededAt = (Get-Date).ToUniversalTime().ToString("o")
Save-State -State $state

Write-Host "Novu operator bootstrap seeded." -ForegroundColor Green
Write-Host "Pack: $($notificationPack.packVersion)"
Write-Host "Workflow: $workflowId"
Write-Host "Operator subscribers: $subscriberCount"
Write-Host "Operator event seeds: $seededEventCount"
Write-Host "Pack registry: $notificationPackPath"
Write-Host "State file: $stateFile"
