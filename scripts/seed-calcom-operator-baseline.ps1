param(
  [string]$ConfigPath,
  [string]$OperatorEmail,
  [string]$OperatorTimeZone
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $ConfigPath) {
  $ConfigPath = Join-Path $root "scripts\data\calcom-operator-baseline.template.json"
}

$stateDir = Join-Path $root "output\calcom-bootstrap"
$statePath = Join-Path $stateDir "operator-baseline-state.json"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Escape-SqlLiteral {
  param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Value)

  return $Value.Replace("'", "''")
}

function Get-PropertyValue {
  param(
    [object]$Object,
    [Parameter(Mandatory = $true)][string]$Name,
    $Default = $null
  )

  if ($null -eq $Object) {
    return $Default
  }

  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) {
    return $Default
  }

  if ($null -eq $property.Value) {
    return $Default
  }

  return $property.Value
}

function ConvertTo-CompactJson {
  param($Value)

  if ($null -eq $Value) {
    return $null
  }

  return ($Value | ConvertTo-Json -Depth 20 -Compress)
}

function ConvertTo-SqlText {
  param($Value)

  if ($null -eq $Value) {
    return "NULL"
  }

  return "'$(Escape-SqlLiteral ([string]$Value))'"
}

function ConvertTo-SqlInt {
  param($Value)

  if ($null -eq $Value -or [string]::IsNullOrWhiteSpace([string]$Value)) {
    return "NULL"
  }

  return ([int]$Value).ToString()
}

function ConvertTo-SqlBoolean {
  param($Value)

  if ($null -eq $Value) {
    return "NULL"
  }

  if ([bool]$Value) {
    return "true"
  }

  return "false"
}

function ConvertTo-SqlJson {
  param($Value)

  if ($null -eq $Value) {
    return "NULL"
  }

  $json = ConvertTo-CompactJson -Value $Value
  return "'$(Escape-SqlLiteral $json)'::jsonb"
}

function Invoke-PostgresScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-postgres psql -v ON_ERROR_STOP=1 -U postgres -d $Database -t -A -f -
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL scalar query failed for $Database."
  }

  return ($output | Out-String).Trim()
}

function Invoke-PostgresLines {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-postgres psql -v ON_ERROR_STOP=1 -U postgres -d $Database -t -A -f -
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL query failed for $Database."
  }

  $trimmed = ($output | Out-String).Trim()
  if (-not $trimmed) {
    return @()
  }

  return @($trimmed -split "(`r`n|`n|`r)" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Invoke-PostgresSql {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $null = $Sql | docker exec -i hylono-postgres psql -v ON_ERROR_STOP=1 -U postgres -d $Database -f -
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL command failed for $Database."
  }
}

function Ensure-CalcomOperatorUser {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$FirstName,
    [Parameter(Mandatory = $true)][string]$LastName,
    [Parameter(Mandatory = $true)][string]$Username,
    [Parameter(Mandatory = $true)][string]$TimeZone,
    [Parameter(Mandatory = $true)][string]$PasswordHash
  )

  $existingId = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select id
from users
where email = '$(Escape-SqlLiteral $Email)'
order by id
limit 1;
"@

  if ($existingId) {
    Invoke-PostgresSql -Database "calcom_db" -Sql @"
update users
set username = '$(Escape-SqlLiteral $Username)',
    name = '$(Escape-SqlLiteral "$FirstName $LastName")',
    "timeZone" = '$(Escape-SqlLiteral $TimeZone)',
    "emailVerified" = coalesce("emailVerified", now()),
    verified = true,
    "completedOnboarding" = true,
    role = 'ADMIN'
where id = $existingId;

insert into "UserPassword" ("userId", hash)
values ($existingId, '$(Escape-SqlLiteral $PasswordHash)')
on conflict ("userId") do update
set hash = excluded.hash;
"@

    return [int]$existingId
  }

  Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into users (
  username,
  name,
  email,
  "timeZone",
  "emailVerified",
  verified,
  "completedOnboarding",
  role,
  uuid
)
values (
  '$(Escape-SqlLiteral $Username)',
  '$(Escape-SqlLiteral "$FirstName $LastName")',
  '$(Escape-SqlLiteral $Email)',
  '$(Escape-SqlLiteral $TimeZone)',
  now(),
  true,
  true,
  'ADMIN',
  gen_random_uuid()
);
"@

  $userId = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select id
from users
where email = '$(Escape-SqlLiteral $Email)'
order by id
limit 1;
"@

  if (-not $userId) {
    throw "Failed to create the Cal.com operator user."
  }

  Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into "UserPassword" ("userId", hash)
values ($userId, '$(Escape-SqlLiteral $PasswordHash)')
on conflict ("userId") do update
set hash = excluded.hash;
"@

  return [int]$userId
}

function Get-AvailabilitySignature {
  param([Parameter(Mandatory = $true)][object]$AvailabilityWindow)

  $daysValue = @((Get-PropertyValue -Object $AvailabilityWindow -Name "days" -Default @())) -join ","
  $startTime = [string](Get-PropertyValue -Object $AvailabilityWindow -Name "startTime" -Default "")
  $endTime = [string](Get-PropertyValue -Object $AvailabilityWindow -Name "endTime" -Default "")

  return "$daysValue|$startTime|$endTime"
}

function Get-SortedUniqueSignatures {
  param([object[]]$AvailabilityWindows)

  if ($null -eq $AvailabilityWindows) {
    return @()
  }

  return @(
    $AvailabilityWindows |
      ForEach-Object { Get-AvailabilitySignature -AvailabilityWindow $_ } |
      Sort-Object -Unique
  )
}

function Test-SignatureSetMatch {
  param(
    [string[]]$Left,
    [string[]]$Right
  )

  $normalizedLeft = @($Left | Sort-Object -Unique)
  $normalizedRight = @($Right | Sort-Object -Unique)

  if ($normalizedLeft.Count -ne $normalizedRight.Count) {
    return $false
  }

  for ($index = 0; $index -lt $normalizedLeft.Count; $index++) {
    if ($normalizedLeft[$index] -ne $normalizedRight[$index]) {
      return $false
    }
  }

  return $true
}

function Expand-EventTypeSeeds {
  param([object[]]$EventTypes)

  $expanded = New-Object System.Collections.Generic.List[object]

  foreach ($eventType in @($EventTypes)) {
    $expanded.Add($eventType)

    foreach ($alias in @((Get-PropertyValue -Object $eventType -Name "aliases" -Default @()))) {
      $baseKey = Get-PropertyValue -Object $eventType -Name "key" -Default (Get-PropertyValue -Object $eventType -Name "slug" -Default "event")
      $aliasSlug = Get-PropertyValue -Object $alias -Name "slug" -Default "alias"
      $aliasKey = "{0}-alias-{1}" -f $baseKey, $aliasSlug
      $aliasTitle = Get-PropertyValue -Object $alias -Name "title" -Default (Get-PropertyValue -Object $eventType -Name "title" -Default $null)
      $aliasDescription = Get-PropertyValue -Object $alias -Name "description" -Default (Get-PropertyValue -Object $eventType -Name "description" -Default $null)
      $aliasEventName = Get-PropertyValue -Object $alias -Name "eventName" -Default (Get-PropertyValue -Object $eventType -Name "eventName" -Default $null)
      $aliasLength = Get-PropertyValue -Object $alias -Name "length" -Default (Get-PropertyValue -Object $eventType -Name "length" -Default $null)
      $aliasMetadata = Get-PropertyValue -Object $alias -Name "metadata" -Default (Get-PropertyValue -Object $eventType -Name "metadata" -Default $null)
      $aliasBookingFields = Get-PropertyValue -Object $alias -Name "bookingFields" -Default (Get-PropertyValue -Object $eventType -Name "bookingFields" -Default @())

      $expanded.Add([pscustomobject]@{
        key = $aliasKey
        slug = Get-PropertyValue -Object $alias -Name "slug" -Default $null
        title = $aliasTitle
        description = $aliasDescription
        eventName = $aliasEventName
        length = $aliasLength
        hidden = Get-PropertyValue -Object $alias -Name "hidden" -Default $true
        minimumBookingNotice = Get-PropertyValue -Object $alias -Name "minimumBookingNotice" -Default (Get-PropertyValue -Object $eventType -Name "minimumBookingNotice" -Default $null)
        minimumRescheduleNotice = Get-PropertyValue -Object $alias -Name "minimumRescheduleNotice" -Default (Get-PropertyValue -Object $eventType -Name "minimumRescheduleNotice" -Default $null)
        beforeEventBuffer = Get-PropertyValue -Object $alias -Name "beforeEventBuffer" -Default (Get-PropertyValue -Object $eventType -Name "beforeEventBuffer" -Default $null)
        afterEventBuffer = Get-PropertyValue -Object $alias -Name "afterEventBuffer" -Default (Get-PropertyValue -Object $eventType -Name "afterEventBuffer" -Default $null)
        slotInterval = Get-PropertyValue -Object $alias -Name "slotInterval" -Default (Get-PropertyValue -Object $eventType -Name "slotInterval" -Default $null)
        requiresConfirmation = Get-PropertyValue -Object $alias -Name "requiresConfirmation" -Default (Get-PropertyValue -Object $eventType -Name "requiresConfirmation" -Default $null)
        requiresConfirmationWillBlockSlot = Get-PropertyValue -Object $alias -Name "requiresConfirmationWillBlockSlot" -Default (Get-PropertyValue -Object $eventType -Name "requiresConfirmationWillBlockSlot" -Default $null)
        disableGuests = Get-PropertyValue -Object $alias -Name "disableGuests" -Default (Get-PropertyValue -Object $eventType -Name "disableGuests" -Default $null)
        hideCalendarNotes = Get-PropertyValue -Object $alias -Name "hideCalendarNotes" -Default (Get-PropertyValue -Object $eventType -Name "hideCalendarNotes" -Default $null)
        hideCalendarEventDetails = Get-PropertyValue -Object $alias -Name "hideCalendarEventDetails" -Default (Get-PropertyValue -Object $eventType -Name "hideCalendarEventDetails" -Default $null)
        hideOrganizerEmail = Get-PropertyValue -Object $alias -Name "hideOrganizerEmail" -Default (Get-PropertyValue -Object $eventType -Name "hideOrganizerEmail" -Default $null)
        disableCancelling = Get-PropertyValue -Object $alias -Name "disableCancelling" -Default (Get-PropertyValue -Object $eventType -Name "disableCancelling" -Default $null)
        disableRescheduling = Get-PropertyValue -Object $alias -Name "disableRescheduling" -Default (Get-PropertyValue -Object $eventType -Name "disableRescheduling" -Default $null)
        requiresBookerEmailVerification = Get-PropertyValue -Object $alias -Name "requiresBookerEmailVerification" -Default (Get-PropertyValue -Object $eventType -Name "requiresBookerEmailVerification" -Default $null)
        bookingRequiresAuthentication = Get-PropertyValue -Object $alias -Name "bookingRequiresAuthentication" -Default (Get-PropertyValue -Object $eventType -Name "bookingRequiresAuthentication" -Default $null)
        lockTimeZoneToggleOnBookingPage = Get-PropertyValue -Object $alias -Name "lockTimeZoneToggleOnBookingPage" -Default (Get-PropertyValue -Object $eventType -Name "lockTimeZoneToggleOnBookingPage" -Default $null)
        useBookerTimezone = Get-PropertyValue -Object $alias -Name "useBookerTimezone" -Default (Get-PropertyValue -Object $eventType -Name "useBookerTimezone" -Default $null)
        currency = Get-PropertyValue -Object $alias -Name "currency" -Default (Get-PropertyValue -Object $eventType -Name "currency" -Default $null)
        interfaceLanguage = Get-PropertyValue -Object $alias -Name "interfaceLanguage" -Default (Get-PropertyValue -Object $eventType -Name "interfaceLanguage" -Default $null)
        metadata = $aliasMetadata
        bookingFields = $aliasBookingFields
      })
    }
  }

  return $expanded.ToArray()
}

function Set-ScheduleAvailability {
  param(
    [int]$UserId,
    [int]$ScheduleId,
    [object[]]$AvailabilityWindows
  )

  Invoke-PostgresSql -Database "calcom_db" -Sql @"
delete from "Availability"
where "scheduleId" = $ScheduleId;
"@

  foreach ($availabilityWindow in @($AvailabilityWindows)) {
    $daysSql = @((Get-PropertyValue -Object $availabilityWindow -Name "days" -Default @())) -join ","
    $startTime = [string](Get-PropertyValue -Object $availabilityWindow -Name "startTime" -Default "")
    $endTime = [string](Get-PropertyValue -Object $availabilityWindow -Name "endTime" -Default "")

    if (-not $daysSql -or -not $startTime -or -not $endTime) {
      throw "Availability windows must include days, startTime, and endTime."
    }

    Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into "Availability" ("userId", "scheduleId", days, "startTime", "endTime")
values (
  $UserId,
  $ScheduleId,
  ARRAY[$daysSql]::integer[],
  '$startTime',
  '$endTime'
);
"@
  }
}

function Upsert-EventType {
  param(
    [int]$UserId,
    [int]$ScheduleId,
    [string]$ResolvedTimeZone,
    [object]$EventTypeSeed,
    [string]$DefaultInterfaceLanguage
  )

  $slug = [string](Get-PropertyValue -Object $EventTypeSeed -Name "slug" -Default "")
  $title = [string](Get-PropertyValue -Object $EventTypeSeed -Name "title" -Default "")

  if (-not $slug -or -not $title) {
    throw "Each event type seed must include slug and title."
  }

  $lockedTimeZone = if ([bool](Get-PropertyValue -Object $EventTypeSeed -Name "lockTimeZoneToggleOnBookingPage" -Default $false)) {
    ConvertTo-SqlText -Value $ResolvedTimeZone
  } else {
    "NULL"
  }

  $interfaceLanguageValue = Get-PropertyValue -Object $EventTypeSeed -Name "interfaceLanguage" -Default $DefaultInterfaceLanguage

  Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into "EventType" (
  title,
  slug,
  description,
  length,
  hidden,
  "userId",
  "eventName",
  "timeZone",
  "requiresConfirmation",
  "minimumBookingNotice",
  currency,
  "scheduleId",
  metadata,
  "bookingFields",
  "afterEventBuffer",
  "beforeEventBuffer",
  "hideCalendarNotes",
  "slotInterval",
  "requiresConfirmationWillBlockSlot",
  "minimumRescheduleNotice",
  "lockTimeZoneToggleOnBookingPage",
  "hideCalendarEventDetails",
  "disableGuests",
  "disableCancelling",
  "disableRescheduling",
  "requiresBookerEmailVerification",
  "bookingRequiresAuthentication",
  "useBookerTimezone",
  "hideOrganizerEmail",
  "interfaceLanguage",
  "lockedTimeZone"
)
values (
  $(ConvertTo-SqlText -Value $title),
  $(ConvertTo-SqlText -Value $slug),
  $(ConvertTo-SqlText -Value (Get-PropertyValue -Object $EventTypeSeed -Name "description" -Default $null)),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "length" -Default $null)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "hidden" -Default $false)),
  $UserId,
  $(ConvertTo-SqlText -Value (Get-PropertyValue -Object $EventTypeSeed -Name "eventName" -Default $null)),
  $(ConvertTo-SqlText -Value $ResolvedTimeZone),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "requiresConfirmation" -Default $false)),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "minimumBookingNotice" -Default $null)),
  $(ConvertTo-SqlText -Value (Get-PropertyValue -Object $EventTypeSeed -Name "currency" -Default "eur")),
  $ScheduleId,
  $(ConvertTo-SqlJson -Value (Get-PropertyValue -Object $EventTypeSeed -Name "metadata" -Default $null)),
  $(ConvertTo-SqlJson -Value (Get-PropertyValue -Object $EventTypeSeed -Name "bookingFields" -Default @())),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "afterEventBuffer" -Default $null)),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "beforeEventBuffer" -Default $null)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "hideCalendarNotes" -Default $false)),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "slotInterval" -Default $null)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "requiresConfirmationWillBlockSlot" -Default $false)),
  $(ConvertTo-SqlInt -Value (Get-PropertyValue -Object $EventTypeSeed -Name "minimumRescheduleNotice" -Default $null)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "lockTimeZoneToggleOnBookingPage" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "hideCalendarEventDetails" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "disableGuests" -Default $true)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "disableCancelling" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "disableRescheduling" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "requiresBookerEmailVerification" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "bookingRequiresAuthentication" -Default $false)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "useBookerTimezone" -Default $true)),
  $(ConvertTo-SqlBoolean -Value (Get-PropertyValue -Object $EventTypeSeed -Name "hideOrganizerEmail" -Default $true)),
  $(ConvertTo-SqlText -Value $interfaceLanguageValue),
  $lockedTimeZone
)
on conflict ("userId", slug)
do update set
  title = excluded.title,
  description = excluded.description,
  length = excluded.length,
  hidden = excluded.hidden,
  "eventName" = excluded."eventName",
  "timeZone" = excluded."timeZone",
  "requiresConfirmation" = excluded."requiresConfirmation",
  "minimumBookingNotice" = excluded."minimumBookingNotice",
  currency = excluded.currency,
  "scheduleId" = excluded."scheduleId",
  metadata = excluded.metadata,
  "bookingFields" = excluded."bookingFields",
  "afterEventBuffer" = excluded."afterEventBuffer",
  "beforeEventBuffer" = excluded."beforeEventBuffer",
  "hideCalendarNotes" = excluded."hideCalendarNotes",
  "slotInterval" = excluded."slotInterval",
  "requiresConfirmationWillBlockSlot" = excluded."requiresConfirmationWillBlockSlot",
  "minimumRescheduleNotice" = excluded."minimumRescheduleNotice",
  "lockTimeZoneToggleOnBookingPage" = excluded."lockTimeZoneToggleOnBookingPage",
  "hideCalendarEventDetails" = excluded."hideCalendarEventDetails",
  "disableGuests" = excluded."disableGuests",
  "disableCancelling" = excluded."disableCancelling",
  "disableRescheduling" = excluded."disableRescheduling",
  "requiresBookerEmailVerification" = excluded."requiresBookerEmailVerification",
  "bookingRequiresAuthentication" = excluded."bookingRequiresAuthentication",
  "useBookerTimezone" = excluded."useBookerTimezone",
  "hideOrganizerEmail" = excluded."hideOrganizerEmail",
  "interfaceLanguage" = excluded."interfaceLanguage",
  "lockedTimeZone" = excluded."lockedTimeZone",
  "updatedAt" = now();
"@

  $eventTypeId = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select id
from "EventType"
where "userId" = $UserId
  and slug = '$(Escape-SqlLiteral $slug)'
limit 1;
"@

  if (-not $eventTypeId) {
    throw "Failed to resolve EventType id for slug '$slug'."
  }

  Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into "_user_eventtype" ("A", "B")
select $eventTypeId, $UserId
where not exists (
  select 1
  from "_user_eventtype"
  where "A" = $eventTypeId
    and "B" = $UserId
);
"@
}

if (-not (Test-Path $ConfigPath)) {
  throw "Cal.com baseline config '$ConfigPath' was not found."
}

$config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
$resolvedOperatorEmail = if ($OperatorEmail) { $OperatorEmail } else { [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "email" -Default "") }
$resolvedOperatorTimeZone = if ($OperatorTimeZone) { $OperatorTimeZone } else { [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "timeZone" -Default "") }
$defaultInterfaceLanguage = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "interfaceLanguage" -Default "en")
$scheduleName = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "schedule" -Default $null) -Name "name" -Default "Hylono Medtech Operator Availability")
$operatorUsername = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "username" -Default "hylono")
$operatorFirstName = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "firstName" -Default "Wiktor")
$operatorLastName = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "lastName" -Default "Myszor")
$operatorPasswordHash = [string](Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "operator" -Default $null) -Name "passwordHash" -Default '$2a$12$XhLESKS3cgY6MPG9gmQX..gaoMFzzb1RLsWI/HQylRBAWcgm07BDm')

if (-not $resolvedOperatorEmail) {
  throw "Operator email is missing. Supply -OperatorEmail or set operator.email in the config file."
}

if (-not $resolvedOperatorTimeZone) {
  throw "Operator time zone is missing. Supply -OperatorTimeZone or set operator.timeZone in the config file."
}

$availabilityWindows = @((Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "schedule" -Default $null) -Name "availabilityWindows" -Default @()))
if ($availabilityWindows.Count -eq 0) {
  throw "The Cal.com baseline config must define at least one availability window."
}

$legacyAvailabilitySignatureRows = @((Get-PropertyValue -Object (Get-PropertyValue -Object $config -Name "schedule" -Default $null) -Name "legacyReplacementSignature" -Default @()))
$eventTypeSeeds = Expand-EventTypeSeeds -EventTypes @((Get-PropertyValue -Object $config -Name "eventTypes" -Default @()))
if ($eventTypeSeeds.Count -eq 0) {
  throw "The Cal.com baseline config must define at least one event type."
}

Write-Step "Checking Cal.com operator baseline"

$userId = Ensure-CalcomOperatorUser `
  -Email $resolvedOperatorEmail `
  -FirstName $operatorFirstName `
  -LastName $operatorLastName `
  -Username $operatorUsername `
  -TimeZone $resolvedOperatorTimeZone `
  -PasswordHash $operatorPasswordHash

$username = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select coalesce(username, '')
from users
where id = $userId;
"@

$scheduleId = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select coalesce("defaultScheduleId", (
  select id
  from "Schedule"
  where "userId" = $userId
  order by id
  limit 1
))
from users
where id = $userId;
"@

$scheduleMode = "updated-existing"
if (-not $scheduleId) {
  Invoke-PostgresSql -Database "calcom_db" -Sql @"
insert into "Schedule" ("userId", name, "timeZone")
values ($userId, '$(Escape-SqlLiteral $scheduleName)', '$(Escape-SqlLiteral $resolvedOperatorTimeZone)');
"@

  $scheduleId = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
select id
from "Schedule"
where "userId" = $userId
order by id desc
limit 1;
"@
  $scheduleMode = "created"
} else {
  Invoke-PostgresSql -Database "calcom_db" -Sql @"
update "Schedule"
set name = '$(Escape-SqlLiteral $scheduleName)',
    "timeZone" = '$(Escape-SqlLiteral $resolvedOperatorTimeZone)'
where id = $scheduleId;
"@
}

Invoke-PostgresSql -Database "calcom_db" -Sql @"
update users
set "defaultScheduleId" = $scheduleId,
    "timeZone" = '$(Escape-SqlLiteral $resolvedOperatorTimeZone)'
where id = $userId;
"@

$currentAvailabilitySignatures = @(
  Invoke-PostgresLines -Database "calcom_db" -Sql @"
select array_to_string(days, ',') || '|' || "startTime" || '|' || "endTime"
from "Availability"
where "scheduleId" = $scheduleId
order by 1;
"@
)

$targetAvailabilitySignatures = @(Get-SortedUniqueSignatures -AvailabilityWindows $availabilityWindows)
$legacyAvailabilitySignatures = @(Get-SortedUniqueSignatures -AvailabilityWindows $legacyAvailabilitySignatureRows)
$availabilityMode = "preserved-custom"

if ($currentAvailabilitySignatures.Count -eq 0) {
  Set-ScheduleAvailability -UserId ([int]$userId) -ScheduleId ([int]$scheduleId) -AvailabilityWindows $availabilityWindows
  $availabilityMode = "seeded-empty"
} elseif ($legacyAvailabilitySignatures.Count -gt 0 -and (Test-SignatureSetMatch -Left $currentAvailabilitySignatures -Right $legacyAvailabilitySignatures)) {
  Set-ScheduleAvailability -UserId ([int]$userId) -ScheduleId ([int]$scheduleId) -AvailabilityWindows $availabilityWindows
  $availabilityMode = "upgraded-legacy"
} elseif (Test-SignatureSetMatch -Left $currentAvailabilitySignatures -Right $targetAvailabilitySignatures) {
  $availabilityMode = "already-baselined"
} else {
  Write-Warning "Schedule $scheduleId already has non-baseline availability. Leaving custom availability in place."
}

foreach ($eventTypeSeed in $eventTypeSeeds) {
  Upsert-EventType -UserId ([int]$userId) -ScheduleId ([int]$scheduleId) -ResolvedTimeZone $resolvedOperatorTimeZone -EventTypeSeed $eventTypeSeed -DefaultInterfaceLanguage $defaultInterfaceLanguage
}

$managedSlugs = @($eventTypeSeeds | ForEach-Object { [string](Get-PropertyValue -Object $_ -Name "slug" -Default "") } | Where-Object { $_ } | Sort-Object -Unique)
$managedSlugListSql = ($managedSlugs | ForEach-Object { "'$(Escape-SqlLiteral $_)'" }) -join ", "
$eventTypeRows = if ($managedSlugListSql) {
  @(
    Invoke-PostgresLines -Database "calcom_db" -Sql @"
select slug || '|' || id || '|' || hidden || '|' || length || '|' || "minimumBookingNotice" || '|' || "requiresConfirmation" || '|' || jsonb_array_length(coalesce("bookingFields", '[]'::jsonb))
from "EventType"
where "userId" = $userId
  and slug in ($managedSlugListSql)
order by slug;
"@
  )
} else {
  @()
}

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

$eventState = foreach ($eventTypeSeed in $eventTypeSeeds) {
  $slug = [string](Get-PropertyValue -Object $eventTypeSeed -Name "slug" -Default "")
  $matchingRow = $eventTypeRows | Where-Object { $_.StartsWith("$slug|") } | Select-Object -First 1
  $parts = if ($matchingRow) { $matchingRow.Split("|") } else { @($slug, "", "", "", "", "", "") }
  $hidden = [bool](Get-PropertyValue -Object $eventTypeSeed -Name "hidden" -Default $false)

  [ordered]@{
    key = Get-PropertyValue -Object $eventTypeSeed -Name "key" -Default $slug
    slug = $slug
    title = Get-PropertyValue -Object $eventTypeSeed -Name "title" -Default $null
    hidden = $hidden
    eventTypeId = if ($parts[1]) { [int]$parts[1] } else { $null }
    length = if ($parts[3]) { [int]$parts[3] } else { $null }
    minimumBookingNotice = if ($parts[4]) { [int]$parts[4] } else { $null }
    requiresConfirmation = if ($parts[5]) { [bool]::Parse($parts[5]) } else { $null }
    bookingFieldCount = if ($parts[6]) { [int]$parts[6] } else { 0 }
    publicPath = if (-not $hidden -and $username) { "/$username/$slug" } else { $null }
  }
}

$state = [ordered]@{
  seedVersion = Get-PropertyValue -Object $config -Name "seedVersion" -Default $null
  seedName = Get-PropertyValue -Object $config -Name "seedName" -Default $null
  appliedAt = (Get-Date).ToString("o")
  configPath = $ConfigPath
  operator = [ordered]@{
    email = $resolvedOperatorEmail
    userId = [int]$userId
    username = if ($username) { $username } else { $null }
    timeZone = $resolvedOperatorTimeZone
  }
  schedule = [ordered]@{
    id = [int]$scheduleId
    name = $scheduleName
    mode = $scheduleMode
    availabilityMode = $availabilityMode
    availabilityWindows = @(
      foreach ($availabilityWindow in $availabilityWindows) {
        [ordered]@{
          days = @((Get-PropertyValue -Object $availabilityWindow -Name "days" -Default @()))
          startTime = Get-PropertyValue -Object $availabilityWindow -Name "startTime" -Default $null
          endTime = Get-PropertyValue -Object $availabilityWindow -Name "endTime" -Default $null
        }
      }
    )
  }
  eventTypes = @($eventState)
}

($state | ConvertTo-Json -Depth 20) | Set-Content -Path $statePath -Encoding UTF8

Write-Host ("Schedule: {0} ({1})" -f $scheduleId, $availabilityMode) -ForegroundColor Green
Write-Host ("Managed event types: {0}" -f $managedSlugs.Count) -ForegroundColor Green
Write-Host ("State file: {0}" -f $statePath) -ForegroundColor Green
