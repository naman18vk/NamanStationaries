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
