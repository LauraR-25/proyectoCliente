document.addEventListener('DOMContentLoaded', function() {
    initMatrixInputs('matrix-a', 'size-a');
    initMatrixInputs('matrix-b', 'size-b');

    document.getElementById('random-a').addEventListener('click', () => fillRandom('matrix-a'));
    document.getElementById('clear-a').addEventListener('click', () => clearMatrix('matrix-a'));
    document.getElementById('identity-a').addEventListener('click', () => fillIdentity('matrix-a'));
    document.getElementById('size-a').addEventListener('change', function() {
        updateMatrixSize('matrix-a', this.value);
    });

    document.getElementById('random-b').addEventListener('click', () => fillRandom('matrix-b'));
    document.getElementById('clear-b').addEventListener('click', () => clearMatrix('matrix-b'));
    document.getElementById('identity-b').addEventListener('click', () => fillIdentity('matrix-b'));
    document.getElementById('size-b').addEventListener('change', function() {
        updateMatrixSize('matrix-b', this.value);
    });

    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const operation = this.getAttribute('data-operation');
            handleOperation(operation);
        });
    });

    document.getElementById('example').addEventListener('click', function() {
        const size = Math.floor(Math.random() * 9) + 2; // 2 a 10
        document.getElementById('size-a').value = size;
        updateMatrixSize('matrix-a', size);
        fillRandom('matrix-a');
    });

    document.getElementById('example-b').addEventListener('click', function() {
        const size = Math.floor(Math.random() * 9) + 2; // 2 a 10
        document.getElementById('size-b').value = size;
        updateMatrixSize('matrix-b', size);
        fillRandom('matrix-b');
    });
});

function generateExampleMatrix(size) {
    let matrix = [];
    let val = 1;
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(val++);
        }
        matrix.push(row);
    }
    return matrix;
}

function setExampleMatrix(matrixId, sizeSelectorId, size) {
    document.getElementById(sizeSelectorId).value = size;
    updateMatrixSize(matrixId, size);
    const example = generateExampleMatrix(size);
    fillMatrixInputs(matrixId, example);
}

function fillMatrixInputs(matrixId, values) {
    const container = document.getElementById(matrixId);
    const size = values.length;
    container.style.setProperty('--size', size);
    const inputs = container.querySelectorAll('.matrix-cell');
    let idx = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = container.querySelector(`.matrix-cell[data-row="${i}"][data-col="${j}"]`);
            if (input) input.value = values[i][j];
        }
    }
}

function initMatrixInputs(matrixId, sizeSelectorId) {
    const size = document.getElementById(sizeSelectorId).value;
    updateMatrixSize(matrixId, size);
}

function updateMatrixSize(matrixId, size) {
    const container = document.getElementById(matrixId);
    container.innerHTML = '';
    container.style.setProperty('--size', size);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.dataset.row = i;
            input.dataset.col = j;
            input.placeholder = '0';
            input.value = '';
            container.appendChild(input);
        }
    }
}

function fillRandom(matrixId) {
    const inputs = document.querySelectorAll(`#${matrixId} .matrix-cell`);
    inputs.forEach(input => {
        input.value = Math.floor(Math.random() * 21) - 10;
    });
}

function fillIdentity(matrixId) {
    const container = document.getElementById(matrixId);
    const size = parseInt(container.style.getPropertyValue('--size'));
    const inputs = container.querySelectorAll('.matrix-cell');
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        input.value = row === col ? '1' : '0';
    });
}

function clearMatrix(matrixId) {
    const inputs = document.querySelectorAll(`#${matrixId} .matrix-cell`);
    inputs.forEach(input => {
        input.value = '';
    });
}

function showMessage(message, type = 'error') {
    const errorBox = document.getElementById('error-messages');
    errorBox.innerHTML = `<div class="alert ${type === 'success' ? 'success' : ''}">${message}</div>`;
    setTimeout(() => errorBox.innerHTML = '', 5000);
}

function displayResult(matrix, title = '') {
    const resultDiv = document.getElementById('result-matrix');
    let html = title ? `<h4>${title}</h4>` : '';
    html += '<div class="matrix-result"><table style="border-collapse:collapse;margin:auto;">';
    matrix.forEach(row => {
        html += '<tr>';
        row.forEach(val => {
            const formatted = Number.isInteger(val) ? val : Number(val).toFixed(4);
            html += `<td style="border:1px solid #ccc;padding:6px 12px;text-align:center;">${formatted}</td>`;
        });
        html += '</tr>';
    });
    html += '</table></div>';
    resultDiv.innerHTML = html;
}

function getMatrixValues(matrixId) {
    const container = document.getElementById(matrixId);
    const size = parseInt(container.style.getPropertyValue('--size'));
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const input = container.querySelector(`.matrix-cell[data-row="${i}"][data-col="${j}"]`);
            const value = parseFloat(input.value);
            if (isNaN(value)) {
                throw new Error(`Valor inválido en ${matrixId}, fila ${i+1}, columna ${j+1}`);
            }
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

function getScalarValue() {
    const value = prompt("Ingrese el valor escalar:");
    const num = parseFloat(value);
    if (isNaN(num)) {
        throw new Error('El valor escalar debe ser un número');
    }
    return num;
}

const matrixOperations = {
    add: (A, B) => {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones');
        }
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    },
    subtract: (A, B) => {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones');
        }
        return A.map((row, i) => row.map((val, j) => val - B[i][j]));
    },
    multiply: (A, B) => {
        if (A[0].length !== B.length) {
            throw new Error('El número de columnas de A debe coincidir con filas de B');
        }
        const result = Array(A.length).fill().map(() => Array(B[0].length).fill(0));
        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < B[0].length; j++) {
                for (let k = 0; k < A[0].length; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    },
    scalarMultiply: (matrix, scalar) => {
        return matrix.map(row => row.map(val => val * scalar));
    },
    transpose: (matrix) => {
        return matrix[0].map((_, j) => matrix.map(row => row[j]));
    },
    determinant: function(matrix) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('La matriz debe ser cuadrada');
        }
        if (matrix.length === 1) return matrix[0][0];
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        let det = 0;
        for (let j = 0; j < matrix.length; j++) {
            const minor = matrix.slice(1).map(row => 
                row.filter((_, col) => col !== j)
            );
            det += matrix[0][j] * Math.pow(-1, j) * this.determinant(minor);
        }
        return det;
    },
    inverse: function(matrix) {
        const det = this.determinant(matrix);
        if (det === 0) throw new Error('La matriz no es invertible (determinante = 0)');
        const n = matrix.length;
        const augmented = matrix.map((row, i) => [
            ...row.map(val => val),
            ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        ]);
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = j;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            const pivot = augmented[i][i];
            if (pivot === 0) throw new Error('La matriz no es invertible (pivote cero)');
            for (let j = i; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            for (let k = 0; k < n; k++) {
                if (k !== i && augmented[k][i] !== 0) {
                    const factor = augmented[k][i];
                    for (let j = i; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        return augmented.map(row => row.slice(n));
    }
};

function handleOperation(operation) {
    try {
        let result, title = '';
        switch(operation) {
            case 'add':
                result = matrixOperations.add(getMatrixValues('matrix-a'), getMatrixValues('matrix-b'));
                title = 'A + B =';
                break;
            case 'subtract':
                result = matrixOperations.subtract(getMatrixValues('matrix-a'), getMatrixValues('matrix-b'));
                title = 'A - B =';
                break;
            case 'subtract-b':
                result = matrixOperations.subtract(getMatrixValues('matrix-b'), getMatrixValues('matrix-a'));
                title = 'B - A =';
                break;
            case 'multiply':
                result = matrixOperations.multiply(getMatrixValues('matrix-a'), getMatrixValues('matrix-b'));
                title = 'A × B =';
                break;
            case 'scalar-a':
                const scalarA = getScalarValue();
                result = matrixOperations.scalarMultiply(getMatrixValues('matrix-a'), scalarA);
                title = `k × A (k = ${scalarA}) =`;
                break;
            case 'scalar-b':
                const scalarB = getScalarValue();
                result = matrixOperations.scalarMultiply(getMatrixValues('matrix-b'), scalarB);
                title = `k × B (k = ${scalarB}) =`;
                break;
            case 'transpose-a':
                result = matrixOperations.transpose(getMatrixValues('matrix-a'));
                title = 'A<sup>T</sup> =';
                break;
            case 'transpose-b':
                result = matrixOperations.transpose(getMatrixValues('matrix-b'));
                title = 'B<sup>T</sup> =';
                break;
            case 'determinant-a':
                const detA = matrixOperations.determinant(getMatrixValues('matrix-a'));
                displayResult([[detA]], `det(A) = ${Number(detA).toFixed(4)}`);
                showMessage('Operación realizada con éxito', 'success');
                return;
            case 'determinant-b':
                const detB = matrixOperations.determinant(getMatrixValues('matrix-b'));
                displayResult([[detB]], `det(B) = ${Number(detB).toFixed(4)}`);
                showMessage('Operación realizada con éxito', 'success');
                return;
            case 'inverse-a':
                result = matrixOperations.inverse(getMatrixValues('matrix-a'));
                title = 'A<sup>-1</sup> =';
                const verification = matrixOperations.multiply(
                    getMatrixValues('matrix-a'), 
                    result
                );
                setTimeout(() => {
                    displayResult(verification, 'Verificación (A × A⁻¹ ≈ I):');
                }, 100);
                break;
            case 'inverse-b':
                result = matrixOperations.inverse(getMatrixValues('matrix-b'));
                title = 'B<sup>-1</sup> =';
                const verificationB = matrixOperations.multiply(
                    getMatrixValues('matrix-b'), 
                    result
                );
                setTimeout(() => {
                    displayResult(verificationB, 'Verificación (B × B⁻¹ ≈ I):');
                }, 100);
                break;
        }
        displayResult(result, title);
        showMessage('Operación realizada con éxito', 'success');
    } catch (error) {
        showMessage(error.message);
        console.error(error);
    }
}