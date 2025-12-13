
Write-Host "--- TEST 1: Faculty Harassment (Detailed Name/Location Check) ---" -ForegroundColor Cyan

$body1 = @{
  prompt = "I want to report an incident. Yesterday evening around 6 pm, in the CSE department staff room, a male faculty member made repeated inappropriate comments about my appearance. I am uncomfortable revealing my name."
  note_id = "verify-loc"
  timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:5002/api/process" -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "Location Detected: " $response1.analysis.location_detected -ForegroundColor Green
    Write-Host "Name Detected:     " $response1.analysis.name_detected -ForegroundColor Green
    Write-Host "Severity:          " $response1.analysis.severity
} catch {
    Write-Host "Request Failed: " $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n--- TEST 2: Explicit Name Extraction ---" -ForegroundColor Cyan

$body2 = @{
  prompt = "My name is Sarah. I am being followed by a stranger from the metro station to my apartment."
  note_id = "verify-name"
  timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:5002/api/process" -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "Location Detected: " $response2.analysis.location_detected -ForegroundColor Green
    Write-Host "Name Detected:     " $response2.analysis.name_detected -ForegroundColor Green
    Write-Host "Severity:          " $response2.analysis.severity
} catch {
    Write-Host "Request Failed: " $_.Exception.Message -ForegroundColor Red
}
