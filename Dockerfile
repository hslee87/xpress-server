# Reference: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
#
FROM node:16-alpine

# Create app directory
# WORKDIR /usr/src/app
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY --chown=node:node . .

USER node

EXPOSE 3000
CMD [ "node", "app.js" ]

# -- How to build :
# $ docker build . -t <your username>/node-web-app
# $ docker images
# $ docker run -p 8080:8080 -d <your username>/node-web-app
# -- Get container ID
# $ docker ps
# -- Print app output
# $ docker logs <container id>
# -- Example
# Running on http://localhost:8080
