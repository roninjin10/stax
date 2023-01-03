# this dockerfile is used by every service

FROM ghcr.io/foundry-rs/foundry

RUN apk --no-cache add curl bash nodejs npm

ENV NODE_VERSION 18.12.1
ENV NVM_DIR=/root/.nvm

# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
COPY ./.nvmrc .
RUN . "$NVM_DIR/nvm.sh" --install \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default

WORKDIR /app

RUN npm i pnpm@7.18.2 --global

COPY . .

RUN pnpm i --frozen-lockfile

ENV NX_CLOUD_ACCESS_TOKEN NWMxN2ZlYzUtNDRmMi00OTk1LTg2YmMtNDU5OTAwYWFlNWRjfHJlYWQ=

RUN npm i -g nx@15.4.2

RUN . "$NVM_DIR/nvm.sh" --install \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && pnpm build

EXPOSE $PORT

CMD ["pnpm", "serve"]
