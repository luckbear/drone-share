FROM alpine AS builder
WORKDIR /app
RUN apk add --no-cache --update nodejs nodejs-npm
COPY package.json package-lock.json ./
RUN npm install --registry=https://registry.npm.taobao.org

FROM alpine
WORKDIR /app
RUN apk add --no-cache --update nodejs nodejs-npm
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm install -g pm2 --registry=https://registry.npm.taobao.org
EXPOSE 8081
ENTRYPOINT ["npm", "run"]
CMD ["prod"]