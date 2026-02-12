# Build Docusaurus for domain deployment (e.g. https://uat.gymia.fit/docs/)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV DOCS_URL=https://uat.gymia.fit
ENV DOCS_BASE_URL=/docs/
RUN npm run build

# Caddy handle_path strips /docs, so we serve build at root
FROM nginx:alpine
RUN echo 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
