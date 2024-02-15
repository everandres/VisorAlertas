import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import os

class Watcher:
    def __init__(self, files_to_watch):
        self.observer = Observer()
        self.files_to_watch = files_to_watch

    def run(self):
        event_handler = Handler(self.files_to_watch)
        # Dado que watchdog necesita un directorio para observar, obtenemos el directorio de los archivos
        watched_dirs = set(map(lambda f: os.path.dirname(f), self.files_to_watch))
        for directory in watched_dirs:
            self.observer.schedule(event_handler, directory, recursive=False)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except KeyboardInterrupt:
            self.observer.stop()
            print("Observer Stopped")

        self.observer.join()

class Handler(FileSystemEventHandler):
    def __init__(self, files_to_watch):
        super().__init__()
        self.files_to_watch = files_to_watch

    def on_modified(self, event):
        # Solo actúa si el archivo modificado está en la lista de archivos a monitorear
        if event.src_path in self.files_to_watch:
            print(f"Cambio detectado en {event.src_path}. Re-ejecutando AlertasSQL.py")
            subprocess.call(['python', 'AlertasSQL.py'])

if __name__ == "__main__":
    files_to_watch = ["/var/lib/data/incendios/probabilidad_icv.csv", "/var/lib/data/incendios/probabilidad_idd.csv"]  # Modifica esto con las rutas de tus archivos específicos
    watcher = Watcher(files_to_watch)
    watcher.run()
