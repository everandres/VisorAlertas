CREATE OR REPLACE VIEW alertas_incendios AS
SELECT i.*, jsonb_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(ST_GeometryN(mg.geom, 1), 4)::jsonb,
  'properties', jsonb_build_object(
	 'PROBABILIDAD_DESC', CASE
                           WHEN i."PROBABILIDAD" = 1 THEN 'BAJA'
                           WHEN i."PROBABILIDAD" = 2 THEN 'MEDIA'
                           WHEN i."PROBABILIDAD" = 3 THEN 'ALTA'
                           ELSE 'no definida' -- Opcional: para valores distintos de 1, 2 o 3
                         END,
    'PROBABILIDAD', i."PROBABILIDAD",
    'REGION', i."REGION",
    'DEPARTAMENTO', i."DEPARTAMENTO",
	  'FECHA_EJECUCION', i."FECHA_EJECUCION",
    'MUNICIPIO', i."MUNICIPIO"
  )
) AS geom
FROM incendios as i
INNER JOIN mgn_mpio_politico as mg
ON i."COD_DANE" = mg.mpio_cdpmp;
