# generate dockefile for nestjs app
FROM node:14

# set working directory

WORKDIR /usr/src/app

# install and cache app dependencies

COPY package*.json ./

RUN npm install


# add app

COPY . /usr/src/app

RUN npm run build

# start app

EXPOSE 3000

CMD ["npm", "run", "start:prod"]


