#!/bin/bash
# 阿里云 OSS 部署脚本
# 使用前需要安装 ossutil: https://help.aliyun.com/document_detail/120075.html

# 配置你的 OSS 信息
BUCKET_NAME="your-bucket-name"
ENDPOINT="oss-cn-beijing.aliyuncs.com"  # 根据你的地区修改

# 上传 dist 文件夹到 OSS
ossutil cp -r ./dist oss://$BUCKET_NAME/ -f

echo "✅ 部署完成！"
echo "🌐 访问地址: http://$BUCKET_NAME.$ENDPOINT/"
