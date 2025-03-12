FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

COPY . ./
RUN npm run build

FROM nginx:stable-alpine3.20-slim AS runtime
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/browser .

RUN echo "Listing files in /usr/share/nginx/html:" && ls -alh /usr/share/nginx/html

#COPY nginx.conf /etc/nginx/sites-enabled/default
COPY nginxangular.conf /etc/nginx/conf.d/default.conf
#RUN rm -rf /usr/share/nginx/html/*
#COPY --from=build /app/dist/assets /usr/share/nginx/html/assets
#COPY --from=build /app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
