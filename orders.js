/* =======================================================
   MASTER ORDERS DATABASE STORAGE ARRAY
   ======================================================= */

// Yeh array har ek generated invoice/bill ko apne andar store karega (LocalStorage se data uthayega)
const ALL_COMPLETED_ORDERS = JSON.parse(localStorage.getItem("NamanPermanentOrders")) || [];

/**
 * Naye bill ka poora data is array me push karne ka master function
 * @param {string} txnId - Unique Transaction Serial Number
 * @param {string} customerName - Logged-in customer ka naam
 * @param {string} dateString - Date aur Time stamp
 * @param {Array} itemsList - Kharide gaye saare products ki deep list array
 * @param {number} finalBillAmount - Grand Total Amount
 */
function saveNewInvoiceToHistory(txnId, customerName, dateString, itemsList, finalBillAmount) {
    
    // Poore bill ka ek single systematic object package banaya
    const newOrderInvoice = {
        transactionId: txnId,
        customer: customerName,
        dateTime: dateString,
        purchasedItems: itemsList, // Isme har item ka name, qty, aur subtotal rahega
        grandTotal: finalBillAmount,
        paymentStatus: "PAID (COD)"
    };

    // Array me data inject kiya
    ALL_COMPLETED_ORDERS.push(newOrderInvoice);

    // 🚀 NEW CODE: Data ko permanent save kiya taaki page reload par delete na ho
    localStorage.setItem("NamanPermanentOrders", JSON.stringify(ALL_COMPLETED_ORDERS));

    // Testing ke liye console me poora record registry print karke check karein
    console.log("🔥 SUCCESS: Bill Data saved to Master Orders Array History!", ALL_COMPLETED_ORDERS);
}

// 🚀 NEW CODE: Jab bhi kisi dusre tab/file (jaise cart.js) se data save ho, ye array real-time me update ho jaye
/**
 * 🚀 AUTO-SYNC ENGINE FOR SEPARATE PAGES
 * Jaise hi order.html page load hoga, ye cart.js se bheja gaya data automatic 
 * aapke ALL_COMPLETED_ORDERS array me inject kar dega.
 */
window.addEventListener("DOMContentLoaded", () => {
    // Storage se data check karenge
    const pendingData = localStorage.getItem("PendingInvoicesToPush");

    if (pendingData) {
        const invoicesList = JSON.parse(pendingData);

        // Har ek invoice ko aapke master function me pass karenge
        invoicesList.forEach(invoice => {
            saveNewInvoiceToHistory(
                invoice.txnId,
                invoice.customerName,
                invoice.dateString,
                invoice.itemsList,
                invoice.finalBillAmount
            );
        });

        // Ek baar array me data successfully chala gaya, to bridge storage saaf kar denge
        localStorage.removeItem("PendingInvoicesToPush");
        
        console.log("✅ ALL PENDING ORDERS SUCCESSFULLY LOADED INTO MASTER ARRAY!");
    } else {
        console.log("ℹ️ No new orders found to sync.");
    }
});

window.saveNewInvoiceToHistory = function(txnId, customerName, dateString, itemsList, finalBillAmount) {
    
    // Poore bill ka ek single systematic object package banaya
    const newOrderInvoice = {
        transactionId: txnId,
        customer: customerName,
        dateTime: dateString,
        purchasedItems: itemsList, 
        grandTotal: finalBillAmount,
        paymentStatus: "PAID (COD)"
    };

    // Array me data inject kiya
    ALL_COMPLETED_ORDERS.push(newOrderInvoice);

    // Testing ke liye console me print karein
    console.log("🔥 SUCCESS: Bill Data saved to Master Orders Array History!", ALL_COMPLETED_ORDERS);
}
