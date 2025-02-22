FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expone el puerto 3001, ya que es donde corre tu aplicación
EXPOSE 3001

CMD ["npm", "start"]


