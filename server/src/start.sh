#!/bin/sh
# Este es start.sh

# Asegúrate de que el script se detenga si ocurre un error
set -e

# Intenta conectarse a la base de datos hasta que tenga éxito
echo "Esperando a que la base de datos esté lista..."
python <<END
import sys
import psycopg2
import time

max_attempts = 10
attempts = 0

while attempts < max_attempts:
    try:
        conn = psycopg2.connect(dbname="alertas", user="postgres", password="Septiembre0672", host="db")
        print("Conexión a la base de datos establecida.")
        conn.close()
        break
    except psycopg2.OperationalError as e:
        print("La base de datos no está lista, esperando...")
        time.sleep(5) # Espera 5 segundos antes de reintentar
        attempts += 1
else:
    print("Se agotaron los intentos para conectarse a la base de datos.")
    sys.exit(1)
END

# Ejecuta el script CargarSHP.py una vez al inicio
python CargarSHP.py
python AlertasSQL.py

#Agrego un comentario