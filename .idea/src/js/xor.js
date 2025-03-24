/**
 * XOR section JavaScript
 * Handles XOR calculator and visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // XOR Calculator button
    document.getElementById('calculate-xor').addEventListener('click', function() {
        const a = document.getElementById('xor-a').value;
        const b = document.getElementById('xor-b').value;

        // Validate input
        if (!validateBinary(a) || !validateBinary(b)) {
            document.getElementById('xor-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Binärzahlen ein (nur 0 und 1).</p>
                </div>
            `;
            return;
        }

        // Check if lengths match
        if (a.length !== b.length) {
            document.getElementById('xor-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Binärzahlen müssen gleich lang sein.</p>
                    <p>A: ${a.length} Bits, B: ${b.length} Bits</p>
                </div>
            `;
            return;
        }

        // Compute XOR with steps
        try {
            const { result, steps } = xorWithSteps(a, b);

            // Display result
            document.getElementById('xor-output').innerHTML = `
                <div class="info-box">
                    <p><strong>Ergebnis:</strong> ${result}</p>
                </div>
            `;

            // Show steps
            showSteps('xor-steps', steps);
        } catch (e) {
            document.getElementById('xor-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: ${e.message}</p>
                </div>
            `;
        }
    });

    // XOR Visualization button
    document.getElementById('start-xor-viz').addEventListener('click', function() {
        const a = document.getElementById('xor-viz-a').value;
        const b = document.getElementById('xor-viz-b').value;

        // Validate input
        if (!validateBinary(a) || !validateBinary(b)) {
            document.getElementById('xor-visualizer').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Binärzahlen ein (nur 0 und 1).</p>
                </div>
            `;
            return;
        }

        // Check if lengths match
        if (a.length !== b.length) {
            document.getElementById('xor-visualizer').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Binärzahlen müssen gleich lang sein.</p>
                    <p>A: ${a.length} Bits, B: ${b.length} Bits</p>
                </div>
            `;
            return;
        }

        // Limit length to 8 bits for better visualization
        if (a.length > 8) {
            document.getElementById('xor-visualizer').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Die Visualisierung unterstützt maximal 8 Bits.</p>
                </div>
            `;
            return;
        }

        // Start visualization
        visualizeXOR(a, b, 'xor-visualizer');
    });

    // Helper function to validate binary input
    function validateBinary(input) {
        return /^[01]+$/.test(input);
    }
});