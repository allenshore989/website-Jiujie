# 阿里云Docker部署指南

本文档详细介绍如何将易经环境设计网站项目部署到阿里云ECS服务器的Docker环境中。

## 前提条件

- 阿里云ECS服务器（建议至少2核4G配置）
- 已安装Docker和Docker Compose
- 已购买并备案的域名（本文档以`yijingdesign.cn`为例）
- 已获取SSL证书

## 步骤1：服务器环境配置

### 安装Docker（如果尚未安装）

```bash
# 更新包管理器
sudo apt update -y

# 安装必要的依赖
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# 添加Docker的官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 添加Docker官方仓库
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 再次更新包索引
sudo apt update -y

# 安装Docker CE
sudo apt install -y docker-ce

# 启动Docker并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 验证Docker安装
docker --version
```

### 安装Docker Compose（如果尚未安装）

```bash
# 下载Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 授予执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

## 步骤2：项目部署准备

### 创建项目目录

```bash
# 创建项目目录
mkdir -p /var/www/yijingdesign
cd /var/www/yijingdesign

# 创建Nginx相关目录
mkdir -p nginx/conf nginx/ssl nginx/logs data

# 创建MySQL数据目录
sudo mkdir -p /www/wwwroot/site002-data/mysql
sudo chown -R 999:999 /www/wwwroot/site002-data/mysql
```

> 注意：MySQL在Docker容器中使用的用户ID通常是999，我们将目录所有权设置为此用户，以确保MySQL容器能正确访问数据目录。

### 上传项目文件

将本地项目文件上传到服务器，包括：
- 项目源代码
- Dockerfile
- docker-compose.yml
- .dockerignore
- nginx配置文件

可以使用SCP、SFTP或者Git等方式上传文件：

```bash
# 使用SCP上传（示例，在本地执行）
scp -r /path/to/local/project/* root@your-server-ip:/var/www/yijingdesign/

# 或者使用Git（在服务器执行）
cd /var/www/yijingdesign
git clone https://your-git-repo-url.git .
```

### 配置SSL证书

将SSL证书文件放入nginx/ssl目录：

```bash
# 复制证书文件（示例，请替换为实际路径）
cp /path/to/your/certificate.crt /var/www/yijingdesign/nginx/ssl/yijingdesign.cn.crt
cp /path/to/your/private.key /var/www/yijingdesign/nginx/ssl/yijingdesign.cn.key
```

### 配置环境变量

创建或编辑.env文件，设置必要的环境变量：

```bash
# 编辑.env文件
nano .env
```

添加以下内容（根据实际情况修改）：

```
# 数据库连接
DATABASE_URL="mysql://yijinguser:your_password@mysql:3306/yijingdb"

# MySQL配置
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=yijingdb
MYSQL_USER=yijinguser
MYSQL_PASSWORD=your_password

# 应用端口
PORT=3000

# 其他环境变量
NODE_ENV=production
```

## 步骤3：构建和启动应用

### 构建Docker镜像并启动容器

```bash
# 切换到项目目录
cd /var/www/yijingdesign

# 构建并启动容器（后台运行）
docker-compose up -d --build
```

### 验证服务状态

```bash
# 查看运行中的容器
docker ps

# 查看应用日志
docker logs yijing-design-app

# 查看数据库日志
docker logs yijing-design-mysql

# 查看Nginx日志
docker logs yijing-design-nginx
```

## 步骤4：配置域名解析

在阿里云DNS控制台中，为您的域名添加以下记录：

- A记录：将`yijingdesign.cn`指向您的服务器IP
- A记录：将`www.yijingdesign.cn`指向您的服务器IP

## 步骤5：测试和维护

### 测试网站访问

在浏览器中访问：
- http://yijingdesign.cn（应自动重定向到HTTPS）
- https://yijingdesign.cn

### 数据库备份

按照以下步骤备份MySQL数据库：

```bash
# 创建备份目录
mkdir -p /www/wwwroot/site002-data/backups

# 备份数据库
docker exec yijing-design-mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" yijingdb' > /www/wwwroot/site002-data/backups/backup-$(date +%Y%m%d).sql
```

您也可以创建一个定时任务，每天自动备份数据库：

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天凌晨2点备份）
0 2 * * * docker exec yijing-design-mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" yijingdb' > /www/wwwroot/site002-data/backups/backup-$(date +%Y%m%d).sql
```

### 常用维护命令

```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs

# 仅查看数据库日志
docker-compose logs mysql

# 更新应用（拉取最新代码后）
git pull
docker-compose up -d --build
```

## 故障排查

### 无法访问网站

1. 检查容器是否正常运行：`docker ps`
2. 检查应用日志：`docker logs yijing-design-app`
3. 检查Nginx日志：`docker logs yijing-design-nginx`
4. 确认服务器安全组是否开放了80和443端口
5. 检查域名解析是否生效：`ping yijingdesign.cn`

### 数据库连接问题

1. 检查MySQL容器是否正常运行：`docker ps | grep mysql`
2. 检查MySQL日志：`docker logs yijing-design-mysql`
3. 验证数据库连接：
   ```bash
   docker exec -it yijing-design-mysql mysql -uyijinguser -p
   # 输入密码后，执行:
   USE yijingdb;
   SHOW TABLES;
   ```
4. 检查.env文件中的数据库配置是否正确
5. 检查数据卷权限：`ls -la /www/wwwroot/site002-data/mysql`

### 其他常见错误

1. 数据库连接问题：检查.env文件中的数据库配置
2. 权限问题：确保数据目录有正确的权限
3. SSL证书问题：确认证书文件路径正确且有效 