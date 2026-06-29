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
     
    Chart.defaults.color = '#8B949E';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.05)';

    // Aggregation Logic for Categories
    const catTotals = {};
    appData.transactions.forEach(t => {
	catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    
    const labels = Object.keys(catTotals).length ? Object.keys(catTotals) : ['Awaiting Data'];
    const data = Object.values(catTotals).length ? Object.values(catTotals) : [0];
   
    // Fintech Corporate Color Palette
    const bgColors = ['#00E5FF', '#7C3AED', '#FF3366', '#f59e0b', '#10b981', '#3b82f6'];

    // --- Chart 1: Bar Chart (Linear Distribution) ---
    const ctxBar = sel('categoryChart');
    if (ctxBar) {
        if (!appData.charts.expenseBar) {
            appData.charts.expenseBar = new Chart(ctxBar, {
		type: 'bar',
                data: {
		    labels: labels,
                    datasets: [{
			label: 'Capital Outflow (₹)',
                        data: data,
			backgroundColor: '#00E5FF',
                        borderRadius: 8i,
			barThickness: 'flex',
                        maxBarThickness: 40
                    }]
		},
                options: {
                    responsive:true, maintainAspectRatio:false,
                    plugins: { legend: {display: false}, tooltip: { mode: 'index', intersect: false, padding: 12, cornerRadius: 8 } },
                    scales: { y: { beginAtZero: true } }
		}
            });
        } else {
            appData.charts.expenseBar.data.labels = labels;
            appData.charts.expenseBar.data.datasets[0].data = data;
	    appData.charts.expenseBar.update();
        }
    }

    // --- Chart 2: Doughnut Chart (Radial Breakdown) ---
    const ctxDoughnut = sel('doughnutChart');
    if (ctxDoughnut) {
        if (!appData.charts.expenseRadial) {
            appData.charts.expenseRadial = new Chart(ctxDoughnut, {
                type: 'doughnut',
		data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: bgColors,
			borderWidth: 2,
                        borderColor: '#07090C',
                        hoverOffset: 10
                    }]
                },
		options: {
                    responsive:true, maintainAspectRatio:false, cutout: '75%',
                    plugins: { legend: { position: 'right', labels: { padding: 20 } } }
                }
            });
	} else {
            appData.charts.expenseRadial.data.labels = labels;
            appData.charts.expenseRadial.data.datasets[0].data = data;
            appData.charts.expenseRadial.update();
        }
    }
}

// --- Chart 3: SIP Line Chart Projection ---
function renderSIPChart(years, monthlyP, rate) {
    if(!window.Chart) return;
    const ctxSIP = sel('sipChart');
    if (!ctxSIP) return;

    const labels = [];
    const investedData = [];
    const returnsData = [];

    const i = rate / 100 / 12;

    // Generate data points for each year
    for(let yr = 1; yr <= years; yr++) {
        labels.push(`Year ${yr}`);
