let cartData = [];

const cartList = document.getElementById("cart-list");
const totalItemsElement = document.getElementById("total-items");
const totalPointsElement = document.getElementById("total-poin");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("btn-checkout");
const receiptDialog = document.getElementById("receipt-dialog");
const receiptItems = document.getElementById("receipt-items");
const closeReceiptButton = document.getElementById("btn-close-receipt");
const ONGKIR = 5000;

const formatRupiah = (amount) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

function updateCartUI() {
    cartList.replaceChildren();

    cartData.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "cart-item";

        const itemDescription = document.createElement("span");
        const subtotal = item.price * item.qty;
        itemDescription.textContent =
            `${item.name} — ${item.qty} × ${formatRupiah(item.price)} = ${formatRupiah(subtotal)}`;

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
    const subtotal = cartData.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );
    const totalPrice = cartData.length === 0 ? 0 : subtotal + ONGKIR;

    totalItemsElement.textContent = itemCount;
    totalPointsElement.textContent = `${pointsTotal} Poin`;
    totalPriceElement.textContent = formatRupiah(totalPrice);
}

function removeFromCart(id) {
    cartData = cartData.filter((item) => item.id !== id);
    updateCartUI();
}

document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".product-card");
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
    });
});

cartList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const removeButton = event.target.closest(".btn-remove-item");
    if (removeButton) {
        removeFromCart(removeButton.dataset.productId);
    }
});

checkoutButton.addEventListener("click", () => {
    if (cartData.length === 0) {
        window.alert("Pilih makanan terlebih dahulu!");
        return;
    }

    const subtotal = cartData.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );
    const totalPrice = subtotal + ONGKIR;

    window.alert(
        `Pesanan ShopeeFood berhasil dibuat! Total biaya: ${formatRupiah(totalPrice)}`
    );
    cartData = [];
    updateCartUI();
});

document.addEventListener("DOMContentLoaded", updateCartUI);
