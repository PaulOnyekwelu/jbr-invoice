ARG NODE_VERSION=20-alpine3.19
ARG APP_HOME=/app

FROM node:${NODE_VERSION}

LABEL name="jbr-invoice"
LABEL license="MIT"
LABEL description="jbr-invoicing MERN application"

ENV NODE_ENV=development


WORKDIR ${APP_HOME}

RUN addgroup --system invoice \
  && adduser --system --ingroup invoice jbr

COPY package*.json ./
RUN npm install

# RUN chown -R jbr:invoice ${APP_HOME}

COPY --chown=jbr:invoice . ${APP_HOME}


USER jbr

CMD [ "npm", "run", "dev" ]