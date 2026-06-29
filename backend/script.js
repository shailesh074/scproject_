//THIS IS BACKEND;

    // Phase 4: Master Ledger Table (Transactions View)
   i const tb = sel('transactions-body'); tb.innerHTML = '';
    if (appData.transactions.length === 0) {
        tb.innerHTML = '<tr><td colspan="5" class="text-center text-secondary p-8">No transaction data available for master ledger.</td></tr>';
    } else {
        appData.transactions.forEach(t => {
            const icon = getCategoryIcon(t.category);
	    tb.innerHTML += `
                <tr>
		    <td class="font-medium">${t.date}</td>
                    <td class="text-xs text-secondary font-mono">${t.id}</td>
		    <td class="font-bold text-white">${t.title}</td>
                    <td><span class="glass px-4 py-2 rounded-xl text-xs">${icon} ${t.category}</span></td>
		    <td class="text-red font-bold text-right text-lg">-${formatINR(t.amount)}</td>
                </tr>
