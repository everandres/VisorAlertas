#!/usr/bin/env python
# coding: utf-8

# In[9]:


import pandas as pd
from sqlalchemy import create_engine
import psycopg2
import geopandas as gpd
from geoalchemy2 import Geometry
import shapely.wkb as wkb


# In[10]:


# Crear una conexión a la base de datos
usuario = 'postgres'
contraseña = 'Septiembre0672'
host = 'localhost'
puerto = '5432'
db = 'alertas'
url_conexion = 'postgresql://postgres:Septiembre0672@db:5432/alertas'


# In[11]:


def cargar_departamentos(gdf, url_conexion):
    # Carga tu archivo SHP
    gdf = gdf.rename(columns=str.lower)
    # Configura la conexión a tu base de datos
    engine = create_engine(url_conexion)
    # Convertir la columna de geometría a WKB
    gdf['geometry'] = gdf['geometry'].apply(lambda x: wkb.dumps(x, hex=True))
    gdf = gdf.rename(columns={'geometry': 'geom'})
   
    return gdf.to_sql('departamentos_wgs84', engine, if_exists='replace', index=False, 
           dtype={'geom': Geometry(geometry_type='GEOMETRY', srid=4326)})


# In[12]:


gdf_departamentos = gpd.read_file('./Departamentos_WGS84/Departamentos_WGS84.shp')


# In[13]:


print(cargar_departamentos(gdf_departamentos, url_conexion))


# In[18]:


def cargar_municipios(gdf, url_conexion):
    # Carga tu archivo SHP
    gdf = gdf.rename(columns=str.lower)
    # Configura la conexión a tu base de datos
    engine = create_engine(url_conexion)
    # Convertir la columna de geometría a WKB
    gdf['geometry'] = gdf['geometry'].apply(lambda x: wkb.dumps(x, hex=True))
    gdf = gdf.rename(columns={'geometry': 'geom'})
   
    return gdf.to_sql('mgn_mpio_politico', engine, if_exists='replace', index=False, 
           dtype={'geom': Geometry(geometry_type='GEOMETRY', srid=4326)})


# In[19]:


gdf_municipios = gpd.read_file('./MGN_MPIO_POLITICO/MGN_MPIO_POLITICO.shp')


# In[21]:


print(cargar_municipios(gdf_municipios, url_conexion))







