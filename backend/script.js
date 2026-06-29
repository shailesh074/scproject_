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
            
