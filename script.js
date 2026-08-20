/* ============================================================================
   PLAZA ESTEBAN — LÓGICA DE LA APLICACIÓN
   ----------------------------------------------------------------------------
   Secciones:
     1. UTILIDADES (formato de precios, DOM, toast)
     2. ESTADO + LOCALSTORAGE
     3. QUERY PARAM ?mesa=
     4. RENDER: promos, categorías, productos
     5. BÚSQUEDA / FILTROS
     6. VARIANTES (modal antes de agregar)
     7. CARRITO (agregar, cantidad, eliminar, total)
     8. CHECKOUT (modalidad + formularios)
     9. WHATSAPP (armado del mensaje)
    10. UI / NAV / ESTADO DEL LOCAL
    11. INIT
   ========================================================================== */

(function () {
  "use strict";

  const { CONFIG, PROMOS, CATEGORIES, MENU } = window.PE_DATA;

  /* ========================================================================
     1. UTILIDADES
     ==================================================================== */
  // Formatea el número al estilo argentino (18000 -> "18.000").
  // El símbolo "$" se agrega en las plantillas, para no duplicarlo.
  const pesoFmt = new Intl.NumberFormat("es-AR", {
    style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0,
  });
  const money = (n) => pesoFmt.format(n);

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const escapeHtml = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => (t.hidden = true), 300);
    }, 2200);
  }

  /* ========================================================================
     2. ESTADO + LOCALSTORAGE
     ==================================================================== */
  const LS_KEY = "plazaEsteban.v1";
  const state = {
    cart: [],        // { key, id, name, variantName, choiceLabel, choiceValue, unit, qty }
    mode: null,      // 'local' | 'delivery' | 'retiro'
    mesa: null,      // número de mesa (string) si viene por ?mesa=
  };

  function persist() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ cart: state.cart, mode: state.mode, mesa: state.mesa }));
    } catch (e) { /* almacenamiento no disponible */ }
  }
  function restore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.cart)) state.cart = data.cart;
      if (data.mode) state.mode = data.mode;
      if (data.mesa) state.mesa = data.mesa;
    } catch (e) { /* ignore */ }
  }

  /* ========================================================================
     3. QUERY PARAM ?mesa=
     ==================================================================== */
  function detectMesa() {
    const params = new URLSearchParams(window.location.search);
    const mesa = params.get("mesa");
    if (mesa && /^\w{1,8}$/.test(mesa)) {
      state.mesa = mesa;
      state.mode = "local"; // al venir por QR de mesa, la modalidad es comer en el local
      persist();
    }
    if (state.mesa) {
      const banner = $("#mesaBanner");
      $("#mesaBannerNum").textContent = "Mesa " + state.mesa;
      banner.hidden = false;
    }
  }
  function clearMesa() {
    state.mesa = null;
    if (state.mode === "local") state.mode = null;
    $("#mesaBanner").hidden = true;
    // limpiar el query param sin recargar
    const url = new URL(window.location.href);
    url.searchParams.delete("mesa");
    history.replaceState(null, "", url.pathname + url.hash);
    persist();
  }

  /* ========================================================================
     4. RENDER
     ==================================================================== */
  function priceLabel(p) {
    // muestra "Desde $X" si tiene múltiples variantes con precios distintos
    const prices = p.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const multi = p.variants.length > 1 && new Set(prices).size > 1;
    return multi
      ? `<span class="from">Desde</span> $${money(min)}`
      : `$${money(min)}`;
  }

  function productCard(p) {
    const card = el("article", "product");
    card.dataset.id = p.id;
    card.dataset.name = p.name.toLowerCase();
    card.dataset.desc = (p.description || "").toLowerCase();
    const badge = p.badge ? `<span class="product-tag">${escapeHtml(p.badge)}</span>` : "";
    card.innerHTML = `
      <div class="product-info">
        <div class="product-name">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="product-desc">${escapeHtml(p.description)}</div>` : ""}
        <div class="product-meta">
          <span class="product-price">${priceLabel(p)}</span>
          ${badge}
        </div>
      </div>
      <button class="product-add" aria-label="Agregar ${escapeHtml(p.name)} al pedido">Agregar</button>`;
    $(".product-add", card).addEventListener("click", () => onAddClick(p));
    return card;
  }

  function renderMenu() {
    const wrap = $("#menuWrap");
    wrap.innerHTML = "";
    const all = [...PROMOS, ...MENU];

    CATEGORIES.forEach((cat) => {
      const items = all.filter((p) => p.category === cat.id);
      if (!items.length) return;
      const section = el("section", "menu-cat");
      section.id = "cat-" + cat.id;
      section.dataset.cat = cat.id;
      section.appendChild(el("h2", "menu-cat-title", escapeHtml(cat.label)));
      const grid = el("div", "menu-grid");
      items.forEach((p) => grid.appendChild(productCard(p)));
      section.appendChild(grid);
      wrap.appendChild(section);
    });
  }

  function renderCategoriesBar() {
    const bar = $("#catBarScroll");
    bar.innerHTML = "";
    const present = CATEGORIES.filter((c) => [...PROMOS, ...MENU].some((p) => p.category === c.id));
    present.forEach((cat, i) => {
      const chip = el("button", "cat-chip", escapeHtml(cat.label));
      chip.dataset.cat = cat.id;
      if (i === 0) chip.classList.add("active");
      chip.addEventListener("click", () => {
        const target = $("#cat-" + cat.id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveChip(cat.id);
      });
      bar.appendChild(chip);
    });
  }
  function setActiveChip(catId) {
    $$(".cat-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === catId));
    const active = $(`.cat-chip[data-cat="${catId}"]`);
    if (active) active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function renderPromos() {
    const grid = $("#promosGrid");
    grid.innerHTML = "";
    PROMOS.forEach((p) => {
      const card = el("article", "promo-card");
      card.innerHTML = `
        <span class="promo-badge">${escapeHtml(p.badge || "Promo")}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description || "")}</p>
        <div class="promo-price">$${money(p.variants[0].price)}
          <small>${escapeHtml(p.variants[0].name)}</small></div>
        <button class="btn btn-primary">Agregar al pedido</button>`;
      $(".btn", card).addEventListener("click", () => onAddClick(p));
      grid.appendChild(card);
    });
  }

  function renderInstagram() {
    const grid = $("#igGrid");
    const labels = ["Pizzas", "Café", "Empanadas", "Meriendas", "Promos"];
    grid.innerHTML = "";
    labels.forEach((l) => {
      const a = el("a", "ig-card");
      a.href = CONFIG.instagramUrl;
      a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", "Ver Instagram de Plaza Esteban");
      a.innerHTML = `<span>${escapeHtml(l)}</span>`;
      grid.appendChild(a);
    });
  }

  /* ========================================================================
     5. BÚSQUEDA / FILTROS
     ==================================================================== */
  function initSearch() {
    const input = $("#searchInput");
    const clearBtn = $("#searchClear");
    const noResults = $("#noResults");

    function apply() {
      const q = input.value.trim().toLowerCase();
      clearBtn.hidden = q === "";
      let visibleTotal = 0;

      $$(".menu-cat").forEach((section) => {
        let visibleInCat = 0;
        $$(".product", section).forEach((card) => {
          const match = !q || card.dataset.name.includes(q) || card.dataset.desc.includes(q);
          card.style.display = match ? "" : "none";
          if (match) visibleInCat++;
        });
        section.style.display = visibleInCat ? "" : "none";
        visibleTotal += visibleInCat;
      });

      noResults.hidden = visibleTotal !== 0;
      $("#catBar").style.display = q ? "none" : "";
    }

    input.addEventListener("input", apply);
    clearBtn.addEventListener("click", () => { input.value = ""; apply(); input.focus(); });
  }

  // Scroll spy: resalta la categoría visible
  function initScrollSpy() {
    const sections = $$(".menu-cat");
    if (!("IntersectionObserver" in window) || !sections.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveChip(e.target.dataset.cat);
      });
    }, { rootMargin: `-${(document.querySelector(".site-header").offsetHeight + 70)}px 0px -70% 0px`, threshold: 0 });
    sections.forEach((s) => obs.observe(s));
  }

  /* ========================================================================
     6. VARIANTES (modal antes de agregar)
     ==================================================================== */
  const variantModal = {
    product: null,
    variantIdx: 0,
    choiceValue: null,
    qty: 1,
  };

  function onAddClick(p) {
    const needsVariant = p.variants.length > 1;
    const needsChoice = !!p.choices;
    if (!needsVariant && !needsChoice) {
      addToCart(p, p.variants[0], null, null, 1);
      bumpFab();
      toast(`${p.name} agregado`);
      return;
    }
    openVariantModal(p);
  }

  function openVariantModal(p) {
    variantModal.product = p;
    variantModal.variantIdx = 0;
    variantModal.choiceValue = p.choices ? p.choices.options[0] : null;
    variantModal.qty = 1;

    $("#variantTitle").textContent = p.name;
    const body = $("#variantBody");
    body.innerHTML = "";

    if (p.description) {
      body.appendChild(el("p", "product-desc", escapeHtml(p.description)));
    }

    // Grupo de variantes (con precio)
    if (p.variants.length > 1) {
      const g = el("div", "opt-group");
      g.appendChild(el("h4", null, "Elegí el tamaño / opción"));
      const list = el("div", "opt-list");
      p.variants.forEach((v, i) => {
        const opt = el("label", "opt" + (i === 0 ? " selected" : ""));
        opt.innerHTML = `
          <input type="radio" name="pe-variant" ${i === 0 ? "checked" : ""} />
          <span class="opt-label">${escapeHtml(v.name)}</span>
          <span class="opt-price">$${money(v.price)}</span>`;
        opt.addEventListener("click", () => {
          variantModal.variantIdx = i;
          $$(".opt", list).forEach((o, j) => o.classList.toggle("selected", j === i));
          $("input", opt).checked = true;
        });
        list.appendChild(opt);
      });
      g.appendChild(list);
      body.appendChild(g);
    }

    // Grupo de choice (sin precio: salsa, sabor, tipo)
    if (p.choices) {
      const g = el("div", "opt-group");
      g.appendChild(el("h4", null, escapeHtml(p.choices.label)));
      const list = el("div", "opt-list");
      p.choices.options.forEach((c, i) => {
        const opt = el("label", "opt" + (i === 0 ? " selected" : ""));
        opt.innerHTML = `
          <input type="radio" name="pe-choice" ${i === 0 ? "checked" : ""} />
          <span class="opt-label">${escapeHtml(c)}</span>`;
        opt.addEventListener("click", () => {
          variantModal.choiceValue = c;
          $$(".opt", list).forEach((o) => o.classList.remove("selected"));
          opt.classList.add("selected");
          $("input", opt).checked = true;
        });
        list.appendChild(opt);
      });
      g.appendChild(list);
      body.appendChild(g);
    }

    // Cantidad
    const qtyGroup = el("div", "opt-group modal-qty");
    qtyGroup.innerHTML = `<span>Cantidad</span>`;
    const qty = el("div", "qty");
    qty.innerHTML = `<button type="button" aria-label="Restar">−</button><span>1</span><button type="button" aria-label="Sumar">+</button>`;
    const [minus, , plus] = qty.childNodes;
    const qtySpan = $("span", qty);
    minus.addEventListener("click", () => { variantModal.qty = Math.max(1, variantModal.qty - 1); qtySpan.textContent = variantModal.qty; });
    plus.addEventListener("click", () => { variantModal.qty = Math.min(50, variantModal.qty + 1); qtySpan.textContent = variantModal.qty; });
    qtyGroup.appendChild(qty);
    body.appendChild(qtyGroup);

    openModal("#variantBackdrop");
  }

  function confirmVariant() {
    const p = variantModal.product;
    if (!p) return;
    const variant = p.variants[variantModal.variantIdx];
    const choiceLabel = p.choices ? p.choices.label : null;
    const choiceValue = variantModal.choiceValue;
    addToCart(p, variant, choiceLabel, choiceValue, variantModal.qty);
    closeModal("#variantBackdrop");
    bumpFab();
    toast(`${p.name} agregado`);
  }

  /* ========================================================================
     7. CARRITO
     ==================================================================== */
  function lineKey(id, variantName, choiceValue) {
    return [id, variantName || "", choiceValue || ""].join("|");
  }

  function addToCart(p, variant, choiceLabel, choiceValue, qty) {
    const key = lineKey(p.id, variant.name, choiceValue);
    const existing = state.cart.find((l) => l.key === key);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      state.cart.push({
        key, id: p.id, name: p.name,
        variantName: variant.name, choiceLabel: choiceLabel || null, choiceValue: choiceValue || null,
        unit: variant.price, qty,
      });
    }
    persist();
    renderCart();
  }

  function changeQty(key, delta) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      state.cart = state.cart.filter((l) => l.key !== key);
    }
    persist();
    renderCart();
  }

  function removeLine(key) {
    state.cart = state.cart.filter((l) => l.key !== key);
    persist();
    renderCart();
  }

  function clearCart() {
    state.cart = [];
    persist();
    renderCart();
  }

  const cartCount = () => state.cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => state.cart.reduce((n, l) => n + l.unit * l.qty, 0);

  function renderCart() {
    const body = $("#cartBody");
    body.innerHTML = "";

    if (!state.cart.length) {
      body.appendChild(el("div", "cart-empty", `<span aria-hidden="true">🛒</span>Tu pedido está vacío.<br>Agregá productos desde la carta.`));
      $("#cartFoot").style.display = "none";
    } else {
      $("#cartFoot").style.display = "";
      state.cart.forEach((l) => {
        const item = el("div", "cart-item");
        const detail = [l.variantName && l.variantName !== "Unidad" && l.variantName !== "Porción" ? l.variantName : null,
                        l.choiceValue ? `${l.choiceLabel}: ${l.choiceValue}` : null]
                        .filter(Boolean).join(" · ");
        item.innerHTML = `
          <div>
            <div class="cart-item-name">${escapeHtml(l.name)}</div>
            ${detail ? `<div class="cart-item-variant">${escapeHtml(detail)}</div>` : ""}
            <div class="cart-item-controls">
              <div class="qty">
                <button type="button" data-act="dec" aria-label="Restar uno">−</button>
                <span>${l.qty}</span>
                <button type="button" data-act="inc" aria-label="Sumar uno">+</button>
              </div>
              <button class="cart-item-remove" data-act="rm">Quitar</button>
            </div>
          </div>
          <div class="cart-item-price">$${money(l.unit * l.qty)}</div>`;
        $('[data-act="dec"]', item).addEventListener("click", () => changeQty(l.key, -1));
        $('[data-act="inc"]', item).addEventListener("click", () => changeQty(l.key, +1));
        $('[data-act="rm"]', item).addEventListener("click", () => removeLine(l.key));
        body.appendChild(item);
      });
    }

    $("#cartTotal").textContent = "$" + money(cartTotal());

    // FAB
    const count = cartCount();
    const fabCount = $("#cartFabCount");
    fabCount.textContent = count;
    fabCount.hidden = count === 0;
    $("#cartFabTotal").textContent = count === 0 ? "Ver pedido" : "$" + money(cartTotal());
  }

  function bumpFab() {
    const fab = $("#cartFab");
    fab.classList.remove("pulse");
    void fab.offsetWidth; // reflow para reiniciar animación
    fab.classList.add("pulse");
  }

  /* ========================================================================
     8. CHECKOUT
     ==================================================================== */
  const checkout = { mode: null, data: {} };

  function openCheckout() {
    if (!state.cart.length) { toast("Tu pedido está vacío"); return; }
    checkout.mode = state.mesa ? "local" : (state.mode || null);
    renderCheckoutStep();
    openModal("#checkoutBackdrop");
  }

  function renderCheckoutStep() {
    const body = $("#checkoutBody");
    body.innerHTML = "";

    // Resumen del pedido siempre visible arriba
    const summary = el("div", "checkout-summary");
    state.cart.forEach((l) => {
      const row = el("div", "cs-row");
      row.innerHTML = `<span>${l.qty}× ${escapeHtml(l.name)}${l.variantName && l.variantName !== "Unidad" && l.variantName !== "Porción" ? " (" + escapeHtml(l.variantName) + ")" : ""}</span><span>$${money(l.unit * l.qty)}</span>`;
      summary.appendChild(row);
    });
    const totalRow = el("div", "cs-row cs-total");
    totalRow.innerHTML = `<span>Total productos</span><span>$${money(cartTotal())}</span>`;
    summary.appendChild(totalRow);
    body.appendChild(summary);

    if (!checkout.mode) {
      renderModeSelect(body);
    } else {
      renderCheckoutForm(body);
    }
  }

  function renderModeSelect(body) {
    body.appendChild(el("p", "form-hint", "¿Cómo querés recibir tu pedido?"));
    const wrap = el("div", "mode-select");
    const modes = [
      { id: "local", icon: "🍽️", title: "Comer en el local", desc: "Indicá tu mesa y comentarios." },
      { id: "retiro", icon: "🛍️", title: "Retirar en el local", desc: "Pedí y retiralo cuando esté listo." },
      { id: "delivery", icon: "🛵", title: "Delivery", desc: "Te lo llevamos a tu dirección." },
    ];
    modes.forEach((m) => {
      const b = el("button", "mode-btn");
      b.innerHTML = `<span class="m-icon" aria-hidden="true">${m.icon}</span><span>${m.title}<small>${m.desc}</small></span>`;
      b.addEventListener("click", () => { checkout.mode = m.id; state.mode = m.id; persist(); renderCheckoutStep(); });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
  }

  // Definición de campos por modalidad
  function fieldsFor(mode) {
    if (mode === "local") {
      return [
        { name: "nombre", label: "Nombre", required: true, type: "text", auto: "name" },
        { name: "mesa", label: "Número de mesa", required: true, type: "text", value: state.mesa || "" },
        { name: "comentarios", label: "Comentarios", required: false, type: "textarea", placeholder: "Ej: sin cebolla, traer primero las bebidas…" },
      ];
    }
    if (mode === "retiro") {
      return [
        { name: "nombre", label: "Nombre", required: true, type: "text", auto: "name" },
        { name: "telefono", label: "Teléfono", required: true, type: "tel", auto: "tel" },
        { name: "horario", label: "Horario aproximado de retiro", required: true, type: "text", placeholder: "Ej: 21:30" },
        { name: "comentarios", label: "Comentarios", required: false, type: "textarea" },
      ];
    }
    // delivery
    return [
      { name: "nombre", label: "Nombre", required: true, type: "text", auto: "name" },
      { name: "telefono", label: "Teléfono", required: true, type: "tel", auto: "tel" },
      { name: "direccion", label: "Dirección (calle)", required: true, type: "text", half: true },
      { name: "numero", label: "Número", required: true, type: "text", half: true },
      { name: "localidad", label: "Localidad", required: true, type: "text" },
      { name: "entrecalles", label: "Entre calles", required: false, type: "text" },
      { name: "referencia", label: "Referencia", required: false, type: "text", placeholder: "Ej: portón negro, timbre 2" },
      { name: "pago", label: "Forma de pago", required: true, type: "select", options: ["Efectivo", "Transferencia", "Consultar otros medios"] },
      { name: "abona", label: "¿Con cuánto abonás?", required: false, type: "text", placeholder: "Ej: $50.000", showIf: { field: "pago", equals: "Efectivo" } },
      { name: "comentarios", label: "Observaciones", required: false, type: "textarea" },
    ];
  }

  function renderCheckoutForm(body) {
    const back = el("button", "checkout-back", "← Cambiar modalidad");
    back.addEventListener("click", () => { checkout.mode = null; renderCheckoutStep(); });
    if (!state.mesa) body.appendChild(back);

    const titleMap = { local: "Comer en el local", retiro: "Retirar en el local", delivery: "Delivery" };
    body.appendChild(el("p", "form-hint", `Modalidad: <strong>${titleMap[checkout.mode]}</strong>`));

    const form = el("form", "checkout-form");
    form.setAttribute("novalidate", "");
    const fields = fieldsFor(checkout.mode);

    // agrupar half fields (dirección + número)
    let i = 0;
    while (i < fields.length) {
      const f = fields[i];
      if (f.half && fields[i + 1] && fields[i + 1].half) {
        const row = el("div", "form-row");
        row.appendChild(buildField(f));
        row.appendChild(buildField(fields[i + 1]));
        form.appendChild(row);
        i += 2;
      } else {
        form.appendChild(buildField(f));
        i += 1;
      }
    }

    const err = el("div", "checkout-error");
    err.hidden = true;
    form.appendChild(err);

    if (checkout.mode === "delivery") {
      form.appendChild(el("p", "form-hint", "🛵 Costo de envío a confirmar por WhatsApp."));
    }

    const submit = el("button", "btn btn-primary btn-block");
    submit.type = "submit";
    submit.innerHTML = `<span aria-hidden="true">💬</span> Enviar pedido por WhatsApp`;
    form.appendChild(submit);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = validateAndCollect(form, fields, err);
      if (!data) return;
      checkout.data = data;
      sendWhatsApp();
    });

    // manejo de showIf (¿con cuánto abonás?)
    form.addEventListener("change", () => applyConditionalFields(form, fields));
    applyConditionalFields(form, fields);

    body.appendChild(form);
  }

  function buildField(f) {
    const wrap = el("div", "form-field");
    wrap.dataset.field = f.name;
    const id = "f-" + f.name;
    const reqMark = f.required ? ` <span class="req" aria-hidden="true">*</span>` : "";
    let control;
    if (f.type === "textarea") {
      control = `<textarea id="${id}" name="${f.name}" ${f.placeholder ? `placeholder="${escapeHtml(f.placeholder)}"` : ""}></textarea>`;
    } else if (f.type === "select") {
      control = `<select id="${id}" name="${f.name}">${f.options.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("")}</select>`;
    } else {
      const auto = f.auto ? `autocomplete="${f.auto}"` : "";
      control = `<input id="${id}" name="${f.name}" type="${f.type}" ${auto} value="${escapeHtml(f.value || "")}" ${f.placeholder ? `placeholder="${escapeHtml(f.placeholder)}"` : ""} />`;
    }
    wrap.innerHTML = `<label for="${id}">${escapeHtml(f.label)}${reqMark}</label>${control}<div class="field-error">Completá este campo.</div>`;
    return wrap;
  }

  function applyConditionalFields(form, fields) {
    fields.forEach((f) => {
      if (!f.showIf) return;
      const controller = form.elements[f.showIf.field];
      const wrap = form.querySelector(`.form-field[data-field="${f.name}"]`);
      if (!controller || !wrap) return;
      const show = controller.value === f.showIf.equals;
      wrap.style.display = show ? "" : "none";
    });
  }

  function validateAndCollect(form, fields, errBox) {
    const data = {};
    let firstInvalid = null;
    fields.forEach((f) => {
      const wrap = form.querySelector(`.form-field[data-field="${f.name}"]`);
      const control = form.elements[f.name];
      if (!control) return;
      const hidden = wrap && wrap.style.display === "none";
      const val = (control.value || "").trim();
      data[f.name] = val;
      if (f.required && !hidden && !val) {
        wrap.classList.add("invalid");
        if (!firstInvalid) firstInvalid = control;
      } else if (wrap) {
        wrap.classList.remove("invalid");
      }
    });
    if (firstInvalid) {
      errBox.hidden = false;
      errBox.textContent = "Completá los campos obligatorios (*).";
      firstInvalid.focus();
      return null;
    }
    errBox.hidden = true;
    return data;
  }

  /* ========================================================================
     9. WHATSAPP
     ==================================================================== */
  function buildOrderMessage() {
    const d = checkout.data;
    const modeLabel = { local: "Comer en el local", retiro: "Retiro en el local", delivery: "Delivery" }[checkout.mode];
    const lines = [];
    lines.push("Hola Plaza Esteban 👋");
    lines.push("");
    lines.push("Quiero hacer un pedido.");
    lines.push("");
    lines.push("*PEDIDO:*");
    state.cart.forEach((l) => {
      const extra = [
        l.variantName && l.variantName !== "Unidad" && l.variantName !== "Porción" ? l.variantName : null,
        l.choiceValue ? `${l.choiceLabel}: ${l.choiceValue}` : null,
      ].filter(Boolean).join(", ");
      const detail = extra ? ` (${extra})` : "";
      lines.push(`• ${l.qty}x ${l.name}${detail} — $${money(l.unit)} c/u`);
    });
    lines.push("");
    lines.push(`*TOTAL PRODUCTOS:* $${money(cartTotal())}`);
    lines.push("");
    lines.push(`*MODALIDAD:* ${modeLabel}`);

    if (checkout.mode === "local") {
      lines.push(`*NOMBRE:* ${d.nombre}`);
      if (d.mesa) lines.push(`*MESA:* ${d.mesa}`);
    } else if (checkout.mode === "retiro") {
      lines.push(`*NOMBRE:* ${d.nombre}`);
      lines.push(`*TELÉFONO:* ${d.telefono}`);
      if (d.horario) lines.push(`*HORARIO DE RETIRO:* ${d.horario}`);
    } else if (checkout.mode === "delivery") {
      lines.push(`*NOMBRE:* ${d.nombre}`);
      lines.push(`*TELÉFONO:* ${d.telefono}`);
      const dir = `${d.direccion} ${d.numero}`.trim();
      lines.push(`*DIRECCIÓN:* ${dir}`);
      if (d.localidad) lines.push(`*LOCALIDAD:* ${d.localidad}`);
      if (d.entrecalles) lines.push(`*ENTRE CALLES:* ${d.entrecalles}`);
      if (d.referencia) lines.push(`*REFERENCIA:* ${d.referencia}`);
      lines.push(`*FORMA DE PAGO:* ${d.pago}`);
      if (d.pago === "Efectivo" && d.abona) lines.push(`*PAGO CON:* ${d.abona}`);
      lines.push("*ENVÍO:* a confirmar por WhatsApp");
    }

    if (d.comentarios) {
      lines.push("");
      lines.push(`*OBSERVACIONES:* ${d.comentarios}`);
    }

    return lines.join("\n");
  }

  function sendWhatsApp() {
    const text = buildOrderMessage();
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    closeModal("#checkoutBackdrop");
    toast("Abriendo WhatsApp… ¡Gracias!");
  }

  /* ========================================================================
     10. UI / NAV / MODALES / ESTADO DEL LOCAL
     ==================================================================== */
  function openModal(sel) {
    const m = $(sel);
    m.hidden = false;
    document.body.style.overflow = "hidden";
    const focusable = m.querySelector("button, input, select, textarea, a[href]");
    if (focusable) setTimeout(() => focusable.focus(), 50);
  }
  function closeModal(sel) {
    $(sel).hidden = true;
    if ($("#cartDrawer").classList.contains("open")) return; // drawer sigue abierto
    document.body.style.overflow = "";
  }

  function openDrawer() {
    renderCart();
    $("#drawerBackdrop").hidden = false;
    const drawer = $("#cartDrawer");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    $("#drawerBackdrop").hidden = true;
    const drawer = $("#cartDrawer");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if ($("#checkoutBackdrop").hidden && $("#variantBackdrop").hidden) document.body.style.overflow = "";
  }

  function toggleNav(force) {
    const nav = $("#mainNav");
    const btn = $("#hamburger");
    const open = force != null ? force : !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    $("#navBackdrop").hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  // Estado abierto/cerrado según CONFIG.horarios (sin inventar horarios)
  function updateOpenStatus() {
    const node = $("#heroStatus");
    if (!CONFIG.horarios || !CONFIG.horarios.length) {
      node.textContent = "Consultá disponibilidad por WhatsApp";
      node.removeAttribute("data-open");
      return;
    }
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const toMins = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
    const open = CONFIG.horarios.some((h) => {
      if (h.dia !== day) return false;
      const a = toMins(h.abre), b = toMins(h.cierra);
      return b > a ? mins >= a && mins < b : mins >= a || mins < b; // cruza medianoche
    });
    node.textContent = open ? "Abierto ahora" : "Cerrado ahora";
    node.setAttribute("data-open", String(open));
  }

  function initLinks() {
    const wa = `https://wa.me/${CONFIG.whatsapp}`;
    const ig = CONFIG.instagramUrl;
    const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
    ["waFooter", "waUbiBtn"].forEach((id) => { const n = document.getElementById(id); if (n) n.href = wa; });
    ["igHandle", "igBtn", "igFooter", "igUbiBtn"].forEach((id) => { const n = document.getElementById(id); if (n) n.href = ig; });
    const mapsBtn = $("#mapsBtn"); if (mapsBtn) mapsBtn.href = maps;
    $("#year").textContent = new Date().getFullYear();
  }

  function initGlobalEvents() {
    // Scroll suave para botones data-scroll
    $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => {
      const t = $(b.dataset.scroll);
      if (t) t.scrollIntoView({ behavior: "smooth" });
    }));

    // Nav
    $("#hamburger").addEventListener("click", () => toggleNav());
    $("#navBackdrop").addEventListener("click", () => toggleNav(false));
    $$("#mainNav a").forEach((a) => a.addEventListener("click", () => toggleNav(false)));

    // Acceso rápido -> setear modalidad y abrir carrito/checkout
    $$(".access-card").forEach((c) => c.addEventListener("click", () => {
      state.mode = c.dataset.mode;
      persist();
      $("#carta").scrollIntoView({ behavior: "smooth" });
      toast("Armá tu pedido y tocá el carrito para finalizar");
    }));

    // Carrito
    $("#cartFab").addEventListener("click", openDrawer);
    $("#cartClose").addEventListener("click", closeDrawer);
    $("#drawerBackdrop").addEventListener("click", closeDrawer);
    $("#cartClear").addEventListener("click", () => { clearCart(); toast("Carrito vaciado"); });
    $("#cartCheckout").addEventListener("click", () => { closeDrawer(); openCheckout(); });

    // Variantes
    $("#variantClose").addEventListener("click", () => closeModal("#variantBackdrop"));
    $("#variantBackdrop").addEventListener("click", (e) => { if (e.target.id === "variantBackdrop") closeModal("#variantBackdrop"); });
    $("#variantAdd").addEventListener("click", confirmVariant);

    // Checkout
    $("#checkoutClose").addEventListener("click", () => closeModal("#checkoutBackdrop"));
    $("#checkoutBackdrop").addEventListener("click", (e) => { if (e.target.id === "checkoutBackdrop") closeModal("#checkoutBackdrop"); });

    // Mesa
    $("#mesaClear").addEventListener("click", clearMesa);

    // ESC cierra lo que esté abierto
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#checkoutBackdrop").hidden) return closeModal("#checkoutBackdrop");
      if (!$("#variantBackdrop").hidden) return closeModal("#variantBackdrop");
      if ($("#cartDrawer").classList.contains("open")) return closeDrawer();
      if ($("#mainNav").classList.contains("open")) return toggleNav(false);
    });
  }

  /* ========================================================================
     11. INIT
     ==================================================================== */
  function init() {
    restore();
    detectMesa();
    renderPromos();
    renderCategoriesBar();
    renderMenu();
    renderInstagram();
    initSearch();
    initScrollSpy();
    initLinks();
    initGlobalEvents();
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);
    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
