// Authentication check for all pages
(function() {
    const SESSION_KEY = 'disasters_docs_auth';

    // Get the base path for the current page
    function getBasePath() {
        const path = window.location.pathname;
        // Extract base directory from current path
        const parts = path.split('/').filter(p => p);
        // Find the index.html or last segment
        const fileIndex = parts.findIndex(p => p.endsWith('.html'));
        if (fileIndex > 0) {
            return '/' + parts.slice(0, fileIndex).join('/') + '/';
        }
        // Default: go to root of disasters-docs
        return '/disasters-docs/';
    }

    function getLoginPage() {
        const basePath = getBasePath();
        return basePath + 'password-protect.html';
    }

    function checkAuth() {
        // Skip authentication on localhost (for development)
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1') {
            console.log('Running on localhost - skipping authentication');
            return;
        }

        // Skip check if we're on the login page
        if (window.location.pathname.endsWith('password-protect.html') ||
            window.location.pathname.endsWith('login.html')) {
            return;
        }

        const auth = localStorage.getItem(SESSION_KEY);

        if (!auth) {
            // No authentication, redirect to login
            window.location.href = getLoginPage();
            return;
        }

        try {
            const authData = JSON.parse(auth);
            const now = new Date().getTime();

            if (authData.expires <= now || !authData.authenticated) {
                // Expired or invalid session
                localStorage.removeItem(SESSION_KEY);
                window.location.href = getLoginPage();
                return;
            }

            // Valid session - allow page to load
        } catch (e) {
            // Invalid auth data
            localStorage.removeItem(SESSION_KEY);
            window.location.href = getLoginPage();
        }
    }

    // Run check immediately
    checkAuth();

    // Add logout functionality
    window.addEventListener('DOMContentLoaded', function() {
        // Add logout button to page if it doesn't exist
        const existingLogout = document.getElementById('logout-btn');
        if (!existingLogout) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 9999; font-size: 14px;';
            logoutBtn.onclick = function() {
                localStorage.removeItem(SESSION_KEY);
                window.location.href = getLoginPage();
            };
            document.body.appendChild(logoutBtn);
        }
    });
})();
