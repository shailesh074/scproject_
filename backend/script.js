//THIS IS BACKEND;

    // Phase 4: Master Ledger Table (Transactions View)
    const tb = sel('transactions-body'); tb.innerHTML = '';
    if (appData.transactions.length === 0) {	
