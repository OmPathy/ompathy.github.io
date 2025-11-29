$headers = @{
    "Authorization" = "Bearer pat_PnBc5GldcFkUsQAoREIIu3eUd8lUvQuTgphV7ZTa9ZuFHrdWb7HcgxkV5SSItbQU"
    "Content-Type"  = "application/json"
}
$url = "https://api.coze.com/open_api/v2/chat"

Write-Host "Testing with invalid conversation_id..."
$body = @{
    bot_id          = "7558009309167599633"
    user            = "demo-user"
    query           = "Hello"
    stream          = $false
    conversation_id = "invalid_id_test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "Error:"
    $_.Exception.Response
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.ReadToEnd()
}
