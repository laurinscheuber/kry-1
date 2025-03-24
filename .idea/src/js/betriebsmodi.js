/**
 * Betriebsmodi (Operation Modes) section JavaScript
 * Handles ECB, CBC and CTR mode simulations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ECB Mode Simulation
    document.getElementById('run-ecb').addEventListener('click', function() {
        const plaintext = document.getElementById('ecb-plaintext').value;
        const key = document.getElementById('ecb-key').value;

        // Validate inputs
        if (!validateBlocks(plaintext) || !validateBinary(key)) {
            document.getElementById('ecb-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Binärblöcke für den Klartext (durch Leerzeichen getrennt) und einen Binärschlüssel ein.</p>
                </div>
            `;
            return;
        }

        // Run ECB mode simulation
        const blocks = plaintext.split(/\s+/);
        const ciphertext = simulateECB(blocks, key);

        // Display results
        document.getElementById('ecb-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Schlüssel:</strong> ${key}</p>
                <p><strong>Chiffretext:</strong> ${ciphertext.join(' ')}</p>
            </div>
        `;

        // Visualize
        visualizeMode('ecb', plaintext, key, '', 'ecb-visualizer');
    });

    // CBC Mode Simulation
    document.getElementById('run-cbc').addEventListener('click', function() {
        const plaintext = document.getElementById('cbc-plaintext').value;
        const key = document.getElementById('cbc-key').value;
        const iv = document.getElementById('cbc-iv').value;

        // Validate inputs
        if (!validateBlocks(plaintext) || !validateBinary(key) || !validateBinary(iv)) {
            document.getElementById('cbc-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Binärblöcke für den Klartext (durch Leerzeichen getrennt), einen Binärschlüssel und einen IV ein.</p>
                </div>
            `;
            return;
        }

        // Run CBC mode simulation
        const blocks = plaintext.split(/\s+/);
        const ciphertext = simulateCBC(blocks, key, iv);

        // Display results
        document.getElementById('cbc-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Schlüssel:</strong> ${key}</p>
                <p><strong>IV:</strong> ${iv}</p>
                <p><strong>Chiffretext:</strong> ${iv} ${ciphertext.join(' ')}</p>
            </div>
        `;

        // Visualize
        visualizeMode('cbc', plaintext, key, iv, 'cbc-visualizer');
    });

    // CTR Mode Simulation
    document.getElementById('run-ctr').addEventListener('click', function() {
        const plaintext = document.getElementById('ctr-plaintext').value;
        const key = document.getElementById('ctr-key').value;
        const counter = document.getElementById('ctr-counter').value;

        // Validate inputs
        if (!validateBlocks(plaintext) || !validateBinary(key) || !validateBinary(counter)) {
            document.getElementById('ctr-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Binärblöcke für den Klartext (durch Leerzeichen getrennt), einen Binärschlüssel und einen Counter ein.</p>
                </div>
            `;
            return;
        }

        // Run CTR mode simulation
        const blocks = plaintext.split(/\s+/);
        const { ciphertext, counters } = simulateCTR(blocks, key, counter);

        // Display results
        document.getElementById('ctr-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Schlüssel:</strong> ${key}</p>
                <p><strong>Initialer Counter:</strong> ${counter}</p>
                <p><strong>Verwendete Counters:</strong> ${counters.join(', ')}</p>
                <p><strong>Chiffretext:</strong> ${ciphertext.join(' ')}</p>
            </div>
        `;

        // Visualize
        visualizeMode('ctr', plaintext, key, counter, 'ctr-visualizer');
    });

    /**
     * Validates if the plaintext consists of valid binary blocks
     * @param {string} blocks - Space-separated binary blocks
     * @returns {boolean} True if valid
     */
    function validateBlocks(blocks) {
        const blockArray = blocks.split(/\s+/);
        return blockArray.every(block => validateBinary(block));
    }

    /**
     * Validates binary input
     * @param {string} input - Binary string
     * @returns {boolean} True if valid
     */
    function validateBinary(input) {
        return /^[01]+$/.test(input);
    }

    /**
     * Simulates ECB mode encryption
     * @param {Array} blocks - Array of plaintext blocks
     * @param {string} key - Encryption key
     * @returns {Array} Array of ciphertext blocks
     */
    function simulateECB(blocks, key) {
        return blocks.map(block => simplifiedEncrypt(block, key));
    }

    /**
     * Simulates CBC mode encryption
     * @param {Array} blocks - Array of plaintext blocks
     * @param {string} key - Encryption key
     * @param {string} iv - Initialization vector
     * @returns {Array} Array of ciphertext blocks
     */
    function simulateCBC(blocks, key, iv) {
        const ciphertext = [];
        let prevBlock = iv;

        for (const block of blocks) {
            // XOR with previous ciphertext block
            const xorResult = xorBinary(block, prevBlock);
            // Encrypt
            const cipherBlock = simplifiedEncrypt(xorResult, key);
            // Add to result
            ciphertext.push(cipherBlock);
            // Update previous block
            prevBlock = cipherBlock;
        }

        return ciphertext;
    }

    /**
     * Simulates CTR mode encryption
     * @param {Array} blocks - Array of plaintext blocks
     * @param {string} key - Encryption key
     * @param {string} initialCounter - Initial counter value
     * @returns {Object} Object containing ciphertext blocks and used counters
     */
    function simulateCTR(blocks, key, initialCounter) {
        const ciphertext = [];
        const counters = [];
        let counter = initialCounter;

        for (const block of blocks) {
            // Save the counter
            counters.push(counter);

            // Encrypt counter
            const encryptedCounter = simplifiedEncrypt(counter, key);

            // XOR with plaintext
            const cipherBlock = xorBinary(block, encryptedCounter);

            // Add to result
            ciphertext.push(cipherBlock);

            // Increment counter
            counter = incrementBinary(counter);
        }

        return { ciphertext, counters };
    }

    /**
     * Simplified encryption function for demonstration
     * In real SPN, this would apply substitution, permutation, and key addition
     * For simplicity, we just XOR the block with the key
     * @param {string} block - Plaintext block
     * @param {string} key - Encryption key
     * @returns {string} Ciphertext block
     */
    function simplifiedEncrypt(block, key) {
        // Pad or truncate key to match block length
        const paddedKey = key.padEnd(block.length, '0').substring(0, block.length);

        // XOR block with key
        return xorBinary(block, paddedKey);
    }

    /**
     * XOR two binary strings
     * @param {string} a - First binary string
     * @param {string} b - Second binary string
     * @returns {string} Result of XOR operation
     */
    function xorBinary(a, b) {
        // Ensure both strings have the same length
        const length = Math.max(a.length, b.length);
        const paddedA = a.padStart(length, '0');
        const paddedB = b.padStart(length, '0');

        let result = '';
        for (let i = 0; i < length; i++) {
            result += (paddedA[i] === paddedB[i]) ? '0' : '1';
        }
        return result;
    }

    /**
     * Increments a binary string by 1
     * @param {string} binary - Binary string to increment
     * @returns {string} Incremented binary string
     */
    function incrementBinary(binary) {
        // Convert to number, add 1, convert back to binary string
        const value = parseInt(binary, 2);
        const incremented = (value + 1) % Math.pow(2, binary.length);
        return incremented.toString(2).padStart(binary.length, '0');
    }
});