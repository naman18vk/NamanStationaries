
const ALL_COMPLETED_ORDERS = [];
function saveNewInvoiceToHistory(txnId, customerName, dateString, itemsList, finalBillAmount) {
   
    const newOrderInvoice = {
        transactionId: txnId,
        customer: customerName,
        dateTime: dateString,
        purchasedItems: itemsList, 
        grandTotal: finalBillAmount,
        paymentStatus: "PAID (COD)"
    };

    ALL_COMPLETED_ORDERS.push(newOrderInvoice);

    console.log("🔥 SUCCESS: Bill Data saved to Master Orders Array History!", ALL_COMPLETED_ORDERS);
}

// 🚀 WINDOW GLOBAL BRIDGE: 
window.saveNewInvoiceToHistory = saveNewInvoiceToHistory;
