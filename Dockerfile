FROM node:lts-alpine3.17

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install --global pnpm

RUN pnpm install --global typescript

WORKDIR /htf

COPY . /htf

RUN pnpm install

RUN pnpm generate

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm migrate && pnpm start"]