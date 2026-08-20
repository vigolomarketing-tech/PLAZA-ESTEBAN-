# Plaza Esteban — Sitio web + Carta digital + Pedidos por WhatsApp

Sitio web oficial (estático) para **Plaza Esteban**, bar · pizzería · cafetería
en Adrogué, Buenos Aires. Incluye presentación de la marca, **carta digital
interactiva** y un **sistema de pedidos** que arma automáticamente un mensaje de
WhatsApp para el restaurante.

- 📍 Plaza Esteban Adrogué 31, Adrogué, Buenos Aires
- 💬 WhatsApp: +54 9 11 5824-2046
- 📸 Instagram: [@plazaestebanadrogue](https://www.instagram.com/plazaestebanadrogue)

---

## ✨ Qué incluye

- **Diseño mobile-first** (negro / blanco / rojo), pensado para entrar desde el
  celular vía Google, Instagram, un link o el **QR de la mesa**.
- **Carta digital** con más de 150 productos, barra de categorías desplazable,
  buscador y scroll automático a cada sección.
- **Carrito de compras real** (agregar, variantes, cantidades, eliminar, vaciar,
  total) con botón flotante y drawer/bottom-sheet.
- **Checkout con 3 modalidades**: comer en el local, retiro y delivery, cada una
  con su propio formulario.
- **Integración con WhatsApp**: genera un mensaje formateado y lo abre en
  `wa.me` — el usuario confirma el envío.
- **QR por mesa**: `?mesa=8` detecta la mesa y selecciona "Comer en el local".
- **LocalStorage**: el carrito, la modalidad y la mesa se conservan al recargar.
- **SEO local** (title, meta description, Open Graph, schema.org `Restaurant`),
  accesibilidad y buen rendimiento (solo HTML/CSS/JS vanilla, sin frameworks).

---

## 🗂️ Estructura del proyecto

```
.
├── index.html      # Estructura de la página
├── style.css       # Estilos (paleta, responsive, componentes)
├── menu.js         # DATOS editables: carta, precios, WhatsApp, dirección, horarios, promos
├── script.js       # LÓGICA: carrito, filtros, checkout, WhatsApp, QR mesa, localStorage
├── README.md
└── assets/
    ├── logo.svg
    ├── favicon.svg
    ├── og-image.svg
    └── frente.jpg  # (opcional) foto real del frente — ver assets/README.md
```

> La **información** (carta, precios, contacto) vive en `menu.js`.
> La **lógica** vive en `script.js`. Así se puede actualizar la carta sin tocar
> el código de la aplicación.

---

## ▶️ Cómo ejecutarlo localmente

Es un sitio estático: se puede abrir `index.html` directamente en el navegador.
Para que todo funcione igual que en producción, conviene servirlo con un
servidor local:

```bash
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: Node
npx serve .
```

Luego abrir <http://localhost:8080>.

---

## ✏️ Dónde modificar cada cosa

Todo lo editable está en **`menu.js`**.

| Quiero cambiar…            | Dónde                                                         |
|----------------------------|--------------------------------------------------------------|
| **Precios / productos**    | Array `MENU` (cada producto tiene `variants: [{name, price}]`) |
| **Nombre de categorías / orden** | Array `CATEGORIES`                                    |
| **Número de WhatsApp**     | `CONFIG.whatsapp` (formato internacional, sin símbolos)      |
| **Dirección**              | `CONFIG.direccion`, `CONFIG.localidad`, `CONFIG.mapsQuery`   |
| **Instagram**              | `CONFIG.instagram`, `CONFIG.instagramUrl`                    |
| **Horarios**               | `CONFIG.horarios` (ver más abajo)                            |
| **Promociones**            | Array `PROMOS`                                               |
| **Precio de "Pizza Libre"**| `CONFIG.pizzaLibrePrecio`                                    |

### Actualizar un precio

```js
{ id: "pz-muzzarella", name: "Muzzarella", category: "pizzas",
  description: "Salsa de tomate, mozzarella, aceitunas verdes y orégano.",
  variants: [{ name: "Mediana", price: 15000 }, { name: "Grande", price: 18000 }] },
```

Cambiá el número en `price` y listo (sin puntos ni símbolos: `18000`).
El sitio lo muestra formateado como `$18.000` automáticamente.

### Precios a confirmar

Algunos valores de la carta impresa están **escritos a mano**. Donde no pudieron
confirmarse con certeza, están marcados con el comentario:

```js
// PRECIO A CONFIRMAR
```

Buscá ese texto en `menu.js` para revisarlos rápido. Afecta principalmente a:
**milanesas**, **sándwiches de milanesa** y **hamburguesas**.

### Horarios (abierto / cerrado)

Mientras `CONFIG.horarios` esté vacío (`[]`), el sitio muestra
*"Consultá disponibilidad por WhatsApp"* (no inventa horarios). Para activarlo:

```js
horarios: [
  { dia: 1, abre: "09:00", cierra: "23:30" }, // lunes
  { dia: 2, abre: "09:00", cierra: "23:30" }, // martes
  // ... dia: 0 = domingo, 6 = sábado
],
```

Podés cargar varios tramos por día. El estado se actualiza solo cada minuto.

---

## 📱 QR por mesa

El sitio detecta el parámetro `?mesa=` en la URL. Al escanear el QR:

- Muestra un banner *"Estás pidiendo desde la Mesa N"*.
- Preselecciona la modalidad **Comer en el local** en el checkout.

Ejemplos de URLs para generar los QR (una por mesa):

```
https://TU-USUARIO.github.io/PLAZA-ESTEBAN-/?mesa=1
https://TU-USUARIO.github.io/PLAZA-ESTEBAN-/?mesa=2
https://TU-USUARIO.github.io/PLAZA-ESTEBAN-/?mesa=15
```

Podés crear los QR con cualquier generador gratuito (por ejemplo buscando
"generador de códigos QR") pegando esas URLs.

---

## 🛒 Cómo funciona el pedido

1. El cliente agrega productos (elige tamaño/variante y salsa/sabor si aplica).
2. Abre el carrito (botón flotante), ajusta cantidades y toca **Finalizar pedido**.
3. Elige la modalidad y completa un formulario corto.
4. Toca **Enviar pedido por WhatsApp**: se abre WhatsApp con el mensaje ya armado
   hacia **+54 9 11 5824-2046**. El envío siempre lo confirma el cliente.

> En delivery **no se calcula costo de envío**: el mensaje aclara
> *"Costo de envío a confirmar por WhatsApp"*.

---

## 🚀 Publicar en GitHub Pages

1. Subí estos archivos a la raíz del repositorio.
2. En GitHub: **Settings → Pages**.
3. En **Source**, elegí la rama (por ejemplo `main`) y la carpeta `/root`.
4. Guardá. En unos minutos el sitio queda en
   `https://TU-USUARIO.github.io/PLAZA-ESTEBAN-/`.

Todas las rutas de assets son **relativas** (`./assets/...`), así que el sitio
funciona correctamente publicado dentro de un subdirectorio del dominio de
GitHub Pages.

---

## 🧩 Notas técnicas

- Sin dependencias ni build: **HTML5 + CSS3 + JavaScript vanilla**.
- Fuentes: Google Fonts (Poppins + Playfair Display) con fallbacks del sistema.
- Respeta `prefers-reduced-motion` y usa foco visible, `aria-labels` y formularios
  etiquetados.
- Precios formateados con `Intl.NumberFormat("es-AR")`.
