# Kiosco Sucursal 2 - Tienda Cliente

## 🏪 Información del Negocio
- **Nombre:** Kiosco Sucursal 2
- **Owner ID:** 6639778784
- **URL:** https://sucursal2.websopen.com

## 🚀 Desarrollo Local

```bash
npm install
npm run dev
```

La app estará disponible en http://localhost:3005

## 📦 Build

```bash
npm run build
```

## 🌐 Deployment

Esta aplicación está configurada para desplegarse en Cloudflare Pages:
- **URL de producción:** https://sucursal2.websopen.com
- **Custom domain configurado:** sucursal2.websopen.com

### Deploy desde Git
1. Push a GitHub
2. Conectar repositorio en Cloudflare Pages
3. Configuración de build:
   - Build command: `npm install && npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

### Deploy manual
```bash
npm run build
npx wrangler pages deploy dist --project-name=web-kiosco-cliente-sucursal2
```

## 🎨 Personalización

Este es un clon independiente que puedes personalizar completamente:
- Colores en `tailwind.config.js`
- Logo en `public/logo.png`
- Componentes en `components/`
- Estilos en `src/`

## 📝 Configuración

El `owner_id` está hardcodeado en este clon: **6639778784**

Para cambios, edita:
- `metadata.json`
- `package.json` (metadata section)
- Cualquier referencia en el código fuente

## 🔄 Sincronización con Base

Si hay actualizaciones importantes en `web-kiosco-cliente` (base):

```bash
# Agregar remote al repo base
git remote add base ../web-kiosco-cliente

# Fetch cambios
git fetch base

# Merge selectivo (revisar conflictos)
git merge base/main --no-commit
```

---

**Creado:** sáb 22 nov 2025 20:56:33 -03
**Script:** create-client-store.sh
