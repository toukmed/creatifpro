# Frontend/Dockerfile
#FROM node:20-alpine AS build
#
#WORKDIR /app
#COPY package*.json ./
#
#RUN npm ci
#RUN npm install -g @angular/cli
#
#COPY . .
#RUN npm run build --prod
#
#FROM nginx:latest
#
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build ./dist/front /usr/share/nginx/html
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Frontend/Dockerfile
#FROM node:20-alpine AS build
#
#WORKDIR /app
#COPY package*.json ./
#RUN npm ci
#RUN npm install -g @angular/cli
#
#COPY . .
#RUN npm run build --prod && \
#    echo "Build complete. Files in dist:" && \
#    ls -la dist && \
#    echo "Listing files inside dist folder:" && \
#    ls -la dist/front || ls -la dist/my-app
#
#FROM nginx:latest
#
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /app/dist/front /usr/share/nginx/html
#
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/front /usr/share/nginx/html
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

