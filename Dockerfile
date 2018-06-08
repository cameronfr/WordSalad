FROM tiangolo/uwsgi-nginx-flask:python3.6

WORKDIR /app

COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt

RUN apt-get update
RUN apt-get -y install unzip wget ca-certificates
RUN pip3 install flask-cors

COPY ./static ./static
COPY ./app ./app
COPY ./public ./public
COPY ./uwsgi.ini ./
COPY ./prestart.sh ./

ENV STATIC_PATH /app/static/
ENV NGINX_WORKER_PROCESSES auto

ENV FLASK_DEBUG 1

#for Google AppEngine
ENV LISTEN_PORT 8080
EXPOSE 8080
