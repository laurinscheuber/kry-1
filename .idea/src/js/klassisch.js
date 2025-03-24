/**
 * Klassische Verfahren (Classical Methods) section JavaScript
 * Handles Caesar cipher and One-Time Pad
 */

document.addEventListener('DOMContentLoaded', function() {
    // Caesar Cipher Encryption
    document.getElementById('caesar-encrypt').addEventListener('click', function() {
        const plaintext = document.getElementById('caesar-plain').value;
        const shift = parseInt(document.getElementById('caesar-shift').value);

        // Validate shift
        if (isNaN(shift) || shift < 1 || shift > 25) {
            document.getElementById('caesar-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Verschiebung muss zwischen 1 und 25 liegen.</p>
                </div>
            `;
            return;
        }

        // Encrypt and display result
        const ciphertext = caesarCipher(plaintext, shift, true);
        document.getElementById('caesar-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Verschiebung:</strong> ${shift}</p>
                <p><strong>Chiffretext:</strong> ${ciphertext}</p>
            </div>
        `;
    });

    // Caesar Cipher Decryption
    document.getElementById('caesar-decrypt').addEventListener('click', function() {
        const ciphertext = document.getElementById('caesar-plain').value;
        const shift = parseInt(document.getElementById('caesar-shift').value);

        // Validate shift
        if (isNaN(shift) || shift < 1 || shift > 25) {
            document.getElementById('caesar-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Verschiebung muss zwischen 1 und 25 liegen.</p>
                </div>
            `;
            return;
        }

        // Decrypt and display result
        const plaintext = caesarCipher(ciphertext, shift, false);
        document.getElementById('caesar-output').innerHTML = `
            <div class="info-box">
                <p><strong>Chiffretext:</strong> ${ciphertext}</p>
                <p><strong>Verschiebung:</strong> ${shift}</p>
                <p><strong>Klartext:</strong> ${plaintext}</p>
            </div>
        `;
    });

    // One-Time Pad Key Generation
    document.getElementById('otp-generate-key').addEventListener('click', function() {
        const plaintext = document.getElementById('otp-plain').value;

        // Validate binary input
        if (!validateBinary(plaintext)) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Der Klartext muss eine Binärzahl sein (nur 0 und 1).</p>
                </div>
            `;
            return;
        }

        // Generate random key of same length
        const key = randomBinary(plaintext.length);
        document.getElementById('otp-key').value = key;

        document.getElementById('otp-output').innerHTML = `
            <div class="info-box">
                <p>Zufälliger Schlüssel mit Länge ${key.length} generiert.</p>
            </div>
        `;
    });

    // One-Time Pad Encryption
    document.getElementById('otp-encrypt').addEventListener('click', function() {
        const plaintext = document.getElementById('otp-plain').value;
        const key = document.getElementById('otp-key').value;

        // Validate inputs
        if (!validateBinary(plaintext) || !validateBinary(key)) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Klartext und Schlüssel müssen Binärzahlen sein (nur 0 und 1).</p>
                </div>
            `;
            return;
        }

        // Check if key is available
        if (key.length === 0) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte generieren Sie zuerst einen Schlüssel.</p>
                </div>
            `;
            return;
        }

        // Check if lengths match
        if (plaintext.length !== key.length) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Klartext und Schlüssel müssen gleich lang sein.</p>
                    <p>Klartext: ${plaintext.length} Bits, Schlüssel: ${key.length} Bits</p>
                </div>
            `;
            return;
        }

        // Encrypt using XOR
        const ciphertext = xorBinary(plaintext, key);

        document.getElementById('otp-output').innerHTML = `
            <div class="info-box">
                <p><strong>Klartext:</strong> ${plaintext}</p>
                <p><strong>Schlüssel:</strong> ${key}</p>
                <p><strong>Chiffretext:</strong> ${ciphertext}</p>
            </div>
        `;
    });

    // One-Time Pad Decryption
    document.getElementById('otp-decrypt').addEventListener('click', function() {
        const ciphertext = document.getElementById('otp-plain').value;
        const key = document.getElementById('otp-key').value;

        // Validate inputs
        if (!validateBinary(ciphertext) || !validateBinary(key)) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Chiffretext und Schlüssel müssen Binärzahlen sein (nur 0 und 1).</p>
                </div>
            `;
            return;
        }

        // Check if key is available
        if (key.length === 0) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte generieren Sie zuerst einen Schlüssel.</p>
                </div>
            `;
            return;
        }

        // Check if lengths match
        if (ciphertext.length !== key.length) {
            document.getElementById('otp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Chiffretext und Schlüssel müssen gleich lang sein.</p>
                    <p>Chiffretext: ${ciphertext.length} Bits, Schlüssel: ${key.length} Bits</p>
                </div>
            `;
            return;
        }

        // Decrypt using XOR (same operation as encryption)
        const plaintext = xorBinary(ciphertext, key);

        document.getElementById('otp-output').innerHTML = `
            <div class="info-box">
                <p><strong>Chiffretext:</strong> ${ciphertext}</p>
                <p><strong>Schlüssel:</strong> ${key}</p>
                <p><strong>Klartext:</strong> ${plaintext}</p>
            </div>
        `;
    });

    // Helper function to validate binary input
    function validateBinary(input) {
        return /^[01]+$/.test(input);
    }
});