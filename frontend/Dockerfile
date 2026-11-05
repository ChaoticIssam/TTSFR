FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "if [ ! -d node_modules/eslint ]; then npm install; fi && npm run dev"]
