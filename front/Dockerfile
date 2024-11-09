# Use Node.js image to build the app
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Install dependencies and build the Angular app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Use an NGINX image to serve the Angular app
FROM nginx:alpine
COPY --from=build /app/dist/your-angular-app-name /usr/share/nginx/html
EXPOSE 80

