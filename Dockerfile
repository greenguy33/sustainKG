# syntax=docker/dockerfile:experimental
FROM nginx:1.20.1 as build
MAINTAINER Qingyu Song
RUN apt-get update && \
    apt-get install -y \
        openssh-client \
        git \
        wget \
        libxml2 \
        libxslt1-dev \
        libpcre3 \
        libpcre3-dev \
        zlib1g \
        zlib1g-dev \
        openssl \
        libssl-dev \
        libtool \
        automake \
        gcc \
        g++ \
        make && \
    rm -rf /var/cache/apt

RUN wget "http://nginx.org/download/nginx-1.20.1.tar.gz" && \
    tar -C /usr/src -xzvf nginx-1.20.1.tar.gz

RUN mkdir -p -m 0600 ~/.ssh && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts

WORKDIR /src
RUN git clone https://github.com/nginx-shib/nginx-http-shibboleth.git

WORKDIR /usr/src/nginx-1.20.1
RUN ./configure --with-compat --with-http_ssl_module --add-dynamic-module=/src/nginx-http-shibboleth && make modules

FROM nginx:1.20.1

COPY dist/ /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/nginx-1.20.1/objs/ngx_http_shibboleth_module.so /usr/lib/nginx/modules/
#COPY --from=build /src/nginx-http-shibboleth/includes/shib_fastcgi_params /etc/nginx/
#COPY --from=build /src/nginx-http-shibboleth/includes/shib_clear_headers /etx/nginx/
