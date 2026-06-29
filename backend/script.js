//THIS IS BACKEND;
i   // --- 5. Mutual Fund SIP Projection (Compound Math) ---
    const calcSIP = () => {
        const p = +sel('sip-p').value;
        const r_annual = +sel('sip-r').value;
        const t_years = +sel('sip-t').value;
        const res = sel('sip-res');
	
        if (p > 0 && r_annual > 0 && t_years > 0) {
            const i = r_annual / 100 / 12;
            const n = t_years * 12;
               
	    // Standard SIP Formula
            const futureValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            const totalInvested = p * n;
            const wealthGained = futureValue - totalInvested;

	    res.innerHTML = `
                <div class="flex-between mb-2"><span class="text-secondary text-sm">Invested Capital:</span> <span>${formatINR(totalInvested)}</span></div>
                <div class="flex-between mb-4"><span class="text-secondary text-sm">Wealth Generated:</span> <span class="text-green">+${formatINR(wealthGained)}</span></div>
                <div class="divider mb-4"></div>
                <div class="text-secondary text-xs uppercase tracking-wide">Projected Maturity Value</div>
		<div class="text-cyan font-extrabold text-3xl mt-2">${formatINR(futureValue)}</div>
            `;
            res.classList.remove('hidden');

            // Hook into Chart Engine
            renderSIPChart(t_years, p, r_annual);
        } else {
            res.classList.add('hidden');
        }
    };
   i ['sip-p', 'sip-r', 'sip-t'].forEach(id => sel(id).addEventListener('input', calcSIP));

    // --- 6. Financial Goals Engine ---
    sel('btn-add-goal').onclick = () => {
        const name = sel('goal-name').value.trim();
	const target = +sel('goal-target').value;
        if(name && target > 0) {
            appData.goals.push({ id: generateUUID(), name, target });
            sel('goal-name').value = '';
            sel('goal-target').value = '';
            renderApp();
        } else {
            alert('SYSTEM HALT: Target amount must be greater than zero.');
        }
    };
}

// 6. MASTER RENDER ENGINE
function renderApp() {
    // Phase 1: Mathematical Aggregation
    let totalExpenses = 0;
    appData.transactions.forEach(t => totalExpenses += t.amount);
    
    let totalAssets = 0;
    appData.accounts.forEach(a => totalAssets += a.balance); 
    
    const currentBalance = appData.budget - totalExpenses;
    const liquidNetWorth = currentBalance + totalAssets;

    // Phase 2: DOM Injection for Core Stats
    sel('total-balance').innerText = formatINR(currentBalance); 
    sel('total-assets').innerText = formatINR(totalAssets);
    sel('total-expenses').innerText = formatINR(totalExpenses);

    // Phase 3: Recent Transactions Widget (Dashboard)
    const rl = sel('recent-transactions'); rl.innerHTML = '';
    if (appData.transactions.length === 0) {
        rl.innerHTML = '<p class="text-secondary p-4 text-center border-dashed rounded mt-4">Ledger is empty.</p>';
    } else {
        appData.transactions.slice(0, 5).forEach(t => {
