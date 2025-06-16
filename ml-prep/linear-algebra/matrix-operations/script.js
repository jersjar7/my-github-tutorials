// === MATRIX OPERATIONS INTERACTIVE SCRIPT ===

// 1. GLOBAL VARIABLES
// Matrix data storage
let matrices = {
    addSub: {
        A: [[1, 2], [3, 4]],
        B: [[2, 1], [1, 0]],
        result: [[0, 0], [0, 0]]
    },
    scalar: {
        A: [[1, 2], [3, 4]],
        result: [[0, 0], [0, 0]]
    },
    transpose: {
        A: [[1, 2, 3], [4, 5, 6]],
        result: [[0, 0], [0, 0], [0, 0]]
    }
};

// 2. UTILITY FUNCTIONS
function parseDimensions(sizeStr) {
    const [rows, cols] = sizeStr.split('x').map(Number);
    return { rows, cols };
}

function initializeMatrix(rows, cols, randomize = true) {
    return Array(rows).fill().map(() => 
        Array(cols).fill().map(() => randomize ? Math.floor(Math.random() * 9) + 1 : 0)
    );
}

function updateMatrixData(matrixId, row, col, value) {
    if (matrixId.includes('addSub_A')) {
        matrices.addSub.A[row][col] = value;
    } else if (matrixId.includes('addSub_B')) {
        matrices.addSub.B[row][col] = value;
    } else if (matrixId.includes('scalar_A')) {
        matrices.scalar.A[row][col] = value;
    } else if (matrixId.includes('transpose_A')) {
        matrices.transpose.A[row][col] = value;
    }
}

function formatNumber(num, decimals = 1) {
    return parseFloat(num).toFixed(decimals);
}

// 3. MATRIX CREATION FUNCTIONS
function createMatrix(rows, cols, id, label, values = null, isResult = false, isEditable = true) {
    const matrix = document.createElement('div');
    matrix.className = 'matrix' + (isResult ? ' result-matrix' : '');
    
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
            
            if (isEditable && !isResult) {
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.1';
                input.value = values ? values[i][j] : (Math.floor(Math.random() * 9) + 1);
                input.id = `${id}_${i}_${j}`;
                input.addEventListener('input', () => updateMatrixData(id, i, j, parseFloat(input.value) || 0));
                cell.appendChild(input);
            } else {
                cell.textContent = values ? values[i][j] : '0';
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

// 4. MATRIX INITIALIZATION FUNCTIONS
function initializeMatrixData(type, rows, cols) {
    if (type === 'addSub') {
        matrices.addSub.A = initializeMatrix(rows, cols);
        matrices.addSub.B = initializeMatrix(rows, cols);
        matrices.addSub.result = initializeMatrix(rows, cols, false);
    } else if (type === 'scalar') {
        matrices.scalar.A = initializeMatrix(rows, cols);
        matrices.scalar.result = initializeMatrix(rows, cols, false);
    } else if (type === 'transpose') {
        matrices.transpose.A = initializeMatrix(rows, cols);
        matrices.transpose.result = initializeMatrix(cols, rows, false);
    }
}

// 5. ADDITION AND SUBTRACTION
function updateAddSubMatrices() {
    const size = document.getElementById('addSubSize').value;
    const { rows, cols } = parseDimensions(size);
    
    initializeMatrixData('addSub', rows, cols);
    
    const container = document.getElementById('addSubContainer');
    container.innerHTML = '';
    
    const matrixA = createMatrix(rows, cols, 'addSub_A', 'A', matrices.addSub.A);
    const plusSymbol = createOperationSymbol('+');
    const matrixB = createMatrix(rows, cols, 'addSub_B', 'B', matrices.addSub.B);
    const equalsSymbol = createOperationSymbol('=', 'equals-symbol');
    const resultMatrix = createMatrix(rows, cols, 'addSub_result', 'Result', matrices.addSub.result, true, false);
    
    container.appendChild(matrixA);
    container.appendChild(plusSymbol);
    container.appendChild(matrixB);
    container.appendChild(equalsSymbol);
    container.appendChild(resultMatrix);
}

function performAddition() {
    const size = document.getElementById('addSubSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aValue = parseFloat(document.getElementById(`addSub_A_${i}_${j}`).value) || 0;
            const bValue = parseFloat(document.getElementById(`addSub_B_${i}_${j}`).value) || 0;
            const result = aValue + bValue;
            
            matrices.addSub.result[i][j] = result;
            document.getElementById(`addSub_result_${i}_${j}`).textContent = result;
        }
    }
    
    // Change operation symbol
    document.querySelector('#addSubContainer .operation-symbol').textContent = '+';
}

function performSubtraction() {
    const size = document.getElementById('addSubSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aValue = parseFloat(document.getElementById(`addSub_A_${i}_${j}`).value) || 0;
            const bValue = parseFloat(document.getElementById(`addSub_B_${i}_${j}`).value) || 0;
            const result = aValue - bValue;
            
            matrices.addSub.result[i][j] = result;
            document.getElementById(`addSub_result_${i}_${j}`).textContent = result;
        }
    }
    
    // Change operation symbol
    document.querySelector('#addSubContainer .operation-symbol').textContent = '−';
}

function randomizeAddSub() {
    const size = document.getElementById('addSubSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const newA = Math.floor(Math.random() * 9) + 1;
            const newB = Math.floor(Math.random() * 9) + 1;
            
            document.getElementById(`addSub_A_${i}_${j}`).value = newA;
            document.getElementById(`addSub_B_${i}_${j}`).value = newB;
            
            matrices.addSub.A[i][j] = newA;
            matrices.addSub.B[i][j] = newB;
        }
    }
}

// 6. SCALAR MULTIPLICATION
function updateScalarMatrix() {
    const size = document.getElementById('scalarSize').value;
    const { rows, cols } = parseDimensions(size);
    
    initializeMatrixData('scalar', rows, cols);
    
    const container = document.getElementById('scalarContainer');
    container.innerHTML = '';
    
    const scalarDiv = createOperationSymbol(document.getElementById('scalarValue').value);
    const timesSymbol = createOperationSymbol('×');
    const matrixA = createMatrix(rows, cols, 'scalar_A', 'A', matrices.scalar.A);
    const equalsSymbol = createOperationSymbol('=', 'equals-symbol');
    const resultMatrix = createMatrix(rows, cols, 'scalar_result', 'Result', matrices.scalar.result, true, false);
    
    container.appendChild(scalarDiv);
    container.appendChild(timesSymbol);
    container.appendChild(matrixA);
    container.appendChild(equalsSymbol);
    container.appendChild(resultMatrix);
}

function performScalarMultiplication() {
    const scalar = parseFloat(document.getElementById('scalarValue').value) || 1;
    const size = document.getElementById('scalarSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aValue = parseFloat(document.getElementById(`scalar_A_${i}_${j}`).value) || 0;
            const result = scalar * aValue;
            
            matrices.scalar.result[i][j] = result;
            document.getElementById(`scalar_result_${i}_${j}`).textContent = result;
        }
    }
    
    // Update scalar display
    document.querySelector('#scalarContainer .operation-symbol').textContent = scalar;
}

function randomizeScalar() {
    const size = document.getElementById('scalarSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const newValue = Math.floor(Math.random() * 9) + 1;
            document.getElementById(`scalar_A_${i}_${j}`).value = newValue;
            matrices.scalar.A[i][j] = newValue;
        }
    }
}

// 7. MATRIX TRANSPOSE
function updateTransposeMatrix() {
    const size = document.getElementById('transposeSize').value;
    const { rows, cols } = parseDimensions(size);
    
    initializeMatrixData('transpose', rows, cols);
    
    const container = document.getElementById('transposeContainer');
    container.innerHTML = '';
    
    const matrixA = createMatrix(rows, cols, 'transpose_A', 'A', matrices.transpose.A);
    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'transpose-arrow';
    arrowDiv.innerHTML = '→<br>Transpose';
    
    const resultMatrix = createMatrix(cols, rows, 'transpose_result', 'Aᵀ', matrices.transpose.result, true, false);
    
    container.appendChild(matrixA);
    container.appendChild(arrowDiv);
    container.appendChild(resultMatrix);
}

function showTranspose() {
    const size = document.getElementById('transposeSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aValue = parseFloat(document.getElementById(`transpose_A_${i}_${j}`).value) || 0;
            matrices.transpose.result[j][i] = aValue;
            document.getElementById(`transpose_result_${j}_${i}`).textContent = aValue;
        }
    }
}

function animateTranspose() {
    const size = document.getElementById('transposeSize').value;
    const { rows, cols } = parseDimensions(size);
    
    let delay = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setTimeout(() => {
                // Highlight source cell
                const sourceCell = document.getElementById(`transpose_A_${i}_${j}`);
                if (sourceCell) sourceCell.classList.add('highlight-cell');
                
                // Highlight destination cell
                const destCell = document.getElementById(`transpose_result_${j}_${i}`);
                if (destCell) destCell.classList.add('highlight-cell');
                
                // Copy value
                const aValue = parseFloat(sourceCell.value) || 0;
                destCell.textContent = aValue;
                
                // Remove highlights after animation
                setTimeout(() => {
                    if (sourceCell) sourceCell.classList.remove('highlight-cell');
                    if (destCell) destCell.classList.remove('highlight-cell');
                }, 500);
                
            }, delay);
            delay += 300;
        }
    }
}

function randomizeTranspose() {
    const size = document.getElementById('transposeSize').value;
    const { rows, cols } = parseDimensions(size);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const newValue = Math.floor(Math.random() * 9) + 1;
            document.getElementById(`transpose_A_${i}_${j}`).value = newValue;
            matrices.transpose.A[i][j] = newValue;
        }
    }
}

// 8. IDENTITY MATRIX
function showIdentityMatrix() {
    const size = parseInt(document.getElementById('identitySize').value);
    const container = document.getElementById('identityContainer');
    container.innerHTML = '';
    
    const identity = Array(size).fill().map((_, i) => 
        Array(size).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    const identityMatrix = createMatrix(size, size, 'identity', 'I', identity, false, false);
    container.appendChild(identityMatrix);
}

function demonstrateIdentityProperty() {
    const size = parseInt(document.getElementById('identitySize').value);
    
    // Create a random matrix A
    const A = Array(size).fill().map(() => 
        Array(size).fill().map(() => Math.floor(Math.random() * 9) + 1)
    );
    
    // Create identity matrix
    const I = Array(size).fill().map((_, i) => 
        Array(size).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    alert(`Demo: Let A be a ${size}×${size} matrix.\nI × A = A (Identity property)\nThis demonstrates that the identity matrix acts like "1" in matrix multiplication!`);
}

// 9. EXERCISE FUNCTIONS
function checkExercise1() {
    const answers = [
        [parseFloat(document.getElementById('ex1_00').value), parseFloat(document.getElementById('ex1_01').value)],
        [parseFloat(document.getElementById('ex1_10').value), parseFloat(document.getElementById('ex1_11').value)]
    ];
    
    const correct = [[3, 3], [3, 5]]; // [2+1, 1+2; 3+0, 4+1]
    
    let isCorrect = true;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (answers[i][j] !== correct[i][j]) {
                isCorrect = false;
                break;
            }
        }
    }
    
    document.getElementById('ex1_result').innerHTML = isCorrect ? 
        ' <span style="color: #4CAF50;">✓ Correct!</span>' : 
        ' <span style="color: #f44336;">✗ Try again</span>';
}

function checkExercise2() {
    const answers = [
        [parseFloat(document.getElementById('ex2_00').value), parseFloat(document.getElementById('ex2_01').value)],
        [parseFloat(document.getElementById('ex2_10').value), parseFloat(document.getElementById('ex2_11').value)]
    ];
    
    const correct = [[3, 6], [0, -3]]; // 3 × [1, 2; 0, -1]
    
    let isCorrect = true;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (answers[i][j] !== correct[i][j]) {
                isCorrect = false;
                break;
            }
        }
    }
    
    document.getElementById('ex2_result').innerHTML = isCorrect ? 
        ' <span style="color: #4CAF50;">✓ Correct!</span>' : 
        ' <span style="color: #f44336;">✗ Try again</span>';
}

function checkExercise3() {
    const answers = [
        [parseFloat(document.getElementById('ex3_00').value), parseFloat(document.getElementById('ex3_01').value)],
        [parseFloat(document.getElementById('ex3_10').value), parseFloat(document.getElementById('ex3_11').value)],
        [parseFloat(document.getElementById('ex3_20').value), parseFloat(document.getElementById('ex3_21').value)]
    ];
    
    const correct = [[1, 4], [2, 5], [3, 6]]; // Transpose of [1,2,3; 4,5,6]
    
    let isCorrect = true;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            if (answers[i][j] !== correct[i][j]) {
                isCorrect = false;
                break;
            }
        }
    }
    
    document.getElementById('ex3_result').innerHTML = isCorrect ? 
        ' <span style="color: #4CAF50;">✓ Correct!</span>' : 
        ' <span style="color: #f44336;">✗ Try again</span>';
}

function checkExercise4(userAnswer) {
    const correct = false; // Cannot add matrices with different dimensions
    
    document.getElementById('ex4_result').innerHTML = userAnswer === correct ? 
        ' <span style="color: #4CAF50;">✓ Correct! Matrices must have same dimensions.</span>' : 
        ' <span style="color: #f44336;">✗ Wrong! Matrices must have identical dimensions to add/subtract.</span>';
}

// 10. EVENT LISTENERS
function setupEventListeners() {
    // Scalar value change listener
    document.getElementById('scalarValue').addEventListener('input', function() {
        performScalarMultiplication();
    });
    
    // Matrix cell input validation and update
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"]') && e.target.id.includes('_')) {
            const value = parseFloat(e.target.value) || 0;
            const idParts = e.target.id.split('_');
            if (idParts.length >= 3) {
                const matrixId = idParts.slice(0, -2).join('_');
                const row = parseInt(idParts[idParts.length - 2]);
                const col = parseInt(idParts[idParts.length - 1]);
                updateMatrixData(e.target.id, row, col, value);
            }
        }
    });
}

// 11. INITIALIZATION
window.addEventListener('load', function() {
    setupEventListeners();
    updateAddSubMatrices();
    updateScalarMatrix();
    updateTransposeMatrix();
    showIdentityMatrix();
});
