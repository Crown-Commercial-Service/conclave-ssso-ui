# Step 1: Build the Angular app
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy the Angular source files
COPY . .

# Build the Angular app
RUN npm run build

# Step 2: Set up NGINX to serve the app
FROM nginx:mainline-alpine3.21 AS runtime

# Set the working directory
WORKDIR /usr/share/nginx/html

# Remove the default NGINX welcome page
RUN rm -rf ./*

# Copy the Angular build output to NGINX's HTML folder
COPY --from=build /app/dist .

#Copy the nginx config  to the Docker Image nginx config directory
COPY nginxangular.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to be accessible outside the container
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]

