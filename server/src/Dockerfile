# Usamos una imagen base de Python
FROM python:3.9


# Instala inotify-tools
RUN apt-get update && apt-get install -y inotify-tools

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app/src

# Copiamos el archivo de dependencias y lo instalamos
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código fuente de la aplicación, incluido start.sh
COPY . .

# Damos permiso de ejecución al script
RUN chmod +x start.sh

# Usamos start.sh como el comando de inicio
CMD ["./start.sh"]
