CREATE OR REPLACE VIEW alertas_deslizamientos AS
SELECT d.*,
jsonb_build_object(
  'type', 'Feature',
  'geometry', ST_AsGeoJSON(ST_GeometryN(mg.geom, 1), 4)::jsonb,
  'properties', jsonb_build_object(
    'PROBABILIDAD_DESC', CASE
                           WHEN d."PROBABILIDAD" = 1 THEN 'BAJA'
                           WHEN d."PROBABILIDAD" = 2 THEN 'MEDIA'
                           WHEN d."PROBABILIDAD" = 3 THEN 'ALTA'
                           ELSE 'no definida' -- Opcional: para valores distintos de 1, 2 o 3
                         END,
    'PROBABILIDAD', d."PROBABILIDAD",
    'REGION', d."REGION",
    'DEPARTAMENTO', d."DEPARTAMENTO",
    'MUNICIPIO', d."MUNICIPIO"
  )
) AS geom
FROM deslizamientos AS d
INNER JOIN mgn_mpio_politico AS mg
ON d."COD_DANE" = mg.mpio_cdpmp;
