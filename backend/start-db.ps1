$dockerBin = "C:\Users\Hp\AppData\Local\Programs\DockerDesktop\resources\bin"
if (Test-Path $dockerBin) {
    $env:PATH = "$dockerBin;$env:PATH"
}

docker compose up -d
