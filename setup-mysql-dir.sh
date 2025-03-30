#!/bin/bash
# 初始化MySQL数据目录脚本

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - MySQL数据目录初始化脚本"
echo "====================================================="
echo ""

# 检查是否具有sudo权限
if [ "$(id -u)" -ne 0 ]; then
    echo "此脚本需要sudo权限才能执行。请使用sudo运行。"
    echo "使用方法：sudo $0"
    exit 1
fi

# 设置目录变量
MYSQL_DATA_DIR="/www/wwwroot/site002-data/mysql"
BACKUP_DIR="/www/wwwroot/site002-data/backups"
MYSQL_INIT_DIR="./mysql-init"

# 创建MySQL数据目录
echo "创建MySQL数据目录: $MYSQL_DATA_DIR"
mkdir -p "$MYSQL_DATA_DIR"

# 创建备份目录
echo "创建备份目录: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 创建MySQL初始化脚本目录
echo "创建MySQL初始化脚本目录"
mkdir -p "$MYSQL_INIT_DIR"

# 设置目录权限
echo "设置MySQL数据目录权限为MySQL用户(uid=999, gid=999)"
chown -R 999:999 "$MYSQL_DATA_DIR"
chmod -R 755 "$MYSQL_DATA_DIR"

echo "设置备份目录权限"
chmod -R 755 "$BACKUP_DIR"

echo ""
echo "====================================================="
echo "MySQL数据目录初始化完成！"
echo ""
echo "目录信息:"
echo "- MySQL数据目录: $MYSQL_DATA_DIR"
echo "- 备份目录: $BACKUP_DIR"
echo "- 初始化脚本目录: $MYSQL_INIT_DIR"
echo ""
echo "请确保将数据库初始化脚本(init.sql)放入 $MYSQL_INIT_DIR 目录中"
echo "=====================================================" 