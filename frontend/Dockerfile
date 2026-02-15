# Build stage - outputs static files to /app/dist
FROM node:20-alpine

# Build arguments for Vite
ARG VITE_API_URL
ARG VITE_API_BASE
ARG VITE_APP_TITLE
ARG VITE_API_VERSION

# Set as environment variables for build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_BASE=${VITE_API_BASE}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
ENV VITE_API_VERSION=${VITE_API_VERSION}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Move dist to build directory, volume will be mounted at /app/dist
RUN mv dist /build

# Copy files to volume on startup and exit
CMD cp -r /build/* /app/dist/ && echo "Frontend files copied to volume"
