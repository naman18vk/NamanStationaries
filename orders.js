/* =======================================================
   MASTER ORDERS DATABASE STORAGE ARRAY
   ======================================================= */

// Yeh khali array har ek generated invoice/bill ko apne andar store karega
const ALL_COMPLETED_ORDERS = [];

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

    // Testing ke liye console me poora record registry print karke check karein
    console.log("🔥 SUCCESS: Bill Data saved to Master Orders Array History!", ALL_COMPLETED_ORDERS);
}

/* =======================================================
   🚀 AUTO-SYNC ENGINE FOR SEPARATE PAGES (NEW BRIDGE)
   ======================================================= */
/**
 * Jaise hi user order.html wale page par aayega, ye listener automatic 
 * cart.js dwara localStorage me bheje gaye data ko read karega aur 
 * aapke upar bane 'saveNewInvoiceToHistory' function ke andar push kar dega.
 */
window.addEventListener("DOMContentLoaded", () => {
    // LocalStorage bridge se pending data check karenge
    const pendingData = localStorage.getItem("PendingInvoicesToPush");

    if (pendingData) {
        const invoicesList = JSON.parse(pendingData);

        // Jitne bhi naye bills aaye hain, unhe ek-ek karke aapke function me pass karenge
        invoicesList.forEach(invoice => {
            saveNewInvoiceToHistory(
                invoice.txnId,
                invoice.customerName,
                invoice.dateString,
                invoice.itemsList,
                invoice.finalBillAmount
            );
        });

        // Ek baar data array me safely inject hone ke baad, temporary storage ko clear kar denge
        // Isse data sirf ek baar array me load hoga aur bar-bar duplicate nahi hoga
        localStorage.removeItem("PendingInvoicesToPush");
        
        console.log("✅ ALL PENDING ORDERS SUCCESSFULLY LOADED INTO ALL_COMPLETED_ORDERS ARRAY!");
    } else {
        console.log("ℹ️ No new orders found to sync right now.");
    }

    // 💡 TIP: Agar aapke paas order.html me HTML table render karne ka koi function hai,
    // to aap use yahan call kar sakte hain. Jaise: renderOrderTable();
});
