// === DOT PRODUCTS & ORTHOGONALITY INTERACTIVE SCRIPT ===

// 1. GLOBAL VARIABLES
// Canvas setup for dot product visualization
const dotCanvas = document.getElementById('dotProductCanvas');
const dotCtx = dotCanvas.getContext('2d');
const dotCenterX = dotCanvas.width / 2;
const dotCenterY = dotCanvas.height / 2;
const dotScale = 25;

// Canvas setup for projection visualization
const projCanvas = document.getElementById('projectionCanvas');
const projCtx = projCanvas.getContext('2d');
const projCenterX = projCanvas.width / 2;
const projCenterY = projCanvas.height / 2;
const projScale = 25;

// Vector data and interaction state
let dotVectorA = { x: 4, y: 2 };
let dotVectorB = { x: 2, y: 3 };
let showProjectionMode = false;
let projectionDirection = 'A_onto_B'; // or 'B_onto_A'
let isDragging = false;
let dragTarget = null;

// 2. UTILITY FUNCTIONS
function calculateMagnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

function calculateDotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function calculateAngle(v1, v2) {
    const dotProduct = calculateDotProduct(v1, v2);
    const mag1 = calculateMagnitude(v1);
    const mag2 = calculateMagnitude(v2);
    const cosTheta = dotProduct / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI;
}

function calculateProjection(vectorA, vectorB, direction = 'A_onto_B') {
    if (direction === 'A_onto_B') {
        const dotProduct = calculateDotProduct(vectorA, vectorB);
        const bMagnitudeSquared = vectorB.x * vectorB.x + vectorB.y * vectorB.y;
        const scalar = dotProduct / bMagnitudeSquared;
        return { 
            x: scalar * vectorB.x, 
            y: scalar * vectorB.y,
            scalarProjection: dotProduct / calculateMagnitude(vectorB)
        };
    } else {
        const dotProduct = calculateDotProduct(vectorA, vectorB);
        const aMagnitudeSquared = vectorA.x * vectorA.x + vectorA.y * vectorA.y;
        const scalar = dotProduct / aMagnitudeSquared;
        return { 
            x: scalar * vectorA.x, 
            y: scalar * vectorA.y,
            scalarProjection: dotProduct / calculateMagnitude(vectorA)
        };
    }
}

// 3. DRAWING FUNCTIONS
function drawGrid(ctx, canvas, centerX, centerY, scale) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    for (let i = -10; i <= 10; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY - i * scale);
        ctx.lineTo(canvas.width, centerY - i * scale);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
}

function drawAxes(ctx, canvas, centerX, centerY) {
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
}

function drawVector(ctx, vector, color, label, centerX, centerY, scale, offset = { x: 0, y: 0 }) {
    const startX = centerX + offset.x * scale;
    const startY = centerY - offset.y * scale;
    const endX = startX + vector.x * scale;
    const endY = startY - vector.y * scale;
    
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

function drawAngleArc(ctx, vectorA, vectorB, centerX, centerY, scale) {
    const angleA = Math.atan2(-vectorA.y, vectorA.x);
    const angleB = Math.atan2(-vectorB.y, vectorB.x);
    
    let startAngle = Math.min(angleA, angleB);
    let endAngle = Math.max(angleA, angleB);
    
    // Handle angle wrap-around
    if (endAngle - startAngle > Math.PI) {
        [startAngle, endAngle] = [endAngle, startAngle + 2 * Math.PI];
    }
    
    const arcRadius = 30;
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle);
    ctx.stroke();
    
    // Draw angle label
    const midAngle = (startAngle + endAngle) / 2;
    const labelX = centerX + Math.cos(midAngle) * (arcRadius + 15);
    const labelY = centerY - Math.sin(midAngle) * (arcRadius + 15);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const angle = Math.abs(endAngle - startAngle) * 180 / Math.PI;
    ctx.fillText(`${angle.toFixed(1)}°`, labelX, labelY);
    ctx.textAlign = 'left';
}

// 4. VISUALIZATION FUNCTIONS
function drawDotProductVisualization() {
    dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
    drawGrid(dotCtx, dotCanvas, dotCenterX, dotCenterY, dotScale);
    drawAxes(dotCtx, dotCanvas, dotCenterX, dotCenterY);
    
    // Draw vectors
    const aPos = drawVector(dotCtx, dotVectorA, '#ff6b6b', 'A', dotCenterX, dotCenterY, dotScale);
    const bPos = drawVector(dotCtx, dotVectorB, '#4ecdc4', 'B', dotCenterX, dotCenterY, dotScale);
    
    // Draw angle arc
    drawAngleArc(dotCtx, dotVectorA, dotVectorB, dotCenterX, dotCenterY, dotScale);
    
    return { aPos, bPos };
}

function drawProjectionVisualization() {
    projCtx.clearRect(0, 0, projCanvas.width, projCanvas.height);
    drawGrid(projCtx, projCanvas, projCenterX, projCenterY, projScale);
    drawAxes(projCtx, projCanvas, projCenterX, projCenterY);
    
    // Draw original vectors
    drawVector(projCtx, dotVectorA, '#ff6b6b', 'A', projCenterX, projCenterY, projScale);
    drawVector(projCtx, dotVectorB, '#4ecdc4', 'B', projCenterX, projCenterY, projScale);
    
    // Calculate and draw projection
    const projection = calculateProjection(dotVectorA, dotVectorB, projectionDirection);
    const projColor = '#9c27b0';
    const projLabel = projectionDirection === 'A_onto_B' ? 'proj_B(A)' : 'proj_A(B)';
    
    // Draw projection vector
    drawVector(projCtx, projection, projColor, projLabel, projCenterX, projCenterY, projScale);
    
    // Draw projection lines (dotted)
    projCtx.strokeStyle = 'rgba(156, 39, 176, 0.5)';
    projCtx.lineWidth = 2;
    projCtx.setLineDash([5, 5]);
    
    if (projectionDirection === 'A_onto_B') {
        const projEndX = projCenterX + projection.x * projScale;
        const projEndY = projCenterY - projection.y * projScale;
        const aEndX = projCenterX + dotVectorA.x * projScale;
        const aEndY = projCenterY - dotVectorA.y * projScale;
        
        projCtx.beginPath();
        projCtx.moveTo(projEndX, projEndY);
        projCtx.lineTo(aEndX, aEndY);
        projCtx.stroke();
    } else {
        const projEndX = projCenterX + projection.x * projScale;
        const projEndY = projCenterY - projection.y * projScale;
        const bEndX = projCenterX + dotVectorB.x * projScale;
        const bEndY = projCenterY - dotVectorB.y * projScale;
        
        projCtx.beginPath();
        projCtx.moveTo(projEndX, projEndY);
        projCtx.lineTo(bEndX, bEndY);
        projCtx.stroke();
    }
    
    projCtx.setLineDash([]);
}

// 5. UPDATE FUNCTIONS
function updateDotProductDisplays() {
    const dotProduct = calculateDotProduct(dotVectorA, dotVectorB);
    const magA = calculateMagnitude(dotVectorA);
    const magB = calculateMagnitude(dotVectorB);
    const theta = calculateAngle(dotVectorA, dotVectorB);
    
    // Update vector displays
    document.querySelector('.control-group:nth-child(1) .vector-display:nth-child(4)').textContent = `A = (${dotVectorA.x.toFixed(1)}, ${dotVectorA.y.toFixed(1)})`;
    document.querySelector('.control-group:nth-child(1) .vector-display:nth-child(5)').textContent = `|A| = ${magA.toFixed(2)}`;
    document.querySelector('.control-group:nth-child(2) .vector-display:nth-child(4)').textContent = `B = (${dotVectorB.x.toFixed(1)}, ${dotVectorB.y.toFixed(1)})`;
    document.querySelector('.control-group:nth-child(2) .vector-display:nth-child(5)').textContent = `|B| = ${magB.toFixed(2)}`;
    
    // Update calculation displays
    document.getElementById('dotProductResult').textContent = `A · B = ${dotVectorA.x}×${dotVectorB.x} + ${dotVectorA.y}×${dotVectorB.y} = ${dotProduct.toFixed(2)}`;
    document.getElementById('angleResult').textContent = `Angle = ${theta.toFixed(2)}°`;
    
    // Orthogonality check
    const isOrthogonal = Math.abs(dotProduct) < 0.01;
    document.getElementById('orthogonalStatus').textContent = isOrthogonal ? 
        'Vectors are ORTHOGONAL! ⊥' : 'Vectors are NOT orthogonal';
    document.getElementById('orthogonalStatus').style.background = isOrthogonal ? 
        'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.2)';
    
    // Update projection info
    updateProjectionDisplay();
}

function updateProjectionDisplay() {
    const projection = calculateProjection(dotVectorA, dotVectorB, 'A_onto_B');
    
    document.getElementById('projectionInfo').innerHTML = `
        <strong>Projection of A onto B:</strong><br>
        proj_B(A) = [(A·B)/|B|²] × B<br>
        Scalar projection = A·B/|B| = ${projection.scalarProjection.toFixed(2)}<br>
        Vector projection = (${projection.x.toFixed(2)}, ${projection.y.toFixed(2)})
    `;
}

// 6. INTERACTION FUNCTIONS
function showProjection() {
    showProjectionMode = !showProjectionMode;
    if (showProjectionMode) {
        drawProjectionVisualization();
    } else {
        drawDotProductVisualization();
    }
}

function makeOrthogonal() {
    // Make B orthogonal to A by setting B to (-A.y, A.x)
    dotVectorB.x = -dotVectorA.y;
    dotVectorB.y = dotVectorA.x;
    
    document.getElementById('dotVectorB_x').value = dotVectorB.x.toFixed(1);
    document.getElementById('dotVectorB_y').value = dotVectorB.y.toFixed(1);
    
    updateDotProductDisplays();
    drawDotProductVisualization();
}

function makeParallel() {
    // Make B parallel to A
    const ratio = calculateMagnitude(dotVectorB) / calculateMagnitude(dotVectorA);
    
    dotVectorB.x = dotVectorA.x * ratio;
    dotVectorB.y = dotVectorA.y * ratio;
    
    document.getElementById('dotVectorB_x').value = dotVectorB.x.toFixed(1);
    document.getElementById('dotVectorB_y').value = dotVectorB.y.toFixed(1);
    
    updateDotProductDisplays();
    drawDotProductVisualization();
}

function resetDotVectors() {
    dotVectorA = { x: 4, y: 2 };
    dotVectorB = { x: 2, y: 3 };
    
    document.getElementById('dotVectorA_x').value = dotVectorA.x;
    document.getElementById('dotVectorA_y').value = dotVectorA.y;
    document.getElementById('dotVectorB_x').value = dotVectorB.x;
    document.getElementById('dotVectorB_y').value = dotVectorB.y;
    
    updateDotProductDisplays();
    drawDotProductVisualization();
}

function toggleProjectionDirection() {
    projectionDirection = projectionDirection === 'A_onto_B' ? 'B_onto_A' : 'A_onto_B';
    drawProjectionVisualization();
    updateProjectionDisplay();
}

function showUnitVectors() {
    const magA = calculateMagnitude(dotVectorA);
    const magB = calculateMagnitude(dotVectorB);
    
    const unitA = { x: dotVectorA.x / magA, y: dotVectorA.y / magA };
    const unitB = { x: dotVectorB.x / magB, y: dotVectorB.y / magB };
    
    alert(`Unit vector A: (${unitA.x.toFixed(3)}, ${unitA.y.toFixed(3)})\nUnit vector B: (${unitB.x.toFixed(3)}, ${unitB.y.toFixed(3)})\nDot product of unit vectors: ${calculateDotProduct(unitA, unitB).toFixed(3)}`);
}

function testOrthogonality() {
    const v1x = parseFloat(document.getElementById('orth_v1_x').value) || 0;
    const v1y = parseFloat(document.getElementById('orth_v1_y').value) || 0;
    const v2x = parseFloat(document.getElementById('orth_v2_x').value) || 0;
    const v2y = parseFloat(document.getElementById('orth_v2_y').value) || 0;
    
    const dotProduct = v1x * v2x + v1y * v2y;
    const isOrthogonal = Math.abs(dotProduct) < 0.01;
    
    document.getElementById('orthTestResult').textContent = isOrthogonal ? 
        `Dot product = ${dotProduct.toFixed(2)} → Vectors are ORTHOGONAL! ⊥` :
        `Dot product = ${dotProduct.toFixed(2)} → Vectors are NOT orthogonal`;
    
    document.getElementById('orthTestResult').style.background = isOrthogonal ? 
        'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.2)';
}

// 7. EXERCISE FUNCTIONS
function checkExercise1() {
    const userAnswer = parseFloat(document.getElementById('ex1_dot').value);
    const correct = 3 * 1 + (-2) * 4; // = -5
    
    if (Math.abs(userAnswer - correct) < 0.1) {
        document.getElementById('ex1_result').innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        document.getElementById('ex1_result').innerHTML = ' <span style="color: #f44336;">✗ Try again (hint: 3×1 + (-2)×4)</span>';
    }
}

function checkExercise2() {
    const userX = parseFloat(document.getElementById('ex2_x').value);
    const userY = parseFloat(document.getElementById('ex2_y').value);
    
    // Check if dot product with (2,3) equals zero
    const dotProduct = 2 * userX + 3 * userY;
    
    if (Math.abs(dotProduct) < 0.1) {
        document.getElementById('ex2_result').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! (Many answers possible)</span>';
    } else {
        document.getElementById('ex2_result').innerHTML = ' <span style="color: #f44336;">✗ Try again (hint: 2x + 3y = 0)</span>';
    }
}

function checkExercise3() {
    const userAnswer = parseFloat(document.getElementById('ex3_dot').value);
    const correct = 5 * 3 * Math.cos(60 * Math.PI / 180); // = 7.5
    
    if (Math.abs(userAnswer - correct) < 0.1) {
        document.getElementById('ex3_result').innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        document.getElementById('ex3_result').innerHTML = ' <span style="color: #f44336;">✗ Try again (hint: cos(60°) = 0.5)</span>';
    }
}

function checkExercise4() {
    const userAnswer = parseFloat(document.getElementById('ex4_angle').value);
    const correct = 45; // angle between (1,0) and (1,1) is 45°
    
    if (Math.abs(userAnswer - correct) < 1) {
        document.getElementById('ex4_result').innerHTML = ' <span style="color: #4CAF50;">✓ Correct!</span>';
    } else {
        document.getElementById('ex4_result').innerHTML = ' <span style="color: #f44336;">✗ Try again (hint: use arccos(dot product / (|a||b|)))</span>';
    }
}

// 8. MOUSE INTERACTION FUNCTIONS
function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function isNearPoint(mousePos, pointX, pointY, threshold = 15) {
    const dx = mousePos.x - pointX;
    const dy = mousePos.y - pointY;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
}

// 9. EVENT LISTENERS
function setupEventListeners() {
    // Input field listeners for vector components
    document.getElementById('dotVectorA_x').addEventListener('input', function() {
        dotVectorA.x = parseFloat(this.value) || 0;
        updateDotProductDisplays();
        drawDotProductVisualization();
    });
    
    document.getElementById('dotVectorA_y').addEventListener('input', function() {
        dotVectorA.y = parseFloat(this.value) || 0;
        updateDotProductDisplays();
        drawDotProductVisualization();
    });
    
    document.getElementById('dotVectorB_x').addEventListener('input', function() {
        dotVectorB.x = parseFloat(this.value) || 0;
        updateDotProductDisplays();
        drawDotProductVisualization();
    });
    
    document.getElementById('dotVectorB_y').addEventListener('input', function() {
        dotVectorB.y = parseFloat(this.value) || 0;
        updateDotProductDisplays();
        drawDotProductVisualization();
    });
    
    // Canvas drag interaction
    dotCanvas.addEventListener('mousedown', function(e) {
        const mousePos = getMousePos(dotCanvas, e);
        
        const aEndX = dotCenterX + dotVectorA.x * dotScale;
        const aEndY = dotCenterY - dotVectorA.y * dotScale;
        const bEndX = dotCenterX + dotVectorB.x * dotScale;
        const bEndY = dotCenterY - dotVectorB.y * dotScale;
        
        if (isNearPoint(mousePos, aEndX, aEndY)) {
            isDragging = true;
            dragTarget = 'A';
        } else if (isNearPoint(mousePos, bEndX, bEndY)) {
            isDragging = true;
            dragTarget = 'B';
        }
    });
    
    dotCanvas.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const mousePos = getMousePos(dotCanvas, e);
        const vectorX = (mousePos.x - dotCenterX) / dotScale;
        const vectorY = -(mousePos.y - dotCenterY) / dotScale;
        
        if (dragTarget === 'A') {
            dotVectorA.x = vectorX;
            dotVectorA.y = vectorY;
            document.getElementById('dotVectorA_x').value = vectorX.toFixed(1);
            document.getElementById('dotVectorA_y').value = vectorY.toFixed(1);
        } else if (dragTarget === 'B') {
            dotVectorB.x = vectorX;
            dotVectorB.y = vectorY;
            document.getElementById('dotVectorB_x').value = vectorX.toFixed(1);
            document.getElementById('dotVectorB_y').value = vectorY.toFixed(1);
        }
        
        updateDotProductDisplays();
        drawDotProductVisualization();
    });
    
    dotCanvas.addEventListener('mouseup', function() {
        isDragging = false;
        dragTarget = null;
    });
}

// 10. INITIALIZATION
window.addEventListener('load', function() {
    setupEventListeners();
    updateDotProductDisplays();
    drawDotProductVisualization();
    testOrthogonality();
});
