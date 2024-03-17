###################
# BASE STAGE
###################
FROM node:21-alpine As base

# Add pnpm to path
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm
RUN corepack enable

# Copy project
COPY . /app
WORKDIR /app

###################
# BUILD STAGE
###################
FROM base AS build

# Install package.json dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Run build script
RUN pnpm build

###################
# PRODUCTION STAGE
###################
FROM nginx:1.25.4-alpine

# Copy NGINX configuration
COPY --from=build /app/tools/docker-nginx.conf /etc/nginx/conf.d/default.conf
# Copy the static files from the build stage to the production server
COPY --from=build /app/dist/. /usr/share/nginx/html
