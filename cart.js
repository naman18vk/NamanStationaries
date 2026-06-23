// Master products array reference mapping keys
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
        if (item.quantity <= 0) {
            cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
        }
        localStorage.setItem("userCart", JSON.stringify(cartArray));
        generateCartTable(); 
    }
}

function removeItem(productId) {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    cartArray = cartArray.filter(i => String(i.id).trim() !== String(productId).trim());
    localStorage.setItem("userCart", JSON.stringify(cartArray));
    generateCartTable();
}

/* -------------------------------------------------------
   3. BUTTON FUNCTION 1: ONLY CLEAR CART (No Invoice PopUp)
   ------------------------------------------------------- */
function clearCartOnly() {
    if (confirm("Kya aap poora cart saaf karna chahte hain?")) {
        localStorage.removeItem("userCart");
        generateCartTable();
    }
}

/* -------------------------------------------------------
   4. BUTTON FUNCTION 2: PROCEED TO CHECKOUT (Show Invoice Bill)
   ------------------------------------------------------- */
function openReceiptBill() {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    if (cartArray.length === 0) return;

    const modal = document.getElementById("receiptModal");
    const receiptBody = document.getElementById("receiptItemsBody");
    const receiptTotal = document.querySelectorAll("#receiptGrandTotal");
    const receiptDate = document.getElementById("receiptDate");
    const receiptTxn = document.getElementById("receiptTxn");
    
    // Bill par username dikhane ke liye target element catch kiya
    const receiptUserLabel = document.getElementById("receiptUser");

    receiptBody.innerHTML = "";

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

    // Update total in receipt modal instances
    receiptTotal.forEach(el => el.textContent = `Rs. ${globalTotalBill}`);
    receiptDate.textContent = `Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`;
    receiptTxn.textContent = `TXN ID: NS${Math.floor(100000 + Math.random() * 900000)}`;

    // LocalStorage se saved log-in username nikal kar bill me Pure Black color me print karna
    const currentLoggedUser = localStorage.getItem("savedUsername") || "Customer";
    if (receiptUserLabel) {
        receiptUserLabel.textContent = `NAME: ${currentLoggedUser}`;
        receiptUserLabel.style.color = "#000000"; // Dynamic script text block forced color reset
    }

    modal.style.display = "flex";
}

function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
    localStorage.removeItem("userCart");
    generateCartTable();
}

/* -------------------------------------------------------
   5. BACK BUTTON CONTROLLER FROM RECEIPT MODAL
   ------------------------------------------------------- */
function goBackToCartFromBill() {
    // Bina cart data khali kiye sirf popup bill modal ko band karna
    document.getElementById("receiptModal").style.display = "none";
    generateCartTable();
}
function openReceiptBill() {
    let cartArray = JSON.parse(localStorage.getItem("userCart")) || [];
    if (cartArray.length === 0) return;

    const modal = document.getElementById("receiptModal");
    const receiptBody = document.getElementById("receiptItemsBody");
    const receiptTotal = document.querySelectorAll("#receiptGrandTotal");
    const receiptDate = document.getElementById("receiptDate");
    const receiptTxn = document.getElementById("receiptTxn");
    const receiptUserLabel = document.getElementById("receiptUser");

    receiptBody.innerHTML = "";
    
    // 📦 NEW: Is specific bill ke saare items ko track karne ke liye temporary array
    let currentInvoiceItems = [];

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

            // Items ka clean detailed array structure taiyar kiya
            currentInvoiceItems.push({
                productName: itemInfo.name,
                quantity: cartItem.quantity,
                pricePerUnit: itemInfo.price,
                itemSubtotal: subtotal
            });
        }
    });

    // Dynamic strings generation variables
    const generatedTxnId = `NS${Math.floor(100000 + Math.random() * 900000)}`;
    const currentTimestamp = `Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`;
    const currentLoggedUser = localStorage.getItem("savedUsername") || "Customer";

    // UI elements content replacement
    receiptTotal.forEach(el => el.textContent = `Rs. ${globalTotalBill}`);
    receiptDate.textContent = currentTimestamp;
    receiptTxn.textContent = `TXN ID: ${generatedTxnId}`;

    if (receiptUserLabel) {
        receiptUserLabel.textContent = `Welcome: ${currentLoggedUser}`;
        receiptUserLabel.style.color = "#000000";
    }

    // 🔥 NEW MASTER TRIGGER: orders.js ke ALL_COMPLETED_ORDERS array me data safely push kiya
    saveNewInvoiceToHistory(generatedTxnId, currentLoggedUser, currentTimestamp, currentInvoiceItems, globalTotalBill);

    modal.style.display = "flex";
}
