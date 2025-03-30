#!/bin/bash
# 易经环境设计网站部署准备脚本

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - 部署准备脚本"
echo "====================================================="
echo ""

# 设置变量
DEPLOY_DIR="./deploy-package"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEPLOY_PACKAGE="site002-deploy-$TIMESTAMP.tar.gz"

# 清理和创建部署目录
echo "准备部署目录..."
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 复制必要的Docker配置文件
echo "复制Docker配置文件..."
cp Dockerfile $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp .dockerignore $DEPLOY_DIR/
cp .env.production.example $DEPLOY_DIR/.env.example

# 创建必要的目录结构
echo "创建目录结构..."
mkdir -p $DEPLOY_DIR/nginx/conf
mkdir -p $DEPLOY_DIR/mysql-init

# 复制Nginx配置和MySQL初始化脚本
echo "复制Nginx配置和MySQL初始化脚本..."
cp -r nginx/conf/* $DEPLOY_DIR/nginx/conf/
cp -r mysql-init/* $DEPLOY_DIR/mysql-init/

# 复制部署和维护脚本
echo "复制部署和维护脚本..."
cp setup-mysql-dir.sh $DEPLOY_DIR/
cp backup-mysql.sh $DEPLOY_DIR/
cp restore-mysql.sh $DEPLOY_DIR/
cp docker-deploy.md $DEPLOY_DIR/README.md
chmod +x $DEPLOY_DIR/*.sh

# 复制源代码（排除不必要文件）
echo "复制源代码（精简版本）..."
mkdir -p $DEPLOY_DIR/src
cp -r src $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp next.config.js $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp tailwind.config.js $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp prisma/schema.prisma $DEPLOY_DIR/prisma.schema

# 创建空目录占位符
mkdir -p $DEPLOY_DIR/nginx/ssl
mkdir -p $DEPLOY_DIR/nginx/logs
touch $DEPLOY_DIR/nginx/ssl/.gitkeep
touch $DEPLOY_DIR/nginx/logs/.gitkeep

# 创建设置脚本
cat > $DEPLOY_DIR/setup.sh << 'EOF'
#!/bin/bash
# 部署设置脚本

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - 部署设置脚本"
echo "====================================================="
echo ""

# 检查是否有sudo权限
if [ "$(id -u)" -ne 0 ]; then
    echo "警告: 此脚本可能需要sudo权限才能执行所有操作。"
    echo "如果遇到权限错误，请使用sudo重新运行。"
fi

# 创建MySQL数据目录
echo "创建MySQL数据目录..."
sudo mkdir -p /www/wwwroot/site002-data/mysql
sudo mkdir -p /www/wwwroot/site002-data/backups
sudo chown -R 999:999 /www/wwwroot/site002-data/mysql
sudo chmod -R 755 /www/wwwroot/site002-data/mysql
sudo chmod -R 755 /www/wwwroot/site002-data/backups

# 创建必要的目录
mkdir -p nginx/ssl nginx/logs

# 配置环境变量
if [ ! -f .env ]; then
    echo "创建环境变量文件..."
    cp .env.example .env
    echo "请编辑.env文件，设置适当的环境变量值"
fi

echo ""
echo "====================================================="
echo "初始设置完成！"
echo ""
echo "下一步:"
echo "1. 配置SSL证书 (放入 nginx/ssl/ 目录)"
echo "2. 编辑.env文件，设置数据库密码和其他变量"
echo "3. 执行 'docker-compose up -d' 启动应用"
echo "====================================================="
EOF
chmod +x $DEPLOY_DIR/setup.sh

# 打包部署文件
echo "创建部署包..."
tar -czf $DEPLOY_PACKAGE -C $DEPLOY_DIR .

# 计算包大小
PACKAGE_SIZE=$(du -h $DEPLOY_PACKAGE | cut -f1)

echo ""
echo "====================================================="
echo "部署包创建成功！"
echo ""
echo "部署包: $DEPLOY_PACKAGE"
echo "大小: $PACKAGE_SIZE"
echo ""
echo "您可以使用以下命令将此包上传到服务器:"
echo "scp $DEPLOY_PACKAGE user@your-server:/var/www/yijingdesign/"
echo ""
echo "然后在服务器上执行:"
echo "cd /var/www/yijingdesign && tar -xzf $DEPLOY_PACKAGE && ./setup.sh"
echo "====================================================="

# 可选: 清理临时部署目录
rm -rf $DEPLOY_DIR 