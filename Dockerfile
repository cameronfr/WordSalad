FROM tiangolo/uwsgi-nginx-flask:python3.6

WORKDIR /app
COPY ./dist ./dist
COPY ./flask ./flask
COPY ./public ./public
COPY ./uwsgi.ini ./

ENV STATIC_PATH /app/dist
