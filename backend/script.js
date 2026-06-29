//THIS IS BACKEND;
 // 4b. Sidebar Routing Logic
    document.querySelectorAll('.nav-links li').forEach(l => {
        l.onclick = () => {
            document.querySelectorAll('.nav-links li').forEach(x => x.classList.remove('active'));
            l.classList.add('active');
            
            document.querySelectorAll('.app-view').forEach(v => {
                v.style.opacity = '0'; 
                setTimeout(() => v.classList.remove('active'), 250);
	     });

            setTimeout(() => {
                const targetView = sel(`view-${l.dataset.view}`);
                if (targetView) {
		    targetView.classList.add('active');
                    targetView.style.opacity = '1';

                    // Special hook for Analytics view rendering
                    if(l.dataset.view === 'analytics' || l.dataset.view === 'investments') {
                        renderCharts();
                    }
                }
            }, 250);
        };
    });

    // Initialize Widget Event Listeners
    initWidgetListeners();
});

// 5. WIDGET EVENT BINDINGS
function initWidgetListeners() {

    // --- 1. Quick Interest Calculator ---
    const calcInt = () => {
        const p = +sel('calc-p').value, r = +sel('calc-r').value, t = +sel('calc-t').value;
        const res = sel('calc-res');
        if (p > 0 && r > 0 && t > 0) {
            const int = (p * r * t) / 100;
            res.innerHTML = `Yield: ${formatINR(int)}<br>Maturity Value: ${formatINR(p + int)}`;
            res.classList.remove('hidden');
        } else {
            res.classList.add('hidden');
        }
    };
    ['calc-p', 'calc-r', 'calc-t'].forEach(id => sel(id).addEventListener('input', calcInt));

    // --- 2. Master Transaction Engine ---
    sel('btn-add-txn').onclick = () => {
        const title = sel('new-txn-title').value.trim() || 'Uncategorized Debit';
        const amount = +sel('new-txn-amount').value;
        const cat = sel('new-txn-cat').value;
        let date = sel('new-txn-date').value;

        
        if (!date) date = new Date().toISOString().split('T')[0];

        if(amount > 0) {
            appData.transactions.push({
                id: generateUUID(),
	        date: date,
                title: title,
                category: cat,
                amount: amount
            });
	    // Sort chronologically descending
            appData.transactions.sort((a, b) => b.date.localeCompare(a.date));

            // Reset fields
            sel('new-txn-title').value = '';
	    sel('new-txn-amount').value = '';
            sel('new-txn-date').value = '';
            sel('new-txn-title').focus(); // Accessibility

            renderApp();
	} else {
            alert('SYSTEM HALT: Transaction amount must be greater than zero.');
        }
    };

    // Routing shortcut for "View All"
    sel('view-all-txns').onclick = () => {
        document.querySelector('.nav-links li[data-view="transactions"]').click();
    };

    // --- 3. Bank Accounts / Assets Manager ---
    sel('btn-add-acc').onclick = () => {
        const name = sel('new-acc-name').value.trim();
        const bal = +sel('new-acc-bal').value;
        if(name && bal >= 0 && sel('new-acc-bal').value !== "") {
            appData.accounts.push({ name, balance: bal, id: generateUUID() });
            sel('new-acc-name').value = '';
            sel('new-acc-bal').value = '';
            renderApp();
        } else {
            alert('SYSTEM HALT: Invalid Asset parameters.');
        }
    };

    // --- 4. Loan Amortization Algorithm ---
     const calcEMI = () => {
        const p = +sel('emi-p').value;
        const r_annual = +sel('emi-r').value;
        const n = +sel('emi-t').value;
        const res = sel('emi-res');
        const sched = sel('emi-schedule');

        if (p > 0 && r_annual > 0 && n > 0) {
            const r = r_annual / 12 / 100; // Monthly rate
            // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
	    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - p;

            res.innerHTML = `Monthly Installment: <br><span style="font-size: 2.5rem">${formatINR(emi)}</span>`;
            res.classList.remove('hidden');

            sched.innerHTML = `
                <div class="expense-item">
                    <div><h4>Principal Borrowed</h4><p class="text-xs text-secondary">Initial Loan Amount</p></div>
		    <div class="font-bold text-lg">${formatINR(p)}</div>
                </div>
                <div class="expense-item">
                    <div><h4>Interest Component</h4><p class="text-xs text-secondary">Cost of Debt</p></div>
                    <div class="text-red font-bold text-lg">+${formatINR(totalInterest)}</div>
                </div>
                <div class="divider mt-2 mb-2"></div>
                <div class="expense-item" style="background: rgba(0,229,255,0.05); border-color: rgba(0,229,255,0.2);">
                    <div><h4 class="text-cyan">Total Debt Burden</h4><p class="text-xs text-secondary">Over ${n} months</p></div>
                    <div class="text-cyan font-extrabold text-xl">${formatINR(totalPayment)}</div>
