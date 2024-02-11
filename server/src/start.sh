#!/bin/sh
# Este es start.sh

# Asegúrate de que el script se detenga si ocurre un error
set -e

# Ejecuta tus scripts de Python
python CargarSHP.py
python AlertasSQL.py

# Puedes añadir comandos adicionales aquí si es necesario
