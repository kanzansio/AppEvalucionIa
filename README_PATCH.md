# Parche rápido para el error de build en Vercel (GSAP)

**Error:** `No matching version found for gsap@^3.13.5`

## Qué cambia este parche
- Fija GSAP a una versión **disponible** en el registry: **^3.12.5**.
- Mantiene el resto de dependencias como están.

## Pasos
1) En tu repo `CuestionarioMejorado` (branch funcional), **reemplaza** el `package.json` por el de este zip.
2) **Elimina** cualquier `pnpm-lock.yaml` del repo (si existe), para que Vercel use **npm**.
3) Opcional: elimina `node_modules/` y `package-lock.json` locales y corre `npm install` para regenerar.
4) En Vercel, haz **Redeploy** con **Clear build cache**.

Con esto el build debería pasar sin errores.
