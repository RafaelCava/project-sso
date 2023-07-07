FROM node:16

WORKDIR /usr/project-sso/app

RUN apt-get install git -y

USER node

ENV NODE_ENV=development

EXPOSE 3000

CMD [ "tail", "-f", "/dev/null" ]