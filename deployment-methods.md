# 易经环境设计网站 - 部署方法指南

本文档介绍了几种不同的部署方法，以解决项目文件太大的问题。

## 方法1：使用精简部署包（推荐）

这种方法通过创建一个精简的部署包，显著减少上传到服务器的数据量。

### 步骤：

1. 在本地执行准备脚本：
   ```bash
   chmod +x prepare-deploy.sh
   ./prepare-deploy.sh
   ```

2. 将生成的部署包上传到服务器：
   ```bash
   scp site002-deploy-*.tar.gz user@your-server:/var/www/yijingdesign/
   ```

3. 在服务器上解压并设置：
   ```bash
   cd /var/www/yijingdesign
   tar -xzf site002-deploy-*.tar.gz
   ./setup.sh
   ```

4. 安装依赖并启动应用：
   ```bash
   docker-compose up -d
   ```

## 方法2：使用Git部署

这种方法通过Git来管理代码部署，避免上传整个项目文件夹。

### 步骤：

1. 在本地项目中初始化Git仓库（如果尚未初始化）：
   ```bash
   git init
   ```

2. 创建并配置`.gitignore`文件，排除不必要的文件：
   ```
   node_modules/
   .next/
   .env*
   data/
   nginx/ssl/
   nginx/logs/
   ```

3. 提交代码到本地仓库：
   ```bash
   git add .
   git commit -m "Initial commit for deployment"
   ```

4. 在阿里云服务器上创建一个裸仓库：
   ```bash
   mkdir -p /var/git/site002.git
   cd /var/git/site002.git
   git init --bare
   ```

5. 在本地添加远程仓库：
   ```bash
   git remote add aliyun user@your-server:/var/git/site002.git
   ```

6. 推送代码到服务器：
   ```bash
   git push aliyun master
   ```

7. 在服务器上配置部署钩子：
   ```bash
   vi /var/git/site002.git/hooks/post-receive
   ```

   添加以下内容：
   ```bash
   #!/bin/bash
   GIT_WORK_TREE=/var/www/yijingdesign git checkout -f
   cd /var/www/yijingdesign
   
   # 创建MySQL数据目录
   sudo mkdir -p /www/wwwroot/site002-data/mysql
   sudo mkdir -p /www/wwwroot/site002-data/backups
   sudo chown -R 999:999 /www/wwwroot/site002-data/mysql
   
   # 如果没有.env文件，则复制示例文件
   if [ ! -f .env ]; then
     cp .env.production.example .env
   fi
   
   # 构建并启动容器
   docker-compose up -d --build
   ```

8. 添加执行权限：
   ```bash
   chmod +x /var/git/site002.git/hooks/post-receive
   ```

9. 从现在开始，每当您需要更新应用时，只需：
   ```bash
   git add .
   git commit -m "Update application"
   git push aliyun master
   ```

## 方法3：通过SSH直接在服务器上构建

这种方法避免将`node_modules`上传到服务器，而是在服务器上安装依赖。

### 步骤：

1. 在服务器上创建项目目录：
   ```bash
   mkdir -p /var/www/yijingdesign
   ```

2. 准备一个不包含`node_modules`的项目压缩包：
   ```bash
   # 在本地执行
   tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf site002-source.tar.gz .
   ```

3. 上传压缩包到服务器：
   ```bash
   scp site002-source.tar.gz user@your-server:/var/www/yijingdesign/
   ```

4. 在服务器上解压：
   ```bash
   cd /var/www/yijingdesign
   tar -xzf site002-source.tar.gz
   ```

5. 配置环境变量：
   ```bash
   cp .env.production.example .env
   # 编辑.env添加适当的配置
   ```

6. 创建数据目录：
   ```bash
   sudo mkdir -p /www/wwwroot/site002-data/mysql
   sudo mkdir -p /www/wwwroot/site002-data/backups
   sudo chown -R 999:999 /www/wwwroot/site002-data/mysql
   ```

7. 启动Docker容器：
   ```bash
   docker-compose up -d
   ```

## 方法4：使用镜像仓库（高级）

如果您经常部署，可以考虑使用Docker镜像仓库（如阿里云容器镜像服务）。

### 步骤：

1. 在阿里云上创建容器镜像仓库

2. 在本地构建和推送镜像：
   ```bash
   # 登录到阿里云镜像仓库
   docker login --username=your_username registry.cn-hangzhou.aliyuncs.com
   
   # 构建镜像
   docker build -t registry.cn-hangzhou.aliyuncs.com/your-namespace/yijing-design:latest .
   
   # 推送镜像
   docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/yijing-design:latest
   ```

3. 在服务器上修改docker-compose.yml，使用镜像而不是本地构建：
   ```yaml
   nextjs-app:
     container_name: yijing-design-app
     image: registry.cn-hangzhou.aliyuncs.com/your-namespace/yijing-design:latest
     restart: always
     # 其他配置保持不变
   ```

4. 在服务器上拉取并启动：
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## 建议

1. **推荐使用方法1**，它提供了最简单且有效的减小部署包大小的方式。

2. 对于持续更新的项目，**方法2**（Git部署）是更好的长期解决方案。

3. 如果您的服务器资源有限，请考虑**方法3**，避免在服务器上构建应用。

4. 对于企业级应用或需要频繁部署的项目，**方法4**提供了更专业的解决方案。 