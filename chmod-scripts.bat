@echo off
echo 添加Linux脚本执行权限的说明
echo.
echo 在Windows环境下，您无法直接使用chmod命令。
echo 但这些脚本上传到Linux服务器后，您需要运行以下命令：
echo.
echo chmod +x prepare-deploy.sh
echo chmod +x build-push-image.sh
echo chmod +x create-source-archive.sh
echo chmod +x setup-mysql-dir.sh
echo chmod +x backup-mysql.sh
echo chmod +x restore-mysql.sh
echo.
echo 或者一次性给所有脚本添加执行权限：
echo chmod +x *.sh
echo.
pause 