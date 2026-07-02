// =======================================================
// 1. MASTER PRODUCTS REGISTRY
// =======================================================
const MASTER_PRODUCTS = [
  { "id": "1", "name": "Bestfriend Copy", "price": "40", "image": "./image/bestfriend copy.jpg" },
  { "id": "2", "name": "Hauser Pens", "price": "150", "image": "./image/Hauser Pens.jfif" },
  { "id": "3", "name": "Pencil Pack", "price": "120", "image": "./image/Pencil Pack.jpg" },
  { "id": "4", "name": "Safari Bag", "price": "1570", "image": "./image/Safari Bag.jfif" }
];

let globalTotalBill = 0;

// =======================================================
// 2. PERMANENT ORDERS DATABASE SYSTEM VARIABLES
// =======================================================
const ORDERS_DB_NAME = "NamanOrdersDB";
const ORDERS_STORE_NAME = "OrderHistory";
const ORDERS_DB_VERSION = 1;

window.addEventListener("DOMContentLoaded", () => {
    generateCartTable();
});

/* -------------------------------------------------------
   CORE ENGINE: GENERATE CART LIST VIEW TABLE
   ------------------------------------------------------- */
function generateCartTable() {
    const tableBody = document.getElementById("cartTableBody");
    const tableElement = document.getElementById("cartTable");
    const summaryBox = document.getElementById("summaryBox");
    const emptyMessage = document.getElementById("emptyMessage");
    const grandTotalLabel = document.getElementById("cartGrandTotal");

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

function clearCartOnly() {
    if (confirm("Kya aap poora cart saaf karna chahte hain?")) {
        localStorage.removeItem("userCart");
        generateCartTable();
    }
}

/* -------------------------------------------------------
   🔥 PROCEED TO CHECKOUT (Show Invoice & Initialize DB Entry)
   ------------------------------------------------------- */
    // 1. Aapka existing DB function
    writeOrderToPermanentDB(generatedTxnId, currentLoggedUser, currentTimestamp, currentInvoiceItems, globalTotalBill);

    // 🚀 ALAG PAGES KE LIYE FIXED CODE: 
    // Pehle se local storage me agar koi pending orders hain to unhe nikalenge
    let pendingInvoices = JSON.parse(localStorage.getItem("PendingInvoicesToPush")) || [];
    
    // Naya data package taiyar kiya
    pendingInvoices.push({
        txnId: generatedTxnId,
        customerName: currentLoggedUser,
        dateString: currentTimestamp,
        itemsList: currentInvoiceItems,
        finalBillAmount: globalTotalBill
    });

    // Storage me save kar diya taaki order.html ise fetch kar sake
    localStorage.setItem("PendingInvoicesToPush", JSON.stringify(pendingInvoices));
    console.log("📦 Order details stored in local bridge for order.js");

    modal.style.display = "flex";
}

function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
    localStorage.removeItem("userCart");
    generateCartTable();
}

function goBackToCartFromBill() {
    document.getElementById("receiptModal").style.display = "none";
    generateCartTable();
}

/* -------------------------------------------------------
   🔒 WRITER UTILITY: CREATE AND WRITE IN NAMANORDERSDB
   ------------------------------------------------------- */
function writeOrderToPermanentDB(txnId, customerName, dateString, itemsList, finalBillAmount) {
    // Open direct connection request
    const dbRequest = indexedDB.open(ORDERS_DB_NAME, ORDERS_DB_VERSION);

    dbRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(ORDERS_STORE_NAME)) {
            db.createObjectStore(ORDERS_STORE_NAME, { keyPath: "transactionId" });
            console.log("Database Engine: 'OrderHistory' object store auto-generated successfully.");
        }
    };

    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(ORDERS_STORE_NAME, "readwrite");
        const store = transaction.objectStore(ORDERS_STORE_NAME);

        const orderInvoicePayload = {
            transactionId: txnId,
            customer: customerName,
            dateTime: dateString,
            purchasedItems: itemsList, 
            grandTotal: finalBillAmount,
            paymentStatus: "PAID (COD)"
        };

        // Table me item permanently write kiya
        const addRequest = store.add(orderInvoicePayload);

        addRequest.onsuccess = function() {
            console.log(`🎉 PERMANENT SYNC: Bill ${txnId} has been successfully locked in IndexedDB!`);
        };

        addRequest.onerror = function(e) {
            console.error("IndexedDB Row insert failed:", e.target.error);
        };

        transaction.oncomplete = () => db.close();
    };

    dbRequest.onerror = function(event) {
        console.error("NamanOrdersDB open failures:", event.target.error);
    };
}
