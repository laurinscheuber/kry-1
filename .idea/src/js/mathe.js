/**
 * Mathematik (Mathematics) section JavaScript
 * Handles GCD, extended GCD, and modular arithmetic
 */

document.addEventListener('DOMContentLoaded', function() {
    // GCD Calculation
    document.getElementById('calc-gcd').addEventListener('click', function() {
        const a = parseInt(document.getElementById('gcd-a').value);
        const b = parseInt(document.getElementById('gcd-b').value);

        // Validate inputs
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            document.getElementById('gcd-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie positive Zahlen für a und b ein.</p>
                </div>
            `;
            return;
        }

        // Calculate GCD with steps
        const { result, steps } = calculateGCDWithSteps(a, b);

        // Display result
        document.getElementById('gcd-output').innerHTML = `
            <div class="info-box">
                <p><strong>ggT(${a}, ${b}) = ${result}</strong></p>
            </div>
        `;

        // Show steps
        showSteps('gcd-steps', steps);
    });

    // Extended GCD Calculation
    document.getElementById('calc-ext-gcd').addEventListener('click', function() {
        const a = parseInt(document.getElementById('ext-gcd-a').value);
        const b = parseInt(document.getElementById('ext-gcd-b').value);

        // Validate inputs
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            document.getElementById('ext-gcd-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie positive Zahlen für a und b ein.</p>
                </div>
            `;
            return;
        }

        // Calculate extended GCD with steps
        const { gcd, s, t, steps } = calculateExtendedGCDWithSteps(a, b);

        // Display result
        document.getElementById('ext-gcd-output').innerHTML = `
            <div class="info-box">
                <p><strong>ggT(${a}, ${b}) = ${gcd}</strong></p>
                <p><strong>Bézout-Koeffizienten:</strong> s = ${s}, t = ${t}</p>
                <p><strong>Bézout-Identität:</strong> ${s} · ${a} + ${t} · ${b} = ${gcd}</p>
                <p><strong>Verifizierung:</strong> ${s * a + t * b} = ${gcd}</p>
            </div>
        `;

        // Show steps
        showSteps('ext-gcd-steps', steps);
    });

    // Modular Arithmetic Calculator
    document.getElementById('calc-mod').addEventListener('click', function() {
        const a = parseInt(document.getElementById('mod-a').value);
        const b = parseInt(document.getElementById('mod-b').value);
        const n = parseInt(document.getElementById('mod-n').value);
        const operation = document.getElementById('mod-op').value;

        // Validate inputs
        if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
            document.getElementById('mod-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie gültige Zahlen ein (n muss positiv sein).</p>
                </div>
            `;
            return;
        }

        // Perform operation
        let result, formula;

        switch (operation) {
            case 'add':
                result = (a + b) % n;
                formula = `(${a} + ${b}) mod ${n} = ${result}`;
                break;
            case 'sub':
                result = ((a - b) % n + n) % n; // Ensure positive result
                formula = `(${a} - ${b}) mod ${n} = ${result}`;
                break;
            case 'mul':
                result = (a * b) % n;
                formula = `(${a} · ${b}) mod ${n} = ${result}`;
                break;
            case 'pow':
                const powResult = modPow(a, b, n);
                result = powResult.result;
                formula = `${a}^${b} mod ${n} = ${result}`;
                break;
        }

        // Display result
        document.getElementById('mod-output').innerHTML = `
            <div class="info-box">
                <p><strong>Berechnung:</strong> ${formula}</p>
                <p><strong>Ergebnis:</strong> ${result}</p>
            </div>
        `;
    });

    // Multiplicative Inverse Calculator
    document.getElementById('calc-inv').addEventListener('click', function() {
        const a = parseInt(document.getElementById('inv-a').value);
        const n = parseInt(document.getElementById('inv-n').value);

        // Validate inputs
        if (isNaN(a) || isNaN(n) || a <= 0 || n <= 0) {
            document.getElementById('inv-output').innerHTML = `
                <div class="warning-box">
                    <p>Fehler: Bitte geben Sie positive Zahlen für a und n ein.</p>
                </div>
            `;
            return;
        }

        // Check if inverse exists
        if (gcd(a, n) !== 1) {
            document.getElementById('inv-output').innerHTML = `
                <div class="warning-box">
                    <p>Das multiplikative Inverse existiert nicht, da ggT(${a}, ${n}) = ${gcd(a, n)} ≠ 1.</p>
                </div>
            `;
            return;
        }

        // Calculate inverse with extended GCD
        const { s, t, steps } = calculateExtendedGCDWithSteps(a, n);

        // The coefficient s is the inverse, but may need to be made positive
        const inverse = ((s % n) + n) % n;

        // Display result
        document.getElementById('inv-output').innerHTML = `
            <div class="info-box">
                <p><strong>Multiplikatives Inverses von ${a} modulo ${n}:</strong> ${inverse}</p>
                <p><strong>Verifizierung:</strong> ${a} · ${inverse} mod ${n} = ${(a * inverse) % n}</p>
            </div>
        `;

        // Show steps
        const inverseSteps = [
            ...steps,
            `Das multiplikative Inverse ist s = ${s}`,
            `Falls s negativ ist, addieren wir n: (${s} mod ${n} + ${n}) mod ${n} = ${inverse}`,
            `Verifizierung: ${a} · ${inverse} mod ${n} = ${(a * inverse) % n}`
        ];
        showSteps('inv-steps', inverseSteps);
    });

    /**
     * Calculates GCD with step-by-step explanation
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {Object} Object containing result and steps
     */
    function calculateGCDWithSteps(a, b) {
        const steps = [`Berechne ggT(${a}, ${b}) mit dem Euklidischen Algorithmus:`];
        const originalA = a;
        const originalB = b;

        // Ensure a >= b
        if (a < b) {
            [a, b] = [b, a];
            steps.push(`Tausche a und b, damit a ≥ b: ggT(${originalA}, ${originalB}) = ggT(${a}, ${b})`);
        }

        // Euclidean algorithm
        while (b !== 0) {
            const quotient = Math.floor(a / b);
            const remainder = a % b;
            steps.push(`${a} = ${b} · ${quotient} + ${remainder}`);

            a = b;
            b = remainder;
        }

        steps.push(`Der ggT ist ${a}, da der letzte Rest ungleich 0 ist.`);

        return { result: a, steps };
    }

    /**
     * Calculates extended GCD with step-by-step explanation
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {Object} Object containing gcd, coefficients, and steps
     */
    function calculateExtendedGCDWithSteps(a, b) {
        const steps = [`Berechne erweiterten euklidischen Algorithmus für ggT(${a}, ${b}):`];

        // Store the original values
        const originalA = a;
        const originalB = b;

        // Table for extended Euclidean algorithm
        const table = [];

        // Initialize
        let s1 = 1, s2 = 0, t1 = 0, t2 = 1;

        // Add header row
        steps.push(`<table>
            <tr>
                <th>i</th>
                <th>a_i</th>
                <th>b_i</th>
                <th>q_i</th>
                <th>r_i</th>
                <th>s_i</th>
                <th>t_i</th>
            </tr>`);

        // Store initial values
        table.push({ i: 0, a_i: a, b_i: b, q_i: '-', r_i: '-', s_i: s1, t_i: t1 });
        table.push({ i: 1, a_i: b, b_i: a % b, q_i: Math.floor(a / b), r_i: a % b, s_i: s2, t_i: t2 });

        // Extended Euclidean algorithm
        let i = 2;
        while (table[i-1].b_i !== 0) {
            const a_i = table[i-1].b_i;
            const b_i = table[i-2].b_i % table[i-1].b_i;
            const q_i = Math.floor(table[i-2].b_i / table[i-1].b_i);

            // Update coefficients
            const s_i = table[i-2].s_i - q_i * table[i-1].s_i;
            const t_i = table[i-2].t_i - q_i * table[i-1].t_i;

            table.push({ i, a_i, b_i, q_i, r_i: b_i, s_i, t_i });
            i++;
        }

        // Create table in steps
        for (const row of table) {
            steps.push(`<tr>
                <td>${row.i}</td>
                <td>${row.a_i}</td>
                <td>${row.b_i}</td>
                <td>${row.q_i}</td>
                <td>${row.r_i}</td>
                <td>${row.s_i}</td>
                <td>${row.t_i}</td>
            </tr>`);
        }

        // Close table
        steps.push(`</table>`);

        // Get results from last two rows
        const gcd = table[table.length - 2].a_i;
        const s = table[table.length - 2].s_i;
        const t = table[table.length - 2].t_i;

        // Verification
        steps.push(`Bézout-Identität: ${s} · ${originalA} + ${t} · ${originalB} = ${gcd}`);
        steps.push(`Verifizierung: ${s * originalA + t * originalB} = ${gcd}`);

        return { gcd, s, t, steps };
    }
});