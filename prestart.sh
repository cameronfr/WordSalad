#! /usr/bin/env bash

dataUrl="https://storage.googleapis.com/wordsalad-205913.appspot.com/glove.6B.300d.magnitude.zip"
# free 5GB bucket on GAE apparently.

# hacky, this image doesn't allow you to specify nginx.conf, should use something else next time.
# or could perform copy in this file
echo "Patching conf.d/nginx.conf"
sed -i.bak "4i\\
        if (\$http_x_forwarded_proto = \"http\") {return 301 https://\$host\$request_uri;}\\" /etc/nginx/conf.d/nginx.conf

cat /etc/nginx/conf.d/nginx.conf

if [ ! -d "./data" ]; then
  echo "No data directory, downloading"
  /bin/sleep 1
  mkdir data && cd data
  wget -O "data.zip" $dataUrl
  unzip data.zip
  /bin/sleep 10
  echo "Sleeping 10s"
fi

cd ..
