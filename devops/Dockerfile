FROM node:8.16.1

ADD devops/init.sh /etc/init.sh

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN npm install -g yarn
RUN yarn install --pure-lockfile
RUN yarn run build

ENV HOST 0.0.0.0

ENTRYPOINT ["/etc/init.sh"]
