FROM node:16

WORKDIR /tms
COPY . .
RUN npm install

CMD ["npm", "run", "dev"]