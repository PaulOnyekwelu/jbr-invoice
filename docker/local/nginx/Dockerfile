FROM nginx:1.24.0-alpine

ARG NGINX_PATH=/etc/nginx/conf.d/default.conf

RUN rm ${NGINX_PATH}

COPY ./default.conf ${NGINX_PATH}
