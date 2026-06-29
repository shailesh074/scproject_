//THIS IS BACKEND;

    // Phase 4: Master Ledger Table (Transactions View)
   i const tb = sel('transactions-body'); tb.innerHTML = '';
    if (appData.transactions.length === 0) {
        tb.innerHTML = '<tr><td colspan="5" class="text-center text-secondary p-8">No transaction data available for master ledger.</td></tr>';
    } else {
