FROM node:14.17-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
RUN npm install
EXPOSE 3002
CMD ["npm", "run", "start"]