# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
 
# Mvc
Set-Location $buildFolder

# 生成最新的主题
node ./theme.js 
# 编译成CSS
$nodePath = Join-Path $buildFolder "assets/css"
$outPath = Join-Path $buildFolder "static/css"

$themes = Get-ChildItem -Path "$nodePath\theme*" -Exclude $Exclued
Foreach($theme in $themes)  
{   
    # echo $theme
    # echo (Join-Path $outPath "$($theme.Basename).css")
    lessc $theme  (Join-Path $outPath "$($theme.Basename).css")
} 
docker build -t docker.ednet.cn/template-c .
docker push docker.ednet.cn/template-c
docker rmi $(docker images -f "dangling=true" -q)

# 更新docker
# Set-Location ~
# docker-compose up --build --no-deps -d template-c
# docker rmi $(docker images -f "dangling=true" -q)
# FINALIZE ###################################################################

# Set-Location $buildFolder