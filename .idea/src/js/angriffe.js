/**
 * Angriffe (Attacks) section JavaScript
 * Handles frequency analysis and brute force attacks
 */

document.addEventListener('DOMContentLoaded', function() {
    // Frequency Analysis
    document.getElementById('analyze-freq').addEventListener('click', function() {
        const ciphertext = document.getElementById('freq-ciphertext').value;

        // Validate input
        if (!ciphertext.trim()) {
            document.getElementById('freq-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie einen verschlüsselten Text ein.</p>
                </div>
            `;
            return;
        }

        // Perform frequency analysis
        const frequencyData = frequencyAnalysis(ciphertext);

        // Display results
        let outputHTML = `
            <div class="info-box">
                <p><strong>Häufigkeitsanalyse:</strong></p>
                <table>
                    <tr>
                        <th>Buchstabe</th>
                        <th>Anzahl</th>
                        <th>Prozent</th>
                    </tr>
        `;

        frequencyData.forEach(item => {
            outputHTML += `
                <tr>
                    <td>${item.char}</td>
                    <td>${item.count}</td>
                    <td>${item.percentage}%</td>
                </tr>
            `;
        });

        outputHTML += `
                </table>
                <p>Für deutsche Texte sind die häufigsten Buchstaben: E, N, I, S, R, A, T.</p>
            </div>
        `;

        document.getElementById('freq-output').innerHTML = outputHTML;

        // Create simple bar chart
        createFrequencyChart(frequencyData, 'freq-chart');
    });

    // Apply Substitution
    document.getElementById('apply-substitution').addEventListener('click', function() {
        const ciphertext = document.getElementById('freq-ciphertext').value;
        const substitution = document.getElementById('freq-substitution').value;

        // Validate inputs
        if (!ciphertext.trim()) {
            document.getElementById('decrypted-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie einen verschlüsselten Text ein.</p>
                </div>
            `;
            return;
        }

        // Parse substitution rules
        const rules = parseSubstitutionRules(substitution);

        if (Object.keys(rules).length === 0) {
            document.getElementById('decrypted-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Substitutionsregeln ein (z.B. "A -> E, B -> N").</p>
                </div>
            `;
            return;
        }

        // Apply substitution
        const decrypted = applySubstitution(ciphertext, rules);

        // Display result
        document.getElementById('decrypted-output').innerHTML = `
            <div class="info-box">
                <p><strong>Angewendete Regeln:</strong></p>
                <ul>
                    ${Object.entries(rules).map(([from, to]) => `<li>${from} → ${to}</li>`).join('')}
                </ul>
                <p><strong>Entschlüsselter Text:</strong></p>
                <p>${decrypted}</p>
            </div>
        `;
    });

    // Brute Force Caesar
    document.getElementById('brute-force').addEventListener('click', function() {
        const ciphertext = document.getElementById('brute-ciphertext').value;

        // Validate input
        if (!ciphertext.trim()) {
            document.getElementById('brute-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie einen verschlüsselten Text ein.</p>
                </div>
            `;
            return;
        }

        // Try all 26 possible shifts
        let outputHTML = `
            <div class="info-box">
                <p><strong>Brute-Force-Ergebnisse für alle Verschiebungen:</strong></p>
                <table>
                    <tr>
                        <th>Verschiebung</th>
                        <th>Text</th>
                    </tr>
        `;

        for (let shift = 0; shift < 26; shift++) {
            const decrypted = caesarCipher(ciphertext, shift, false);
            outputHTML += `
                <tr>
                    <td>${shift}</td>
                    <td>${decrypted}</td>
                </tr>
            `;
        }

        outputHTML += `
                </table>
            </div>
        `;

        document.getElementById('brute-output').innerHTML = outputHTML;
    });

    /**
     * Creates a simple frequency chart
     * @param {Array} data - Frequency data
     * @param {string} containerId - ID of the container element
     */
    function createFrequencyChart(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Set dimensions
        const width = container.clientWidth;
        const height = container.clientHeight - 40;
        const barWidth = Math.min(30, (width - 50) / data.length);
        const maxCount = Math.max(...data.map(item => item.count));

        // Create a div for each letter with height based on frequency
        data.forEach((item, index) => {
            const barHeight = (item.count / maxCount) * height;
            const barLeft = 50 + index * (barWidth + 10);

            // Create bar
            const bar = document.createElement('div');
            bar.style.position = 'absolute';
            bar.style.bottom = '40px';
            bar.style.left = `${barLeft}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.height = `${barHeight}px`;
            bar.style.backgroundColor = '#3498db';
            container.appendChild(bar);

            // Create label
            const label = document.createElement('div');
            label.style.position = 'absolute';
            label.style.bottom = '20px';
            label.style.left = `${barLeft}px`;
            label.style.width = `${barWidth}px`;
            label.style.textAlign = 'center';
            label.textContent = item.char;
            container.appendChild(label);

            // Create count label
            const countLabel = document.createElement('div');
            countLabel.style.position = 'absolute';
            countLabel.style.bottom = `${barHeight + 45}px`;
            countLabel.style.left = `${barLeft}px`;
            countLabel.style.width = `${barWidth}px`;
            countLabel.style.textAlign = 'center';
            countLabel.textContent = item.count;
            countLabel.style.fontSize = '12px';
            container.appendChild(countLabel);
        });

        // Create y-axis
        const yAxis = document.createElement('div');
        yAxis.style.position = 'absolute';
        yAxis.style.bottom = '40px';
        yAxis.style.left = '30px';
        yAxis.style.width = '1px';
        yAxis.style.height = `${height}px`;
        yAxis.style.backgroundColor = '#333';
        container.appendChild(yAxis);

        // Create x-axis
        const xAxis = document.createElement('div');
        xAxis.style.position = 'absolute';
        xAxis.style.bottom = '40px';
        xAxis.style.left = '30px';
        xAxis.style.width = `${width - 40}px`;
        xAxis.style.height = '1px';
        xAxis.style.backgroundColor = '#333';
        container.appendChild(xAxis);
    }

    /**
     * Parses substitution rules from a string
     * @param {string} rulesString - String containing substitution rules (e.g., "A -> E, B -> N")
     * @returns {Object} Object mapping from characters to their substitutions
     */
    function parseSubstitutionRules(rulesString) {
        const rules = {};

        // Split by comma or semicolon
        const ruleStrings = rulesString.split(/[,;]\s*/);

        for (const ruleString of ruleStrings) {
            // Match patterns like "A -> E" or "A=>E" or "A:E"
            const match = ruleString.match(/([A-Za-z])\s*(?:->|=>|:)\s*([A-Za-z])/);

            if (match) {
                const [, from, to] = match;
                rules[from.toUpperCase()] = to.toUpperCase();
                // Also add lowercase mapping
                rules[from.toLowerCase()] = to.toLowerCase();
            }
        }

        return rules;
    }

    /**
     * Applies substitution rules to a ciphertext
     * @param {string} ciphertext - Encrypted text
     * @param {Object} rules - Substitution rules
     * @returns {string} Decrypted text
     */
    function applySubstitution(ciphertext, rules) {
        return ciphertext.split('').map(char => {
            return rules[char] || char;
        }).join('');
    }
});