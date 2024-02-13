from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import os

class CambioArchivoHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == "/data/incendios/probabilidad_icv.csv" or event.src_path == "/data/deslizamientos/probabilidad_idd.csv":
            print(f"Archivo modificado: {event.src_path}. Ejecutando script...")
            os.system('python AlertasSQL.py')

if __name__ == "__main__":
    path_incendios = '/data/incendios'
    path_deslizamientos = '/data/deslizamientos'
    event_handler = CambioArchivoHandler()
    observer = Observer()
    observer.schedule(event_handler, path_incendios, recursive=False)
    observer.schedule(event_handler, path_deslizamientos, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
