# Configurar Dominio Personalizado para Kiosco El Morro

## 🎯 Objetivo
Cambiar la URL de `https://cliente-base-kiosco.pages.dev/` a un dominio personalizado como:
- `elmorro.tudominio.com` (si tienes un dominio)
- `kioskelmorro.com` (dominio nuevo)

---

## 📋 Opción 1: Usar Subdominio de tu Dominio Actual (GRATIS)

### Paso 1: Verificar que tienes un dominio en Cloudflare
1. Ve a tu dashboard de Cloudflare: https://dash.cloudflare.com/
2. Revisa si tienes algún dominio listado en "Websites"
3. Si tienes uno, anota el nombre (ej: `tudominio.com`)

### Paso 2: Configurar Custom Domain en Cloudflare Pages
1. Ve a **Workers & Pages** en el menú izquierdo
2. Busca el proyecto **cliente-base-kiosco**
3. Haz clic en el proyecto
4. Ve a la pestaña **Custom domains**
5. Haz clic en **Set up a custom domain**

### Paso 3: Agregar el Subdominio
Escribe el subdominio que quieres usar, por ejemplo:
- `elmorro.tudominio.com`
- `kiosco.tudominio.com`
- `pedidos.tudominio.com`

### Paso 4: Cloudflare Configurará Automáticamente
Cloudflare automáticamente:
- ✅ Creará el registro DNS necesario
- ✅ Activará HTTPS/SSL automático
- ✅ Tu app estará disponible en la nueva URL en 1-2 minutos

---

## 📋 Opción 2: Comprar Dominio Nuevo

### Paso 1: Comprar el Dominio
**En Cloudflare (Recomendado - sin markup):**
1. Ve a https://dash.cloudflare.com/
2. Menú lateral → **Domain Registration**
3. Busca dominios disponibles:
   - `kioskelmorro.com`
   - `elmorro.shop`
   - `kioscoelmorro.com`
4. Compra el dominio (precios al costo, sin comisión)

**Alternativas:**
- Namecheap: https://www.namecheap.com/
- GoDaddy: https://www.godaddy.com/
- Google Domains: https://domains.google/

### Paso 2: Agregar el Dominio a Cloudflare
Si compraste el dominio fuera de Cloudflare:
1. Ve a **Websites** → **Add a site**
2. Ingresa tu nuevo dominio
3. Sigue los pasos para cambiar los nameservers en tu registrador
4. Espera 24-48h para que se propague

### Paso 3: Configurar en Cloudflare Pages
Una vez que el dominio esté en Cloudflare:
1. Ve a **Workers & Pages**
2. Selecciona **cliente-base-kiosco**
3. Pestaña **Custom domains**
4. Agrega tu dominio completo (ej: `kioskelmorro.com`)
5. También puedes agregar `www.kioskelmorro.com` como alias

---

## 🚀 Opción 3: Dominio Temporal Cloudflare (Gratis)

Si solo quieres una URL más corta temporalmente:

### Renombrar el Proyecto
1. Ve a **Workers & Pages**
2. Selecciona **cliente-base-kiosco**
3. Ve a **Settings**
4. Busca **Project name**
5. Cámbialo a algo más corto:
   - `elmorro` → `https://elmorro.pages.dev`
   - `kiosco-elmorro` → `https://kiosco-elmorro.pages.dev`
   - `pedidos-elmorro` → `https://pedidos-elmorro.pages.dev`

⚠️ **Nota:** Esto cambiará todas las URLs de producción, asegúrate de actualizar las referencias.

---

## 🔄 Actualizar Referencias en el Código

Después de configurar el dominio personalizado, actualiza estas referencias:

### 1. DevHub Configuration
Archivo: `/omni_app/webapp/api/dev_api.py`

```python
DEV_APPS = {
    "kiosco_cliente": {
        "name": "Kiosco Cliente",
        "description": "Interfaz para clientes",
        "port": 3005,
        "url_local": "http://localhost:3005",
        "url_prod": "https://TU-NUEVO-DOMINIO.com",  # ← CAMBIAR AQUÍ
        "requires_auth": False,
        "auth_type": None,
        "icon": "🛒"
    },
}
```

### 2. README y Documentación
Archivo: `/frontends/web-kiosco-cliente/README.md`

Actualiza las URLs de producción mencionadas.

---

## 📝 Ejemplo Completo: Configurar elmorro.midominio.com

### Suponiendo que tienes `midominio.com` en Cloudflare:

```bash
# 1. Ve a Cloudflare Dashboard
https://dash.cloudflare.com/

# 2. Workers & Pages → cliente-base-kiosco → Custom domains

# 3. Click "Set up a custom domain"

# 4. Ingresa: elmorro.midominio.com

# 5. Click "Continue"

# 6. Cloudflare configurará automáticamente:
#    - DNS Record: CNAME elmorro → cliente-base-kiosco.pages.dev
#    - SSL Certificate: Automático (Universal SSL)

# 7. ¡Listo! En 1-2 minutos estará disponible en:
https://elmorro.midominio.com
```

---

## ✅ Verificación

Después de configurar, verifica:

### 1. DNS Propagación
```bash
# En tu terminal
nslookup elmorro.midominio.com
# Debería resolver a un IP de Cloudflare
```

### 2. HTTPS Funcionando
```bash
curl -I https://elmorro.midominio.com
# Debería retornar 200 OK con certificado válido
```

### 3. Aplicación Carga Correctamente
- Abre `https://elmorro.midominio.com` en tu navegador
- Verifica que la app carga sin errores de CORS
- Verifica que puede conectarse al backend

---

## 🔧 Configuración Avanzada (Opcional)

### Redirect www a dominio principal
Si configuraste `kioskelmorro.com`, también agrega:

1. Custom domain: `www.kioskelmorro.com`
2. En **Page Rules** (en el dominio principal):
   - URL: `www.kioskelmorro.com/*`
   - Setting: **Forwarding URL** (301 Permanent Redirect)
   - Destination: `https://kioskelmorro.com/$1`

### Configurar Headers de Seguridad
En Cloudflare Pages → Settings → Functions:

Crea `functions/_middleware.ts`:
```typescript
export async function onRequest(context) {
  const response = await context.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

---

## 💡 Recomendaciones

### Para "Kiosco El Morro":

**Si tienes dominio:**
- ✅ `elmorro.tudominio.com` - Claro y directo
- ✅ `pedidos.elmorro.com` - Específico para pedidos
- ✅ `kiosco.tudominio.com` - Genérico

**Si compras dominio nuevo:**
- ✅ `kioskelmorro.com` - Nombre del negocio
- ✅ `elmorro.shop` - Moderno y comercial
- ✅ `pedidoselmorro.com` - Descriptivo

**Nombre corto en Pages.dev:**
- ✅ `elmorro.pages.dev` - Simple
- ✅ `kiosco-elmorro.pages.dev` - Balance

---

## 🆘 Solución de Problemas

### Error: "Domain already in use"
El dominio ya está siendo usado por otro proyecto en Cloudflare Pages.
- **Solución:** Usa un subdominio diferente o remueve el dominio del otro proyecto.

### Error: "Unable to reach DNS provider"
Los nameservers del dominio no apuntan a Cloudflare.
- **Solución:** Verifica que los nameservers estén configurados correctamente en tu registrador.

### HTTPS no funciona
El certificado SSL aún se está generando.
- **Solución:** Espera 5-10 minutos. Cloudflare genera certificados automáticamente.

### 522 Error (Connection timed out)
El proyecto no está desplegado o hay un error en el build.
- **Solución:** Verifica que el último deployment fue exitoso en la pestaña "Deployments".

---

## 📞 Soporte

Si necesitas ayuda:
1. **Cloudflare Community:** https://community.cloudflare.com/
2. **Cloudflare Docs:** https://developers.cloudflare.com/pages/
3. **Cloudflare Support:** Desde tu dashboard (planes Pro+)

---

## ✨ Próximos Pasos

Después de configurar tu dominio:

1. ✅ Actualizar `dev_api.py` con la nueva URL de producción
2. ✅ Probar el flujo completo desde DevHub
3. ✅ Generar QR code con la nueva URL
4. ✅ Actualizar materiales de marketing
5. ✅ Compartir el link con tus clientes

---

**¡Tu Kiosco El Morro tendrá una URL profesional y fácil de recordar!** 🎉
