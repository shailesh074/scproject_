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
		 `;
        });
    }

    // Phase 5: Assets & Bank Accounts
    const al = sel('accounts-list'); al.innerHTML = '';
    if (appData.accounts.length === 0) {
        al.innerHTML = '<p class="text-secondary p-4 text-center border-dashed rounded mt-4">No external assets tracked.</p>';
	} else {
        appData.accounts.forEach(a => {
	   al.innerHTML += `
                <div class="expense-item">
		    <div class="flex align-center">
                        <div class="expense-icon" style="background: rgba(124,58,237,0.1); color: var(--accent-purple);">🏦</div>
			<div>
                            <h4>${a.name}</h4>
			    <p class="text-xs text-secondary">Verified Asset</p>
                        </div>
		    </div>
                    <div class="text-cyan font-bold text-lg">${formatINR(a.balance)}</div>
	        </div>
            `;
        });
    }

    // Phase 6: Financial Goals Progress Tracker
    const gl = sel('goals-list'); gl.innerHTML = '';
    if (appData.goals.length === 0) {
        gl.innerHTML = '<p class="text-secondary p-4 text-center border-dashed rounded mt-4">Define a financial target to begin tracking.</p>';
    } else {
        appData.goals.forEach(g => {
	    const progressRaw = (liquidNetWorth / g.target) * 100;
            const progress = Math.min(Math.max(progressRaw, 0), 100);
	    const isComplete = progress >= 100;
            
            gl.innerHTML += `
	       <div class="expense-item" style="display:block; padding: 1.5rem;">
                    <div class="flex-between align-center mb-2">
		        <h4 class="text-lg ${isComplete ? 'text-green' : ''}">${isComplete ? '🎉 ' : ''}${g.name}</h4>
                        <span class="font-extrabold ${isComplete ? 'text-green' : 'text-cyan'} text-xl">${progress.toFixed(1)}%</span>
		    </div>
                    <div class="progress-bg"><div class="progress-fill ${isComplete ? 'bg-green' : ''}" style="width: ${progress}%;"></div></div>
		    <div class="goal-meta mt-4">
                        <span>Target: <strong class="text-white">${formatINR(g.target)}</strong></span>
			<span>Allocated: <strong class="text-white">${formatINR(Math.min(liquidNetWorth, g.target))}</strong></span>
                    </div>
		    </div>
            `;
	 });
    }

    // Phase 7: Dispatch Chart Updates
    renderCharts();
}

// 7. CHART.JS ANALYTICS ENGINE
function renderCharts() {
    if(!window.Chart) {
        console.warn('Chart.js engine offline. Visualizations disabled.');
	return;
    }
