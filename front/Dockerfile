# Frontend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm ci
RUN npm install -g @angular/cli

COPY . .
RUN npm run build --prod

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./dist/front /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
