FROM nginx
MAINTAINER Qingyu Song
COPY dist/ /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
