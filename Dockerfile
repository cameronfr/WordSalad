FROM tiangolo/uwsgi-nginx-flask:python3.6

WORKDIR /app
COPY ./static ./static
COPY ./app ./app
COPY ./public ./public
COPY ./uwsgi.ini ./

ENV STATIC_PATH /app/static/

RUN pip3 install numpy torch torchvision tqdm sklearn
RUN pip3 install scipy
