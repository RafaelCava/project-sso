FROM node:18-alpine

WORKDIR /usr/project-sso/app

RUN apk add --no-cache git

USER node

ENV NODE_ENV=development

EXPOSE 3000

CMD [ "tail", "-f", "/dev/null" ]