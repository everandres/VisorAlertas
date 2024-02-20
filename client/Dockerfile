FROM node:21.6.1 as build-stage

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Corregimos el comando para listar el contenido del directorio build correcto
RUN ls -la /usr/src/app/client/build

FROM nginx:alpine

# Aseguramos que la ruta de origen es la correcta al copiar al contenedor de nginx
COPY --from=build-stage /usr/src/app/client/build /usr/share/nginx/html

# Copia la configuración personalizada de Nginx al contenedor
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
