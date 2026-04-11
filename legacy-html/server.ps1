param([int]$Port = 8080)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Server is running on http://localhost:$Port/ (Press Ctrl+C to stop)"

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $path = $request.Url.LocalPath
            if ($path -eq "/") { $path = "/index.html" }
            
            # Prevent directory traversal
            if ($path -match "\.\.") {
                $response.StatusCode = 403
                $response.Close()
                continue
            }

            $localPath = Join-Path $PWD.Path $path.Replace('/', '\')
            if (Test-Path $localPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $content.Length
                
                if ($localPath -match "\.html$") { $response.ContentType = "text/html; charset=utf-8" }
                elseif ($localPath -match "\.css$") { $response.ContentType = "text/css; charset=utf-8" }
                elseif ($localPath -match "\.js$") { $response.ContentType = "application/javascript; charset=utf-8" }
                elseif ($localPath -match "\.png$") { $response.ContentType = "image/png" }
                elseif ($localPath -match "\.jpg$|\.jpeg$") { $response.ContentType = "image/jpeg" }
                elseif ($localPath -match "\.svg$") { $response.ContentType = "image/svg+xml" }
                elseif ($localPath -match "\.json$") { $response.ContentType = "application/json; charset=utf-8" }
                
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
            }
            $response.Close()
        } catch {
            # Ignore client disconnections quietly
        }
    }
} finally {
    $listener.Stop()
}
