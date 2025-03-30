#!/bin/bash
# MySQL数据库备份脚本

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - MySQL数据库备份脚本"
echo "====================================================="
echo ""

# 设置变量
BACKUP_DIR="/www/wwwroot/site002-data/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/yijingdb-backup-$TIMESTAMP.sql"

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

echo "开始备份数据库 yijingdb..."
echo "备份文件将保存在: $BACKUP_FILE"

# 执行备份
docker exec yijing-design-mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --databases yijingdb --add-drop-database' > "$BACKUP_FILE"

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "备份成功完成！"
    echo "备份文件大小: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # 压缩备份文件
    gzip "$BACKUP_FILE"
    echo "备份文件已压缩: $BACKUP_FILE.gz"
    
    # 列出最近的5个备份文件
    echo ""
    echo "最近的备份文件:"
    ls -lht "$BACKUP_DIR" | grep ".gz" | head -n 5
else
    echo "备份失败！请检查错误信息。"
    exit 1
fi

echo ""
echo "=====================================================" 