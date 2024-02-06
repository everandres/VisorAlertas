CREATE OR REPLACE VIEW departamentos_colombia AS
SELECT departamen, jsonb_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(geom, 4)::jsonb,
  'properties', jsonb_build_object(
    'DEPARTAMENTO', departamen
  )
) AS geom
FROM public.departamentos_wgs84