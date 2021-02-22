# build stage
# FROM node:lts-alpine as build-stage
# FROM node:10.16.3 as build
FROM node:11-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
COPY . .
RUN npm run build

FROM node:11-alpine
COPY --from=build /app /
ENV HOST 0.0.0.0 
ENV PORT 80 
ENV ENV NODE_ENV=production
ENV NUXT_ENV_THEME=red
ENV NUXT_ENV_TENANT_ID=18
CMD ["npm","start"]
