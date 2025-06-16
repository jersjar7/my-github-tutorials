// === VECTOR FUNDAMENTALS INTERACTIVE SCRIPT ===

// 1. GLOBAL VARIABLES
// 2D Canvas Setup
const canvas = document.getElementById('vector2D');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let scale = 30;
let zoom = 1;

// Vector data
let vectorA = { x: 3, y: 2 };
let vectorB = { x: 1, y: 4 };
let showSum = false;
let showDiff = false;
let scalarValue = 1;

// 3D Scene variables
let scene, camera, renderer, vector3D;

// 2. UTILITY FUNCTIONS
function calculateMagnitude(vector) {
    if (vector.z !== undefined) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    } else {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
}

function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

function addVectors(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    };
}

function subtractVectors(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    };
}

function scaleVector(vector, scalar) {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar
    };
}

// 3. DRAWING FUNCTIONS
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    const currentScale = scale * zoom;
    const gridRange = Math.ceil(15 / zoom);
    
    for (let i = -gridRange; i <= gridRange; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * currentScale, 0);
        ctx.lineTo(centerX + i * currentScale, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY - i * currentScale);
        ctx.lineTo(canvas.width, centerY - i * currentScale);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
}

function drawAxes() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('x', canvas.width - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
}

function drawVector(vector, color, label, offset = { x: 0, y: 0 }) {
    const currentScale = scale * zoom;
    const startX = centerX + offset.x * currentScale;
    const startY = centerY - offset.y * currentScale;
    const endX = startX + vector.x * currentScale;
    const endY = startY - vector.y * currentScale;
    
    // Draw vector line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw vector head as dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw starting point
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(label, endX + 8, endY - 8);
    
    return { startX, startY, endX, endY };
}

function drawVectors() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawAxes();
    
    const currentScale = scale * zoom;
    
    // Draw main vectors
    if (vectorA.x !== 0 || vectorA.y !== 0) {
        drawVector(vectorA, '#ff6b6b', 'A');
    }
    if (vectorB.x !== 0 || vectorB.y !== 0) {
        drawVector(vectorB, '#4ecdc4', 'B');
    }
    
    if (showSum) {
        const sum = addVectors(vectorA, vectorB);
        drawVector(sum, '#45b7d1', 'A+B');
        
        // Draw parallelogram
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(centerX + vectorA.x * currentScale, centerY - vectorA.y * currentScale);
        ctx.lineTo(centerX + sum.x * currentScale, centerY - sum.y * currentScale);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + vectorB.x * currentScale, centerY - vectorB.y * currentScale);
        ctx.lineTo(centerX + sum.x * currentScale, centerY - sum.y * currentScale);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    if (showDiff) {
        const diff = subtractVectors(vectorA, vectorB);
        drawVector(diff, '#f39c12', 'A-B');
    }
}

// 4. UPDATE FUNCTIONS
function updateVectorDisplays() {
    const magA = calculateMagnitude(vectorA);
    const magB = calculateMagnitude(vectorB);
    
    document.getElementById('vectorA_display').textContent = `A = (${formatNumber(vectorA.x, 1)}, ${formatNumber(vectorA.y, 1)})`;
    document.getElementById('vectorA_magnitude').textContent = `|A| = ${formatNumber(magA)}`;
    document.getElementById('vectorB_display').textContent = `B = (${formatNumber(vectorB.x, 1)}, ${formatNumber(vectorB.y, 1)})`;
    document.getElementById('vectorB_magnitude').textContent = `|B| = ${formatNumber(magB)}`;
    
    // Update operation results
    const sum = addVectors(vectorA, vectorB);
    const diff = subtractVectors(vectorA, vectorB);
    const scaled = scaleVector(vectorA, 2);
    
    document.getElementById('result_addition').textContent = `A + B = (${formatNumber(sum.x, 1)}, ${formatNumber(sum.y, 1)})`;
    document.getElementById('result_subtraction').textContent = `A - B = (${formatNumber(diff.x, 1)}, ${formatNumber(diff.y, 1)})`;
    document.getElementById('result_scalar').textContent = `2 × A = (${formatNumber(scaled.x, 1)}, ${formatNumber(scaled.y, 1)})`;
}

function update3DVectorDisplays() {
    const x = parseFloat(document.getElementById('vector3D_x').value) || 0;
    const y = parseFloat(document.getElementById('vector3D_y').value) || 0;
    const z = parseFloat(document.getElementById('vector3D_z').value) || 0;
    
    const magnitude = calculateMagnitude({x, y, z});
    
    document.getElementById('vector3D_display').textContent = `v = (${formatNumber(x, 1)}, ${formatNumber(y, 1)}, ${formatNumber(z, 1)})`;
    document.getElementById('vector3D_magnitude').textContent = `|v| = ${formatNumber(magnitude)}`;
}

// 5. INTERACTION FUNCTIONS
function showVectorSum() {
    showSum = !showSum;
    showDiff = false;
    drawVectors();
}

function showVectorDiff() {
    showDiff = !showDiff;
    showSum = false;
    drawVectors();
}

function scaleVectorA() {
    const newScale = prompt('Enter scaling factor:', '2');
    if (newScale !== null) {
        const factor = parseFloat(newScale);
        if (!isNaN(factor)) {
            vectorA.x *= factor;
            vectorA.y *= factor;
            document.getElementById('vectorA_x').value = formatNumber(vectorA.x, 1);
            document.getElementById('vectorA_y').value = formatNumber(vectorA.y, 1);
            updateVectorDisplays();
            drawVectors();
        }
    }
}

function resetZoom() {
    zoom = 1;
    drawVectors();
    showZoomLevel();
}

function clearVectors() {
    showSum = false;
    showDiff = false;
    vectorA = { x: 3, y: 2 };
    vectorB = { x: 1, y: 4 };
    document.getElementById('vectorA_x').value = vectorA.x;
    document.getElementById('vectorA_y').value = vectorA.y;
    document.getElementById('vectorB_x').value = vectorB.x;
    document.getElementById('vectorB_y').value = vectorB.y;
    updateVectorDisplays();
    drawVectors();
}

function calculateMagnitudeFromInputs() {
    const x = parseFloat(document.getElementById('mag_x').value) || 0;
    const y = parseFloat(document.getElementById('mag_y').value) || 0;
    const z = parseFloat(document.getElementById('mag_z').value) || 0;
    
    const magnitude = calculateMagnitude({x, y, z});
    document.getElementById('magnitude_result').textContent = `|v| = ${formatNumber(magnitude)}`;
    
    if (magnitude > 0) {
        const unitX = x / magnitude;
        const unitY = y / magnitude;
        const unitZ = z / magnitude;
        document.getElementById('unit_vector_result').textContent = `Unit vector: (${formatNumber(unitX, 3)}, ${formatNumber(unitY, 3)}, ${formatNumber(unitZ, 3)})`;
    } else {
        document.getElementById('unit_vector_result').textContent = 'Unit vector: undefined (zero vector)';
    }
}

function showZoomLevel() {
    let zoomIndicator = document.getElementById('zoom-indicator');
    if (!zoomIndicator) {
        zoomIndicator = document.createElement('div');
        zoomIndicator.id = 'zoom-indicator';
        zoomIndicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            pointer-events: none;
            z-index: 100;
        `;
        canvas.parentElement.style.position = 'relative';
        canvas.parentElement.appendChild(zoomIndicator);
    }
    
    zoomIndicator.textContent = `Zoom: ${(zoom * 100).toFixed(0)}%`;
    zoomIndicator.style.opacity = '1';
    
    setTimeout(() => {
        if (zoomIndicator) {
            zoomIndicator.style.opacity = '0';
        }
    }, 2000);
}

// 6. 3D FUNCTIONS
function init3D() {
    const container = document.getElementById('threeContainer');
    if (!container) return;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x2a2a2a);
    container.appendChild(renderer.domElement);
    
    // Add grid
    const gridHelper = new THREE.GridHelper(6, 6, 0x404040, 0x404040);
    scene.add(gridHelper);
    
    // Add axes
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
    
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 0, 0);
    
    // Add basic orbit controls simulation
    let mouseDown = false;
    let mouseX = 0, mouseY = 0;
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        mouseDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        mouseDown = false;
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    update3DVector();
    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function update3DVector() {
    const x = parseFloat(document.getElementById('vector3D_x').value) || 0;
    const y = parseFloat(document.getElementById('vector3D_y').value) || 0;
    const z = parseFloat(document.getElementById('vector3D_z').value) || 0;
    
    // Remove existing vector
    if (vector3D) {
        scene.remove(vector3D);
    }
    
    // Create new vector arrow
    const direction = new THREE.Vector3(x, y, z);
    const origin = new THREE.Vector3(0, 0, 0);
    const length = direction.length();
    
    if (length > 0) {
        const arrowHelper = new THREE.ArrowHelper(
            direction.normalize(), 
            origin, 
            length, 
            0xff6b6b, 
            length * 0.2, 
            length * 0.1
        );
        scene.add(arrowHelper);
        vector3D = arrowHelper;
    }
    
    update3DVectorDisplays();
}

function showUnitVector() {
    const x = parseFloat(document.getElementById('vector3D_x').value) || 0;
    const y = parseFloat(document.getElementById('vector3D_y').value) || 0;
    const z = parseFloat(document.getElementById('vector3D_z').value) || 0;
    
    const magnitude = calculateMagnitude({x, y, z});
    if (magnitude > 0) {
        const unitX = x / magnitude;
        const unitY = y / magnitude;
        const unitZ = z / magnitude;
        
        // Temporarily show unit vector
        if (vector3D) {
            scene.remove(vector3D);
        }
        
        const direction = new THREE.Vector3(unitX, unitY, unitZ);
        const origin = new THREE.Vector3(0, 0, 0);
        const arrowHelper = new THREE.ArrowHelper(direction, origin, 1, 0x4caf50, 0.2, 0.1);
        scene.add(arrowHelper);
        vector3D = arrowHelper;
        
        alert(`Unit vector: (${formatNumber(unitX, 3)}, ${formatNumber(unitY, 3)}, ${formatNumber(unitZ, 3)})`);
        
        // Restore original vector after 3 seconds
        setTimeout(() => {
            update3DVector();
        }, 3000);
    }
}

// 7. EXERCISE FUNCTIONS
function checkExercise1() {
    const userX = parseFloat(document.getElementById('ex1_x').value);
    const userY = parseFloat(document.getElementById('ex1_y').value);
    const correctX = 3, correctY = 1; // (2,−3) + (1,4) = (3,1)
    
    const feedback = document.getElementById('ex1_result');
    if (userX === correctX && userY === correctY) {
        feedback.innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        feedback.innerHTML = ' <span style="color: #f44336;">✗ Try again</span>';
    }
}

function checkExercise2() {
    const userMag = parseFloat(document.getElementById('ex2_mag').value);
    const correctMag = 13; // sqrt(3² + 4² + 12²) = sqrt(169) = 13
    
    const feedback = document.getElementById('ex2_result');
    if (Math.abs(userMag - correctMag) < 0.1) {
        feedback.innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        feedback.innerHTML = ' <span style="color: #f44336;">✗ Try again</span>';
    }
}

function checkExercise3() {
    const userX = parseFloat(document.getElementById('ex3_x').value);
    const userY = parseFloat(document.getElementById('ex3_y').value);
    const correctX = -6, correctY = -3; // -3 × (2,1) = (-6,-3)
    
    const feedback = document.getElementById('ex3_result');
    if (userX === correctX && userY === correctY) {
        feedback.innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        feedback.innerHTML = ' <span style="color: #f44336;">✗ Try again</span>';
    }
}

// 8. EVENT LISTENERS
function setupEventListeners() {
    // Vector A input listeners
    document.getElementById('vectorA_x').addEventListener('input', function() {
        vectorA.x = parseFloat(this.value) || 0;
        updateVectorDisplays();
        drawVectors();
    });
    
    document.getElementById('vectorA_y').addEventListener('input', function() {
        vectorA.y = parseFloat(this.value) || 0;
        updateVectorDisplays();
        drawVectors();
    });
    
    // Vector B input listeners
    document.getElementById('vectorB_x').addEventListener('input', function() {
        vectorB.x = parseFloat(this.value) || 0;
        updateVectorDisplays();
        drawVectors();
    });
    
    document.getElementById('vectorB_y').addEventListener('input', function() {
        vectorB.y = parseFloat(this.value) || 0;
        updateVectorDisplays();
        drawVectors();
    });
    
    // 3D vector input listeners
    document.getElementById('vector3D_x').addEventListener('input', update3DVector);
    document.getElementById('vector3D_y').addEventListener('input', update3DVector);
    document.getElementById('vector3D_z').addEventListener('input', update3DVector);
    
    // Button listeners
    document.getElementById('showSumBtn').addEventListener('click', showVectorSum);
    document.getElementById('showDiffBtn').addEventListener('click', showVectorDiff);
    document.getElementById('scaleBtn').addEventListener('click', scaleVectorA);
    document.getElementById('resetZoomBtn').addEventListener('click', resetZoom);
    document.getElementById('clearBtn').addEventListener('click', clearVectors);
    document.getElementById('update3DBtn').addEventListener('click', update3DVector);
    document.getElementById('showUnitBtn').addEventListener('click', showUnitVector);
    document.getElementById('calcMagnitudeBtn').addEventListener('click', calculateMagnitudeFromInputs);
    
    // Exercise button listeners
    document.getElementById('checkEx1Btn').addEventListener('click', checkExercise1);
    document.getElementById('checkEx2Btn').addEventListener('click', checkExercise2);
    document.getElementById('checkEx3Btn').addEventListener('click', checkExercise3);
    
    // Canvas interaction listeners
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const currentScale = scale * zoom;
        const x = (e.clientX - rect.left - centerX) / currentScale;
        const y = -(e.clientY - rect.top - centerY) / currentScale;
        
        vectorA.x = x;
        vectorA.y = y;
        document.getElementById('vectorA_x').value = formatNumber(x, 1);
        document.getElementById('vectorA_y').value = formatNumber(y, 1);
        
        updateVectorDisplays();
        drawVectors();
    });
    
    // Mouse wheel zoom
    canvas.addEventListener('wheel', function(e) {
        e.preventDefault();
        const zoomFactor = 1.1;
        
        if (e.deltaY < 0) {
            zoom *= zoomFactor;
        } else {
            zoom /= zoomFactor;
        }
        
        zoom = Math.max(0.2, Math.min(5, zoom));
        drawVectors();
        showZoomLevel();
    });
}

// 9. INITIALIZATION
window.addEventListener('load', function() {
    setupEventListeners();
    updateVectorDisplays();
    drawVectors();
    calculateMagnitudeFromInputs();
    init3D();
});
