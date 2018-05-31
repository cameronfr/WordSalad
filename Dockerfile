FROM tiangolo/uwsgi-nginx-flask:python3.6

WORKDIR /app
COPY ./static ./static 
COPY ./flask ./flask
COPY ./public ./public
COPY ./uwsgi.ini ./

ENV STATIC_PATH /app/static/
