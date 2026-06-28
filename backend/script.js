// 1. GLOBAL STATE MANAGEMENT
const appData = {
    budget: 0,
    transactions: [],
    accounts: [],
    goals: [],
    charts: { expenseBar: null, expenseRadial: null, sipLineChart: null },
    ui: {
        currentView: 'landing',
        isMobile: window.innerWidth <= 768
    }
};
// 2. UTILITY & HELPER FUNCTIONS
const formatINR = (num) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
};
