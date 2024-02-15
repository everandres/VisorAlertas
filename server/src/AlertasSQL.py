#!/usr/bin/env python
# coding: utf-8

# In[1]:

import pandas as pd
from sqlalchemy import create_engine, text
import geopandas as gpd
from geoalchemy2 import Geometry
import shapely.wkb as wkb
from sqlalchemy.exc import SQLAlchemyError

# In[2]:

# Leer el archivo CSV
df_incendios = pd.read_csv('/var/lib/data/incendios/probabilidad_icv.csv', sep=';', encoding='utf-8')
df_deslizamientos = pd.read_csv('/var/lib/data/deslizamientos/probabilidad_idd.csv', sep=';', encoding='utf-8')

# In[3]:

# Crear una conexión a la base de datos
usuario = 'postgres'
contraseña = 'Septiembre0672'
host = 'localhost'
puerto = '5432'
db = 'alertas'
url_conexion = 'postgresql://postgres:Septiembre0672@db:5432/alertas'

# In[4]:

def alertas_incendios(url, df_incendios):
    try:
        engine = create_engine(url_conexion)
        return df_incendios.to_sql('incendios', con=engine, if_exists='replace', index=False)
    except:
        engine = create_engine(url_conexion)
        # Eliminar los registros existentes de la tabla 'incendios'
        with engine.connect() as conn:
            conn.execute("DELETE FROM incendios")
        return df_incendios.to_sql('incendios', con=engine, if_exists='append', index=False)

# In[5]:

print(alertas_incendios(url_conexion, df_incendios))

# In[6]:

def alertas_deslizamientos(url, df_deslizamientos):
    try:
        engine = create_engine(url_conexion)
        return df_deslizamientos.to_sql('deslizamientos', con=engine, if_exists='replace', index=False)
    except:
        engine = create_engine(url_conexion)
        # Eliminar los registros existentes de la tabla 'incendios'
        with engine.connect() as conn:
            conn.execute("DELETE FROM deslizamientos")
        return df_deslizamientos.to_sql('deslizamientos', con=engine, if_exists='append', index=False)

# In[7]:

print(alertas_deslizamientos(url_conexion, df_deslizamientos))

# In[8]:

def vista_departamentos(url_conexion):
    engine = create_engine(url_conexion)
    create_view_sql = text("""
CREATE OR REPLACE VIEW departamentos_colombia AS
SELECT departamen, jsonb_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(geom, 4)::jsonb,
  'properties', jsonb_build_object(
    'DEPARTAMENTO', departamen
  )
) AS geom
FROM public.departamentos_wgs84
""")
    try:
        with engine.connect() as conn:
            conn.execute(create_view_sql)
            conn.commit()  # Asegúrate de hacer commit si es necesario
            return("Vista creada exitosamente.")
    except SQLAlchemyError as e:
        return(f"Error al crear la vista departamentos_colombia: {e}")

# In[9]:

print(vista_departamentos(url_conexion))

# In[10]:

def vista_deslizamientos(url_conexion):
    engine = create_engine(url_conexion)
    create_view_sql = text("""
CREATE OR REPLACE VIEW alertas_deslizamientos AS
SELECT d.*, jsonb_build_object(
  'type', 'Feature',
  'geometry', ST_AsGeoJSON(ST_GeometryN(mg.geom, 1), 4)::jsonb,
  'properties', jsonb_build_object(
    'PROBABILIDAD_DESC', CASE
                           WHEN d."PROBABILIDAD" = 1 THEN 'BAJA'
                           WHEN d."PROBABILIDAD" = 2 THEN 'MEDIA'
                           WHEN d."PROBABILIDAD" = 3 THEN 'ALTA'
                           ELSE 'no definida'
                         END,
    'PROBABILIDAD', d."PROBABILIDAD",
    'REGION', d."REGION",
    'DEPARTAMENTO', d."DEPARTAMENTO",
    'MUNICIPIO', d."MUNICIPIO",
    'FECHA_EJECUCION', d."FECHA_EJECUCION"
  )
) AS geom
FROM deslizamientos AS d
INNER JOIN mgn_mpio_politico AS mg ON d."COD_DANE" = mg.mpio_cdpmp;
""")
    try:
        with engine.connect() as conn:
            conn.execute(create_view_sql)
            conn.commit()  # Asegúrate de hacer commit si es necesario
            return("Vista creada exitosamente.")
    except SQLAlchemyError as e:
        return(f"Error al crear la vista alertas_deslizamientos: {e}")

print(vista_deslizamientos(url_conexion))

def vista_incendios(url_conexion):
    engine = create_engine(url_conexion)
    create_view_sql = text("""
CREATE OR REPLACE VIEW alertas_incendios AS
SELECT i.*, jsonb_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(ST_GeometryN(mg.geom, 1), 4)::jsonb,
  'properties', jsonb_build_object(
    'PROBABILIDAD_DESC', CASE
                           WHEN i."PROBABILIDAD" = 1 THEN 'BAJA'
                           WHEN i."PROBABILIDAD" = 2 THEN 'MEDIA'
                           WHEN i."PROBABILIDAD" = 3 THEN 'ALTA'
                           ELSE 'no definida'
                         END,
    'PROBABILIDAD', i."PROBABILIDAD",
    'REGION', i."REGION",
    'DEPARTAMENTO', i."DEPARTAMENTO",
    'MUNICIPIO', i."MUNICIPIO",
    'FECHA_EJECUCION', i."FECHA_EJECUCION"
  )
) AS geom
FROM incendios AS i
INNER JOIN mgn_mpio_politico AS mg ON i."COD_DANE" = mg.mpio_cdpmp;
""")
    try:
        with engine.connect() as conn:
            conn.execute(create_view_sql)
            conn.commit()  # Asegúrate de hacer commit si es necesario
            return("Vista creada exitosamente.")
    except SQLAlchemyError as e:
        return(f"Error al crear la vista alertas_incendios: {e}")

print(vista_incendios(url_conexion))
