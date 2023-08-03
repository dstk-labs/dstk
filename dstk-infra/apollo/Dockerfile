# pull official base image
FROM node:lts
WORKDIR /app

RUN apt-get update
RUN npm install -g pnpm

# Files required by pnpm install
# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r
CMD ["pnpm", "start"]