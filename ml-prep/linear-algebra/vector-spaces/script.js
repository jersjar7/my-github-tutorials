// === VECTOR SPACES & INDEPENDENCE INTERACTIVE SCRIPT ===

// 1. GLOBAL VARIABLES
// Canvas setup
const indCanvas = document.getElementById('independenceCanvas');
const indCtx = indCanvas.getContext('2d');
const spanCanvas = document.getElementById('spanCanvas');
const spanCtx = spanCanvas.getContext('2d');

// 3D Scene variables
let scene, camera, renderer, vectors3D = [];

// Current vectors
let vectors = {
    v1: { x: 2, y: 1 },
    v2: { x: 1, y: 3 },
    v3: { x: 0, y: 0 }
};

let vectors3D_data = {
    a: { x: 1, y: 0, z: 0 },
    b: { x: 0, y: 1, z: 0 },
    c: { x: 0, y: 0, z: 1 }
};

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

// 3. DRAWING FUNCTIONS
function drawGrid(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 30;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY - i * scale);
        ctx.lineTo(canvas.width, centerY - i * scale);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
}

function drawAxes(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
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

function drawVector(ctx, canvas, vector, color, label) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 30;
    
    const endX = centerX + vector.x * scale;
    const endY = centerY - vector.y * scale;
    
    // Draw vector line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead as dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw starting point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(label, endX + 8, endY - 8);
}

function drawIndependenceVisualization() {
    indCtx.clearRect(0, 0, indCanvas.width, indCanvas.height);
    drawGrid(indCtx, indCanvas);
    drawAxes(indCtx, indCanvas);
    
    // Get current vector values
    updateVectorValues();
    
    // Draw vectors
    if (vectors.v1.x !== 0 || vectors.v1.y !== 0) {
        drawVector(indCtx, indCanvas, vectors.v1, '#ff6b6b', 'v₁');
    }
    if (vectors.v2.x !== 0 || vectors.v2.y !== 0) {
        drawVector(indCtx, indCanvas, vectors.v2, '#4ecdc4', 'v₂');
    }
    if (vectors.v3.x !== 0 || vectors.v3.y !== 0) {
        drawVector(indCtx, indCanvas, vectors.v3, '#45b7d1', 'v₃');
    }
}

// 4. UPDATE FUNCTIONS
function updateVectorValues() {
    vectors.v1.x = parseFloat(document.getElementById('v1_x').value) || 0;
    vectors.v1.y = parseFloat(document.getElementById('v1_y').value) || 0;
    vectors.v2.x = parseFloat(document.getElementById('v2_x').value) || 0;
    vectors.v2.y = parseFloat(document.getElementById('v2_y').value) || 0;
    vectors.v3.x = parseFloat(document.getElementById('v3_x').value) || 0;
    vectors.v3.y = parseFloat(document.getElementById('v3_y').value) || 0;
}

// 5. INDEPENDENCE CHECKING
function checkIndependence() {
    updateVectorValues();
    
    // Count non-zero vectors
    const nonZeroVectors = [];
    if (vectors.v1.x !== 0 || vectors.v1.y !== 0) nonZeroVectors.push(vectors.v1);
    if (vectors.v2.x !== 0 || vectors.v2.y !== 0) nonZeroVectors.push(vectors.v2);
    if (vectors.v3.x !== 0 || vectors.v3.y !== 0) nonZeroVectors.push(vectors.v3);
    
    const result = document.getElementById('independenceResult');
    
    if (nonZeroVectors.length === 0) {
        result.className = 'independence-result dependent';
        result.innerHTML = `
            <h4>All Zero Vectors</h4>
            <div class="independence-explanation">
                Zero vectors are always linearly dependent.
            </div>
        `;
        return;
    }
    
    if (nonZeroVectors.length === 1) {
        result.className = 'independence-result independent';
        result.innerHTML = `
            <h4>Linearly Independent</h4>
            <div class="independence-explanation">
                A single non-zero vector is always linearly independent.
            </div>
        `;
        updateDimensionDisplay(1);
        return;
    }
    
    if (nonZeroVectors.length === 2) {
        // Check if one is a scalar multiple of the other
        const v1 = nonZeroVectors[0];
        const v2 = nonZeroVectors[1];
        
        // Calculate cross product (determinant) for 2D
        const det = v1.x * v2.y - v1.y * v2.x;
        const isIndependent = Math.abs(det) > 0.001;
        
        result.className = `independence-result ${isIndependent ? 'independent' : 'dependent'}`;
        result.innerHTML = `
            <h4>Linearly ${isIndependent ? 'Independent' : 'Dependent'}</h4>
            <div class="independence-explanation">
                ${isIndependent ? 
                    'Vectors point in different directions - they span the entire 2D plane!' :
                    'One vector is a scalar multiple of the other - they lie on the same line.'}
                <br><strong>Determinant:</strong> ${det.toFixed(3)}
            </div>
        `;
        updateDimensionDisplay(isIndependent ? 2 : 1);
        return;
    }
    
    if (nonZeroVectors.length === 3) {
        // In 2D, any 3 vectors are automatically dependent
        result.className = 'independence-result dependent';
        result.innerHTML = `
            <h4>Linearly Dependent</h4>
            <div class="independence-explanation">
                In 2D space, any 3 or more vectors are automatically linearly dependent!
                Maximum independent vectors in ℝ² is 2.
            </div>
        `;
        updateDimensionDisplay(2);
    }
}

function updateDimensionDisplay(dim) {
    document.getElementById('dimensionDisplay').textContent = `Dimension of span: ${dim}`;
}

// 6. VECTOR MANIPULATION
function makeDependent() {
    // Make v2 a scalar multiple of v1
    const v1x = parseFloat(document.getElementById('v1_x').value) || 1;
    const v1y = parseFloat(document.getElementById('v1_y').value) || 1;
    
    document.getElementById('v2_x').value = (v1x * 2).toFixed(1);
    document.getElementById('v2_y').value = (v1y * 2).toFixed(1);
    document.getElementById('v3_x').value = 0;
    document.getElementById('v3_y').value = 0;
    
    drawIndependenceVisualization();
    checkIndependence();
}

function randomizeVectors() {
    document.getElementById('v1_x').value = (Math.random() * 6 - 3).toFixed(1);
    document.getElementById('v1_y').value = (Math.random() * 6 - 3).toFixed(1);
    document.getElementById('v2_x').value = (Math.random() * 6 - 3).toFixed(1);
    document.getElementById('v2_y').value = (Math.random() * 6 - 3).toFixed(1);
    document.getElementById('v3_x').value = (Math.random() * 2 - 1).toFixed(1);
    document.getElementById('v3_y').value = (Math.random() * 2 - 1).toFixed(1);
    
    drawIndependenceVisualization();
}

function resetVectors() {
    document.getElementById('v1_x').value = 2;
    document.getElementById('v1_y').value = 1;
    document.getElementById('v2_x').value = 1;
    document.getElementById('v2_y').value = 3;
    document.getElementById('v3_x').value = 0;
    document.getElementById('v3_y').value = 0;
    
    drawIndependenceVisualization();
    checkIndependence();
}

// 7. SPAN VISUALIZATION
function showSpan() {
    spanCtx.clearRect(0, 0, spanCanvas.width, spanCanvas.height);
    drawGrid(spanCtx, spanCanvas);
    drawAxes(spanCtx, spanCanvas);
    
    updateVectorValues();
    
    const centerX = spanCanvas.width / 2;
    const centerY = spanCanvas.height / 2;
    const scale = 30;
    
    // Get active vectors
    const activeVectors = [];
    if (vectors.v1.x !== 0 || vectors.v1.y !== 0) activeVectors.push(vectors.v1);
    if (vectors.v2.x !== 0 || vectors.v2.y !== 0) activeVectors.push(vectors.v2);
    
    if (activeVectors.length === 0) return;
    
    if (activeVectors.length === 1) {
        // Span is a line through origin
        const v = activeVectors[0];
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
        const unitX = v.x / length;
        const unitY = v.y / length;
        
        spanCtx.strokeStyle = 'rgba(255, 193, 7, 0.8)';
        spanCtx.lineWidth = 4;
        spanCtx.beginPath();
        spanCtx.moveTo(centerX - unitX * 200, centerY + unitY * 200);
        spanCtx.lineTo(centerX + unitX * 200, centerY - unitY * 200);
        spanCtx.stroke();
        
    } else if (activeVectors.length === 2) {
        // Check if independent
        const det = activeVectors[0].x * activeVectors[1].y - activeVectors[0].y * activeVectors[1].x;
        
        if (Math.abs(det) > 0.001) {
            // Independent - spans entire plane
            spanCtx.fillStyle = 'rgba(255, 193, 7, 0.3)';
            spanCtx.fillRect(0, 0, spanCanvas.width, spanCanvas.height);
            
            spanCtx.fillStyle = '#333';
            spanCtx.font = '16px Arial';
            spanCtx.textAlign = 'center';
            spanCtx.fillText('Spans entire 2D plane', centerX, 30);
        } else {
            // Dependent - same line
            const v = activeVectors[0];
            const length = Math.sqrt(v.x * v.x + v.y * v.y);
            const unitX = v.x / length;
            const unitY = v.y / length;
            
            spanCtx.strokeStyle = 'rgba(255, 193, 7, 0.8)';
            spanCtx.lineWidth = 4;
            spanCtx.beginPath();
            spanCtx.moveTo(centerX - unitX * 200, centerY + unitY * 200);
            spanCtx.lineTo(centerX + unitX * 200, centerY - unitY * 200);
            spanCtx.stroke();
        }
    }
    
    // Draw original vectors
    drawVector(spanCtx, spanCanvas, vectors.v1, '#ff6b6b', 'v₁');
    drawVector(spanCtx, spanCanvas, vectors.v2, '#4ecdc4', 'v₂');
}

function animateSpan() {
    showSpan();
    
    // Animate some linear combinations
    updateVectorValues();
    const activeVectors = [];
    if (vectors.v1.x !== 0 || vectors.v1.y !== 0) activeVectors.push(vectors.v1);
    if (vectors.v2.x !== 0 || vectors.v2.y !== 0) activeVectors.push(vectors.v2);
    
    if (activeVectors.length < 2) return;
    
    let step = 0;
    const maxSteps = 20;
    
    function animateStep() {
        if (step >= maxSteps) return;
        
        const t1 = Math.sin(step * 0.3) * 2;
        const t2 = Math.cos(step * 0.4) * 1.5;
        
        const combo = {
            x: t1 * activeVectors[0].x + t2 * activeVectors[1].x,
            y: t1 * activeVectors[0].y + t2 * activeVectors[1].y
        };
        
        drawVector(spanCtx, spanCanvas, combo, '#9C27B0', `${t1.toFixed(1)}v₁+${t2.toFixed(1)}v₂`);
        
        step++;
        setTimeout(animateStep, 300);
    }
    
    setTimeout(animateStep, 500);
}

function clearSpan() {
    spanCtx.clearRect(0, 0, spanCanvas.width, spanCanvas.height);
    drawGrid(spanCtx, spanCanvas);
    drawAxes(spanCtx, spanCanvas);
    
    drawVector(spanCtx, spanCanvas, vectors.v1, '#ff6b6b', 'v₁');
    drawVector(spanCtx, spanCanvas, vectors.v2, '#4ecdc4', 'v₂');
}

// 8. BASIS FUNCTIONS
function testBasis() {
    const b1x = parseFloat(document.getElementById('b1_x').value) || 0;
    const b1y = parseFloat(document.getElementById('b1_y').value) || 0;
    const b2x = parseFloat(document.getElementById('b2_x').value) || 0;
    const b2y = parseFloat(document.getElementById('b2_y').value) || 0;
    
    const det = b1x * b2y - b1y * b2x;
    const isValidBasis = Math.abs(det) > 0.001;
    
    const result = document.getElementById('basisResult');
    result.className = `basis-test-result ${isValidBasis ? 'valid-basis' : 'invalid-basis'}`;
    result.innerHTML = isValidBasis ? 
        `✓ Valid Basis for ℝ²<br>Determinant: ${det.toFixed(3)} ≠ 0<br>These vectors span all of 2D space!` :
        `✗ Not a Basis<br>Determinant: ${det.toFixed(3)} ≈ 0<br>Vectors are linearly dependent`;
}

function showStandardBasis() {
    document.getElementById('b1_x').value = 1;
    document.getElementById('b1_y').value = 0;
    document.getElementById('b2_x').value = 0;
    document.getElementById('b2_y').value = 1;
    testBasis();
}

function randomBasis() {
    // Generate random but valid basis
    const angle1 = Math.random() * 2 * Math.PI;
    const angle2 = angle1 + Math.PI/4 + Math.random() * Math.PI/2;
    
    document.getElementById('b1_x').value = Math.cos(angle1).toFixed(2);
    document.getElementById('b1_y').value = Math.sin(angle1).toFixed(2);
    document.getElementById('b2_x').value = Math.cos(angle2).toFixed(2);
    document.getElementById('b2_y').value = Math.sin(angle2).toFixed(2);
    testBasis();
}

// 9. 3D FUNCTIONS
function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x2a2a2a);
    document.getElementById('threeContainer').appendChild(renderer.domElement);
    
    // Add grid
    const gridHelper = new THREE.GridHelper(6, 6, 0x404040, 0x404040);
    scene.add(gridHelper);
    
    // Add axes
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
    
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 0, 0);
    
    // Add orbit controls simulation
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
    
    update3DVectors();
    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);
    renderer.render(scene, camera);
}

function update3DVectors() {
    // Clear existing vectors
    vectors3D.forEach(vector => scene.remove(vector));
    vectors3D = [];
    
    // Get vector values
    vectors3D_data.a.x = parseFloat(document.getElementById('v3d_a_x').value) || 0;
    vectors3D_data.a.y = parseFloat(document.getElementById('v3d_a_y').value) || 0;
    vectors3D_data.a.z = parseFloat(document.getElementById('v3d_a_z').value) || 0;
    
    vectors3D_data.b.x = parseFloat(document.getElementById('v3d_b_x').value) || 0;
    vectors3D_data.b.y = parseFloat(document.getElementById('v3d_b_y').value) || 0;
    vectors3D_data.b.z = parseFloat(document.getElementById('v3d_b_z').value) || 0;
    
    vectors3D_data.c.x = parseFloat(document.getElementById('v3d_c_x').value) || 0;
    vectors3D_data.c.y = parseFloat(document.getElementById('v3d_c_y').value) || 0;
    vectors3D_data.c.z = parseFloat(document.getElementById('v3d_c_z').value) || 0;
    
    // Create vector arrows
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1];
    const vectorData = [vectors3D_data.a, vectors3D_data.b, vectors3D_data.c];
    
    vectorData.forEach((vec, i) => {
        if (vec.x !== 0 || vec.y !== 0 || vec.z !== 0) {
            const direction = new THREE.Vector3(vec.x, vec.y, vec.z);
            const origin = new THREE.Vector3(0, 0, 0);
            const length = direction.length();
            
            if (length > 0) {
                const arrowHelper = new THREE.ArrowHelper(
                    direction.normalize(), 
                    origin, 
                    length, 
                    colors[i], 
                    length * 0.2, 
                    length * 0.1
                );
                scene.add(arrowHelper);
                vectors3D.push(arrowHelper);
            }
        }
    });
}

function check3DIndependence() {
    // For 3D independence, we need to check if the determinant of the 3x3 matrix is non-zero
    const a = vectors3D_data.a;
    const b = vectors3D_data.b;
    const c = vectors3D_data.c;
    
    // Calculate 3x3 determinant
    const det = a.x * (b.y * c.z - b.z * c.y) - 
                a.y * (b.x * c.z - b.z * c.x) + 
                a.z * (b.x * c.y - b.y * c.x);
    
    const isIndependent = Math.abs(det) > 0.001;
    
    const result = document.getElementById('independence3DResult');
    result.className = `independence-result ${isIndependent ? 'independent' : 'dependent'}`;
    result.innerHTML = `
        <h4>3D Vectors are ${isIndependent ? 'Independent' : 'Dependent'}</h4>
        <div class="independence-explanation">
            ${isIndependent ? 
                'These vectors span all of 3D space (ℝ³)!' :
                'These vectors are coplanar or collinear - they don\'t span all of ℝ³.'}
            <br><strong>Determinant:</strong> ${det.toFixed(3)}
            <br><strong>Dimension of span:</strong> ${isIndependent ? 3 : (det === 0 ? '< 3' : '?')}
        </div>
    `;
}

function randomize3D() {
    document.getElementById('v3d_a_x').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_a_y').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_a_z').value = (Math.random() * 4 - 2).toFixed(1);
    
    document.getElementById('v3d_b_x').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_b_y').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_b_z').value = (Math.random() * 4 - 2).toFixed(1);
    
    document.getElementById('v3d_c_x').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_c_y').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('v3d_c_z').value = (Math.random() * 4 - 2).toFixed(1);
    
    update3DVectors();
}

// 10. EXERCISE FUNCTIONS
function checkExercise1(userAnswer) {
    const correct = false; // (2,4) = 2*(1,2), so they're dependent
    
    if (userAnswer === correct) {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! (2,4) = 2×(1,2)</span>';
    } else {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. One is a scalar multiple of the other.</span>';
    }
}

function checkExercise2() {
    const userAnswer = parseInt(document.getElementById('ex2_dim').value);
    const correct = 2; // Standard basis vectors span ℝ²
    
    if (userAnswer === correct) {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! These are the standard basis vectors.</span>';
    } else {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Independent vectors span the full space.</span>';
    }
}

function checkExercise3() {
    const userAnswer = parseInt(document.getElementById('ex3_max').value);
    const correct = 3; // Dimension of ℝ³ is 3
    
    if (userAnswer === correct) {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! dim(ℝ³) = 3</span>';
    } else {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Maximum = dimension of the space.</span>';
    }
}

function checkExercise4(userAnswer) {
    const correct = 'line'; // Dependent vectors in ℝ² can span at most a line
    
    if (userAnswer === correct) {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! Dependent vectors can\'t span the full plane.</span>';
    } else {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Dependent vectors span less than the full space.</span>';
    }
}

function checkExercise5(userAnswer) {
    const correct = true; // Any 4 vectors in ℝ³ must be dependent
    
    if (userAnswer === correct) {
        document.getElementById('ex5_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! Cannot have more than 3 independent vectors in ℝ³.</span>';
    } else {
        document.getElementById('ex5_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Dimension limits the number of independent vectors.</span>';
    }
}

// 11. EVENT LISTENERS
function setupEventListeners() {
    // Add input listeners for real-time visualization updates
    ['v1_x', 'v1_y', 'v2_x', 'v2_y', 'v3_x', 'v3_y'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', drawIndependenceVisualization);
        }
    });
    
    ['b1_x', 'b1_y', 'b2_x', 'b2_y'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', testBasis);
        }
    });
    
    ['v3d_a_x', 'v3d_a_y', 'v3d_a_z', 'v3d_b_x', 'v3d_b_y', 'v3d_b_z', 'v3d_c_x', 'v3d_c_y', 'v3d_c_z'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', update3DVectors);
        }
    });
}

// 12. INITIALIZATION
window.addEventListener('load', function() {
    // Check if canvases exist before initializing
    if (indCanvas && spanCanvas) {
        drawIndependenceVisualization();
        checkIndependence();
    }
    
    testBasis();
    setupEventListeners();
    
    // Initialize 3D scene if container exists
    const threeContainer = document.getElementById('threeContainer');
    if (threeContainer) {
        init3D();
    }
});
