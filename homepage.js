const STATIC_PRODUCTS = [
  { "id": "1", "name": "Bestfriend Copy", "price": "40", "image": "./image/bestfriend copy.jpg" },
  { "id": "2", "name": "Hauser Pens", "price": "150", "image": "./image/Hauser Pens.jfif" },
  { "id": "3", "name": "Pencil Pack", "price": "120", "image": "./image/Pencil Pack.jpg" },
  { "id": "4", "name": "Safari Bag", "price": "1570", "image": "./image/Safari Bag.jfif" }
];

window.addEventListener("DOMContentLoaded", () => {
    const usernameLabel = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");
    const fetchedData = localStorage.getItem("savedUsername");

    if (fetchedData && usernameLabel) {
        usernameLabel.textContent = `Welcome ${fetchedData}`;
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (usernameLabel) usernameLabel.textContent = "Welcome";
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    displayItem(STATIC_PRODUCTS);
    updateCartBadge();
});

function displayItem(itemsList) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;
    productGrid.innerHTML = "";

    itemsList.forEach(product => {
        productGrid.innerHTML += `
        <div class="product-card">
            <div class="card img"><img src="${product.image}" alt="${product.name}" onerror="this.src='./image/bestfriend.jpg'"></div>
            <h3>${product.name}</h3>
            <p class="price">Rs. ${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>`;
    });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity += 1; } else { cart.push({ id: productId, quantity: 1 }); }
    localStorage.setItem("userCart", JSON.stringify(cart));
    updateCartBadge();
    alert("Item added to cart successfully!");
}

function updateCartBadge() {
    const cartCountLabel = document.getElementById("cart-count");
    if (!cartCountLabel) return;
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountLabel.textContent = totalItems;
    cartCountLabel.style.display = totalItems === 0 ? "none" : "inline-block";
}

function logoutUser() {
    localStorage.removeItem("savedUsername");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Slider Animation Engine
const trackLeft = document.getElementById('image-track-left');
const trackRight = document.getElementById('image-track-right');
let currentIndex = 0;
setInterval(() => {
    if (!trackLeft || !trackRight) return;
    currentIndex++;
    trackLeft.style.transition = "transform 0.5s ease-in-out";
    trackRight.style.transition = "transform 0.5s ease-in-out";
    trackLeft.style.transform = `translateX(-${currentIndex * 280}px)`;
    trackRight.style.transform = `translateX(-${currentIndex * 280}px)`;
    if (currentIndex >= 4) {
        setTimeout(() => {
            trackLeft.style.transition = "none"; trackRight.style.transition = "none";
            currentIndex = 0;
            trackLeft.style.transform = `translateX(0px)`; trackRight.style.transform = `translateX(0px)`;
        }, 500);
    }
}, 1000);
