@"
# Auditoría y Contramedidas de Seguridad (Laravel API + Vue 3 PWA)

## Seguridad en producción

Para el despliegue seguro de esta arquitectura (API Laravel + Cliente Vue 3 PWA/Capacitor) en un entorno de producción, se aplican y exigen las siguientes medidas:

1. **Transporte cifrado (HTTPS / TLS):**
   - Toda comunicación entre el cliente web/móvil y la API debe realizarse exclusivamente mediante `https://` con certificados TLS válidos para evitar la interceptación de tokens Bearer en tránsito.
2. **Variables de entorno y gestión de secretos:**
   - En producción se establece estrictamente `APP_ENV=production` y `APP_DEBUG=false` en Laravel para evitar fugas de trazas, consultas SQL o rutas internas ante excepciones.
   - Las claves privadas (`APP_KEY`, credenciales de base de datos, claves de pasarelas de pago) permanecen únicamente en el servidor backend; nunca se prefijan con `VITE_` ni se incluyen en el bundle del cliente.
3. **Autenticación, sesiones y control de acceso:**
   - Tokens de Sanctum configurados con tiempo de expiración (`expiration => 60` minutos) y revocación explícita en el servidor mediante `POST /api/logout`.
   - Autorización verificada en el backend mediante Policies (`PedidoPolicy`) y validación estricta de entradas en cada endpoint, junto con limitación de tasa (`throttle:5,1`) en rutas de autenticación.
4. **Endurecimiento del cliente PWA y Capacitor:**
   - Almacenamiento temporal de tokens en `sessionStorage` (evitando `localStorage`), sanitización de salidas en Vue (`{{ }}` sin `v-html` sobre datos no confiables), políticas CSP (`Content-Security-Policy`) y cabeceras HTTP de seguridad (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`).
   - Exclusión de endpoints privados (`/api/pedidos`, `/api/login`) del Service Worker (`NetworkOnly`) para evitar persistencia en `Cache Storage` en dispositivos compartidos.
5. **Mantenimiento y auditoría de dependencias:**
   - Ejecución periódica de `composer audit` (backend) y `npm audit` (frontend) antes de cada despliegue para detectar y parchar vulnerabilidades conocidas en paquetes de terceros.
"@ | Set-Content -Encoding UTF8 README.md