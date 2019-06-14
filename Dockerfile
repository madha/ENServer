FROM node:10.15.1

# install dependencies
WORKDIR /opt/app
COPY package*.json ./
RUN npm install

# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . .

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects

EXPOSE 3001

CMD [ "npm", "start" ]