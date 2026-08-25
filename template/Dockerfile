# Stage 1: Build using Node
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build Vite
RUN npm run build

# 🩹 Copy images manually to build output
RUN mkdir -p /app/dist/assets/img && \
    cp -r /app/src/assets/img/* /app/dist/assets/img/ || true && \
    mkdir -p /app/dist/assets/img/icons && \
    cp -r /app/src/assets/img/icons/* /app/dist/assets/img/icons/ || true

# Stage 2: Serve using Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

