/**
 * Raymond Elphance - Professional Portfolio Operations Engine
 * Handles Native Theme Switching Systems & Asynchronous Cloud API Integration
 */

const API_BASE_URL = "https://portfolio-backend-rmoy.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. THEME SWITCHER & STATE MANAGEMENT CONTROLLER
    // ==========================================================================
    const themeToggleBtn = document.getElementById("themeToggle");
    
    // Check local storage memory cache or default to user system setting
    const cachedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (cachedTheme) {
        document.documentElement.setAttribute("data-theme", cachedTheme);
    } else {
        const initialTheme = systemPrefersDark ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", initialTheme);
    }

    // Interactive Theme Toggle Click Listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // ==========================================================================
    // 2. LIVE CLOUD BACKEND HANDSHAKE & STATUS MONITORING
    // ==========================================================================
    const statusElement = document.getElementById("api-status");
    const contactForm = document.getElementById("contactForm");
    const formResponse = document.getElementById("formResponse");

    // Ping the backend API endpoint to evaluate connection state
    fetch(`${API_BASE_URL}/api/status`)
        .then(response => {
            if (!response.ok) throw new Error("Server network negotiation anomaly");
            return response.json();
        })
        .then(data => {
            // Update the layout context seamlessly using theme-compliant styles
            statusElement.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.message}`;
            statusElement.className = "status-banner status-success";
        })
        .catch(error => {
            console.error("Status Ping Error Execution context:", error);
            statusElement.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Server sleeping. Wake-up takes ~30 seconds.`;
            statusElement.className = "status-banner status-error";
        });

    // ==========================================================================
    // 3. SECURE ASYNCHRONOUS FORM SUBMISSION HUB
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            // Display an elegant, theme-compliant loading state
            formResponse.className = "form-alert alert-loading";
            formResponse.innerHTML = `<p><i class="fa-solid fa-spinner fa-spin"></i> Transmitting your secure payload data to Raymond...</p>`;

            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.ok) {
                    formResponse.className = "form-alert alert-success";
                    formResponse.innerHTML = `<p><i class="fa-solid fa-square-check"></i> ${result.success || 'Message transmitted successfully.'}</p>`;
                    contactForm.reset();
                } else {
                    formResponse.className = "form-alert alert-error";
                    formResponse.innerHTML = `<p><i class="fa-solid fa-triangle-exclamation"></i> ${result.error || 'Server validation error encountered.'}</p>`;
                }
            } catch (err) {
                console.error("Form Submission Error Execution context:", err);
                formResponse.className = "form-alert alert-error";
                formResponse.innerHTML = `<p><i class="fa-solid fa-triangle-exclamation"></i> Transmission pipeline error. Please attempt again later.</p>`;
            }
        });
    }
});
