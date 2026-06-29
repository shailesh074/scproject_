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
