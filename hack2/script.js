let cartData = [];

const cartList = document.getElementById("cart-list");
const totalItemsElement = document.getElementById("total-items");
const totalPointsElement = document.getElementById("total-poin");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("btn-checkout");
const receiptDialog = document.getElementById("receipt-dialog");
const receiptItems = document.getElementById("receipt-items");
const closeReceiptButton = document.getElementById("btn-close-receipt");

const formatRupiah = (amount) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

// Render keranjang dan perbarui seluruh nilai ringkasannya.
function updateCartUI() {
    cartList.replaceChildren();

    cartData.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "cart-item";

        const itemDescription = document.createElement("span");
        itemDescription.textContent =
            `${item.name} — ${item.qty} × ${formatRupiah(item.price)}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn-remove-item";
        removeButton.dataset.productId = item.id;
        removeButton.textContent = "Hapus";

        listItem.append(itemDescription, removeButton);
        cartList.appendChild(listItem);
    });

    const itemCount = cartData.reduce((total, item) => total + item.qty, 0);
    const pointsTotal = cartData.reduce(
        (total, item) => total + item.poin * item.qty,
        0
    );
    const priceTotal = cartData.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );

    totalItemsElement.textContent = itemCount;
    totalPointsElement.textContent = `${pointsTotal} Poin`;
    totalPriceElement.textContent = formatRupiah(priceTotal);
}

// Hapus satu produk dari keranjang berdasarkan ID.
function removeFromCart(id) {
    cartData = cartData.filter((item) => item.id !== id);
    updateCartUI();
}

// Isi struk dari salinan keranjang sebelum keranjang dikosongkan.
function showReceipt(items) {
    receiptItems.replaceChildren();

    items.forEach((item) => {
        const row = document.createElement("li");
        row.className = "receipt-item";

        const description = document.createElement("span");
        description.textContent = `${item.name} × ${item.qty}`;

        const subtotal = document.createElement("span");
        subtotal.textContent = formatRupiah(item.price * item.qty);

        row.append(description, subtotal);
        receiptItems.appendChild(row);
    });

    const itemCount = items.reduce((total, item) => total + item.qty, 0);
    const pointsTotal = items.reduce(
        (total, item) => total + item.poin * item.qty,
        0
    );
    const priceTotal = items.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );

    document.getElementById("receipt-order-id").textContent =
        `ES-${Date.now().toString().slice(-8)}`;
    document.getElementById("receipt-date").textContent =
        new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date());
    document.getElementById("receipt-total-items").textContent =
        `${itemCount} item`;
    document.getElementById("receipt-total-points").textContent =
        `${pointsTotal} Poin`;
    document.getElementById("receipt-total-price").textContent =
        formatRupiah(priceTotal);

    receiptDialog.showModal();
}

// Delegasi event menangani tombol tambah produk dan hapus item keranjang.
document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const addButton = event.target.closest(".btn-add-cart");
    if (addButton) {
        const productCard = addButton.closest(".product-card");
        if (!productCard) return;

        const name = productCard.querySelector("h3")?.textContent.trim();
        const { productId: id, price, poin } = productCard.dataset;
        const numericPrice = Number(price);
        const numericPoints = Number(poin);

        if (
            !name ||
            !id ||
            !Number.isFinite(numericPrice) ||
            !Number.isFinite(numericPoints)
        ) {
            return;
        }

        const existingItem = cartData.find((item) => item.id === id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cartData.push({
                id,
                name,
                price: numericPrice,
                poin: numericPoints,
                qty: 1
            });
        }

        updateCartUI();
        return;
    }

    const removeButton = event.target.closest(".btn-remove-item");
    if (removeButton) {
        removeFromCart(removeButton.dataset.productId);
    }
});

// Proses pesanan hanya jika keranjang berisi produk.
checkoutButton.addEventListener("click", () => {
    if (cartData.length === 0) {
        window.alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
        return;
    }

    showReceipt(cartData.map((item) => ({ ...item })));
    cartData = [];
    updateCartUI();
});

closeReceiptButton.addEventListener("click", () => receiptDialog.close());

updateCartUI();
