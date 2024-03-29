# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=16.19.1

################################################################################
# Create a stage for building the application.
FROM node:${NODE_VERSION}-alpine as builder

# Set working directory
WORKDIR /usr/src/app

# Download development dependencies before building.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the builder stage.
FROM nginx:latest as final

# Use production node environment by default.
ENV NODE_ENV production

# Replace default nginx.conf with prepared one.
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bck
COPY ./nginx.conf /etc/nginx/

# Copy the built application from the builder stage into the image.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose the port that the application listens on.
EXPOSE 8080

RUN nginx -t
