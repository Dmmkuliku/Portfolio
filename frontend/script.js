document.addEventListener("DOMContentLoaded", () => {
    // 1. PERSISTENT LIGHT / DARK MODE CONTROLLER
    const themeSwitcher = document.getElementById("theme-switcher");
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    
    themeSwitcher.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        let newTheme = (theme === "light") ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // 2. RESPONSIVE MOBILE DRAWERS & MENUS
    const menuIcon = document.getElementById("menu-icon");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuIcon && navMenu) {
        menuIcon.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-active");
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("mobile-active")) {
                navMenu.classList.remove("mobile-active");
            }
        });
    });

    // 3. BACKEND API INTEGRATION (ASSIGNMENT REQUIREMENT)
    const API_URL = "https://portfolio-backend-3r1v.onrender.com";
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formResponse = document.getElementById("formResponse");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Transmission...`;
            
            const payload = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            try {
                const response = await fetch(`${API_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    formResponse.style.display = "block";
                    formResponse.style.color = "#10b981";
                    formResponse.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transmission successful. Data routed to server.`;
                    contactForm.reset();
                } else {
                    throw new Error("Server rejected request");
                }
            } catch (error) {
                formResponse.style.display = "block";
                formResponse.style.color = "#ef4444";
                formResponse.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Transmission failed. API connection issue.`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Dispatch Transmission`;
            }
        });
    }
});
