/**
 * Grundlagen (Fundamentals) section JavaScript
 * Handles possibilistic security interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for System 1
    document.getElementById('check1').addEventListener('click', function() {
        checkPossibilisticSecurity(1);
    });

    // Set up event listeners for System 2
    document.getElementById('check2').addEventListener('click', function() {
        checkPossibilisticSecurity(2);
    });

    /**
     * Checks if there exists a key in the given system that maps plaintext to ciphertext
     * @param {number} systemNumber - The system number (1 or 2)
     */
    function checkPossibilisticSecurity(systemNumber) {
        const plaintext = document.getElementById(`plaintext${systemNumber}`).value;
        const ciphertext = document.getElementById(`ciphertext${systemNumber}`).value;
        const outputElement = document.getElementById(`output${systemNumber}`);

        // Define the encryption tables for both systems
        const systems = {
            1: {
                // System 1: Latin square (possibilistically secure)
                'a': { 'k₁': 'A', 'k₂': 'B', 'k₃': 'C' },
                'b': { 'k₁': 'B', 'k₂': 'C', 'k₃': 'A' },
                'c': { 'k₁': 'C', 'k₂': 'A', 'k₃': 'B' }
            },
            2: {
                // System 2: Not possibilistically secure
                'a': { 'k₁': 'A', 'k₂': 'B', 'k₃': 'A' },
                'b': { 'k₁': 'B', 'k₂': 'A', 'k₃': 'B' },
                'c': { 'k₁': 'C', 'k₂': 'C', 'k₃': 'C' }
            }
        };

        // Get the system
        const system = systems[systemNumber];

        // Check if there exists a key that maps plaintext to ciphertext
        const plaintextKeys = system[plaintext];
        const possibleKeys = [];

        for (const key in plaintextKeys) {
            if (plaintextKeys[key] === ciphertext) {
                possibleKeys.push(key);
            }
        }

        // Output the result
        let resultHTML = '';

        if (possibleKeys.length > 0) {
            resultHTML += `
                <div class="info-box">
                    <p>✅ Es existiert ein Schlüssel, der "${plaintext}" auf "${ciphertext}" abbildet!</p>
                    <p>Mögliche Schlüssel: ${possibleKeys.join(', ')}</p>
                </div>
            `;
        } else {
            resultHTML += `
                <div class="warning-box">
                    <p>❌ Es existiert kein Schlüssel, der "${plaintext}" auf "${ciphertext}" abbildet!</p>
                </div>
            `;
        }

        // Check all plaintext-ciphertext pairs to determine if the system is possibilistically secure
        const isPossibilisticallySecure = checkSystemSecurity(system);

        if (isPossibilisticallySecure.secure) {
            resultHTML += `
                <div class="info-box">
                    <p><strong>System ${systemNumber} ist possibilistisch sicher.</strong></p>
                    <p>Für jedes Klartextzeichen und jedes Chiffretextzeichen existiert ein Schlüssel.</p>
                </div>
            `;
        } else {
            resultHTML += `
                <div class="warning-box">
                    <p><strong>System ${systemNumber} ist nicht possibilistisch sicher.</strong></p>
                    <p>Unmögliche Paare (Klartext,Chiffretext): ${isPossibilisticallySecure.impossiblePairs.join(', ')}</p>
                </div>
            `;
        }

        // Update the output element
        outputElement.innerHTML = resultHTML;
    }

    /**
     * Checks if a system is possibilistically secure
     * @param {object} system - The encryption system to check
     * @returns {object} Object indicating if system is secure and any impossible pairs
     */
    function checkSystemSecurity(system) {
        let isPossibilisticallySecure = true;
        const impossiblePairs = [];

        const plaintexts = ['a', 'b', 'c'];
        const ciphertexts = ['A', 'B', 'C'];

        for (const pt of plaintexts) {
            for (const ct of ciphertexts) {
                let found = false;
                const plaintextKeys = system[pt];

                for (const key in plaintextKeys) {
                    if (plaintextKeys[key] === ct) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    isPossibilisticallySecure = false;
                    impossiblePairs.push(`(${pt},${ct})`);
                }
            }
        }

        return {
            secure: isPossibilisticallySecure,
            impossiblePairs: impossiblePairs
        };
    }

    // Call the functions initially to show the security status of both systems
    checkSystemSecurity(1);
    checkSystemSecurity(2);
});