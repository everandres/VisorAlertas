# Establecer la imagen base
FROM node:21.6.1

# Crear directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Instalar dependencias
# El caracter asterisco (*) se utiliza para asegurarse de copiar tanto package.json como package-lock.json
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Si necesitas instalar nodemon globalmente en tu imagen
RUN npm install -g nodemon

# Copiar los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación usando nodemon
CMD [ "npm", "start" ]
