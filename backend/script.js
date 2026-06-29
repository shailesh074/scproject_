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
