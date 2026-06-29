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
