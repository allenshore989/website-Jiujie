#!/bin/bash
# MySQL数据库恢复脚本

# 显示欢迎信息
echo "====================================================="
echo "    易经环境设计网站 - MySQL数据库恢复脚本"
echo "====================================================="
echo ""

# 检查参数
if [ $# -ne 1 ]; then
    echo "使用方法: $0 <备份文件路径>"
    echo "示例: $0 /www/wwwroot/site002-data/backups/yijingdb-backup-20230101-120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# 检查文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "错误: 备份文件 '$BACKUP_FILE' 不存在"
    exit 1
fi

echo "将要从以下文件恢复数据库:"
echo "$BACKUP_FILE"
echo ""

# 提示确认
read -p "此操作将覆盖当前数据库中的所有数据。是否继续？ [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "操作已取消"
    exit 0
fi

echo ""
echo "开始恢复数据库..."

# 处理gz压缩文件
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "检测到压缩文件，解压中..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    BACKUP_FILE="$TEMP_FILE"
    echo "文件已解压到: $BACKUP_FILE"
fi

# 执行恢复
cat "$BACKUP_FILE" | docker exec -i yijing-design-mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'

# 检查恢复是否成功
if [ $? -eq 0 ]; then
    echo "数据库恢复成功完成！"
else
    echo "数据库恢复失败！请检查错误信息。"
    exit 1
fi

# 清理临时文件
if [[ "$TEMP_FILE" != "" && -f "$TEMP_FILE" ]]; then
    echo "清理临时文件..."
    rm "$TEMP_FILE"
fi

echo ""
echo "=====================================================" 