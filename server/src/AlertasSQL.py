#!/usr/bin/env python
# coding: utf-8

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
import time


# Importaciones adicionales
import geopandas as gpd
from geoalchemy2 import Geometry
import shapely.wkb as wkb


# Crear una conexión a la base de datos
usuario = 'postgres'
contraseña = 'Septiembre0672'
host = 'localhost'
puerto = '5432'
db = 'alertas'
#url_conexion = f'postgresql://{usuario}:{contraseña}@{host}:{puerto}/{db}'
url_conexion = 'postgresql://postgres:Septiembre0672@db:5432/alertas'


df_incendios = '/var/lib/data/incendios/probabilidad_icv.csv'
df_deslizamientos = '/var/lib/data/deslizamientos/probabilidad_idd.csv'

def alertas_incendios(url_conexion, ruta_archivo):
    df_incendios = pd.read_csv(ruta_archivo, sep=';', encoding='utf-8')
    try:
        engine = create_engine(url_conexion)
        return df_incendios.to_sql('incendios', con=engine, index=False)
    except Exception as e:
        engine = create_engine(url_conexion)
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM incendios"))
            conn.commit()
        return df_incendios.to_sql('incendios', con=engine, if_exists='append', index=False)

# In[4]:

def alertas_deslizamientos(url_conexion, ruta_archivo):
    df_deslizamientos = pd.read_csv(ruta_archivo, sep=';', encoding='utf-8')
    try:
        engine = create_engine(url_conexion)
        return df_deslizamientos.to_sql('deslizamientos', con=engine, index=False)
    except Exception as e:
        engine = create_engine(url_conexion)
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM deslizamientos"))
            conn.commit()
        return df_deslizamientos.to_sql('deslizamientos', con=engine, if_exists='append', index=False)

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



def vista_deslizamientos(url_conexion):
    engine = create_engine(url_conexion)
    create_view_sql = text("""
CREATE OR REPLACE VIEW alertas_deslizamientos AS
SELECT d.*, jsonb_build_object(
  'type', 'Feature',
  'geometry', ST_AsGeoJSON((SELECT geom FROM (SELECT geom, ST_Area(geom) AS area FROM ST_Dump(mg.geom)) AS subquery ORDER BY area DESC LIMIT 1), 4)::jsonb,
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


def vista_incendios(url_conexion):
    engine = create_engine(url_conexion)
    create_view_sql = text("""
CREATE OR REPLACE VIEW alertas_incendios AS
SELECT i.*, jsonb_build_object(
  'type',       'Feature',
    'geometry', ST_AsGeoJSON((SELECT geom FROM (SELECT geom, ST_Area(geom) AS area FROM ST_Dump(mg.geom)) AS subquery ORDER BY area DESC LIMIT 1), 4)::jsonb,
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

# Función de monitoreo
def monitorear_archivos():
    ultima_modificacion_incendios = None
    ultima_modificacion_deslizamientos = None
    ruta_archivo_incendios = '/var/lib/data/incendios/probabilidad_icv.csv'
    ruta_archivo_deslizamientos = '/var/lib/data/deslizamientos/probabilidad_idd.csv'

    while True:
        try:
            modificacion_actual_incendios = os.path.getmtime(ruta_archivo_incendios)
            if modificacion_actual_incendios != ultima_modificacion_incendios:
                alertas_incendios(url_conexion, ruta_archivo_incendios)
                ultima_modificacion_incendios = modificacion_actual_incendios

            modificacion_actual_deslizamientos = os.path.getmtime(ruta_archivo_deslizamientos)
            if modificacion_actual_deslizamientos != ultima_modificacion_deslizamientos:
                alertas_deslizamientos(url_conexion, ruta_archivo_deslizamientos)
                ultima_modificacion_deslizamientos = modificacion_actual_deslizamientos
        except Exception as e:
            print(f"Error durante el monitoreo: {e}")

        time.sleep(10)  # Espera 10 segundos antes de verif




print(alertas_incendios(url_conexion, df_incendios))
print(alertas_deslizamientos(url_conexion, df_deslizamientos))
print(vista_departamentos(url_conexion))
print(vista_deslizamientos(url_conexion))
print(vista_incendios(url_conexion))
print(monitorear_archivos())