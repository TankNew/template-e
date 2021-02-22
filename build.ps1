# COMMON PATHS

$buildFolder = (Get-Item -Path "./" -Verbose).FullName
 
# Mvc
Set-Location $buildFolder

# 生成最新的主题
node ./theme.js
# 编译成CSS

for theme in ${work_path}/assets/css/theme*
do
    # echo $theme
    lessc $theme static/css/${${theme%.*}##*/}.css
done

docker build -t docker.ednet.cn/template-c .
docker push docker.ednet.cn/template-c
docker rmi $(docker images -f "dangling=true" -q)

# 更新docker
# Set-Location ~
# docker-compose up --build --no-deps -d template-c
# docker rmi $(docker images -f "dangling=true" -q)
# FINALIZE ###################################################################

# Set-Location $buildFolder