FROM node:alpine

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install -g pnpm


RUN pnpm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "pnpm", "start" ]

