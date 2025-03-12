# Stage 1: Build the Angular application
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy all files and build the Angular project
COPY . ./
RUN npm run build

# Debugging: List files in the build directory
RUN echo "Listing files in /app/dist/browser:" && ls -alh /app/dist/browser

# Stage 2: Deploy using Nginx
FROM nginx:stable-alpine3.20-slim AS runtime
WORKDIR /usr/share/nginx/html

# Remove default HTML files
RUN rm -rf ./*

# Copy Angular build output
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Change ownership & permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

RUN echo "Listing files in /usr/share/nginx/html:" && ls -alh /usr/share/nginx/html


# Copy Nginx configuration
COPY nginxangular.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
