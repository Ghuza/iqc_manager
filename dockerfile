# generate dockefile for nestjs app
FROM node:14-alpine

# set working directory

WORKDIR /usr/src/app

# install and cache app dependencies

COPY package.json /usr/src/app/package.json

RUN npm install

# add app

COPY . /usr/src/app

# start app

CMD ["npm", "run", "start:prod"]


