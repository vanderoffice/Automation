# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development
FROM deps AS dev
COPY . .
EXPOSE 5180
CMD ["npm", "run", "dev"]

# Stage 3: Build
FROM deps AS build
COPY . .
RUN npm run build

# Stage 4: Production
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
