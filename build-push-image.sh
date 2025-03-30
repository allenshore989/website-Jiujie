#!/bin/bash
# 构建并推送Docker镜像到阿里云容器镜像服务

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - 镜像构建和推送脚本"
echo "====================================================="
echo ""

# 默认变量设置
DEFAULT_REGISTRY="registry.cn-hangzhou.aliyuncs.com"
DEFAULT_NAMESPACE="your-namespace"
DEFAULT_IMAGE_NAME="yijing-design"
DEFAULT_TAG="latest"

# 读取用户输入
read -p "阿里云容器镜像仓库地址 [$DEFAULT_REGISTRY]: " REGISTRY
REGISTRY=${REGISTRY:-$DEFAULT_REGISTRY}

read -p "命名空间 [$DEFAULT_NAMESPACE]: " NAMESPACE
NAMESPACE=${NAMESPACE:-$DEFAULT_NAMESPACE}

read -p "镜像名称 [$DEFAULT_IMAGE_NAME]: " IMAGE_NAME
IMAGE_NAME=${IMAGE_NAME:-$DEFAULT_IMAGE_NAME}

read -p "镜像标签 [$DEFAULT_TAG]: " TAG
TAG=${TAG:-$DEFAULT_TAG}

# 构建完整的镜像名称
FULL_IMAGE_NAME="$REGISTRY/$NAMESPACE/$IMAGE_NAME:$TAG"

echo ""
echo "将构建并推送以下镜像:"
echo "$FULL_IMAGE_NAME"
echo ""

# 确认
read -p "确认以上信息? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "操作已取消"
  exit 0
fi

echo ""
echo "登录到阿里云容器镜像服务..."
docker login --username=$NAMESPACE $REGISTRY

# 检查登录是否成功
if [ $? -ne 0 ]; then
  echo "登录失败，请检查您的用户名和密码。"
  exit 1
fi

echo ""
echo "开始构建镜像..."
docker build -t $FULL_IMAGE_NAME .

# 检查构建是否成功
if [ $? -ne 0 ]; then
  echo "镜像构建失败。"
  exit 1
fi

echo ""
echo "开始推送镜像..."
docker push $FULL_IMAGE_NAME

# 检查推送是否成功
if [ $? -ne 0 ]; then
  echo "镜像推送失败。"
  exit 1
fi

echo ""
echo "====================================================="
echo "镜像已成功构建并推送!"
echo ""
echo "完整镜像名称: $FULL_IMAGE_NAME"
echo ""
echo "在服务器上使用这个镜像，您需要修改docker-compose.yml文件:"
echo ""
cat << EOF
services:
  nextjs-app:
    container_name: yijing-design-app
    image: $FULL_IMAGE_NAME
    restart: always
    # 其他配置保持不变...
EOF
echo ""
echo "然后执行: docker-compose pull && docker-compose up -d"
echo "=====================================================" 