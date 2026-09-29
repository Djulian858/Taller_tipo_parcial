const products = [
  {
    id: "switch-2",
    name: "Nintendo Switch 2",
    type: "Nueva generación",
    description: "Más pantalla, más potencia y nuevas formas de jugar juntos.",
    price: 2599900,
    image: "imagenes/Nintendo%20Switch%202.jpg",
    imageAlt: "Consola Nintendo Switch con Joy-Con de colores"
  },
  {
    id: "switch-oled",
    name: "Nintendo Switch OLED",
    type: "Pantalla OLED",
    description: "Colores intensos en una pantalla OLED de 7 pulgadas.",
    price: 1599900,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Consola portátil de videojuegos con pantalla a color"
  },
  {
    id: "gamecube",
    name: "Nintendo GameCube",
    type: "Consola retro",
    description: "La consola de sobremesa que acompañó una generación de juegos.",
    price: 699900,
    image: "imagenes/Nintendo%20Gamecube.png",
    imageAlt: "Consola Nintendo GameCube"
  },
  {
    id: "nintendo-64",
    name: "Nintendo 64",
    type: "Consola retro",
    description: "Vuelve a los clásicos que hicieron historia en los videojuegos.",
    price: 449900,
    image: "imagenes/Nintendo%2064.jpg",
    imageAlt: "Consola Nintendo 64"
  }
];

const cart = new Map();
const productGrid = document.querySelector("#product-grid");
const search = document.querySelector("#product-search");
const catalogCount = document.querySelector("#catalog-count");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const orderForm = document.querySelector("#order-form");
const orderButton = document.querySelector("#order-button");
const orderStatus = document.querySelector("#order-status");
const formatCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function createCell(content, className = "") {
  const cell = document.createElement("td");
  if (className) cell.className = className;
  if (typeof content === "string") {
    cell.textContent = content;
  } else {
    cell.append(content);
  }
  return cell;
}

function addToCart(product) {
  const line = cart.get(product.id);
  cart.set(product.id, { product, quantity: (line?.quantity ?? 0) + 1 });
  orderStatus.textContent = `${product.name} añadido al carrito.`;
  renderCart();
}

function renderProducts() {
  const query = search.value.trim().toLocaleLowerCase("es");
  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.type}`.toLocaleLowerCase("es").includes(query)
  );

  catalogCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "consola" : "consolas"}`;
  productGrid.replaceChildren();

  if (visibleProducts.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "catalog-empty";
    emptyMessage.textContent = "No encontramos consolas con esa búsqueda.";
    productGrid.append(emptyMessage);
    return;
  }

  for (const product of visibleProducts) {
    const card = document.createElement("article");
    card.className = "product-card";

    const figure = document.createElement("figure");
    figure.className = "product-image-wrap";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.imageAlt;
    image.loading = "lazy";
    figure.append(image);

    const details = document.createElement("div");
    details.className = "product-details";
    const type = document.createElement("p");
    type.className = "product-type";
    type.textContent = product.type;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    const purchaseRow = document.createElement("div");
    purchaseRow.className = "purchase-row";
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatCOP.format(product.price);
    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = "Agregar";
    addButton.setAttribute("aria-label", `Agregar ${product.name} al carrito`);
    addButton.addEventListener("click", () => addToCart(product));

    purchaseRow.append(price, addButton);
    details.append(type, name, description, purchaseRow);
    card.append(figure, details);
    productGrid.append(card);
  }
}

function renderCart() {
  cartItems.replaceChildren();
  let quantityTotal = 0;
  let priceTotal = 0;

  if (cart.size === 0) {
    const row = document.createElement("tr");
    const emptyCell = createCell("Tu carrito está esperando una consola.", "empty-cart");
    emptyCell.colSpan = 5;
    row.append(emptyCell);
    cartItems.append(row);
  }

  for (const { product, quantity } of cart.values()) {
    const row = document.createElement("tr");
    const itemName = document.createElement("span");
    itemName.className = "cart-product-name";
    itemName.textContent = product.name;
    const itemCell = createCell(itemName, "cart-product-cell");

    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Quitar una unidad de ${product.name}`);
    decrease.addEventListener("click", () => updateQuantity(product, -1));
    const quantityValue = document.createElement("span");
    quantityValue.textContent = String(quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Agregar una unidad de ${product.name}`);
    increase.addEventListener("click", () => updateQuantity(product, 1));
    quantityControl.append(decrease, quantityValue, increase);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Quitar";
    removeButton.setAttribute("aria-label", `Quitar ${product.name} del carrito`);
    removeButton.addEventListener("click", () => {
      cart.delete(product.id);
      orderStatus.textContent = `${product.name} se quitó del carrito.`;
      renderCart();
    });

    const lineTotal = product.price * quantity;
    quantityTotal += quantity;
    priceTotal += lineTotal;
    row.append(
      itemCell,
      createCell(formatCOP.format(product.price)),
      createCell(quantityControl, "quantity-cell"),
      createCell(formatCOP.format(lineTotal), "line-total"),
      createCell(removeButton)
    );
    cartItems.append(row);
  }

  cartCount.textContent = String(quantityTotal);
  cartTotal.textContent = formatCOP.format(priceTotal);
  orderButton.disabled = cart.size === 0;
}

function updateQuantity(product, amount) {
  const line = cart.get(product.id);
  if (!line) return;

  const nextQuantity = line.quantity + amount;
  if (nextQuantity <= 0) {
    cart.delete(product.id);
  } else {
    cart.set(product.id, { product, quantity: nextQuantity });
  }
  renderCart();
}

search.addEventListener("input", renderProducts);
orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const customerName = new FormData(orderForm).get("customerName").toString().trim();
  orderStatus.textContent = `Solicitud de ${customerName} preparada por ${cartTotal.textContent}. La tienda debe confirmar disponibilidad y pago.`;
});

renderProducts();
renderCart();
