FROM --platform=linux/x86_64 node:20-alpine3.18 as build

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build:prod

FROM --platform=linux/x86_64 nginx:1.25.1-alpine3.17

COPY --from=build app/dist/sparrow-express-ui /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
