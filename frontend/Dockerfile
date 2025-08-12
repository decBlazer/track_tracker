# syntax=docker/dockerfile:1.7
# --------- Build Stage ---------
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy sources & build
COPY . .
RUN npm run build

# --------- Runtime Stage ---------
FROM nginx:1.25-alpine
# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom nginx.conf for SPA fallback
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 