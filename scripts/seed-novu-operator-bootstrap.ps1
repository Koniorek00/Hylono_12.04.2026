param(
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

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

function Invoke-NovuJson {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Path,
    [object]$Body
  )

  $requestParams = @{
    Method = $Method
    Uri = "$script:NovuBaseUrl/$Path"
    Headers = @{
      Authorization = "ApiKey $script:NovuApiSecret"
    }
    TimeoutSec = 30
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $requestParams["Body"] = ($Body | ConvertTo-Json -Depth 10)
    $requestParams["ContentType"] = "application/json"
  }

  return Invoke-RestMethod @requestParams
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
if (Test-Path (Join-Path $root ".env.local")) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path (Join-Path $root ".env.local"))
}

$script:NovuBaseUrl = if ($envMap["NOVU_API_BASE_URL"]) {
  $envMap["NOVU_API_BASE_URL"].TrimEnd("/")
} else {
  "http://localhost:18110"
}

$script:NovuApiSecret = $envMap["NOVU_API_SECRET"]
if (-not $script:NovuApiSecret) {
  throw "NOVU_API_SECRET is missing from .env or .env.local."
}

$workflowId = if ($envMap["NOVU_WORKFLOW_ID"]) {
  $envMap["NOVU_WORKFLOW_ID"]
} else {
  [string]$notificationPack.workflow.defaultWorkflowId
}

$workflowResponse = Invoke-NovuJson -Method GET -Path "v2/workflows?limit=20"
$workflow = @($workflowResponse.data.workflows) | Where-Object { $_.workflowId -eq $workflowId } | Select-Object -First 1
if (-not $workflow) {
  throw "Expected Novu workflow '$workflowId' was not found."
}

if ($workflow.status -ne "ACTIVE") {
  throw "Novu workflow '$workflowId' exists but is not ACTIVE."
}

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
