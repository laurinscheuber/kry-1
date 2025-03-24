/**
 * Main JavaScript file
 * Handles navigation and common functionality across all sections
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').substring(1);

            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Scroll to top of the section
            window.scrollTo(0, 0);
        });
    });

    // Tab handling - universal for all tab systems
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Get the parent container of tabs
                const tabContainer = this.closest('.tabs');

                // Get all tabs and content in this container
                const siblingTabs = tabContainer.querySelectorAll('.tab');
                const tabContents = tabContainer.closest('.interactive-box').querySelectorAll('.tab-content');

                // Remove active class from all tabs and content
                siblingTabs.forEach(tab => tab.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    });

    // Helper function to show steps one by one
    window.showSteps = function(stepsContainerId, stepsArray) {
        const container = document.getElementById(stepsContainerId);
        container.innerHTML = '';

        stepsArray.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = step;
            container.appendChild(stepElement);

            // Show steps with delay
            setTimeout(() => {
                stepElement.classList.add('visible');
            }, 500 * (index + 1));
        });
    };

    // Helper function to validate binary input
    window.validateBinary = function(input) {
        return /^[01]+$/.test(input);
    };

    // Helper function to validate hex input
    window.validateHex = function(input) {
        return /^[0-9A-Fa-f]+$/.test(input);
    };
});