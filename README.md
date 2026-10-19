# Ergonomía ocupacional en Herraidea

Sitio educativo sobre investigación ergonómica en Herraidea. La portada corresponde al segundo parcial: RULA, REBA, OWAS, esquema LEST de la rúbrica, evidencia pendiente y plan de mejora.

## Rutas

- `/`: estructura del segundo parcial, con cuatro espacios de video y previsualización local sin subida ni persistencia.
- `/seguimiento/`: programa de Claude con tema visual Herraidea y enlace de regreso al reporte. Se conserva el JavaScript original del ZIP; las modificaciones se limitan al diseño, navegación, base de rutas y aviso sobre las condiciones de ejemplo.
- `/primer-parcial`: presentación anterior conservada como antecedente.

## Seguimiento

El programa incluye la imagen de ejemplo y sus modelos locales en `seguimiento/mp/`. Carga la biblioteca MediaPipe Pose y sus scripts auxiliares desde jsDelivr; necesita conexión para esa carga y las fuentes. La cámara requiere un contexto seguro (HTTPS o localhost), permiso explícito y un dispositivo compatible. No se solicita cámara al abrir la presentación.

Los valores precargados son ejemplos de tarea, no mediciones confirmadas para cada video. No se ha validado la exactitud de las puntuaciones ni la compatibilidad con todos los dispositivos. No hay base de datos añadida. Los videos nuevos y la demostración se integrarán cuando el equipo los proporcione.

## Desarrollo local

El proyecto es una página estática y no requiere instalar dependencias:

```bash
python3 -m http.server 4173
```

Después visita `http://localhost:4173`.

## Despliegue en Vercel

Importa este repositorio desde el panel de Vercel. El framework debe detectarse como **Other** y no requiere comando de compilación ni directorio de salida personalizado. Cada actualización de `main` generará un nuevo despliegue de producción.
