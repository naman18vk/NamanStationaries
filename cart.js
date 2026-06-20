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
// Master array to match item details based on ID from homepage
const MASTER_PRODUCTS = [
  { "id": "1", "name": "Bestfriend Copy", "price": "40", "image": "./image/bestfriend copy.jpg" },
  { "id": "2", "name": "Hauser Pens", "price": "150", "image": "./image/Hauser Pens.jfif" },
  { "id": "3", "name": "Pencil Pack", "price": "120", "image": "./image/Pencil Pack.jpg" },
  { "id": "4", "name": "Safari Bag", "price": "1570", "image": "./image/Safari Bag.jfif" }
];

let globalTotalBill = 0;

window.addEventListener("DOMContentLoaded", () => {
    generateCartTable();
});

/* -------------------------------------------------------
   1. MAIN ENGINE: GENERATE CART LIST VIEW TABLE
   ------------------------------------------------------- */
function generateCartTable() {
    const tableBody = document.getElementById("cartTableBody");
    const tableElement = document.getElementById("cartTable");
    const summaryBox = document.getElementById("summaryBox");
    const emptyMessage = document.getElementById("emptyMessage");
    const grandTotalLabel = document.getElementById("cartGrandTotal");

    // LocalStorage se saved array fetch karein
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
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

    globalTotalBill = 0;

    cartArray.forEach(cartItem => {
        // ID ke basis par details match karein
        const originalItem = MASTER_PRODUCTS.find(p => String(p.id).trim() === String(cartItem.id).trim());

        if (originalItem) {
            const subtotal = Number(originalItem.price) * Number(cartItem.quantity);
            globalTotalBill += subtotal;

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

    grandTotalLabel.textContent = `Rs. ${globalTotalBill}`;
}

/* -------------------------------------------------------
   2. TRANSACTION CONTROLLERS: PLUS, MINUS & REMOVE
   ------------------------------------------------------- */
function updateQty(productId, amount) {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    let item = cartArray.find(i => String(i.id).trim() === String(productId).trim());

    if (item) {
        item.quantity += amount;
        // Quantity 0 hote hi auto remove layer lock
        if (item.quantity <= 0) {
            cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
        }
        localStorage.setItem("userCart", JSON.stringify(cartArray));
        generateCartTable(); // Table refresh karo
    }
}

function removeItem(productId) {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
    localStorage.setItem("userCart", JSON.stringify(cartArray));
    generateCartTable();
}

/* -------------------------------------------------------
   3. BILL RECEIPT GENERATION POPUP ENGINE
   ------------------------------------------------------- */
function clearCart() {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    if (cartArray.length === 0) return;

    const modal = document.getElementById("receiptModal");
    const receiptBody = document.getElementById("receiptItemsBody");
    const receiptTotal = document.getElementById("receiptGrandTotal");
    const receiptDate = document.getElementById("receiptDate");
    const receiptTxn = document.getElementById("receiptTxn");

    receiptBody.innerHTML = "";

    // Invoice layout rows data inject karein
    cartArray.forEach(cartItem => {
        const itemInfo = MASTER_PRODUCTS.find(p => String(p.id).trim() === String(cartItem.id).trim());
        if (itemInfo) {
            const subtotal = Number(itemInfo.price) * Number(cartItem.quantity);
            receiptBody.innerHTML += `
                <tr style="border-bottom: 1px dotted #eee;">
                    <td style="padding: 6px 0; text-align: left;">${itemInfo.name}</td>
                    <td style="text-align: center; padding: 6px 0;">${cartItem.quantity}</td>
                    <td style="text-align: right; padding: 6px 0;">Rs. ${subtotal}</td>
                </tr>
            `;
        }
    });

    // Invoice dates, unique transaction serial IDs configuration
    receiptTotal.textContent = `Rs. ${globalTotalBill}`;
    receiptDate.textContent = `Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`;
    receiptTxn.textContent = `TXN ID: NS${Math.floor(100000 + Math.random() * 900000)}`;

    // Show PopUp Modal
    modal.style.display = "flex";
}

function closeReceipt() {
    // Hide Modal box
    document.getElementById("receiptModal").style.display = "none";
    
    // Receipt window close hote hi memory reset checkout layers complete
    localStorage.removeItem("userCart");
    generateCartTable();
}
