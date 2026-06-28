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
const sel = (id) => document.getElementById(id);
const generateUUID = () => {
    return 'tx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const getCategoryIcon = (cat) => {
    const icons = { 'Housing': '🏠', 'Food': '🍔', 'Transport': '🚗', 'Shopping': '🛍️', 'Utilities': '⚡', 'Other': '📌' };
    return icons[cat] || '📌';
};
// 3. THREE.JS 3D CINEMATIC LAUNCH ENGINE
let scene, camera, renderer, particles, animationId;

function initThreeJS() {
    const container = sel('three-container');
    if (!container) return;

    // Scene Setup
    scene = new THREE.Scene();
