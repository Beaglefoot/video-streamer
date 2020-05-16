FROM node:12-alpine

WORKDIR /app

RUN apk update
RUN apk add exiftool
RUN apk add ffmpeg

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD [ "node", "dist/" ]
