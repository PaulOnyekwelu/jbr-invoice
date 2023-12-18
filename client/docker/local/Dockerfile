ARG NODE_VERSION=20-alpine3.19

FROM node:${NODE_VERSION}

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY package*.json ./
RUN npm install

COPY . ${APP_HOME}

CMD [ "npm", "start" ]
