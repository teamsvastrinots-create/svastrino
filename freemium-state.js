/**
 * freemium-state.js
 * Manages the global state for Premium vs Freemium modes using localStorage.
 */

(function() {
    function initFreemiumState() {
        // Default to freemium mode if not set
        let isFreemium = localStorage.getItem('isFreemium');
        if (isFreemium === null) {
            isFreemium = 'true';
            localStorage.setItem('isFreemium', isFreemium);
        }

        applyFreemiumState(isFreemium === 'true');
    }

    function applyFreemiumState(isFreemium) {
        if (isFreemium) {
            document.documentElement.classList.add('freemium-mode');
        } else {
            document.documentElement.classList.remove('freemium-mode');
        }
    }

    window.toggleFreemiumMode = function(checkbox) {
        const isFreemium = !checkbox.checked; // If checked, Premium mode is ON (Freemium is OFF)
        localStorage.setItem('isFreemium', isFreemium.toString());
        applyFreemiumState(isFreemium);
    };

    // Initialize immediately so CSS applies before render
    initFreemiumState();

    // After DOM loads, sync the toggle slider visually
    document.addEventListener('DOMContentLoaded', () => {
        const toggles = document.querySelectorAll('.premium-toggle-checkbox');
        const isFreemium = localStorage.getItem('isFreemium') === 'true';
        
        toggles.forEach(toggle => {
            toggle.checked = !isFreemium; // If freemium is true, premium toggle is unchecked
        });
    });

    // Prevent navigation to locked pages in freemium mode
    document.addEventListener('click', function(e) {
        if (document.documentElement.classList.contains('freemium-mode')) {
            const lockedLink = e.target.closest('a[href="psychometric-test.html"], a[href="my-test-results.html"], a[href="webinars.html"], a[href="profile.html"], a[href="notifications.html"]');
            if (lockedLink) {
                e.preventDefault();
                // Optionally, could show a toast message here
            }
        }
    });

})();
