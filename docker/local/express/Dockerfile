ARG NODE_VERSION=20-alpine3.19

FROM node:${NODE_VERSION}

LABEL name="jbr-invoice"
LABEL license="MIT"
LABEL description="jbr-invoicing MERN application"

ARG APP_HOME=/app

ENV NODE_ENV=development

RUN addgroup --system invoice \
  && adduser --system --ingroup invoice jbr

WORKDIR ${APP_HOME}


COPY package*.json ./
RUN npm install

COPY --chown=jbr:invoice . ${APP_HOME}

RUN chown -R jbr:invoice ${APP_HOME}


USER jbr

CMD [ "npm", "run", "dev" ]