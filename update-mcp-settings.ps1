# PowerShell script to merge new MCP server into existing cline_mcp_settings.json

$settingsPath = "C:\\Users\\wikto\\AppData\\Roaming\\Code\\User\\globalStorage\\saoudrizwan.claude-dev\\settings\\cline_mcp_settings.json"

# Read existing settings
$existingJson = Get-Content $settingsPath -Raw | ConvertFrom-Json

# Define new server configuration
$newServer = @{
    command = "cmd"
    args = @("/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR_FIGMA_API_KEY", "--stdio")
    env = @{
        FIGMA_API_KEY = "YOUR_FIGMA_API_KEY"
    }
    disabled = $false
    autoApprove = @("get_figma_data", "download_figma_images")
    timeout = 120
    type = "stdio"
}

# Add new server to existing mcpServers
$existingJson.mcpServers | Add-Member -NotePropertyName "github.com/GLips/Figma-Context-MCP" -NotePropertyValue $newServer -Force

# Write back to file with proper formatting
$updatedJson = $existingJson | ConvertTo-Json -Depth 10
$updatedJson | Set-Content $settingsPath -NoNewline

Write-Host "Successfully added github.com/GLips/Figma-Context-MCP to MCP settings"
