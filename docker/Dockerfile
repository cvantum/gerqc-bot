FROM node:current-buster
MAINTAINER cvantum
RUN mkdir -p /opt/gerqc-bot/
WORKDIR /opt/gerqc-bot/
COPY /mnt/node-data/ /opt/gerqc-bot/
RUN ls -l /opt/gerqc-bot/
RUN npm install
RUN npm run dev