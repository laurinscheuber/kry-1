/**
 * SPN (Substitution-Permutation Network) section JavaScript
 * Handles SPN configuration and encryption
 */

document.addEventListener('DOMContentLoaded', function() {
    // Store SPN configuration
    let spnConfig = {
        rounds: 2,
        sbox: [],
        invSbox: [],
        permutation: [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15], // Default permutation
        key: '',
        roundKeys: []
    };

    // Setup SPN Configuration
    document.getElementById('spn-setup').addEventListener('click', function() {
        const rounds = parseInt(document.getElementById('spn-rounds').value);
        const sboxHex = document.getElementById('spn-sbox').value;
        const key = document.getElementById('spn-key').value;

        // Validate rounds
        if (isNaN(rounds) || rounds < 1 || rounds > 4) {
            document.getElementById('spn-config-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Anzahl der Runden muss zwischen 1 und 4 liegen.</p>
                </div>
            `;
            return;
        }

        // Validate S-Box
        if (!validateHex(sboxHex) || sboxHex.length !== 16) {
            document.getElementById('spn-config-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die S-Box muss 16 hexadezimale Zeichen enthalten.</p>
                </div>
            `;
            return;
        }

        // Validate key
        if (!validateBinary(key) || key.length !== 16) {
            document.getElementById('spn-config-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Der Schlüssel muss 16 Binärzeichen (0 oder 1) enthalten.</p>
                </div>
            `;
            return;
        }

        // Parse S-Box
        const sbox = [];
        for (let i = 0; i < 16; i++) {
            sbox[i] = parseInt(sboxHex[i], 16);
        }

        // Generate inverse S-Box
        const invSbox = new Array(16).fill(0);
        for (let i = 0; i < 16; i++) {
            invSbox[sbox[i]] = i;
        }

        // Generate round keys
        const roundKeys = generateRoundKeys(key, rounds);

        // Store configuration
        spnConfig = {
            rounds,
            sbox,
            invSbox,
            permutation: [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
            key,
            roundKeys
        };

        // Display configuration
        document.getElementById('spn-config-output').innerHTML = `
            <div class="info-box">
                <p><strong>SPN Konfiguration gespeichert:</strong></p>
                <p>Runden: ${rounds}</p>
                <p>S-Box: ${sbox.map(x => x.toString(16).toUpperCase()).join(' ')}</p>
                <p>Schlüssel: ${key}</p>
                <p>Rundenschlüssel:</p>
                <ul>
                    ${roundKeys.map((k, i) => `<li>K${i}: ${k}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    // Run SPN Encryption
    document.getElementById('spn-run').addEventListener('click', function() {
        const plaintext = document.getElementById('spn-plaintext').value;

        // Check if configuration is set
        if (spnConfig.roundKeys.length === 0) {
            document.getElementById('spn-encrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte konfigurieren Sie zuerst das SPN.</p>
                </div>
            `;
            return;
        }

        // Validate plaintext
        if (!validateBinary(plaintext) || plaintext.length !== 16) {
            document.getElementById('spn-encrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Der Klartext muss 16 Binärzeichen (0 oder 1) enthalten.</p>
                </div>
            `;
            return;
        }

        // Encrypt
        const { ciphertext, steps } = encryptSPN(plaintext, spnConfig);

        // Display result
        document.getElementById('spn-encrypt-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Chiffretext:</strong> ${ciphertext}</p>
            </div>
        `;

        // Show steps
        showSteps('spn-steps', steps);
    });

    /**
     * Generates round keys for SPN
     * @param {string} masterKey - 16-bit master key
     * @param {number} rounds - Number of rounds
     * @returns {Array} Array of round keys
     */
    function generateRoundKeys(masterKey, rounds) {
        const roundKeys = [];

        // For each round, including the initial and final key
        for (let i = 0; i <= rounds; i++) {
            // In a real implementation, this would derive the round key from the master key
            // For simplicity, we'll use the full key for all rounds
            roundKeys.push(masterKey);
        }

        return roundKeys;
    }

    /**
     * Encrypts plaintext using SPN
     * @param {string} plaintext - 16-bit binary plaintext
     * @param {Object} config - SPN configuration
     * @returns {Object} Object containing ciphertext and encryption steps
     */
    function encryptSPN(plaintext, config) {
        const { rounds, sbox, permutation, roundKeys } = config;
        const steps = [];

        // Initial state
        let state = plaintext;
        steps.push(`<strong>Anfangszustand:</strong> ${state}`);

        // Initial key addition
        state = xorBinary(state, roundKeys[0]);
        steps.push(`<strong>Initiale Schlüsseladdition (K₀ = ${roundKeys[0]}):</strong> ${state}`);

        // Main rounds
        for (let r = 1; r < rounds; r++) {
            // Substitution layer
            let afterSBox = '';
            for (let i = 0; i < 4; i++) {
                const nibble = state.substring(i * 4, (i + 1) * 4);
                const nibbleValue = parseInt(nibble, 2);
                const substituted = sbox[nibbleValue];
                const substitutedBinary = substituted.toString(2).padStart(4, '0');
                afterSBox += substitutedBinary;
            }
            steps.push(`<strong>Runde ${r}, S-Box:</strong> ${afterSBox}`);

            // Permutation layer
            let afterPerm = new Array(16).fill('0');
            for (let i = 0; i < 16; i++) {
                afterPerm[permutation[i]] = afterSBox[i];
            }
            afterPerm = afterPerm.join('');
            steps.push(`<strong>Runde ${r}, Permutation:</strong> ${afterPerm}`);

            // Round key addition
            state = xorBinary(afterPerm, roundKeys[r]);
            steps.push(`<strong>Runde ${r}, Schlüsseladdition (K${r} = ${roundKeys[r]}):</strong> ${state}`);
        }

        // Final round
        // Substitution layer (no permutation in final round)
        let afterSBox = '';
        for (let i = 0; i < 4; i++) {
            const nibble = state.substring(i * 4, (i + 1) * 4);
            const nibbleValue = parseInt(nibble, 2);
            const substituted = sbox[nibbleValue];
            const substitutedBinary = substituted.toString(2).padStart(4, '0');
            afterSBox += substitutedBinary;
        }
        steps.push(`<strong>Finale Runde, S-Box:</strong> ${afterSBox}`);

        // Final key addition
        const ciphertext = xorBinary(afterSBox, roundKeys[rounds]);
        steps.push(`<strong>Finale Schlüsseladdition (K${rounds} = ${roundKeys[rounds]}):</strong> ${ciphertext}`);

        return { ciphertext, steps };
    }

    /**
     * Helper function to validate binary input
     * @param {string} input - Binary string to validate
     * @returns {boolean} True if valid binary
     */
    function validateBinary(input) {
        return /^[01]+$/.test(input);
    }

    /**
     * Helper function to validate hexadecimal input
     * @param {string} input - Hexadecimal string to validate
     * @returns {boolean} True if valid hexadecimal
     */
    function validateHex(input) {
        return /^[0-9A-Fa-f]+$/.test(input);
    }

    /**
     * XOR two binary strings
     * @param {string} a - First binary string
     * @param {string} b - Second binary string
     * @returns {string} Result of XOR operation
     */
    function xorBinary(a, b) {
        let result = '';
        for (let i = 0; i < a.length; i++) {
            result += (a[i] === b[i]) ? '0' : '1';
        }
        return result;
    }
});