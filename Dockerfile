FROM node:12-alpine

RUN mkdir /app
WORKDIR /app
ADD . .
RUN yarn install

EXPOSE 8090

# EXPOSE <PORT from build script>
CMD ["yarn", "start"]