param([string]$Sdk = $env:ANDROID_HOME, [string]$Java = $env:JAVA_HOME,
      [string]$VersionName = '1.0.1', [int]$VersionCode = 2, [switch]$DebugBuild)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if (!$Sdk) { $Sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (!$Java) { throw 'Set JAVA_HOME to a JDK 17 or newer.' }
$tools = Join-Path $Sdk 'build-tools\35.0.0'
$platform = Join-Path $Sdk 'platforms\android-35\android.jar'
foreach ($required in @($platform, "$tools\aapt2.exe", "$Java\bin\javac.exe")) {
    if (!(Test-Path -LiteralPath $required)) { throw "Missing build dependency: $required" }
}
function Run([string]$exe, [string[]]$arguments) {
    & $exe @arguments
    if ($LASTEXITCODE -ne 0) { throw "$exe failed with exit code $LASTEXITCODE" }
}
$build = Join-Path $root 'android\build'
$release = Join-Path $root 'dist'
$private = Join-Path $root '.signing'
foreach ($folder in @($build, $release, $private, "$build\classes", "$build\dex", "$build\assets", "$build\assets\assets")) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}
$webFiles = @('index.html','style.css','premium.css','expansion.css','content.js','art.js','controls.js','gear.js','game.js','premium.js')
foreach ($file in $webFiles) { Copy-Item -LiteralPath (Join-Path $root $file) -Destination "$build\assets\$file" }
Get-ChildItem "$root\assets" -Filter '*.png' | Copy-Item -Destination "$build\assets\assets"
Run "$tools\aapt2.exe" @('compile','--dir',"$root\android\res",'-o',"$build\resources.zip")
$manifest = Get-Content -LiteralPath "$root\android\AndroidManifest.xml" -Raw
if ($DebugBuild) { $manifest = $manifest.Replace('<application ', '<application android:debuggable="true" ') }
[IO.File]::WriteAllText("$build\AndroidManifest.xml", $manifest)
Run "$tools\aapt2.exe" @('link','-I',$platform,'--manifest',"$build\AndroidManifest.xml",'--version-code',"$VersionCode",'--version-name',$VersionName,'-o',"$build\unsigned.apk","$build\resources.zip")
$sources = @(Get-ChildItem "$root\android\src" -Filter '*.java' -Recurse | ForEach-Object FullName)
Run "$Java\bin\javac.exe" (@('-encoding','UTF-8','-source','8','-target','8','-classpath',$platform,'-d',"$build\classes") + $sources)
Run "$Java\bin\jar.exe" @('cf',"$build\classes.jar",'-C',"$build\classes",'.')
Run "$tools\d8.bat" @('--release','--min-api','26','--lib',$platform,'--output',"$build\dex","$build\classes.jar")
# jar normalizes archive paths to forward slashes. aapt2 -A on Windows can
# preserve backslashes in nested assets, which Android AssetManager cannot load.
Run "$Java\bin\jar.exe" @('uf',"$build\unsigned.apk",'-C',$build,'assets','-C',"$build\dex",'classes.dex')
$entries = & "$Java\bin\jar.exe" tf "$build\unsigned.apk"
if ($LASTEXITCODE -ne 0 -or ($entries | Where-Object { $_.Contains('\') })) { throw 'Invalid APK archive paths.' }
foreach ($image in (Get-ChildItem "$root\assets" -Filter '*.png')) {
    if ($entries -notcontains "assets/assets/$($image.Name)") { throw "Missing packaged image: $($image.Name)" }
}
Run "$tools\zipalign.exe" @('-f','-p','4',"$build\unsigned.apk","$build\aligned.apk")
$key = Join-Path $private 'monks-path-release.jks'
$password = Join-Path $private 'password.txt'
if (!(Test-Path -LiteralPath $key)) {
    if (Test-Path -LiteralPath $password) { throw 'Password exists without keystore; restore the signing backup before building.' }
    $bytes = New-Object byte[] 48
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()
    [IO.File]::WriteAllText($password, [Convert]::ToBase64String($bytes))
    Run "$Java\bin\keytool.exe" @('-genkeypair','-keystore',$key,'-storetype','JKS','-alias','monks-path','-keyalg','RSA','-keysize','3072','-validity','10000','-storepass:file',$password,'-keypass:file',$password,'-dname','CN=Monks Path Release, OU=Game, O=Monks Path')
}
if (!(Test-Path -LiteralPath $password)) { throw 'Restore .signing/password.txt from your private backup.' }
$suffix = if ($DebugBuild) { '-debug' } else { '' }
$apk = Join-Path $release "monks-path-$VersionName$suffix.apk"
Run "$tools\apksigner.bat" @('sign','--ks',$key,'--ks-key-alias','monks-path','--ks-pass',"file:$password",'--out',$apk,"$build\aligned.apk")
Run "$tools\apksigner.bat" @('verify','--verbose','--print-certs',$apk)
Run "$Java\bin\keytool.exe" @('-exportcert','-rfc','-keystore',$key,'-alias','monks-path','-storepass:file',$password,'-file',"$release\signing-certificate.pem")
$hash = (Get-FileHash -LiteralPath $apk -Algorithm SHA256).Hash.ToLowerInvariant()
[IO.File]::WriteAllText("$release\SHA256SUMS$suffix.txt", "$hash  monks-path-$VersionName$suffix.apk`n")
Write-Output "Signed release APK: $apk"
