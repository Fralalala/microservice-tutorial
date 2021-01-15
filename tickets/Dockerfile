FROM node:alpine
ENV CI = true

WORKDIR /app
COPY package.json .
# --onlyprod will make the npm install only install the non dev. Basically packages that are installed with --save-dev wont be installed since they dont need to be
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]