# Generates (or edits) one image with the OpenAI Images API.
# The key is read from the Windows User env var OPENAI_API_KEY; never stored here.
param(
  [Parameter(Mandatory)] [string]$Prompt,
  [Parameter(Mandatory)] [string]$Out,
  [string]$Size = '1536x1024',
  [string]$Quality = 'high',
  [string]$Model = 'gpt-image-2.5-sunburst',
  [string]$Background = 'auto',
  [string]$EditFrom = ''
)
$ErrorActionPreference = 'Stop'
$key = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User')
if (-not $key) { $key = $env:OPENAI_API_KEY }
if (-not $key) { throw 'OPENAI_API_KEY missing' }
Add-Type -AssemblyName System.Net.Http
$http = New-Object System.Net.Http.HttpClient
$http.Timeout = [TimeSpan]::FromMinutes(6)
$http.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $key)

if ($EditFrom) {
  $form = New-Object System.Net.Http.MultipartFormDataContent
  foreach ($kv in @{ model = $Model; prompt = $Prompt; size = $Size; quality = $Quality }.GetEnumerator()) {
    $form.Add((New-Object System.Net.Http.StringContent($kv.Value)), $kv.Key) }
  foreach ($src in $EditFrom.Split(';')) {
    $img = New-Object System.Net.Http.ByteArrayContent(,[IO.File]::ReadAllBytes($src))
    $img.Headers.ContentType = New-Object System.Net.Http.Headers.MediaTypeHeaderValue('image/png')
    $form.Add($img, 'image[]', [IO.Path]::GetFileName($src)) }
  $resp = $http.PostAsync('https://api.openai.com/v1/images/edits', $form).Result
} else {
  $body = @{ model = $Model; prompt = $Prompt; size = $Size; quality = $Quality; n = 1; background = $Background } | ConvertTo-Json
  $content = New-Object System.Net.Http.StringContent($body, [Text.Encoding]::UTF8, 'application/json')
  $resp = $http.PostAsync('https://api.openai.com/v1/images/generations', $content).Result
}
$text = $resp.Content.ReadAsStringAsync().Result
if (-not $resp.IsSuccessStatusCode) { throw "HTTP $([int]$resp.StatusCode): $text" }
$json = $text | ConvertFrom-Json
[IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($json.data[0].b64_json))
"saved $Out"
