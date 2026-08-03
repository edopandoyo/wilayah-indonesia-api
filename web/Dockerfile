# Stage 1: Build React app with Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_MINIO_PUBLIC_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MINIO_PUBLIC_URL=$VITE_MINIO_PUBLIC_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
