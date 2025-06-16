// === DETERMINANTS & INVERSES INTERACTIVE SCRIPT ===

// 1. GLOBAL VARIABLES
// Matrix data storage
let detMatrix = [[2, 1], [3, 4]];
let invMatrix = [[2, 1], [3, 4]];
let systemMatrix = [[2, 3], [1, 4]];
let systemVector = [7, 6];

// 2. UTILITY FUNCTIONS
function formatNumber(num, decimals = 3) {
    return parseFloat(num).toFixed(decimals);
}

function updateMatrixData(matrixId, row, col, value) {
    if (matrixId.includes('det')) {
        detMatrix[row][col] = value;
    } else if (matrixId.includes('inv')) {
        invMatrix[row][col] = value;
    } else if (matrixId.includes('system')) {
        systemMatrix[row][col] = value;
    }
}

// 3. MATRIX CREATION FUNCTIONS
function createMatrix(rows, cols, id, label, values, isEditable = true) {
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'matrix-label';
    labelDiv.textContent = label;
    matrix.appendChild(labelDiv);
    
    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            
            if (isEditable) {
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.1';
                input.value = values[i][j];
                input.id = `${id}_${i}_${j}`;
                input.addEventListener('input', () => updateMatrixData(id, i, j, parseFloat(input.value) || 0));
                cell.appendChild(input);
            } else {
                cell.textContent = values[i][j];
                cell.id = `${id}_${i}_${j}`;
            }
            
            grid.appendChild(cell);
        }
    }
    
    matrix.appendChild(grid);
    return matrix;
}

function createOperationSymbol(symbol, className = 'operation-symbol') {
    const symbolDiv = document.createElement('div');
    symbolDiv.className = className;
    symbolDiv.textContent = symbol;
    return symbolDiv;
}

// 4. DETERMINANT FUNCTIONS
function updateDetMatrix() {
    const size = document.getElementById('detMatrixSize').value;
    const container = document.getElementById('detMatrixContainer');
    container.innerHTML = '';
    
    if (size === '2x2') {
        detMatrix = [[2, 1], [3, 4]];
        const matrix = createMatrix(2, 2, 'det_A', 'A', detMatrix);
        container.appendChild(matrix);
    } else {
        detMatrix = [[1, 2, 0], [3, 1, 2], [0, 1, 1]];
        const matrix = createMatrix(3, 3, 'det_A', 'A', detMatrix);
        container.appendChild(matrix);
    }
}

function calculateDeterminant() {
    const size = document.getElementById('detMatrixSize').value;
    
    // Get current values from inputs
    if (size === '2x2') {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const input = document.getElementById(`det_A_${i}_${j}`);
                detMatrix[i][j] = parseFloat(input.value) || 0;
            }
        }
        
        const det = detMatrix[0][0] * detMatrix[1][1] - detMatrix[0][1] * detMatrix[1][0];
        document.getElementById('detResult').textContent = `det(A) = ${det}`;
        
        if (det === 0) {
            document.getElementById('detResult').className = 'result-display singular-warning';
            document.getElementById('detResult').textContent += ' (Singular - No Inverse!)';
        } else {
            document.getElementById('detResult').className = 'result-display determinant-result';
        }
        
        updateGeometricViz();
        
    } else {
        // 3x3 determinant using cofactor expansion
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const input = document.getElementById(`det_A_${i}_${j}`);
                detMatrix[i][j] = parseFloat(input.value) || 0;
            }
        }
        
        const a = detMatrix[0][0], b = detMatrix[0][1], c = detMatrix[0][2];
        const d = detMatrix[1][0], e = detMatrix[1][1], f = detMatrix[1][2];
        const g = detMatrix[2][0], h = detMatrix[2][1], i = detMatrix[2][2];
        
        const det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
        document.getElementById('detResult').textContent = `det(A) = ${det.toFixed(3)}`;
        
        if (Math.abs(det) < 0.001) {
            document.getElementById('detResult').className = 'result-display singular-warning';
            document.getElementById('detResult').textContent += ' (Singular - No Inverse!)';
        } else {
            document.getElementById('detResult').className = 'result-display determinant-result';
        }
    }
}

function animateDeterminant() {
    const size = document.getElementById('detMatrixSize').value;
    
    if (size === '2x2') {
        // Highlight diagonal elements
        document.getElementById('det_A_0_0').classList.add('det-highlight');
        document.getElementById('det_A_1_1').classList.add('det-highlight');
        
        setTimeout(() => {
            const a = detMatrix[0][0], b = detMatrix[0][1];
            const c = detMatrix[1][0], d = detMatrix[1][1];
            
            document.getElementById('stepDisplay').innerHTML = `
                <h4>2×2 Determinant Step-by-Step</h4>
                <div class="step-calculation">det([${a}, ${b}; ${c}, ${d}]) = (${a})(${d}) - (${b})(${c})</div>
                <div class="step-calculation">= ${a*d} - ${b*c} = ${a*d - b*c}</div>
            `;
            
            // Clear highlights
            document.querySelectorAll('.det-highlight').forEach(cell => {
                cell.classList.remove('det-highlight');
            });
            
            // Highlight anti-diagonal
            document.getElementById('det_A_0_1').classList.add('det-highlight');
            document.getElementById('det_A_1_0').classList.add('det-highlight');
            
            setTimeout(() => {
                document.querySelectorAll('.det-highlight').forEach(cell => {
                    cell.classList.remove('det-highlight');
                });
            }, 2000);
            
        }, 1000);
        
    } else {
        // 3x3 cofactor expansion animation
        document.getElementById('stepDisplay').innerHTML = `
            <h4>3×3 Determinant (Cofactor Expansion)</h4>
            <p>Expanding along first row:</p>
            <div class="step-calculation">det(A) = a₁₁×det(M₁₁) - a₁₂×det(M₁₂) + a₁₃×det(M₁₃)</div>
            <p>Where Mᵢⱼ are the 2×2 minors</p>
        `;
    }
}

function randomizeDetMatrix() {
    const size = document.getElementById('detMatrixSize').value;
    
    if (size === '2x2') {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const newValue = Math.floor(Math.random() * 5) + 1;
                detMatrix[i][j] = newValue;
                document.getElementById(`det_A_${i}_${j}`).value = newValue;
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const newValue = Math.floor(Math.random() * 5) + 1;
                detMatrix[i][j] = newValue;
                document.getElementById(`det_A_${i}_${j}`).value = newValue;
            }
        }
    }
}

// 5. INVERSE FUNCTIONS
function calculateInverse() {
    // Use 2x2 matrix for simplicity
    invMatrix = [[detMatrix[0][0], detMatrix[0][1]], [detMatrix[1][0], detMatrix[1][1]]];
    
    const a = invMatrix[0][0], b = invMatrix[0][1];
    const c = invMatrix[1][0], d = invMatrix[1][1];
    const det = a*d - b*c;
    
    const container = document.getElementById('invMatrixContainer');
    container.innerHTML = '';
    
    // Show original matrix
    const originalMatrix = createMatrix(2, 2, 'inv_orig', 'A', invMatrix);
    container.appendChild(originalMatrix);
    
    const arrowDiv = document.createElement('div');
    arrowDiv.style.fontSize = '2em';
    arrowDiv.style.color = '#9C27B0';
    arrowDiv.textContent = '→';
    container.appendChild(arrowDiv);
    
    if (Math.abs(det) < 0.001) {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '1.2em';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.textContent = 'No Inverse (det = 0)';
        container.appendChild(errorDiv);
        
        document.getElementById('invResult').textContent = 'Matrix is singular - no inverse exists!';
        document.getElementById('invResult').className = 'result-display singular-warning';
    } else {
        const invDet = 1/det;
        const inverse = [[d*invDet, -b*invDet], [-c*invDet, a*invDet]];
        
        const inverseMatrix = createMatrix(2, 2, 'inv_result', 'A⁻¹', inverse.map(row => row.map(val => val.toFixed(3))), false);
        container.appendChild(inverseMatrix);
        
        document.getElementById('invResult').innerHTML = `
            <strong>Inverse calculated!</strong><br>
            det(A) = ${det.toFixed(3)}<br>
            A⁻¹ = (1/${det.toFixed(3)}) × [${d}, ${-b}; ${-c}, ${a}]
        `;
        document.getElementById('invResult').className = 'result-display inverse-result';
    }
}

function verifyInverse() {
    calculateInverse();
    
    const a = invMatrix[0][0], b = invMatrix[0][1];
    const c = invMatrix[1][0], d = invMatrix[1][1];
    const det = a*d - b*c;
    
    if (Math.abs(det) < 0.001) {
        alert('Cannot verify - matrix has no inverse!');
        return;
    }
    
    const invDet = 1/det;
    const inverse = [[d*invDet, -b*invDet], [-c*invDet, a*invDet]];
    
    // Calculate A × A⁻¹
    const product = [
        [a*inverse[0][0] + b*inverse[1][0], a*inverse[0][1] + b*inverse[1][1]],
        [c*inverse[0][0] + d*inverse[1][0], c*inverse[0][1] + d*inverse[1][1]]
    ];
    
    const isIdentity = Math.abs(product[0][0] - 1) < 0.01 && 
                      Math.abs(product[0][1]) < 0.01 && 
                      Math.abs(product[1][0]) < 0.01 && 
                      Math.abs(product[1][1] - 1) < 0.01;
    
    if (isIdentity) {
        alert(`Verification successful!\nA × A⁻¹ = [${product[0][0].toFixed(2)}, ${product[0][1].toFixed(2)}; ${product[1][0].toFixed(2)}, ${product[1][1].toFixed(2)}] ≈ I`);
    } else {
        alert(`Verification shows some numerical error:\nA × A⁻¹ = [${product[0][0].toFixed(3)}, ${product[0][1].toFixed(3)}; ${product[1][0].toFixed(3)}, ${product[1][1].toFixed(3)}]`);
    }
}

function randomizeInvMatrix() {
    invMatrix = [
        [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1],
        [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1]
    ];
    detMatrix = [[invMatrix[0][0], invMatrix[0][1]], [invMatrix[1][0], invMatrix[1][1]]];
    
    // Update determinant matrix display if it's 2x2
    if (document.getElementById('detMatrixSize').value === '2x2') {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                document.getElementById(`det_A_${i}_${j}`).value = detMatrix[i][j];
            }
        }
    }
}

// 6. GEOMETRIC VISUALIZATION
function updateGeometricViz() {
    const canvas = document.getElementById('geometricCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 50;
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(canvas.width, centerY + i * scale);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Draw unit square
    ctx.strokeStyle = '#2196F3';
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(centerX, centerY, scale, -scale);
    ctx.fill();
    ctx.stroke();
    
    // Draw transformed parallelogram
    const a = detMatrix[0][0], b = detMatrix[0][1];
    const c = detMatrix[1][0], d = detMatrix[1][1];
    
    ctx.strokeStyle = '#f44336';
    ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + a * scale, centerY - c * scale);
    ctx.lineTo(centerX + (a + b) * scale, centerY - (c + d) * scale);
    ctx.lineTo(centerX + b * scale, centerY - d * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    const det = a*d - b*c;
    document.getElementById('areaDisplay').textContent = `Current area: ${Math.abs(det).toFixed(2)}`;
}

function animateTransformation() {
    // Simple animation showing transformation
    updateGeometricViz();
    setTimeout(() => {
        alert('The red parallelogram shows how the matrix transforms the blue unit square!\nArea scaling factor = |determinant|');
    }, 500);
}

// 7. LINEAR SYSTEM SOLVER
function solveLinearSystem() {
    const A = systemMatrix;
    const b = systemVector;
    
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    
    if (Math.abs(det) < 0.001) {
        document.getElementById('systemResult').innerHTML = '<span style="color: #f44336;">No unique solution - system is singular!</span>';
        return;
    }
    
    // Calculate A⁻¹
    const invDet = 1/det;
    const invA = [[A[1][1]*invDet, -A[0][1]*invDet], [-A[1][0]*invDet, A[0][0]*invDet]];
    
    // Calculate x = A⁻¹b
    const x = invA[0][0] * b[0] + invA[0][1] * b[1];
    const y = invA[1][0] * b[0] + invA[1][1] * b[1];
    
    document.getElementById('systemResult').innerHTML = `
        <span style="color: #4CAF50;">Solution found!</span><br>
        x = ${x.toFixed(3)}<br>
        y = ${y.toFixed(3)}
    `;
    
    document.getElementById('stepDisplay').innerHTML = `
        <h4>Solution Process</h4>
        <div class="step-calculation">det(A) = ${det.toFixed(3)} ≠ 0 ✓</div>
        <div class="step-calculation">A⁻¹ = (1/${det.toFixed(3)}) × [${A[1][1]}, ${-A[0][1]}; ${-A[1][0]}, ${A[0][0]}]</div>
        <div class="step-calculation">x = A⁻¹b = [${x.toFixed(3)}, ${y.toFixed(3)}]ᵀ</div>
    `;
}

function newRandomSystem() {
    systemMatrix = [
        [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1],
        [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1]
    ];
    systemVector = [Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 10) + 5];
    
    document.getElementById('systemDisplay').innerHTML = `
        <div class="equation-display">${systemMatrix[0][0]}x + ${systemMatrix[0][1]}y = ${systemVector[0]}</div>
        <div class="equation-display">${systemMatrix[1][0]}x + ${systemMatrix[1][1]}y = ${systemVector[1]}</div>
    `;
    
    document.getElementById('systemResult').textContent = 'Click "Solve System" to find x and y!';
}

// 8. EXERCISE FUNCTIONS
function checkExercise1() {
    const userAnswer = parseFloat(document.getElementById('ex1_det').value);
    const correct = 3*4 - 1*2; // det([3,1;2,4]) = 12 - 2 = 10
    
    if (userAnswer === correct) {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! (3×4 - 1×2 = 10)</span>';
    } else {
        document.getElementById('ex1_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again (ad - bc formula)</span>';
    }
}

function checkExercise2(userAnswer) {
    const correct = 'singular';
    
    if (userAnswer === correct) {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! det = 0 means singular (no inverse)</span>';
    } else {
        document.getElementById('ex2_feedback').innerHTML = ' <span style="color: #f44336;">✗ Wrong. det = 0 means no inverse exists</span>';
    }
}

function checkExercise3() {
    const userAnswer = parseFloat(document.getElementById('ex3_inv').value);
    // For [2,1;3,2], det = 4-3 = 1, so inverse is [2,-1;-3,2], so (1,1) element is 2
    const correct = 2;
    
    if (Math.abs(userAnswer - correct) < 0.1) {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! (1/1) × 2 = 2</span>';
    } else {
        document.getElementById('ex3_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again (det=1, inverse formula)</span>';
    }
}

function checkExercise4() {
    const userAnswer = parseFloat(document.getElementById('ex4_area').value);
    const correct = 2; // |det| = area
    
    if (userAnswer === correct) {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #4CAF50;">✓ Correct! |det(A)| = area</span>';
    } else {
        document.getElementById('ex4_feedback').innerHTML = ' <span style="color: #f44336;">✗ Try again (absolute value of determinant)</span>';
    }
}

// 9. EVENT LISTENERS
function setupEventListeners() {
    // Matrix cell input validation and update
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"]') && e.target.id.includes('_')) {
            const value = parseFloat(e.target.value) || 0;
            const idParts = e.target.id.split('_');
            if (idParts.length >= 3) {
                const row = parseInt(idParts[idParts.length - 2]);
                const col = parseInt(idParts[idParts.length - 1]);
                updateMatrixData(e.target.id, row, col, value);
            }
        }
    });
}

// 10. INITIALIZATION
window.addEventListener('load', function() {
    setupEventListeners();
    updateDetMatrix();
    updateGeometricViz();
    newRandomSystem();
});
