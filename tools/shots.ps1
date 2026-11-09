# Headless Edge screenshots of the mock-ups. Usage: .\shots.ps1 -Out <dir> -Pages 'a/index.html|1440x900', ...
param([string]$Out, [string[]]$Pages, [switch]$Reduce)
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$root = (Resolve-Path "$PSScriptRoot\..\directions").Path -replace '\\', '/'
$prof = Join-Path $env:TEMP 'grilloo-edge-shots'
New-Item -ItemType Directory -Force $Out | Out-Null
foreach ($p in $Pages) {
  $url, $size = $p.Split('|'); $w, $h = $size.Split('x')
  $name = ($url -replace '[^a-z0-9]+', '-').Trim('-') + "-$w.png"
  $args = @('--headless=new', '--disable-gpu', '--hide-scrollbars', "--user-data-dir=$prof", "--window-size=$w,$h", '--virtual-time-budget=6000',$(if ($Reduce) { '--force-prefers-reduced-motion' } else { '--no-first-run' }), "--screenshot=$Out\$name", "file:///$root/$url")
  Start-Process -FilePath $edge -ArgumentList $args -Wait -NoNewWindow
  "$name"
}
