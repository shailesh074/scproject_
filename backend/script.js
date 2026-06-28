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
    scene.fog = new THREE.FogExp2(0x030407, 0.001);

    // Camera Setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1000;

    // Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x030407, 1);
    container.appendChild(renderer.domElement);

    // Particle System (The "Launch" Effect)
    const geometry = new THREE.BufferGeometry();
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00E5FF); // Cyan
    const color2 = new THREE.Color(0x7C3AED); // Purple

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Spherical distribution
        const radius = 800 + Math.random() * 1200;
	const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
	positions[i + 2] = radius * Math.cos(phi);

        // Mix colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i] = mixedColor.r;
	colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

   particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Helper function to create massive, glowing symbol textures natively
    function createSymbolTexture(text, color) {
	const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        ctx.textAlign = 'center';
