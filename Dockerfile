FROM tiangolo/uwsgi-nginx-flask:python3.6

WORKDIR /app

RUN apt-get update
RUN apt-get -y install ca-certificates
RUN python -m pip install --upgrade pip setuptools wheel
COPY ./requirements.txt ./
RUN pip install -r requirements.txt

RUN apt-get -y install unzip wget
RUN pip install flask-cors

COPY ./static ./static
COPY ./app ./app
COPY ./public ./public
COPY ./uwsgi.ini ./
COPY ./prestart.sh ./

ENV STATIC_PATH /app/static/
ENV NGINX_WORKER_PROCESSES auto

# ENV FLASK_DEBUG 1

#for Google AppEngine, 8080
#for webserver, 80
ENV LISTEN_PORT 80
EXPOSE 80
