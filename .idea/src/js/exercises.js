/**
 * Exercise functionality JavaScript
 * For integrated exercises in index.html
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeExercises();

    // Re-initialize exercises when the nav links are clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to ensure the section is visible
            setTimeout(initializeExercises, 100);
        });
    });

    /**
     * Initialize all exercise functionality
     */
    function initializeExercises() {
        // Handle individual answer toggles
        const toggleButtons = document.querySelectorAll('.toggle-answer');

        toggleButtons.forEach(button => {
            // Remove existing listener to avoid duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', function() {
                // Find the answer div that follows this button
                const answer = this.nextElementSibling;

                // Toggle visibility
                if (answer.classList.contains('visible')) {
                    answer.classList.remove('visible');
                    this.textContent = 'Antwort anzeigen';
                } else {
                    answer.classList.add('visible');
                    this.textContent = 'Antwort verstecken';
                }
            });
        });

        // Handle toggle all answers button for Serie 1
        const toggleAllButton1 = document.getElementById('toggle-all-answers-1');

        if (toggleAllButton1) {
            // Remove existing listener to avoid duplicates
            const newButton1 = toggleAllButton1.cloneNode(true);
            toggleAllButton1.parentNode.replaceChild(newButton1, toggleAllButton1);

            newButton1.addEventListener('click', function() {
                const section = document.getElementById('serie1');
                toggleAllAnswersInSection(section);
            });
        }

        // Handle toggle all answers button for Serie 2
        const toggleAllButton2 = document.getElementById('toggle-all-answers-2');

        if (toggleAllButton2) {
            // Remove existing listener to avoid duplicates
            const newButton2 = toggleAllButton2.cloneNode(true);
            toggleAllButton2.parentNode.replaceChild(newButton2, toggleAllButton2);

            newButton2.addEventListener('click', function() {
                const section = document.getElementById('serie2');
                toggleAllAnswersInSection(section);
            });
        }

        // Initialize exercise state from URL hash if present
        if (window.location.hash) {
            const hashParts = window.location.hash.substring(1).split('-');
            if (hashParts.length === 2) {
                // Format is like #serie1-3 for Serie 1, Aufgabe 3
                const serieId = hashParts[0];
                const exerciseNum = hashParts[1];
                const exerciseId = `exercise-${serieId}-${exerciseNum}`;
                const exercise = document.getElementById(exerciseId);

                if (exercise) {
                    // Ensure the section is visible
                    const serieSection = document.getElementById(serieId);
                    if (serieSection) {
                        // Make sure the section is active
                        document.querySelectorAll('.section').forEach(section => {
                            section.classList.remove('active');
                        });
                        serieSection.classList.add('active');

                        // Update navigation
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                        });
                        document.querySelector(`a[href="#${serieId}"]`).classList.add('active');
                    }

                    // Scroll to the exercise
                    setTimeout(() => {
                        exercise.scrollIntoView({ behavior: 'smooth' });

                        // Highlight it briefly
                        exercise.style.transition = 'background-color 0.5s';
                        exercise.style.backgroundColor = '#ffe6cc';

                        setTimeout(() => {
                            exercise.style.backgroundColor = 'white';
                        }, 1500);
                    }, 300);
                }
            }
        }

        // Add links to each exercise heading for direct navigation
        document.querySelectorAll('.exercise h3').forEach(heading => {
            // Extract serie and exercise number from parent ID
            const exerciseId = heading.parentElement.id;
            if (!exerciseId) return;

            const parts = exerciseId.split('-');
            if (parts.length !== 3) return;

            const serieId = parts[1];
            const exerciseNum = parts[2];

            // Add link functionality
            heading.style.cursor = 'pointer';
            heading.title = 'Link zu dieser Aufgabe';

            // Remove existing listener to avoid duplicates
            const newHeading = heading.cloneNode(true);
            heading.parentNode.replaceChild(newHeading, heading);

            newHeading.addEventListener('click', function() {
                // Update URL without reload
                const hash = `${serieId}-${exerciseNum}`;
                window.history.pushState({}, '', `#${hash}`);

                // Copy the link to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Show small tooltip or notification
                    const notification = document.createElement('span');
                    notification.textContent = 'Link kopiert!';
                    notification.style.marginLeft = '10px';
                    notification.style.color = 'green';
                    notification.style.fontSize = '0.8em';

                    newHeading.appendChild(notification);

                    setTimeout(() => {
                        if (notification.parentNode === newHeading) {
                            newHeading.removeChild(notification);
                        }
                    }, 2000);
                });
            });
        });
    }

    /**
     * Toggles all answers in a specific section
     * @param {HTMLElement} section - The section containing answers to toggle
     */
    function toggleAllAnswersInSection(section) {
        if (!section) return;

        const answers = section.querySelectorAll('.answer');
        const toggleButtons = section.querySelectorAll('.toggle-answer');

        // Check if all answers are currently visible
        const allVisible = Array.from(answers).every(answer => answer.classList.contains('visible'));

        // Either show all or hide all
        answers.forEach(answer => {
            if (allVisible) {
                answer.classList.remove('visible');
            } else {
                answer.classList.add('visible');
            }
        });

        // Update all toggle buttons text
        toggleButtons.forEach(button => {
            button.textContent = allVisible ? 'Antwort anzeigen' : 'Antwort verstecken';
        });

        // Update main toggle button text
        const toggleAllButton = section.querySelector('button[id^="toggle-all-answers"]');
        if (toggleAllButton) {
            toggleAllButton.textContent = allVisible ? 'Alle Antworten anzeigen' : 'Alle Antworten verstecken';
        }
    }
});