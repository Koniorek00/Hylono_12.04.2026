# Hylono Content Generation Engine (v2)
# Automates SEO Markdown generation for Modalities AND Protocols

$packsDir = "research/packs"
$outputDir = "content/automated"
$protocolOutputDir = "content/protocols"

if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir }
if (!(Test-Path $protocolOutputDir)) { New-Item -ItemType Directory -Path $protocolOutputDir }

Write-Host "Initializing Content Generation Engine..." -ForegroundColor Cyan

# --- 1. MODALITY GENERATION ---
Get-ChildItem -Path $packsDir -Filter "*_safety_claims.md" | ForEach-Object {
    $content = Get-Content $_.FullName
    $modality = $_.BaseName.Split('_')[0].ToUpper()
    
    Write-Host "→ Generating Modality content for: $($modality)" -ForegroundColor Cyan

    $id = ""; $approvedClaims = @(); $synergies = @()
    $currentSection = ""

    foreach ($line in $content) {
        if ($line -match "id: (KP-\w+-\d+)") { $id = $matches[1] }
        if ($line -match "## 2. Approved") { $currentSection = "approved" }
        elseif ($line -match "## 7. Synergy") { $currentSection = "synergy" }
        elseif ($line -match "## ") { $currentSection = "" }

        if ($line -match "^\s*-\s+""(.+)""") {
            if ($currentSection -eq "approved") { $approvedClaims += $matches[1] }
        }
    }

    $seoTitle = "Advanced $($modality) Bio-Optimization | Hylono"
    $slug = $modality.ToLower()
    $dateText = Get-Date -Format "yyyy-MM-dd"
    $outputPath = Join-Path $outputDir "$($slug).md"

    "---" | Set-Content $outputPath
    "title: `"$($seoTitle)`"" | Add-Content $outputPath
    "modality: `"$($modality)`"" | Add-Content $outputPath
    "slug: `"$($slug)`"" | Add-Content $outputPath
    "id: `"$($id)`"" | Add-Content $outputPath
    "last_updated: `"$($dateText)`"" | Add-Content $outputPath
    "---" | Add-Content $outputPath
    "" | Add-Content $outputPath
    "# $($modality): The Future of Non-Invasive Regeneration" | Add-Content $outputPath
    "" | Add-Content $outputPath
    "## Key Benefits" | Add-Content $outputPath
    $approvedClaims | ForEach-Object { "- **$($_)**" } | Add-Content $outputPath
}

# --- 2. PROTOCOL GENERATION (STATIC FOR NOW) ---
# We use the logic from constants/protocols.ts to generate high-value SEO pages
$protocols = @(
    @{ Id="mito-reset"; Name="Mitochondrial Reset"; Tag="Deep cellular rejuvenation"; Time=85; Coherence=98 },
    @{ Id="deep-recovery"; Name="Deep Performance Recovery"; Tag="Rapid metabolic waste clearance"; Time=110; Coherence=95 },
    @{ Id="quantum-clarity"; Name="Quantum Clarity"; Tag="Neurological optimization"; Time=75; Coherence=92 }
)

foreach ($proto in $protocols) {
    Write-Host "→ Generating Protocol content for: $($proto.Name)" -ForegroundColor Green
    $outputPPath = Join-Path $protocolOutputDir "$($proto.Id).md"
    
    "---" | Set-Content $outputPPath
    "title: `"$($proto.Name) Protocol | Hylono Elite`"" | Add-Content $outputPPath
    "type: `"PROTOCOL`"" | Add-Content $outputPPath
    "id: `"$($proto.Id)`"" | Add-Content $outputPPath
    "coherence: $($proto.Coherence)" | Add-Content $outputPPath
    "---" | Add-Content $outputPPath
    "" | Add-Content $outputPPath
    "# $($proto.Name)" | Add-Content $outputPPath
    "## $($proto.Tag)" | Add-Content $outputPPath
    "" | Add-Content $outputPPath
    "This advanced multi-modality stack is engineered for a total mission time of $($proto.Time) minutes. It leverages the latest resonance data from our Synergy Intelligence Engine." | Add-Content $outputPPath
}

Write-Host "Content Generation Complete." -ForegroundColor Yellow
