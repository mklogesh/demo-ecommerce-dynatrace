// --- Product Data ---
const PRODUCTS = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
    },
    {
        id: 2,
        name: "Smartphone Pro",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    },
    {
        id: 3,
        name: "Fitness Tracker",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400",
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    },
    {
        id: 5,
        name: "Digital Camera",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
    },
    {
        id: 6,
        name: "Gaming Mouse",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    }
];

// --- Cart Logic ---
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
function addToCart(productId) {
    let cart = getCart();
    let item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({id: productId, qty: 1});
    }
    setCart(cart);
    alert("Product added to cart!");
}
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    setCart(cart);
    renderCart();
}
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    document.querySelectorAll('#cart-count').forEach(e => e.textContent = count);
}
// --- Product Listing Logic ---
function renderProducts(filter = "") {
    const list = document.getElementById('products');
    if (!list) return;
    list.innerHTML = "";
    let filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
    );
    if (filtered.length === 0) {
        list.innerHTML = "<p>No products found.</p>";
        return;
    }
    filtered.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="product-title">${p.name}</div>
            <div class="product-price">$${p.price.toFixed(2)}</div>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        list.appendChild(div);
    });
}

// --- Cart Page Logic ---
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    if (!container || !totalDiv) return;
    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalDiv.innerHTML = "";
        document.getElementById('checkout-btn').style.display = "none";
        return;
    }
    let html = "";
    let total = 0;
    cart.forEach(item => {
        let product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return;
        let subtotal = product.price * item.qty;
        total += subtotal;
        html += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                <div class="cart-item-qty">Qty: ${item.qty}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${product.id})">Remove</button>
            </div>
        `;
    });
    container.innerHTML = html;
    totalDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    document.getElementById('checkout-btn').style.display = "block";
}

// --- Checkout Logic ---
function checkout() {
    setCart([]);
    renderCart();
    document.getElementById('order-confirmation').style.display = "block";
    document.getElementById('checkout-btn').style.display = "none";
    document.getElementById('cart-items').style.display = "none";
    document.getElementById('cart-total').style.display = "none";
}

// --- Search Logic ---
function setupSearch() {
    const search = document.getElementById('search');
    if (!search) return;
    search.addEventListener('input', function() {
        renderProducts(this.value);
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Page-specific logic
    if (document.getElementById('products')) {
        renderProducts();
        setupSearch();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
        document.getElementById('checkout-btn').onclick = checkout;
    }
});