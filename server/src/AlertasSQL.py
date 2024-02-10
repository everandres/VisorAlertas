import pandas as pd
from sqlalchemy import create_engine
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Leer el archivo CSV
df_incendios = pd.read_csv(r'G:\Mi unidad\OSPA\01. Tematicas\04. Incendios\01. Productos\postmodelo_icv\temporales\probabilidad_icv.csv', sep=';', encoding='utf-8')
df_deslizamientos = pd.read_csv(r'G:\Mi unidad\OSPA\01. Tematicas\03. Deslizamientos\01. Productos\postmodelo_idd\temporales\probabilidad_idd.csv', sep=';', encoding='utf-8')

# Configuración de conexión inicial al servidor de PostgreSQL
usuario = 'postgres'
contraseña = 'Septiembre0672'
host = 'localhost'
puerto = '5432'
db_default = 'postgres'  # Base de datos predeterminada para conectar inicialmente

# Crear conexión al servidor PostgreSQL sin especificar la base de datos 'alertas'
conn_info = f"postgresql://{usuario}:{contraseña}@{host}:{puerto}/{db_default}"
engine_default = create_engine(conn_info)

with engine_default.connect() as conn:
    conn.execute("COMMIT")  # Necesario para ejecutar comandos CREATE DATABASE
    conn.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'alertas'")
    exists = conn.fetchone()
    if not exists:
        conn.execute("CREATE DATABASE alertas")

# Actualizar la información de conexión para incluir la base de datos 'alertas'
url_conexion = f"postgresql://{usuario}:{contraseña}@{host}:{puerto}/alertas"
engine_alertas = create_engine(url_conexion)

# Crear la extensión PostGIS si no existe
with engine_alertas.connect() as conn:
    conn.execute("COMMIT")
    conn.execute("CREATE EXTENSION IF NOT EXISTS postgis")

def alertas_incendios(df_incendios):
    df_incendios.to_sql('incendios', con=engine_alertas, if_exists='replace', index=False)

def alertas_deslizamientos(df_deslizamientos):
    df_deslizamientos.to_sql('deslizamientos', con=engine_alertas, if_exists='replace', index=False)

# Llamadas a funciones (Asegúrate de tener tus DataFrames definidos)
alertas_incendios(df_incendios)
alertas_deslizamientos(df_deslizamientos)
