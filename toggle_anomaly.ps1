# Toggle Anomaly Injection for Hackathon 2.0 Showcase
# Use this to slow down the system and prove findings in Grafana

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("on", "off")]
    [string]$State
)

$isActive = ($State -eq "on")
$body = @{ active = $isActive } | ConvertTo-Json

Write-Host "Setting Anomaly to: $State..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost/api/anomaly/toggle" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure your backend is running at http://localhost" -ForegroundColor Yellow
}
