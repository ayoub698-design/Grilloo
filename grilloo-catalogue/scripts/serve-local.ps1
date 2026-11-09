# Serveur local minimal pour le site HTML exporté (dossier out/). Aucune installation requise.
param([int]$Port = 4173, [string]$Root = (Join-Path $PSScriptRoot '..\out'))
$Root = (Resolve-Path $Root).Path
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8'; '.json'='application/json'; '.txt'='text/plain; charset=utf-8'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.svg'='image/svg+xml'; '.webp'='image/webp'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.ico'='image/x-icon'; '.pdf'='application/pdf' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
try { $l.Start() } catch { Write-Host "Le port $Port est déjà utilisé : le site est sans doute déjà ouvert sur http://localhost:$Port/"; exit }
Write-Host "Site GRILLOO : http://localhost:$Port/   (fermer cette fenêtre pour arrêter)"
while ($l.IsListening) {
  $ctx = $l.GetContext(); $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    $path = [IO.Path]::GetFullPath((Join-Path $Root $rel))
    if (Test-Path -LiteralPath $path -PathType Container) {
      if (-not $ctx.Request.Url.AbsolutePath.EndsWith('/')) { $res.Redirect($ctx.Request.Url.AbsolutePath + '/' + $ctx.Request.Url.Query); $res.Close(); continue }
      $path = Join-Path $path 'index.html'
    } elseif (-not (Test-Path -LiteralPath $path) -and (Test-Path -LiteralPath "$path.html")) { $path = "$path.html" }
    if (-not $path.StartsWith($Root) -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
      $res.StatusCode = 404; $nf = Join-Path $Root '404.html'
      $b = if (Test-Path -LiteralPath $nf) { [IO.File]::ReadAllBytes($nf) } else { [Text.Encoding]::UTF8.GetBytes('Page introuvable') }
      $res.ContentType = 'text/html; charset=utf-8'; $res.OutputStream.Write($b, 0, $b.Length)
    } else {
      $ext = [IO.Path]::GetExtension($path).ToLower()
      $res.ContentType = $(if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' })
      $bytes = [IO.File]::ReadAllBytes($path); $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch { } finally { try { $res.OutputStream.Close() } catch { } }
}
