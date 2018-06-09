#! /usr/bin/env bash

dataUrl="http://nlp.stanford.edu/data/glove.6B.zip"
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
  #wget -O "data.zip" $dataUrl
  wget --quiet --load-cookies /tmp/cookies.txt "https://drive.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://drive.google.com/uc?export=download&id=11Ug6gC8bfoZEceC0kHUz2eWa4Rx7emTf' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=11Ug6gC8bfoZEceC0kHUz2eWa4Rx7emTf" -O data.zip && rm /tmp/cookies.txt
  unzip data.zip
  /bin/sleep 60
  echo "Sleeping 60s"
fi

cd ..
