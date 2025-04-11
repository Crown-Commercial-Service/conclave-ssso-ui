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
FROM nginx:alpine

# Remove the default NGINX welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output to NGINX's HTML folder
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expose port 80 to be accessible outside the container
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]

