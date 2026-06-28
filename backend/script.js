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
