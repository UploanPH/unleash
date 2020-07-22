FROM node:12-alpine

RUN mkdir /app
WORKDIR /app
ADD . .
RUN yarn install

# EXPOSE <PORT from build script>
CMD ["yarn", "start"]