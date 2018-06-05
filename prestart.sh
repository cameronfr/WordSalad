#! /usr/bin/env bash

dataUrl="http://nlp.stanford.edu/data/glove.6B.zip"

if [ ! -d "./data" ]; then
  echo "No data directory, downloading"
  mkdir data && cd data
  #wget -O "data.zip" $dataUrl
  wget --quiet --load-cookies /tmp/cookies.txt "https://drive.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://drive.google.com/uc?export=download&id=11Ug6gC8bfoZEceC0kHUz2eWa4Rx7emTf' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=11Ug6gC8bfoZEceC0kHUz2eWa4Rx7emTf" -O data.zip && rm /tmp/cookies.txt
  unzip data.zip
fi
