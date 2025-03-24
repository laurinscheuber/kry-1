/**
 * Utility functions for cryptographic operations and visualizations
 */

/**
 * Mathematical functions
 */

// Greatest Common Divisor using Euclidean algorithm
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Extended Euclidean Algorithm to find Bézout coefficients
function extendedGcd(a, b) {
    if (a === 0) {
        return [b, 0, 1];
    } else {
        const [g, x, y] = extendedGcd(b % a, a);
        return [g, y - Math.floor(b / a) * x, x];
    }
}

// Find modular multiplicative inverse
function modInverse(a, m) {
    if (gcd(a, m) !== 1) {
        return null; // Inverse doesn't exist
    } else {
        const [g, x, y] = extendedGcd(a, m);
        return ((x % m) + m) % m; // Ensure the result is positive
    }
}

// Modular exponentiation (a^b mod n) - Square and Multiply algorithm
function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;

    let result = 1;
    base = base % modulus;

    // Store steps for visualization
    const steps = [`Starting with result = 1, base = ${base} mod ${modulus}`];

    while (exponent > 0) {
        // If exponent is odd, multiply result with base
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
            steps.push(`Exponent is odd (${exponent}): result = result * base mod ${modulus} = ${result}`);
        }

        // Divide exponent by 2
        exponent = Math.floor(exponent / 2);

        // Square base
        if (exponent > 0) {
            base = (base * base) % modulus;
            steps.push(`Square base: base = base² mod ${modulus} = ${base}`);
        }
    }

    steps.push(`Final result: ${result}`);
    return { result, steps };
}

// Calculate Euler's Totient Function φ(n)
function eulerPhi(n) {
    let result = n;

    // Find prime factors
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            while (n % i === 0) {
                n /= i;
            }
            result -= result / i;
        }
    }

    // If n > 1, it's a prime factor
    if (n > 1) {
        result -= result / n;
    }

    return result;
}

/**
 * Cryptographic operations
 */

// XOR two binary strings of equal length
function xorBinary(a, b) {
    if (a.length !== b.length) {
        throw new Error('Binary strings must have equal length');
    }

    let result = '';
    for (let i = 0; i < a.length; i++) {
        result += a[i] === b[i] ? '0' : '1';
    }

    return result;
}

// XOR operation with step-by-step explanation
function xorWithSteps(a, b) {
    if (a.length !== b.length) {
        throw new Error('Binary strings must have equal length');
    }

    const steps = [`XOR operation on ${a} and ${b}:`];
    let result = '';

    for (let i = 0; i < a.length; i++) {
        const bitResult = a[i] === b[i] ? '0' : '1';
        result += bitResult;
        steps.push(`Bit ${i + 1}: ${a[i]} ⊕ ${b[i]} = ${bitResult}`);
    }

    steps.push(`Final result: ${result}`);
    return { result, steps };
}

// Convert between hex and binary
function hexToBinary(hex) {
    let binary = '';
    for (let i = 0; i < hex.length; i++) {
        const decimal = parseInt(hex[i], 16);
        let bits = decimal.toString(2);
        // Pad to 4 bits
        while (bits.length < 4) {
            bits = '0' + bits;
        }
        binary += bits;
    }
    return binary;
}

function binaryToHex(binary) {
    let hex = '';
    // Pad binary to be multiple of 4
    while (binary.length % 4 !== 0) {
        binary = '0' + binary;
    }

    for (let i = 0; i < binary.length; i += 4) {
        const chunk = binary.substring(i, i + 4);
        const decimal = parseInt(chunk, 2);
        hex += decimal.toString(16).toUpperCase();
    }

    return hex;
}

// Generate random binary string of given length
function randomBinary(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.random() > 0.5 ? '1' : '0';
    }
    return result;
}

// Caesar cipher
function caesarCipher(text, shift, encrypt = true) {
    // Normalize shift for decryption
    if (!encrypt) {
        shift = (26 - shift) % 26;
    }

    return text.split('').map(char => {
        // Only shift letters
        if (/[a-zA-Z]/.test(char)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;

            // Apply shift with modulo 26
            return String.fromCharCode((code - base + shift) % 26 + base);
        }
        return char;
    }).join('');
}

// Frequency analysis
function frequencyAnalysis(text) {
    // Only count letters
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
    const freq = {};
    const totalChars = cleanText.length;

    // Count occurrences
    for (const char of cleanText) {
        if (freq[char]) {
            freq[char]++;
        } else {
            freq[char] = 1;
        }
    }

    // Convert to percentages and sort
    const result = Object.keys(freq).map(char => ({
        char,
        count: freq[char],
        percentage: (freq[char] / totalChars * 100).toFixed(2)
    })).sort((a, b) => b.count - a.count);

    return result;
}

/**
 * Visualization helpers
 */

// Create a visualization of XOR operation
function visualizeXOR(a, b, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const result = xorBinary(a, b);
    const blockWidth = 40;
    const blockHeight = 40;
    const spacing = 30;

    // Set positions
    const aY = 40;
    const bY = 120;
    const resultY = 200;
    const operationY = (aY + bY) / 2;

    // Draw bits of a
    for (let i = 0; i < a.length; i++) {
        const bit = document.createElement('div');
        bit.className = 'bit';
        bit.textContent = a[i];
        bit.style.left = `${50 + i * (blockWidth + spacing)}px`;
        bit.style.top = `${aY}px`;
        container.appendChild(bit);
    }

    // Draw XOR operations
    for (let i = 0; i < a.length; i++) {
        const op = document.createElement('div');
        op.className = 'operations';
        op.textContent = '⊕';
        op.style.left = `${50 + i * (blockWidth + spacing)}px`;
        op.style.top = `${operationY}px`;
        container.appendChild(op);
    }

    // Draw bits of b
    for (let i = 0; i < b.length; i++) {
        const bit = document.createElement('div');
        bit.className = 'bit';
        bit.textContent = b[i];
        bit.style.left = `${50 + i * (blockWidth + spacing)}px`;
        bit.style.top = `${bY}px`;
        container.appendChild(bit);
    }

    // Draw equal sign
    const equalSign = document.createElement('div');
    equalSign.style.position = 'absolute';
    equalSign.style.left = `${50 + (a.length * (blockWidth + spacing)) / 2 - 20}px`;
    equalSign.style.top = `${(bY + resultY) / 2}px`;
    equalSign.style.fontSize = '24px';
    equalSign.textContent = '=';
    container.appendChild(equalSign);

    // Animate the result after a delay
    setTimeout(() => {
        for (let i = 0; i < result.length; i++) {
            const bit = document.createElement('div');
            bit.className = 'bit';
            bit.textContent = result[i];
            bit.style.left = `${50 + i * (blockWidth + spacing)}px`;
            bit.style.top = `${resultY}px`;
            bit.style.opacity = '0';
            container.appendChild(bit);

            // Fade in
            setTimeout(() => {
                bit.style.opacity = '1';
            }, i * 200);
        }
    }, 1000);
}

// Visualize block cipher modes
function visualizeMode(mode, plaintext, key, iv, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Parse inputs
    const blocks = plaintext.split(/\s+/);

    // Draw the visualization based on the mode
    switch (mode) {
        case 'ecb':
            visualizeECB(blocks, key, container);
            break;
        case 'cbc':
            visualizeCBC(blocks, key, iv, container);
            break;
        case 'ctr':
            visualizeCTR(blocks, key, iv, container);
            break;
    }
}

// ECB Mode visualization
function visualizeECB(blocks, key, container) {
    let xPos = 20;
    let yPos = 20;

    for (let i = 0; i < blocks.length; i++) {
        // Draw plaintext block
        const pBlock = document.createElement('div');
        pBlock.className = 'block plaintext-block';
        pBlock.textContent = blocks[i];
        pBlock.style.position = 'absolute';
        pBlock.style.left = `${xPos}px`;
        pBlock.style.top = `${yPos}px`;
        container.appendChild(pBlock);

        // Draw encryption
        const enc = document.createElement('div');
        enc.className = 'operation';
        enc.textContent = 'E';
        enc.style.position = 'absolute';
        enc.style.left = `${xPos + 90}px`;
        enc.style.top = `${yPos + 5}px`;
        container.appendChild(enc);

        // Draw key
        const keyBlock = document.createElement('div');
        keyBlock.className = 'block key-block';
        keyBlock.textContent = key;
        keyBlock.style.position = 'absolute';
        keyBlock.style.left = `${xPos + 90}px`;
        keyBlock.style.top = `${yPos - 50}px`;
        container.appendChild(keyBlock);

        // Draw arrow from key to encryption
        drawArrow(container, xPos + 130, yPos - 30, xPos + 130, yPos + 5, '#ff9900');

        // Draw ciphertext block
        const cBlock = document.createElement('div');
        cBlock.className = 'block ciphertext-block';
        cBlock.textContent = xorBinary(blocks[i], key); // Simplified
        cBlock.style.position = 'absolute';
        cBlock.style.left = `${xPos + 160}px`;
        cBlock.style.top = `${yPos}px`;
        container.appendChild(cBlock);

        // Draw arrow from plaintext to encryption
        drawArrow(container, xPos + 80, yPos + 20, xPos + 90, yPos + 20, '#333');

        // Draw arrow from encryption to ciphertext
        drawArrow(container, xPos + 120, yPos + 20, xPos + 160, yPos + 20, '#333');

        // Move to next row
        yPos += 70;
    }
}

// CBC Mode visualization
function visualizeCBC(blocks, key, iv, container) {
    let xPos = 20;
    let yPos = 60;

    // Draw IV
    const ivBlock = document.createElement('div');
    ivBlock.className = 'block iv-block';
    ivBlock.textContent = iv;
    ivBlock.style.position = 'absolute';
    ivBlock.style.left = `${xPos}px`;
    ivBlock.style.top = `${yPos - 50}px`;
    container.appendChild(ivBlock);

    let prevCipher = iv;

    for (let i = 0; i < blocks.length; i++) {
        // Draw plaintext block
        const pBlock = document.createElement('div');
        pBlock.className = 'block plaintext-block';
        pBlock.textContent = blocks[i];
        pBlock.style.position = 'absolute';
        pBlock.style.left = `${xPos}px`;
        pBlock.style.top = `${yPos}px`;
        container.appendChild(pBlock);

        // Draw XOR
        const xorOp = document.createElement('div');
        xorOp.className = 'operation';
        xorOp.textContent = '⊕';
        xorOp.style.position = 'absolute';
        xorOp.style.left = `${xPos + 90}px`;
        xorOp.style.top = `${yPos + 5}px`;
        container.appendChild(xorOp);

        // Draw arrow from previous cipher/IV to XOR
        drawArrow(container, xPos + 40, yPos - 30, xPos + 90, yPos + 5, '#0000cc');

        // Draw XOR result
        const xorResult = xorBinary(blocks[i], prevCipher);

        // Draw encryption
        const enc = document.createElement('div');
        enc.className = 'operation';
        enc.textContent = 'E';
        enc.style.position = 'absolute';
        enc.style.left = `${xPos + 130}px`;
        enc.style.top = `${yPos + 5}px`;
        container.appendChild(enc);

        // Draw key
        const keyBlock = document.createElement('div');
        keyBlock.className = 'block key-block';
        keyBlock.textContent = key;
        keyBlock.style.position = 'absolute';
        keyBlock.style.left = `${xPos + 130}px`;
        keyBlock.style.top = `${yPos - 50}px`;
        container.appendChild(keyBlock);

        // Draw arrow from key to encryption
        drawArrow(container, xPos + 170, yPos - 30, xPos + 170, yPos + 5, '#ff9900');

        // Draw ciphertext block
        const cipher = xorBinary(xorResult, key); // Simplified
        const cBlock = document.createElement('div');
        cBlock.className = 'block ciphertext-block';
        cBlock.textContent = cipher;
        cBlock.style.position = 'absolute';
        cBlock.style.left = `${xPos + 200}px`;
        cBlock.style.top = `${yPos}px`;
        container.appendChild(cBlock);

        // Draw arrow from plaintext to XOR
        drawArrow(container, xPos + 80, yPos + 20, xPos + 90, yPos + 20, '#333');

        // Draw arrow from XOR to encryption
        drawArrow(container, xPos + 110, yPos + 20, xPos + 130, yPos + 20, '#333');

        // Draw arrow from encryption to ciphertext
        drawArrow(container, xPos + 150, yPos + 20, xPos + 200, yPos + 20, '#333');

        // Update previous cipher for next block
        prevCipher = cipher;

        // Move to next row
        yPos += 100;
    }
}

// CTR Mode visualization
function visualizeCTR(blocks, key, counter, container) {
    let xPos = 20;
    let yPos = 60;

    let currentCounter = counter;

    for (let i = 0; i < blocks.length; i++) {
        // Draw counter
        const ctrBlock = document.createElement('div');
        ctrBlock.className = 'block iv-block';
        ctrBlock.textContent = currentCounter;
        ctrBlock.style.position = 'absolute';
        ctrBlock.style.left = `${xPos}px`;
        ctrBlock.style.top = `${yPos - 50}px`;
        container.appendChild(ctrBlock);

        // Draw encryption
        const enc = document.createElement('div');
        enc.className = 'operation';
        enc.textContent = 'E';
        enc.style.position = 'absolute';
        enc.style.left = `${xPos + 90}px`;
        enc.style.top = `${yPos - 50}px`;
        container.appendChild(enc);

        // Draw key
        const keyBlock = document.createElement('div');
        keyBlock.className = 'block key-block';
        keyBlock.textContent = key;
        keyBlock.style.position = 'absolute';
        keyBlock.style.left = `${xPos + 90}px`;
        keyBlock.style.top = `${yPos - 100}px`;
        container.appendChild(keyBlock);

        // Draw arrow from key to encryption
        drawArrow(container, xPos + 130, yPos - 80, xPos + 130, yPos - 50, '#ff9900');

        // Draw arrow from counter to encryption
        drawArrow(container, xPos + 80, yPos - 30, xPos + 90, yPos - 30, '#333');

        // Draw encrypted counter
        const encCounter = xorBinary(currentCounter, key); // Simplified
        const encCounterBlock = document.createElement('div');
        encCounterBlock.className = 'block';
        encCounterBlock.textContent = encCounter;
        encCounterBlock.style.position = 'absolute';
        encCounterBlock.style.left = `${xPos + 130}px`;
        encCounterBlock.style.top = `${yPos - 50}px`;
        container.appendChild(encCounterBlock);

        // Draw arrow from encryption to encrypted counter
        drawArrow(container, xPos + 110, yPos - 30, xPos + 130, yPos - 30, '#333');

        // Draw plaintext block
        const pBlock = document.createElement('div');
        pBlock.className = 'block plaintext-block';
        pBlock.textContent = blocks[i];
        pBlock.style.position = 'absolute';
        pBlock.style.left = `${xPos + 130}px`;
        pBlock.style.top = `${yPos}px`;
        container.appendChild(pBlock);

        // Draw XOR
        const xorOp = document.createElement('div');
        xorOp.className = 'operation';
        xorOp.textContent = '⊕';
        xorOp.style.position = 'absolute';
        xorOp.style.left = `${xPos + 170}px`;
        xorOp.style.top = `${yPos - 15}px`;
        container.appendChild(xorOp);

        // Draw arrow from encrypted counter to XOR
        drawArrow(container, xPos + 170, yPos - 30, xPos + 170, yPos - 15, '#333');

        // Draw arrow from plaintext to XOR
        drawArrow(container, xPos + 170, yPos, xPos + 170, yPos - 15, '#333');

        // Draw ciphertext block
        const cipher = xorBinary(blocks[i], encCounter);
        const cBlock = document.createElement('div');
        cBlock.className = 'block ciphertext-block';
        cBlock.textContent = cipher;
        cBlock.style.position = 'absolute';
        cBlock.style.left = `${xPos + 230}px`;
        cBlock.style.top = `${yPos - 15}px`;
        container.appendChild(cBlock);

        // Draw arrow from XOR to ciphertext
        drawArrow(container, xPos + 190, yPos - 15, xPos + 230, yPos - 15, '#333');

        // Increment counter (binary addition)
        currentCounter = incrementBinary(currentCounter);

        // Move to next row
        yPos += 120;
    }
}

// Helper function to increment binary string
function incrementBinary(binary) {
    let result = '';
    let carry = 1;

    for (let i = binary.length - 1; i >= 0; i--) {
        const bit = parseInt(binary[i], 2);
        const sum = bit + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }

    if (carry > 0) {
        result = '1' + result;
    }

    return result;
}

// Helper function to draw an arrow
function drawArrow(container, x1, y1, x2, y2, color) {
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.width = '1px';
    arrow.style.height = `${Math.abs(y2 - y1)}px`;
    arrow.style.backgroundColor = color;
    arrow.style.left = `${x1}px`;
    arrow.style.top = `${Math.min(y1, y2)}px`;
    container.appendChild(arrow);

    // Add arrowhead if horizontal
    if (y1 === y2) {
        arrow.style.width = `${Math.abs(x2 - x1)}px`;
        arrow.style.height = '1px';
        arrow.style.left = `${Math.min(x1, x2)}px`;

        const arrowhead = document.createElement('div');
        arrowhead.style.position = 'absolute';
        arrowhead.style.width = '0';
        arrowhead.style.height = '0';
        arrowhead.style.borderTop = '5px solid transparent';
        arrowhead.style.borderBottom = '5px solid transparent';
        arrowhead.style.borderLeft = `5px solid ${color}`;
        arrowhead.style.left = `${x2 - 5}px`;
        arrowhead.style.top = `${y2 - 5}px`;
        container.appendChild(arrowhead);
    }
}