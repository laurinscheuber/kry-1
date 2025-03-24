/**
 * RSA section JavaScript
 * Handles RSA key generation, encryption, decryption and fast exponentiation
 */

document.addEventListener('DOMContentLoaded', function() {
    // RSA Key Generation
    document.getElementById('generate-keys').addEventListener('click', function() {
        const p = parseInt(document.getElementById('rsa-p').value);
        const q = parseInt(document.getElementById('rsa-q').value);

        // Validate inputs
        if (isNaN(p) || isNaN(q) || p < 2 || q < 2) {
            document.getElementById('key-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: p und q müssen positive Zahlen größer als 1 sein.</p>
                </div>
            `;
            return;
        }

        // Check if p and q are prime
        if (!isPrime(p) || !isPrime(q)) {
            document.getElementById('key-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: p und q müssen Primzahlen sein.</p>
                </div>
            `;
            return;
        }

        // Generate RSA keys
        const { n, phi, e, d, steps } = generateRSAKeys(p, q);

        // Display results
        document.getElementById('key-output').innerHTML = `
            <div class="info-box">
                <p><strong>Öffentlicher Schlüssel (n, e):</strong> (${n}, ${e})</p>
                <p><strong>Privater Schlüssel (n, d):</strong> (${n}, ${d})</p>
            </div>
        `;

        // Show steps
        showSteps('key-steps', steps);

        // Update encryption/decryption inputs
        document.getElementById('rsa-encrypt-n').value = n;
        document.getElementById('rsa-encrypt-e').value = e;
        document.getElementById('rsa-decrypt-n').value = n;
        document.getElementById('rsa-decrypt-d').value = d;
    });

    // RSA Encryption
    document.getElementById('rsa-encrypt-btn').addEventListener('click', function() {
        const n = parseInt(document.getElementById('rsa-encrypt-n').value);
        const e = parseInt(document.getElementById('rsa-encrypt-e').value);
        const message = parseInt(document.getElementById('rsa-plaintext').value);

        // Validate inputs
        if (isNaN(n) || isNaN(e) || isNaN(message)) {
            document.getElementById('rsa-encrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: n, e und Klartext müssen ganze Zahlen sein.</p>
                </div>
            `;
            return;
        }

        if (message < 0 || message >= n) {
            document.getElementById('rsa-encrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Der Klartext muss zwischen 0 und ${n-1} liegen.</p>
                </div>
            `;
            return;
        }

        // Encrypt
        const { result, steps } = modPow(message, e, n);

        // Display results
        document.getElementById('rsa-encrypt-output').innerHTML = `
            <div class="info-box">
                <p><strong>Formel:</strong> C = M^e mod n = ${message}^${e} mod ${n}</p>
                <p><strong>Chiffretext:</strong> ${result}</p>
            </div>
        `;

        // Show steps
        showSteps('encrypt-steps', steps);

        // Update decryption input
        document.getElementById('rsa-ciphertext').value = result;
    });

    // RSA Decryption
    document.getElementById('rsa-decrypt-btn').addEventListener('click', function() {
        const n = parseInt(document.getElementById('rsa-decrypt-n').value);
        const d = parseInt(document.getElementById('rsa-decrypt-d').value);
        const ciphertext = parseInt(document.getElementById('rsa-ciphertext').value);

        // Validate inputs
        if (isNaN(n) || isNaN(d) || isNaN(ciphertext)) {
            document.getElementById('rsa-decrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: n, d und Chiffretext müssen ganze Zahlen sein.</p>
                </div>
            `;
            return;
        }

        if (ciphertext < 0 || ciphertext >= n) {
            document.getElementById('rsa-decrypt-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Der Chiffretext muss zwischen 0 und ${n-1} liegen.</p>
                </div>
            `;
            return;
        }

        // Decrypt
        const { result, steps } = modPow(ciphertext, d, n);

        // Display results
        document.getElementById('rsa-decrypt-output').innerHTML = `
            <div class="info-box">
                <p><strong>Formel:</strong> M = C^d mod n = ${ciphertext}^${d} mod ${n}</p>
                <p><strong>Klartext:</strong> ${result}</p>
            </div>
        `;

        // Show steps
        showSteps('decrypt-steps', steps);

        // Update encryption input
        document.getElementById('rsa-plaintext').value = result;
    });

    // Fast Exponentiation Calculator
    document.getElementById('calc-fast-exp').addEventListener('click', function() {
        const a = parseInt(document.getElementById('fast-exp-a').value);
        const b = parseInt(document.getElementById('fast-exp-b').value);
        const n = parseInt(document.getElementById('fast-exp-n').value);

        // Validate inputs
        if (isNaN(a) || isNaN(b) || isNaN(n) || a < 0 || b < 0 || n <= 0) {
            document.getElementById('fast-exp-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: a, b und n müssen nicht-negative Zahlen sein, und n muss größer als 0 sein.</p>
                </div>
            `;
            return;
        }

        // Calculate
        const { result, steps } = modPow(a, b, n);

        // Display results
        document.getElementById('fast-exp-output').innerHTML = `
            <div class="info-box">
                <p><strong>Formel:</strong> a^b mod n = ${a}^${b} mod ${n}</p>
                <p><strong>Ergebnis:</strong> ${result}</p>
            </div>
        `;

        // Show steps
        showSteps('fast-exp-steps', steps);
    });

    /**
     * Generates RSA keys
     * @param {number} p - First prime number
     * @param {number} q - Second prime number
     * @returns {Object} Object containing n, phi, e, d, and steps
     */
    function generateRSAKeys(p, q) {
        const steps = [];

        // Calculate n
        const n = p * q;
        steps.push(`Berechne n = p · q = ${p} · ${q} = ${n}`);

        // Calculate Euler's totient function φ(n)
        const phi = (p - 1) * (q - 1);
        steps.push(`Berechne φ(n) = (p - 1) · (q - 1) = (${p} - 1) · (${q} - 1) = ${phi}`);

        // Choose e (public exponent)
        // For simplicity, we'll use 65537 if possible, otherwise find the smallest valid e
        let e = 65537;
        if (e >= phi || gcd(e, phi) !== 1) {
            e = findCoprime(phi);
        }
        steps.push(`Wähle e = ${e} (teilerfremd zu φ(n), also ggT(e, φ(n)) = 1)`);

        // Calculate d (private exponent)
        const d = modInverse(e, phi);
        steps.push(`Berechne d = e^(-1) mod φ(n) = ${e}^(-1) mod ${phi} = ${d}`);

        // Verify e·d ≡ 1 (mod φ(n))
        const verification = (e * d) % phi;
        steps.push(`Überprüfe: e · d mod φ(n) = ${e} · ${d} mod ${phi} = ${verification} ≡ 1 (mod ${phi})`);

        return { n, phi, e, d, steps };
    }

    /**
     * Checks if a number is prime
     * @param {number} num - Number to check
     * @returns {boolean} True if prime
     */
    function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }

        return true;
    }

    /**
     * Finds the smallest number greater than 1 that is coprime to n
     * @param {number} n - Number to find coprime for
     * @returns {number} Smallest coprime
     */
    function findCoprime(n) {
        for (let i = 2; i < n; i++) {
            if (gcd(i, n) === 1) {
                return i;
            }
        }
        return 1; // Fallback, shouldn't happen for valid input
    }
});