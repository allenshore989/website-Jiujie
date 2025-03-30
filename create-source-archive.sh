#!/bin/bash
# 创建源代码归档，排除大文件

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - 源代码归档脚本"
echo "====================================================="
echo ""

# 设置变量
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE_NAME="site002-source-$TIMESTAMP.tar.gz"

# 显示将要排除的目录
echo "将创建源代码归档，排除以下目录和文件："
echo "- node_modules/       (依赖文件，体积很大)"
echo "- .next/              (构建文件，可在服务器上重新生成)"
echo "- .git/               (版本控制信息，不需要部署)"
echo "- node_modules/       (依赖文件，体积很大)"
echo "- data/               (数据文件，应使用数据卷)"
echo "- logs/               (日志文件)"
echo "- .env                (环境变量文件，包含敏感信息)"
echo "- *.zip, *.tar.gz     (其他归档文件)"
echo ""

# 确认
read -p "确认创建归档? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "操作已取消"
  exit 0
fi

echo ""
echo "创建归档文件..."

# 创建归档，排除不需要的文件
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='data' \
    --exclude='logs' \
    --exclude='nginx/ssl/*' \
    --exclude='nginx/logs/*' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='*.zip' \
    --exclude='*.tar.gz' \
    -czf $ARCHIVE_NAME .

# 检查归档是否成功
if [ $? -ne 0 ]; then
  echo "创建归档失败。"
  exit 1
fi

# 计算归档大小
ARCHIVE_SIZE=$(du -h $ARCHIVE_NAME | cut -f1)

echo ""
echo "====================================================="
echo "归档创建成功！"
echo ""
echo "归档文件: $ARCHIVE_NAME"
echo "大小: $ARCHIVE_SIZE"
echo ""
echo "您可以使用以下命令将归档上传到服务器:"
echo "scp $ARCHIVE_NAME user@your-server:/var/www/yijingdesign/"
echo ""
echo "在服务器上，执行:"
echo "cd /var/www/yijingdesign && tar -xzf $ARCHIVE_NAME"
echo "=====================================================" 