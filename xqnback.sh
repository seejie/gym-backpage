echo -e "\n\n\n\n***********************begin：xqnback start build******************\n\n"
echo -e "rm -rf ./xqnback"
rm -rf ./xqnback
cnpm install --unsafe-perm 
cnpm run build

if [ -d "./xqnback" ];then
rm -rf /mydisk/maintomcat/webapps/xqnback
cp -r ./xqnback /mydisk/maintomcat/webapps
echo -e "success：xqnback打包成功\n\n\n\n"
else
echo -e "error：xqnback文件夹不存在,打包失败\n\n\n\n"
fi

#mv xqnback /mydisk/maintomcat/webapps/xqnback

