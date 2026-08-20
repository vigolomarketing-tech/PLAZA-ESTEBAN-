/* ============================================================================
   PLAZA ESTEBAN — DATOS DEL NEGOCIO Y DE LA CARTA
   ----------------------------------------------------------------------------
   Este archivo contiene TODA la información editable del sitio.
   No hace falta tocar el HTML ni la lógica (script.js) para actualizar la carta.

   CÓMO ACTUALIZAR:
   - Precios / productos .......... editar el array MENU (más abajo).
   - WhatsApp / dirección ......... editar el objeto CONFIG.
   - Horarios ..................... editar CONFIG.horarios.
   - Promociones .................. editar el array PROMOS.
   - Precio de "Pizza Libre" ...... CONFIG.pizzaLibrePrecio.

   NOTA SOBRE PRECIOS:
   Algunos precios de la carta impresa están escritos a mano o modificados.
   Donde el valor no pudo confirmarse con certeza está marcado con el
   comentario  // PRECIO A CONFIRMAR  para revisarlo fácilmente.
   ========================================================================== */

/* ----------------------------------------------------------------------------
   CONFIGURACIÓN DEL NEGOCIO
---------------------------------------------------------------------------- */
const CONFIG = {
  nombre: "Plaza Esteban",
  // Número de WhatsApp en formato internacional SIN símbolos (para wa.me)
  whatsapp: "5491158242046",
  whatsappDisplay: "+54 9 11 5824-2046",
  instagram: "plazaestebanadrogue",
  instagramUrl: "https://www.instagram.com/plazaestebanadrogue",
  direccion: "Plaza Esteban Adrogué 31",
  localidad: "Adrogué, Buenos Aires",
  // Búsqueda en Google Maps (no requiere API key)
  mapsQuery: "Plaza Esteban Adrogué 31, Adrogué, Buenos Aires",

  // Precio destacado de la promo "Pizza Libre" (puede cambiar; editar acá).
  pizzaLibrePrecio: 18000,

  /* HORARIOS
     Dejar el array vacío ([]) mientras no estén confirmados: el sitio mostrará
     "Consultá disponibilidad por WhatsApp" en lugar de un estado inventado.

     Cuando se confirmen, cargar un objeto por día:
       { dia: 0..6 (0=domingo), abre: "09:00", cierra: "23:30" }
     Se pueden cargar varios tramos para el mismo día.
  */
  horarios: [], // HORARIOS A CONFIRMAR
};

/* ----------------------------------------------------------------------------
   PROMOCIONES  (sección Promociones + categoría de la carta)
---------------------------------------------------------------------------- */
const PROMOS = [
  {
    id: "promo-pizza-libre",
    name: "Pizza Libre",
    category: "promociones",
    badge: "Destacado",
    description:
      "Pizza libre + gaseosa o cerveza. Variedades: Muzzarella, Napolitana y Fugazza. Reservá tu lugar por WhatsApp.",
    variants: [{ name: "Por persona", price: CONFIG.pizzaLibrePrecio }],
  },
  {
    id: "promo-empanadas-docena",
    name: "Promo Docena de Empanadas",
    category: "promociones",
    badge: "Promo",
    description:
      "Docena de empanadas caseras. Incluye hasta 2 especiales. No aplica descuento. Abonando en efectivo.",
    variants: [{ name: "Docena", price: 38000 }],
  },
];

/* ----------------------------------------------------------------------------
   ORDEN Y ETIQUETAS DE CATEGORÍAS (barra de navegación de la carta)
---------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: "promociones", label: "Promociones" },
  { id: "pizzas", label: "Pizzas" },
  { id: "empanadas", label: "Empanadas" },
  { id: "milanesas", label: "Milanesas" },
  { id: "carnes", label: "Carnes" },
  { id: "pollo-cerdo", label: "Pollo y cerdo" },
  { id: "pescados", label: "Pescados" },
  { id: "pastas", label: "Pastas" },
  { id: "ensaladas", label: "Ensaladas" },
  { id: "tortillas", label: "Tortillas" },
  { id: "guarniciones", label: "Guarniciones" },
  { id: "sandwiches", label: "Sándwiches" },
  { id: "sandwiches-mila", label: "Sánd. de Milanesa" },
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "cafeteria", label: "Cafetería" },
  { id: "desayunos", label: "Desayunos y meriendas" },
  { id: "licuados", label: "Licuados y jugos" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas sin alcohol" },
  { id: "aperitivos", label: "Aperitivos" },
  { id: "cervezas", label: "Cervezas" },
  { id: "vinos", label: "Vinos" },
  { id: "infantil", label: "Menú infantil" },
];

/* ----------------------------------------------------------------------------
   CARTA / MENÚ
   Esquema de cada producto:
   {
     id:          identificador único (string)
     name:        nombre visible
     category:    id de categoría (ver CATEGORIES)
     description: (opcional) texto descriptivo
     variants:    array de { name, price }  -> si hay más de una, el usuario elige
     choices:     (opcional) { label, options:[...] } -> modificador SIN costo
                  (p. ej. elección de salsa). Se agrega al detalle del producto.
   }
---------------------------------------------------------------------------- */
const MENU = [
  /* ========================= PIZZAS ========================= */
  // Precios manuscritos en la carta; verificar ante cambios.
  { id: "pz-muzzarella", name: "Muzzarella", category: "pizzas",
    description: "Salsa de tomate, mozzarella, aceitunas verdes y orégano.",
    variants: [{ name: "Mediana", price: 15000 }, { name: "Grande", price: 18000 }] },
  { id: "pz-plaza-esteban", name: "Plaza Esteban", category: "pizzas",
    description: "Mozzarella, provolone, champiñón, aceite de oliva, morrón, orégano y aceitunas negras.",
    variants: [{ name: "Mediana", price: 25000 }, { name: "Grande", price: 34000 }] },
  { id: "pz-fugazza", name: "Fugazza", category: "pizzas",
    description: "Cebolla, orégano y aceite de oliva.",
    variants: [{ name: "Mediana", price: 14500 }, { name: "Grande", price: 17000 }] },
  { id: "pz-americana", name: "Americana", category: "pizzas",
    description: "Mozzarella, jamón, mayonesa, aceitunas verdes y huevo.",
    variants: [{ name: "Mediana", price: 15500 }, { name: "Grande", price: 24000 }] },
  { id: "pz-jamon", name: "Jamón", category: "pizzas",
    description: "Salsa de tomate, mozzarella, jamón y condimentos.",
    variants: [{ name: "Mediana", price: 18500 }, { name: "Grande", price: 23500 }] },
  { id: "pz-jamon-morrones", name: "Jamón y morrones", category: "pizzas",
    description: "Salsa de tomate, mozzarella, jamón, morrón y aceitunas verdes.",
    variants: [{ name: "Mediana", price: 24500 }, { name: "Grande", price: 26500 }] },
  { id: "pz-napolitana", name: "Napolitana", category: "pizzas",
    description: "Salsa de tomate, mozzarella, rodajas de tomate, ajo, aceitunas verdes y condimentos.",
    variants: [{ name: "Mediana", price: 18500 }, { name: "Grande", price: 22000 }] },
  { id: "pz-napolitana-jamon", name: "Napolitana con jamón", category: "pizzas",
    description: "Salsa de tomate, mozzarella, jamón, rodajas de tomate y ajo.",
    variants: [{ name: "Mediana", price: 22000 }, { name: "Grande", price: 24000 }] },
  { id: "pz-calabresa", name: "Calabresa", category: "pizzas",
    description: "Salsa de tomate, mozzarella, longaniza en rodajas, condimentos y aceitunas verdes.",
    variants: [{ name: "Mediana", price: 24000 }, { name: "Grande", price: 30000 }] },
  { id: "pz-roquefort", name: "Roquefort", category: "pizzas",
    description: "Salsa de tomate, mozzarella, roquefort y aceitunas verdes.",
    variants: [{ name: "Mediana", price: 18900 }, { name: "Grande", price: 25300 }] },
  { id: "pz-rucula", name: "Rúcula con panceta o jamón crudo", category: "pizzas",
    description: "Mozzarella, panceta ahumada o jamón crudo, rúcula, morrón y aceitunas negras.",
    variants: [{ name: "Mediana", price: 26000 }, { name: "Grande", price: 36500 }] },
  { id: "pz-provolone", name: "Provolone", category: "pizzas",
    description: "Mozzarella, provolone, condimentos y aceitunas negras.",
    variants: [{ name: "Mediana", price: 24000 }, { name: "Grande", price: 26000 }] },
  { id: "pz-verdura", name: "Verdura", category: "pizzas",
    description: "Mozzarella, espinaca/acelga, salsa blanca, parmesano y aceitunas verdes.",
    variants: [{ name: "Mediana", price: 22300 }, { name: "Grande", price: 27500 }] },
  { id: "pz-cuatro-quesos", name: "Cuatro quesos", category: "pizzas",
    description: "Salsa de tomate, mozzarella, provolone, roquefort y parmesano.",
    variants: [{ name: "Mediana", price: 26000 }, { name: "Grande", price: 31500 }] },
  { id: "pz-italiana", name: "Italiana", category: "pizzas",
    description: "Salsa de tomate, mozzarella, tomate en rodajas y morrón.",
    variants: [{ name: "Mediana", price: 24300 }, { name: "Grande", price: 25500 }] }, // PRECIO A CONFIRMAR (manuscrito)
  { id: "pz-siciliana", name: "Siciliana", category: "pizzas",
    description: "Salsa de tomate, mozzarella, huevo duro, anchoas, condimentos y aceitunas negras.",
    variants: [{ name: "Mediana", price: 19000 }, { name: "Grande", price: 23500 }] },
  { id: "pz-glase", name: "Glasé", category: "pizzas",
    description: "Mozzarella, jamón glaseado, ananá y cerezas.",
    variants: [{ name: "Mediana", price: 21700 }, { name: "Grande", price: 32000 }] },
  { id: "pz-fugazza-queso", name: "Fugazza con queso", category: "pizzas",
    description: "Mozzarella, cebolla, aceite de oliva y orégano.",
    variants: [{ name: "Mediana", price: 15000 }, { name: "Grande", price: 18000 }] },
  { id: "pz-fugazzetta", name: "Fugazzetta especial", category: "pizzas",
    description: "Mozzarella, jamón, cebolla y aceite de oliva.",
    variants: [{ name: "Mediana", price: 22000 }, { name: "Grande", price: 28000 }] },
  { id: "pz-faina-entera", name: "Fainá entera", category: "pizzas",
    variants: [{ name: "Entera", price: 16000 }] },
  { id: "pz-faina-porcion", name: "Fainá (porción)", category: "pizzas",
    variants: [{ name: "Porción", price: 2300 }] },

  /* ========================= EMPANADAS ========================= */
  // Empanadas clásicas a $3.300 c/u; especiales $4.000 c/u.
  { id: "emp-carne", name: "Empanada de carne", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-carne-picante", name: "Empanada de carne picante", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-pollo", name: "Empanada de pollo", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-jyq", name: "Empanada de jamón y queso", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-humita", name: "Empanada de humita", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-verdura", name: "Empanada de verdura", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-cebolla-queso", name: "Empanada de cebolla y queso", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-capresse", name: "Empanada capresse", category: "empanadas",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "emp-roquefort-jamon", name: "Empanada especial roquefort y jamón", category: "empanadas",
    description: "Especial.", variants: [{ name: "Unidad", price: 4000 }] },
  { id: "emp-jamon-crudo-queso", name: "Empanada especial jamón crudo y queso", category: "empanadas",
    description: "Especial.", variants: [{ name: "Unidad", price: 4000 }] },
  { id: "emp-docena", name: "Docena de empanadas (promo)", category: "empanadas",
    description: "Incluye hasta 2 especiales. No aplica descuento. Abonando en efectivo.",
    variants: [{ name: "Docena", price: 38000 }] },

  /* ========================= MILANESAS ========================= */
  // Milanesas de ternera o supremas de pollo, con guarnición.
  // Precios manuscritos en la carta — verificar.
  { id: "mila-sola", name: "Milanesa sola", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 19000 }] }, // PRECIO A CONFIRMAR (ternera $19.000 / pollo $22.000 aprox.)
  { id: "mila-napolitana", name: "Milanesa napolitana", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 23000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-suiza", name: "Milanesa suiza o fugazzeta", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 24000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-verdeo", name: "Milanesa al verdeo", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 23000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-roquefort", name: "Milanesa a la roquefort", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 24000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-4-quesos", name: "Milanesa a los 4 quesos", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 24000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-xl", name: "Milanesa XL", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 25000 }] }, // PRECIO A CONFIRMAR
  { id: "mila-xl-napolitana", name: "Milanesa XL napolitana", category: "milanesas",
    description: "Con guarnición.",
    choices: { label: "Milanesa de", options: ["Ternera", "Pollo (suprema)"] },
    variants: [{ name: "Porción", price: 26000 }] }, // PRECIO A CONFIRMAR

  /* ========================= CARNES ========================= */
  { id: "carne-matambre", name: "Matambre a la pizza", category: "carnes",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 25000 }] },
  { id: "carne-bife", name: "Bife de chorizo", category: "carnes",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 26000 }] },
  { id: "carne-bife-verdeo", name: "Bife de chorizo al verdeo", category: "carnes",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 27000 }] },
  { id: "carne-bife-champignon", name: "Bife de chorizo al champignon", category: "carnes",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 27000 }] }, // PRECIO A CONFIRMAR

  /* ===================== POLLO Y CERDO ===================== */
  // Pollo (1/4) y Cerdo (bondiola), con guarnición.
  { id: "pc-solo", name: "Solo", category: "pollo-cerdo",
    description: "Con guarnición.",
    variants: [{ name: "Pollo (1/4)", price: 16500 }, { name: "Cerdo (bondiola)", price: 19000 }] },
  { id: "pc-verdeo", name: "Al verdeo", category: "pollo-cerdo",
    description: "Con guarnición.",
    variants: [{ name: "Pollo (1/4)", price: 19900 }, { name: "Cerdo (bondiola)", price: 21500 }] },
  { id: "pc-champignon", name: "Al champignon", category: "pollo-cerdo",
    description: "Con guarnición.",
    variants: [{ name: "Pollo (1/4)", price: 21900 }, { name: "Cerdo (bondiola)", price: 22500 }] },
  { id: "pc-riojana", name: "A la riojana", category: "pollo-cerdo",
    description: "Con guarnición.",
    variants: [{ name: "Pollo (1/4)", price: 24000 }, { name: "Cerdo (bondiola)", price: 24000 }] }, // PRECIO A CONFIRMAR (cerdo)

  /* ========================= PESCADOS ========================= */
  { id: "pesc-romana", name: "Merluza a la romana", category: "pescados",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 19900 }] },
  { id: "pesc-verdeo", name: "Merluza al verdeo", category: "pescados",
    description: "Con guarnición.", variants: [{ name: "Porción", price: 21000 }] },

  /* ========================= PASTAS ========================= */
  // Salsa a elección sin costo: Fileto, Crema, Mixta, Rosa, Blanca.
  { id: "pasta-sorrentinos", name: "Sorrentinos de jamón y queso", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 12000 }] },
  { id: "pasta-ravioles", name: "Ravioles de verdura / ricota / pollo", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 10500 }] },
  { id: "pasta-noquis", name: "Ñoquis", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 8500 }] },
  { id: "pasta-tallarines", name: "Tallarines", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 8500 }] },
  { id: "pasta-tagliatelles", name: "Tagliatelles", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 8500 }] },
  { id: "pasta-canelones", name: "Canelones de verdura o ricota", category: "pastas",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Porción", price: 19800 }] },
  { id: "pasta-salsa-especial", name: "Salsa especial (adicional)", category: "pastas",
    description: "Elegí una salsa especial para tu pasta.",
    choices: { label: "Salsa especial", options: ["Bolognesa", "Cuatro quesos", "Scarparo", "Parisienne", "Putanesca", "Pesto"] },
    variants: [{ name: "Adicional", price: 9900 }] },

  /* ========================= ENSALADAS ========================= */
  { id: "ens-4-gustos", name: "Ensalada 4 gustos", category: "ensaladas",
    variants: [{ name: "Porción", price: 14000 }] },
  { id: "ens-caesar", name: "Ensalada Caesar", category: "ensaladas",
    variants: [{ name: "Porción", price: 16000 }] },
  { id: "ens-capresse", name: "Ensalada Capresse", category: "ensaladas",
    variants: [{ name: "Porción", price: 17000 }] },

  /* ========================= TORTILLAS ========================= */
  { id: "tor-papas", name: "Tortilla de papas", category: "tortillas",
    variants: [{ name: "Porción", price: 13500 }] },
  { id: "tor-papas-cebolla", name: "Tortilla de papas con cebolla", category: "tortillas",
    variants: [{ name: "Porción", price: 15000 }] },
  { id: "tor-espanola", name: "Tortilla a la española", category: "tortillas",
    variants: [{ name: "Porción", price: 16500 }] },

  /* ========================= GUARNICIONES ========================= */
  { id: "guar-papas", name: "Papas fritas", category: "guarniciones",
    variants: [{ name: "Porción", price: 7000 }] },
  { id: "guar-papas-cheddar", name: "Papas fritas con cheddar", category: "guarniciones",
    variants: [{ name: "Porción", price: 13000 }] },
  { id: "guar-papas-panceta-cheddar", name: "Papas fritas con panceta y cheddar", category: "guarniciones",
    variants: [{ name: "Porción", price: 15000 }] },
  { id: "guar-pure", name: "Puré de papas o calabaza", category: "guarniciones",
    variants: [{ name: "Porción", price: 7000 }] },

  /* ========================= SÁNDWICHES ========================= */
  // En pan de miga o árabe.
  { id: "sand-jyq", name: "Sándwich de jamón cocido y queso", category: "sandwiches",
    variants: [{ name: "Unidad", price: 11000 }] },
  { id: "sand-crudo-tomate", name: "Sándwich de jamón crudo, queso y tomate", category: "sandwiches",
    variants: [{ name: "Unidad", price: 12000 }] },
  { id: "sand-completo", name: "Sándwich completo", category: "sandwiches",
    description: "Jamón, queso, tomate y lechuga.",
    variants: [{ name: "Unidad", price: 13500 }] },

  /* ==================== SÁNDWICHES DE MILANESA ==================== */
  // Carne o pollo. Precios manuscritos en la carta — verificar.
  { id: "sm-sola", name: "Sándwich de milanesa solo", category: "sandwiches-mila",
    choices: { label: "Milanesa de", options: ["Carne", "Pollo"] },
    variants: [{ name: "Unidad", price: 15000 }] }, // PRECIO A CONFIRMAR
  { id: "sm-lechuga-tomate", name: "Sándwich de milanesa con lechuga y tomate", category: "sandwiches-mila",
    choices: { label: "Milanesa de", options: ["Carne", "Pollo"] },
    variants: [{ name: "Unidad", price: 16000 }] }, // PRECIO A CONFIRMAR
  { id: "sm-jyq", name: "Sándwich de milanesa con jamón cocido y queso", category: "sandwiches-mila",
    choices: { label: "Milanesa de", options: ["Carne", "Pollo"] },
    variants: [{ name: "Unidad", price: 17000 }] }, // PRECIO A CONFIRMAR
  { id: "sm-completo", name: "Sándwich de milanesa completo", category: "sandwiches-mila",
    description: "Con lechuga, tomate, jamón, queso y huevo.",
    choices: { label: "Milanesa de", options: ["Carne", "Pollo"] },
    variants: [{ name: "Unidad", price: 18000 }] }, // PRECIO A CONFIRMAR

  /* ==================== HAMBURGUESAS CASERAS ==================== */
  // Precios manuscritos en la carta — verificar.
  { id: "ham-sola", name: "Hamburguesa sola con guarnición", category: "hamburguesas",
    variants: [{ name: "Unidad", price: 18000 }] }, // PRECIO A CONFIRMAR
  { id: "ham-lechuga-tomate", name: "Hamburguesa con lechuga y tomate, con guarnición", category: "hamburguesas",
    variants: [{ name: "Unidad", price: 19000 }] }, // PRECIO A CONFIRMAR
  { id: "ham-jyq", name: "Hamburguesa con jamón y queso, con guarnición", category: "hamburguesas",
    variants: [{ name: "Unidad", price: 20000 }] }, // PRECIO A CONFIRMAR
  { id: "ham-completa", name: "Hamburguesa completa", category: "hamburguesas",
    variants: [{ name: "Unidad", price: 23000 }] }, // PRECIO A CONFIRMAR
  { id: "ham-cheddar-crispy", name: "Hamburguesa con cheddar, panceta y cebolla crispy", category: "hamburguesas",
    variants: [{ name: "Unidad", price: 23000 }] }, // PRECIO A CONFIRMAR
  { id: "ham-veggie", name: "Hamburguesa veggie", category: "hamburguesas",
    description: "Medallón de lentejas con lechuga y tomate.",
    variants: [{ name: "Unidad", price: 18000 }] }, // PRECIO A CONFIRMAR

  /* ========================= CAFETERÍA ========================= */
  { id: "caf-cafe", name: "Café / cortado / té", category: "cafeteria",
    variants: [{ name: "Unidad", price: 3300 }] },
  { id: "caf-americano", name: "Americano", category: "cafeteria",
    variants: [{ name: "Unidad", price: 3400 }] },
  { id: "caf-doble", name: "Café doble / lágrima doble", category: "cafeteria",
    variants: [{ name: "Unidad", price: 4600 }] },
  { id: "caf-con-leche", name: "Café con leche", category: "cafeteria",
    variants: [{ name: "Unidad", price: 5000 }] },
  { id: "caf-capuccino", name: "Capuccino", category: "cafeteria",
    variants: [{ name: "Unidad", price: 4800 }] },
  { id: "caf-capuccino-italiano", name: "Capuccino italiano", category: "cafeteria",
    variants: [{ name: "Unidad", price: 5700 }] },
  { id: "caf-frappuccino", name: "Frappuccino", category: "cafeteria",
    variants: [{ name: "Unidad", price: 6500 }] },
  { id: "caf-submarino", name: "Submarino", category: "cafeteria",
    variants: [{ name: "Unidad", price: 6000 }] },
  { id: "caf-calipso", name: "Café Calipso", category: "cafeteria",
    variants: [{ name: "Unidad", price: 5800 }] },
  { id: "caf-reggaeton", name: "Café Reggaetton", category: "cafeteria",
    description: "Tía María, leche, café espresso, crema batida y canela.",
    variants: [{ name: "Unidad", price: 8500 }] },
  { id: "caf-plaza-esteban", name: "Café Plaza Esteban", category: "cafeteria",
    description: "Tía María, leche, café espresso, crema batida y chocolate rallado.",
    variants: [{ name: "Unidad", price: 8300 }] },
  { id: "caf-irlandes", name: "Café irlandés", category: "cafeteria",
    description: "Whisky, café espresso, crema batida y canela.",
    variants: [{ name: "Unidad", price: 8300 }] },
  { id: "caf-adicional", name: "Adicional café", category: "cafeteria",
    variants: [{ name: "Unidad", price: 1300 }] },
  { id: "caf-1-media", name: "Café + 1 medialuna", category: "cafeteria",
    variants: [{ name: "Combo", price: 4800 }] },
  { id: "caf-2-medias", name: "Café + 2 medialunas", category: "cafeteria",
    variants: [{ name: "Combo", price: 6000 }] },
  { id: "caf-leche-2-medias", name: "Café con leche + 2 medialunas", category: "cafeteria",
    variants: [{ name: "Combo", price: 7500 }] },
  { id: "caf-leche-3-medias", name: "Café con leche + 3 medialunas", category: "cafeteria",
    variants: [{ name: "Combo", price: 7900 }] },
  { id: "caf-leche-tostado", name: "Café con leche + medio tostado", category: "cafeteria",
    variants: [{ name: "Combo", price: 8500 }] },
  { id: "caf-exprimido-tostado", name: "Copa de exprimido + medio tostado", category: "cafeteria",
    variants: [{ name: "Combo", price: 10000 }] },

  /* =================== DESAYUNOS Y MERIENDAS =================== */
  { id: "des-ejecutivo", name: "Desayuno Ejecutivo", category: "desayunos", featured: true,
    description: "1 capuccino, medio tostado y copa de jugo de naranja.",
    variants: [{ name: "Combo", price: 12000 }] },
  { id: "des-light", name: "Desayuno Light", category: "desayunos", featured: true,
    description: "1 infusión, copa de jugo de naranja, tostadas de pan blanco, queso blanco descremado y mermelada dietética.",
    variants: [{ name: "Combo", price: 11500 }] },
  { id: "des-americano", name: "Desayuno Americano", category: "desayunos", featured: true,
    description: "1 infusión, huevos revueltos con rolls de jamón cocido y copa de jugo de naranja.",
    variants: [{ name: "Combo", price: 14000 }] },
  { id: "des-plaza-esteban", name: "Desayuno Plaza Esteban", category: "desayunos", featured: true,
    description: "2 infusiones, medio tostado, 2 copas de jugo de naranja y media porción de torta a elección.",
    variants: [{ name: "Combo", price: 24000 }] },
  { id: "des-adrogue", name: "Especial Adrogué", category: "desayunos", featured: true,
    description: "1 infusión, medio tostado, media porción de torta a elección y 1 copa de jugo de naranja.",
    variants: [{ name: "Combo", price: 14000 }] },
  // Para acompañar
  { id: "acc-medialuna", name: "Medialuna de manteca o grasa", category: "desayunos",
    variants: [{ name: "Unidad", price: 1700 }] },
  { id: "acc-huevos", name: "Huevos revueltos con jamón cocido", category: "desayunos",
    variants: [{ name: "Porción", price: 7500 }] },
  { id: "acc-tostadas", name: "Tostadas con manteca, mermelada y dulce de leche", category: "desayunos",
    variants: [{ name: "Porción", price: 6000 }] },
  { id: "acc-tostado", name: "Tostado de jamón y queso", category: "desayunos",
    variants: [{ name: "Unidad", price: 11000 }] },
  { id: "acc-medio-tostado", name: "Medio tostado de jamón y queso", category: "desayunos",
    variants: [{ name: "Unidad", price: 6900 }] },
  { id: "acc-medialuna-jyq", name: "Medialuna de jamón y queso", category: "desayunos",
    variants: [{ name: "Unidad", price: 3800 }] },

  /* =================== LICUADOS Y JUGOS =================== */
  { id: "lic-agua", name: "Licuado al agua", category: "licuados",
    choices: { label: "Sabor", options: ["Ananá", "Frutilla", "Durazno", "Banana", "Multifruta"] },
    variants: [{ name: "Vaso", price: 8000 }] },
  { id: "lic-leche", name: "Licuado con leche", category: "licuados",
    choices: { label: "Sabor", options: ["Ananá", "Frutilla", "Durazno", "Banana", "Multifruta"] },
    variants: [{ name: "Vaso", price: 9000 }] },
  { id: "lic-limonada", name: "Limonada", category: "licuados",
    variants: [{ name: "Vaso", price: 7500 }] },
  { id: "lic-milkshake", name: "Milk Shake", category: "licuados",
    description: "Leche, crema de leche y helado de chocolate o americana.",
    variants: [{ name: "Vaso", price: 9900 }] },
  { id: "lic-exprimido", name: "Exprimido de naranjas", category: "licuados",
    variants: [{ name: "Vaso", price: 8500 }] },

  /* =================== POSTRES =================== */
  { id: "pos-bocha-1", name: "Bocha de helado (1)", category: "postres",
    variants: [{ name: "Unidad", price: 4500 }] },
  { id: "pos-bocha-2", name: "Bocha de helado (2)", category: "postres",
    variants: [{ name: "Unidad", price: 6500 }] },
  { id: "pos-flan", name: "Flan casero mixto", category: "postres",
    variants: [{ name: "Porción", price: 7000 }] },
  { id: "pos-budin", name: "Budín de pan mixto", category: "postres",
    variants: [{ name: "Porción", price: 7000 }] },
  { id: "pos-ensalada-frutas", name: "Ensalada de frutas", category: "postres",
    variants: [{ name: "Porción", price: 7000 }] },
  { id: "pos-panqueque", name: "Panqueque de dulce de leche", category: "postres",
    variants: [{ name: "Unidad", price: 9900 }] },

  /* =================== BEBIDAS SIN ALCOHOL =================== */
  { id: "beb-agua-gas", name: "Agua con gas", category: "bebidas",
    variants: [{ name: "Unidad", price: 3500 }] },
  { id: "beb-agua-sin-gas", name: "Agua sin gas", category: "bebidas",
    variants: [{ name: "Unidad", price: 3500 }] },
  { id: "beb-gaseosa", name: "Gaseosa línea Coca-Cola", category: "bebidas",
    variants: [{ name: "Unidad", price: 3500 }] },

  /* =================== APERITIVOS =================== */
  { id: "ape-gancia", name: "Gancia", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-cinzano", name: "Cinzano", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-martini", name: "Martini", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-campari", name: "Campari", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-fernet", name: "Fernet Branca", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-whiscola", name: "Whiscola", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-gintonic", name: "Gin Tonic", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-cubalibre", name: "Cuba Libre", category: "aperitivos", variants: [{ name: "Medida", price: 9200 }] },
  { id: "ape-jw-roja", name: "J. Walker etiqueta roja", category: "aperitivos", variants: [{ name: "Medida", price: 11000 }] },
  { id: "ape-jw-negra", name: "J. Walker etiqueta negra", category: "aperitivos", variants: [{ name: "Medida", price: 15000 }] },
  { id: "ape-blenders", name: "Blenders", category: "aperitivos", variants: [{ name: "Medida", price: 7500 }] },
  { id: "ape-tiamaria", name: "Tía María", category: "aperitivos", variants: [{ name: "Medida", price: 8500 }] },
  { id: "ape-baileys", name: "Baileys", category: "aperitivos", variants: [{ name: "Medida", price: 9900 }] },

  /* =================== CERVEZAS =================== */
  { id: "cer-heineken-litro", name: "Heineken litro", category: "cervezas", variants: [{ name: "Litro", price: 14000 }] },
  { id: "cer-heineken-lata", name: "Heineken lata", category: "cervezas", variants: [{ name: "Lata", price: 8000 }] }, // PRECIO A CONFIRMAR
  { id: "cer-miller-litro", name: "Miller litro", category: "cervezas", variants: [{ name: "Litro", price: 12000 }] },
  { id: "cer-imperial-litro", name: "Imperial litro", category: "cervezas", variants: [{ name: "Litro", price: 12000 }] },
  { id: "cer-imperial-lata", name: "Imperial lata", category: "cervezas", variants: [{ name: "Lata", price: 7000 }] },
  { id: "cer-guten-litro", name: "Guten Bier litro", category: "cervezas", variants: [{ name: "Litro", price: 11000 }] },
  { id: "cer-guten-porron", name: "Guten Bier porrón", category: "cervezas", variants: [{ name: "Porrón", price: 6000 }] },

  /* =================== VINOS =================== */
  { id: "vin-eb-malbec", name: "Eugenio Bustos Malbec", category: "vinos", variants: [{ name: "Botella", price: 18000 }] },
  { id: "vin-eb-chardonnay", name: "Eugenio Bustos Chardonnay", category: "vinos", variants: [{ name: "Botella", price: 18000 }] },
  { id: "vin-lacelia-malbec", name: "La Celia Reserva Malbec", category: "vinos", variants: [{ name: "Botella", price: 20000 }] },
  { id: "vin-lacelia-rose", name: "La Celia Reserva Rosé", category: "vinos", variants: [{ name: "Botella", price: 20000 }] },
  { id: "vin-sidra", name: "Sidra 1888", category: "vinos", variants: [{ name: "Botella", price: 13000 }] },
  { id: "vin-copa", name: "Copa de vino", category: "vinos", variants: [{ name: "Copa", price: 4500 }] },

  /* =================== MENÚ INFANTIL =================== */
  { id: "inf-nuggets", name: "Nuggets de pollo con fritas", category: "infantil",
    description: "Incluye gaseosa y bocha de helado o ensalada de frutas.",
    variants: [{ name: "Menú", price: 15000 }] },
  { id: "inf-milanesita", name: "Milanesita de ternera con fritas", category: "infantil",
    description: "Incluye gaseosa y bocha de helado o ensalada de frutas.",
    variants: [{ name: "Menú", price: 15000 }] },
  { id: "inf-noquis", name: "Ñoquis de papa con salsa a elección", category: "infantil",
    description: "Incluye gaseosa y bocha de helado o ensalada de frutas.",
    choices: { label: "Salsa", options: ["Fileto", "Crema", "Mixta", "Rosa", "Blanca"] },
    variants: [{ name: "Menú", price: 15000 }] },
];

// Exponer para script.js
window.PE_DATA = { CONFIG, PROMOS, CATEGORIES, MENU };
