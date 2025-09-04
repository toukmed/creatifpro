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

# Stage 1: build Angular
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Nginx
FROM nginx:latest
COPY --from=builder /app/dist/front/browser /usr/share/nginx/html
COPY ./nginx/app.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

