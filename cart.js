// Master array copied from homepage.js to match item details based on ID
const MASTER_PRODUCTS = [
  { "id": "1", "name": "Bestfriend Copy", "price": "40", "image": "./image/bestfriend copy.jpg" },
  { "id": "2", "name": "Hauser Pens", "price": "150", "image": "./image/Hauser Pens.jfif" },
  { "id": "3", "name": "Pencil Pack", "price": "120", "image": "./image/Pencil Pack.jpg" },
  { "id": "4", "name": "Safari Bag", "price": "1570", "image": "./image/Safari Bag.jfif" }
];

window.addEventListener("DOMContentLoaded", () => {
    generateCartTable();
});

function generateCartTable() {
    const tableBody = document.getElementById("cartTableBody");
    const tableElement = document.getElementById("cartTable");
    const summaryBox = document.getElementById("summaryBox");
    const emptyMessage = document.getElementById("emptyMessage");
    const grandTotalLabel = document.getElementById("cartGrandTotal");

    // LocalStorage se homepage wala cart array lekar aao
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];

    // Reset Table rows
    tableBody.innerHTML = "";

    if (cartArray.length === 0) {
        tableElement.style.display = "none";
        summaryBox.style.display = "none";
        emptyMessage.style.display = "block";
        return;
    }

    tableElement.style.display = "table";
    summaryBox.style.display = "flex";
    emptyMessage.style.display = "none";

    let finalGrandTotal = 0;

    // Loop through user's added items
    cartArray.forEach(cartItem => {
        // ID ke basis par MASTER_PRODUCTS array se item details match karo
        const originalItem = MASTER_PRODUCTS.find(p => String(p.id).trim() === String(cartItem.id).trim());

        if (originalItem) {
            const priceNum = Number(originalItem.price);
            const quantityNum = Number(cartItem.quantity);
            const subtotal = priceNum * quantityNum;
            finalGrandTotal += subtotal;

            // Creating Table Row
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${originalItem.image}" alt="${originalItem.name}" class="table-img" onerror="this.src='./image/hero books.png'"></td>
                <td><strong>${originalItem.name}</strong></td>
                <td>Rs. ${originalItem.price}</td>
                <td>
                    <div class="qty-btn-container">
                        <button onclick="updateQty('${cartItem.id}', -1)">-</button>
                        <span class="qty-val">${cartItem.quantity}</span>
                        <button onclick="updateQty('${cartItem.id}', 1)">+</button>
                    </div>
                </td>
                <td>Rs. ${subtotal}</td>
                <td><button class="delete-row-btn" onclick="removeItem('${cartItem.id}')">Delete</button></td>
            `;
            tableBody.appendChild(row);
        }
    });

    // Update grand total display text
    grandTotalLabel.textContent = `Rs. ${finalGrandTotal}`;
}

// Table ke andarr se quantity plus minus karne ke liye function
function updateQty(productId, amount) {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    let item = cartArray.find(i => String(i.id).trim() === String(productId).trim());

    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
        }
        localStorage.setItem("userCart", JSON.stringify(cartArray));
        generateCartTable(); // Table refresh karo
    }
}

// Single item delete button function
function removeItem(productId) {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
    localStorage.setItem("userCart", JSON.stringify(cartArray));
    generateCartTable();
}

// Pure cart array ko khali karne ke liye
function clearCart() {
    if(confirm("Kya aap poora cart saaf karna chahte hain?")) {
        localStorage.removeItem("userCart");
        generateCartTable();
    }
}
