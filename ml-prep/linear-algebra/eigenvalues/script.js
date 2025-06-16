// === EIGENVALUES & EIGENVECTORS INTERACTIVE SCRIPT ===

// Current matrix values
let currentMatrix = [[3, 1], [0, 2]];
let eigenvalues = [];
let eigenvectors = [];
let dataPoints = [];
let pcaComponents = [];

// Canvas contexts
const transformCanvas = document.getElementById('transformationCanvas');
const transformCtx = transformCanvas.getContext('2d');
const pcaCanvas = document.getElementById('pcaCanvas');
const pcaCtx = pcaCanvas.getContext('2d');

function updateMatrix() {
    currentMatrix[0][0] = parseFloat(document.getElementById('a11').value) || 0;
    currentMatrix[0][1] = parseFloat(document.getElementById('a12').value) || 0;
    currentMatrix[1][0] = parseFloat(document.getElementById('a21').value) || 0;
    currentMatrix[1][1] = parseFloat(document.getElementById('a22').value) || 0;
}

function calculateEigenvalues() {
    updateMatrix();
    const a = currentMatrix[0][0];
    const b = currentMatrix[0][1];
    const c = currentMatrix[1][0];
    const d = currentMatrix[1][1];
    
    // Characteristic polynomial: λ² - (a+d)λ + (ad-bc) = 0
    const trace = a + d;
    const det = a * d - b * c;
    
    // Quadratic formula
    const discriminant = trace * trace - 4 * det;
    
    if (discriminant >= 0) {
        const sqrtDisc = Math.sqrt(discriminant);
        eigenvalues = [
            (trace + sqrtDisc) / 2,
            (trace - sqrtDisc) / 2
        ];
    } else {
        eigenvalues = [
            { real: trace / 2, imag: Math.sqrt(-discriminant) / 2 },
            { real: trace / 2, imag: -Math.sqrt(-discriminant) / 2 }
        ];
    }
    
    displayEigenvalues();
}

function displayEigenvalues() {
    const result = document.getElementById('eigenResults');
    
    let content = '<h4>Eigenvalue Analysis</h4>';
    
    if (typeof eigenvalues[0] === 'number') {
        content += `
            <div class="eigenvalue-item">
                <strong>λ₁ = ${eigenvalues[0].toFixed(3)}</strong><br>
                Scaling factor for first eigenvector
            </div>
            <div class="eigenvalue-item">
                <strong>λ₂ = ${eigenvalues[1].toFixed(3)}</strong><br>
                Scaling factor for second eigenvector
            </div>
        `;
        
        const a = currentMatrix[0][0];
        const d = currentMatrix[1][1];
        const det = currentMatrix[0][0] * currentMatrix[1][1] - currentMatrix[0][1] * currentMatrix[1][0];
        
        content += `
            <div class="eigenvalue-item">
                <strong>Verification:</strong><br>
                Trace = λ₁ + λ₂ = ${(eigenvalues[0] + eigenvalues[1]).toFixed(3)} = ${(a + d).toFixed(3)} ✓<br>
                Det = λ₁ × λ₂ = ${(eigenvalues[0] * eigenvalues[1]).toFixed(3)} = ${det.toFixed(3)} ✓
            </div>
        `;
    } else {
        content += `
            <div class="eigenvalue-item">
                <strong>Complex Eigenvalues</strong><br>
                λ₁ = ${eigenvalues[0].real.toFixed(3)} + ${eigenvalues[0].imag.toFixed(3)}i<br>
                λ₂ = ${eigenvalues[1].real.toFixed(3)} + ${eigenvalues[1].imag.toFixed(3)}i<br>
                This matrix causes rotation + scaling!
            </div>
        `;
    }
    
    result.innerHTML = content;
}

function calculateEigenvectors() {
    calculateEigenvalues();
    
    if (typeof eigenvalues[0] !== 'number') {
        alert('Complex eigenvalues detected! Eigenvectors would be complex.');
        return;
    }
    
    eigenvectors = [];
    
    eigenvalues.forEach((lambda, i) => {
        // Solve (A - λI)v = 0
        const a = currentMatrix[0][0] - lambda;
        const b = currentMatrix[0][1];
        const c = currentMatrix[1][0];
        const d = currentMatrix[1][1] - lambda;
        
        let v;
        if (Math.abs(b) > 0.001) {
            // Use first row: (a-λ)x + by = 0, so y = -(a-λ)x/b
            v = [1, -a / b];
        } else if (Math.abs(c) > 0.001) {
            // Use second row: cx + (d-λ)y = 0, so x = -(d-λ)y/c
            v = [-d / c, 1];
        } else {
            // Special case - likely identity or scaled identity
            v = i === 0 ? [1, 0] : [0, 1];
        }
        
        // Normalize
        const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        v = [v[0] / norm, v[1] / norm];
        
        eigenvectors.push(v);
    });
    
    displayEigenvectors();
    drawTransformationVisualization();
}

function displayEigenvectors() {
    const result = document.getElementById('eigenResults');
    let content = result.innerHTML;
    
    content += '<h4 style="margin-top: 20px; color: #9C27B0;">Eigenvectors</h4>';
    
    eigenvectors.forEach((v, i) => {
        content += `
            <div class="eigenvalue-item">
                <strong>v₁${i+1} = [${v[0].toFixed(3)}, ${v[1].toFixed(3)}]</strong><br>
                Direction unchanged by transformation (scaled by λ${i+1})
            </div>
        `;
    });
    
    result.innerHTML = content;
}

function drawGrid(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 40;
    
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
}

function drawVector(ctx, canvas, vector, color, label, scale = 40) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const endX = centerX + vector[0] * scale;
    const endY = centerY - vector[1] * scale;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Arrowhead
    const angle = Math.atan2(-vector[1], vector[0]);
    const arrowLength = 8;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI/6), endY + arrowLength * Math.sin(angle - Math.PI/6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI/6), endY + arrowLength * Math.sin(angle + Math.PI/6));
    ctx.stroke();
    
    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.fillText(label, endX + 5, endY - 5);
}

function drawTransformationVisualization() {
    transformCtx.clearRect(0, 0, transformCanvas.width, transformCanvas.height);
    drawGrid(transformCtx, transformCanvas);
    drawAxes(transformCtx, transformCanvas);
    
    // Draw unit grid vectors
    drawVector(transformCtx, transformCanvas, [1, 0], '#4ecdc4', 'i', 40);
    drawVector(transformCtx, transformCanvas, [0, 1], '#45b7d1', 'j', 40);
    
    // Draw some test vectors
    const testVectors = [[1, 1], [2, 0.5], [0.5, 2]];
    testVectors.forEach((v, i) => {
        drawVector(transformCtx, transformCanvas, v, '#999', `v${i+1}`, 40);
    });
    
    // Highlight eigenvectors if calculated
    if (eigenvectors.length > 0) {
        eigenvectors.forEach((v, i) => {
            drawVector(transformCtx, transformCanvas, v, '#ff6b6b', `e${i+1}`, 40);
        });
    }
}

function showTransformation() {
    if (eigenvectors.length === 0) {
        calculateEigenvectors();
    }
    
    transformCtx.clearRect(0, 0, transformCanvas.width, transformCanvas.height);
    drawGrid(transformCtx, transformCanvas);
    drawAxes(transformCtx, transformCanvas);
    
    // Draw transformed vectors
    const testVectors = [[1, 0], [0, 1], [1, 1], [2, 0.5]];
    
    testVectors.forEach((v, i) => {
        // Apply transformation: Av
        const transformed = [
            currentMatrix[0][0] * v[0] + currentMatrix[0][1] * v[1],
            currentMatrix[1][0] * v[0] + currentMatrix[1][1] * v[1]
        ];
        
        // Draw original (light)
        drawVector(transformCtx, transformCanvas, v, 'rgba(150, 150, 150, 0.5)', '', 40);
        
        // Draw transformed (bold)
        drawVector(transformCtx, transformCanvas, transformed, '#2196F3', `Av${i+1}`, 40);
    });
    
    // Show eigenvectors and their transformations
    if (eigenvectors.length > 0 && eigenvalues.length > 0) {
        eigenvectors.forEach((v, i) => {
            if (typeof eigenvalues[i] === 'number') {
                const scaledEigenvector = [v[0] * eigenvalues[i], v[1] * eigenvalues[i]];
                
                // Original eigenvector
                drawVector(transformCtx, transformCanvas, v, '#ff6b6b', `e${i+1}`, 40);
                
                // Scaled eigenvector
                drawVector(transformCtx, transformCanvas, scaledEigenvector, '#ff0000', `λ${i+1}e${i+1}`, 40);
            }
        });
    }
}

function animateTransformation() {
    let progress = 0;
    const maxProgress = 1;
    const speed = 0.02;
    
    function animate() {
        if (progress > maxProgress) return;
        
        transformCtx.clearRect(0, 0, transformCanvas.width, transformCanvas.height);
        drawGrid(transformCtx, transformCanvas);
        drawAxes(transformCtx, transformCanvas);
        
        const testVectors = [[1, 0], [0, 1], [1, 1]];
        
        testVectors.forEach((v, i) => {
            // Interpolate between original and transformed
            const transformed = [
                currentMatrix[0][0] * v[0] + currentMatrix[0][1] * v[1],
                currentMatrix[1][0] * v[0] + currentMatrix[1][1] * v[1]
            ];
            
            const current = [
                v[0] + progress * (transformed[0] - v[0]),
                v[1] + progress * (transformed[1] - v[1])
            ];
            
            drawVector(transformCtx, transformCanvas, current, '#2196F3', `v${i+1}`, 40);
        });
        
        progress += speed;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function resetTransformation() {
    drawTransformationVisualization();
}

function showEigenvectors() {
    if (eigenvectors.length === 0) {
        calculateEigenvectors();
    }
    
    transformCtx.clearRect(0, 0, transformCanvas.width, transformCanvas.height);
    drawGrid(transformCtx, transformCanvas);
    drawAxes(transformCtx, transformCanvas);
    
    // Emphasize eigenvectors
    if (eigenvectors.length > 0) {
        eigenvectors.forEach((v, i) => {
            // Draw extended line through eigenvector
            const scale = 150;
            transformCtx.strokeStyle = '#ff6b6b';
            transformCtx.lineWidth = 2;
            transformCtx.setLineDash([5, 5]);
            
            transformCtx.beginPath();
            transformCtx.moveTo(transformCanvas.width/2 - v[0] * scale, transformCanvas.height/2 + v[1] * scale);
            transformCtx.lineTo(transformCanvas.width/2 + v[0] * scale, transformCanvas.height/2 - v[1] * scale);
            transformCtx.stroke();
            
            transformCtx.setLineDash([]);
            
            // Draw eigenvector
            drawVector(transformCtx, transformCanvas, v, '#ff0000', `e${i+1} (λ=${eigenvalues[i]?.toFixed(2)})`, 40);
        });
    }
}

function generateData() {
    const spreadX = parseFloat(document.getElementById('spreadX').value);
    const spreadY = parseFloat(document.getElementById('spreadY').value);
    const correlation = parseFloat(document.getElementById('correlation').value);
    
    document.getElementById('spreadXValue').textContent = spreadX.toFixed(1);
    document.getElementById('spreadYValue').textContent = spreadY.toFixed(1);
    document.getElementById('correlationValue').textContent = correlation.toFixed(1);
    
    dataPoints = [];
    const numPoints = 50;
    
    for (let i = 0; i < numPoints; i++) {
        // Generate correlated Gaussian data
        const u1 = Math.random();
        const u2 = Math.random();
        
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        
        const x = z1 * spreadX;
        const y = correlation * z1 + Math.sqrt(1 - correlation * correlation) * z2;
        
        dataPoints.push([x, y * spreadY]);
    }
    
    drawPCAVisualization();
}

function drawPCAVisualization() {
    pcaCtx.clearRect(0, 0, pcaCanvas.width, pcaCanvas.height);
    drawGrid(pcaCtx, pcaCanvas);
    drawAxes(pcaCtx, pcaCanvas);
    
    // Draw data points
    const centerX = pcaCanvas.width / 2;
    const centerY = pcaCanvas.height / 2;
    const scale = 40;
    
    pcaCtx.fillStyle = '#2196F3';
    dataPoints.forEach(point => {
        const x = centerX + point[0] * scale;
        const y = centerY - point[1] * scale;
        
        pcaCtx.beginPath();
        pcaCtx.arc(x, y, 3, 0, 2 * Math.PI);
        pcaCtx.fill();
    });
}

function runPCA() {
    if (dataPoints.length === 0) {
        generateData();
    }
    
    // Center the data
    const meanX = dataPoints.reduce((sum, p) => sum + p[0], 0) / dataPoints.length;
    const meanY = dataPoints.reduce((sum, p) => sum + p[1], 0) / dataPoints.length;
    
    const centeredData = dataPoints.map(p => [p[0] - meanX, p[1] - meanY]);
    
    // Compute covariance matrix
    let cxx = 0, cxy = 0, cyy = 0;
    centeredData.forEach(p => {
        cxx += p[0] * p[0];
        cxy += p[0] * p[1];
        cyy += p[1] * p[1];
    });
    
    const n = centeredData.length - 1;
    cxx /= n;
    cxy /= n;
    cyy /= n;
    
    // Find eigenvalues of covariance matrix
    const trace = cxx + cyy;
    const det = cxx * cyy - cxy * cxy;
    const discriminant = trace * trace - 4 * det;
    
    const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    
    // Find eigenvectors
    let v1, v2;
    if (Math.abs(cxy) > 0.001) {
        v1 = [1, (lambda1 - cxx) / cxy];
        v2 = [1, (lambda2 - cxx) / cxy];
    } else {
        v1 = [1, 0];
        v2 = [0, 1];
    }
    
    // Normalize eigenvectors
    const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
    v1 = [v1[0] / norm1, v1[1] / norm1];
    v2 = [v2[0] / norm2, v2[1] / norm2];
    
    pcaComponents = [
        { vector: v1, eigenvalue: lambda1 },
        { vector: v2, eigenvalue: lambda2 }
    ];
    
    // Draw PCA results
    drawPCAVisualization();
    
    // Draw principal components
    const scale = 40;
    pcaComponents.forEach((pc, i) => {
        const scaledVector = [
            pc.vector[0] * Math.sqrt(pc.eigenvalue) * 2,
            pc.vector[1] * Math.sqrt(pc.eigenvalue) * 2
        ];
        
        drawVector(pcaCtx, pcaCanvas, scaledVector, i === 0 ? '#ff6b6b' : '#ff9800', `PC${i+1}`, scale);
    });
    
    // Display results
    const totalVariance = lambda1 + lambda2;
    const variance1 = (lambda1 / totalVariance * 100).toFixed(1);
    const variance2 = (lambda2 / totalVariance * 100).toFixed(1);
    
    document.getElementById('pcaResults').innerHTML = `
        <strong>PCA Results:</strong><br>
        PC1: ${variance1}% variance (λ = ${lambda1.toFixed(3)})<br>
        PC2: ${variance2}% variance (λ = ${lambda2.toFixed(3)})<br>
        PC1 direction: [${v1[0].toFixed(3)}, ${v1[1].toFixed(3)}]<br>
        PC2 direction: [${v2[0].toFixed(3)}, ${v2[1].toFixed(3)}]
    `;
}

function projectData() {
    if (pcaComponents.length === 0) {
        runPCA();
    }
    
    // Project all data points onto PC1
    const pc1 = pcaComponents[0].vector;
    
    // Center the data first
    const meanX = dataPoints.reduce((sum, p) => sum + p[0], 0) / dataPoints.length;
    const meanY = dataPoints.reduce((sum, p) => sum + p[1], 0) / dataPoints.length;
    
    drawPCAVisualization();
    
    // Draw PC1 axis
    drawVector(pcaCtx, pcaCanvas, [pc1[0] * 3, pc1[1] * 3], '#ff6b6b', 'PC1', 40);
    
    // Project and draw projected points
    pcaCtx.fillStyle = '#4CAF50';
    dataPoints.forEach(point => {
        const centered = [point[0] - meanX, point[1] - meanY];
        
        // Project onto PC1
        const projection = (centered[0] * pc1[0] + centered[1] * pc1[1]);
        const projectedPoint = [projection * pc1[0], projection * pc1[1]];
        
        const x = pcaCanvas.width/2 + projectedPoint[0] * 40;
        const y = pcaCanvas.height/2 - projectedPoint[1] * 40;
        
        pcaCtx.beginPath();
        pcaCtx.arc(x, y, 3, 0, 2 * Math.PI);
        pcaCtx.fill();
    });
}

function clearPCA() {
    pcaCtx.clearRect(0, 0, pcaCanvas.width, pcaCanvas.height);
    drawGrid(pcaCtx, pcaCanvas);
    drawAxes(pcaCtx, pcaCanvas);
    
    document.getElementById('pcaResults').innerHTML = `
        <strong>PCA Results:</strong><br>
        Click "Generate Data" then "Run PCA" to analyze principal components.
    `;
}

function showDetailedCalculation() {
    updateMatrix();
    const a = currentMatrix[0][0];
    const b = currentMatrix[0][1];
    const c = currentMatrix[1][0];
    const d = currentMatrix[1][1];
    
    const content = `
        <h4>Step-by-Step Calculation for Current Matrix</h4>
        <div class="eigenvalue-item">
            <strong>Matrix A = [${a}, ${b}; ${c}, ${d}]</strong>
        </div>
        <div class="eigenvalue-item">
            <strong>Step 1:</strong> Characteristic equation<br>
            det(A - λI) = det([${a}-λ, ${b}; ${c}, ${d}-λ]) = 0
        </div>
        <div class="eigenvalue-item">
            <strong>Step 2:</strong> Expand determinant<br>
            (${a}-λ)(${d}-λ) - (${b})(${c}) = 0<br>
            λ² - ${a+d}λ + ${a*d - b*c} = 0
        </div>
        <div class="eigenvalue-item">
            <strong>Step 3:</strong> Solve using quadratic formula<br>
            λ = [${a+d} ± √(${(a+d)*(a+d)} - 4(${a*d - b*c}))] / 2<br>
            λ = [${a+d} ± √${(a+d)*(a+d) - 4*(a*d - b*c)}] / 2
        </div>
    `;
    
    document.getElementById('stepByStep').innerHTML = content;
}

function showQuadraticFormula() {
    alert(`Quadratic Formula for Eigenvalues:

For matrix A = [a, b; c, d]
Characteristic equation: λ² - (a+d)λ + (ad-bc) = 0

Using quadratic formula:
λ = [(a+d) ± √((a+d)² - 4(ad-bc))] / 2

Where:
• a+d = trace of matrix
• ad-bc = determinant of matrix
• If discriminant < 0 → complex eigenvalues`);
}

function symmetricMatrix() {
    document.getElementById('a11').value = 2;
    document.getElementById('a12').value = 1;
    document.getElementById('a21').value = 1;
    document.getElementById('a22').value = 2;
    drawTransformationVisualization();
}

function randomMatrix() {
    document.getElementById('a11').value = (Math.random() * 4 - 2).toFixed(1);
    document.getElementById('a12').value = (Math.random() * 2 - 1).toFixed(1);
    document.getElementById('a21').value = (Math.random() * 2 - 1).toFixed(1);
    document.getElementById('a22').value = (Math.random() * 4 - 2).toFixed(1);
    drawTransformationVisualization();
}

// Exercise checking functions
function checkExercise1() {
    const lambda1 = parseFloat(document.getElementById('ex1_lambda1').value);
    const lambda2 = parseFloat(document.getElementById('ex1_lambda2').value);
    
    const correct = (lambda1 === 4 && lambda2 === 2) || (lambda1 === 2 && lambda2 === 4);
    
    if (correct) {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! Diagonal entries are eigenvalues.</span>';
    } else {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again. For diagonal matrices, look at the diagonal!</span>';
    }
}

function checkExercise2() {
    const x = parseFloat(document.getElementById('ex2_x').value);
    const y = parseFloat(document.getElementById('ex2_y').value);
    
    if (x === 3 && y === 0) {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! Av = λv = 3(1,0) = (3,0)</span>';
    } else {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again. Use Av = λv formula.</span>';
    }
}

function checkExercise3(answer) {
    if (answer === 'pc1') {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! PC1 has the largest eigenvalue.</span>';
    } else {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Larger eigenvalue = more variance explained.</span>';
    }
}

function checkExercise4(answer) {
    if (answer === false) {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! Eigenvectors only get scaled, not rotated.</span>';
    } else {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. Eigenvectors maintain their direction!</span>';
    }
}

function checkExercise5() {
    const det = parseFloat(document.getElementById('ex5_det').value);
    
    if (det === 10) {
        document.getElementById('ex5_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! det = λ₁ × λ₂ = 5 × 2 = 10</span>';
    } else {
        document.getElementById('ex5_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again. Multiply the eigenvalues.</span>';
    }
}

// Event listeners for real-time updates
['a11', 'a12', 'a21', 'a22'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        drawTransformationVisualization();
        eigenvalues = [];
        eigenvectors = [];
    });
});

['spreadX', 'spreadY', 'correlation'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        generateData();
    });
});

// Initialize
window.addEventListener('load', function() {
    drawTransformationVisualization();
    generateData();
});
