# Ergonomía ocupacional en Herraidea

Sitio educativo sobre el diagnóstico ergonómico de un taller metalmecánico de alta precisión en León, Guanajuato.

## Desarrollo local

El proyecto es una página estática y no requiere instalar dependencias:

```bash
python3 -m http.server 4173
```

Después visita `http://localhost:4173`.

## Despliegue en Vercel

Importa este repositorio desde el panel de Vercel. El framework debe detectarse como **Other** y no requiere comando de compilación ni directorio de salida personalizado. Cada actualización de `main` generará un nuevo despliegue de producción.
