document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================
       1. PERSISTENT LIGHT / DARK MODE CONTROLLER
       ========================================== */
    const themeSwitcher = document.getElementById("theme-switcher");
    const currentTheme = localStorage.getItem("theme") || "light";
    
    // Set initial structural data state attribute
    document.documentElement.setAttribute("data-theme", currentTheme);
    
    themeSwitcher.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        let newTheme = (theme === "light") ? "dark" : "light";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    /* ==========================================
       2. RESPONSIVE MOBILE DRAWERS & MENUS
       ========================================== */
    const menuIcon = document.getElementById("menu-icon");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuIcon && navMenu) {
        menuIcon.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-active");
        });
    }

    // Auto close drawer when an explicit navigation target is selected
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("mobile-active")) {
                navMenu.classList.remove("mobile-active");
            }
        });
    });

    /* ==========================================
       3. SECURE FORM PROCESSING LOGIC (EmailJS)
       ========================================== */
    /**
     * INSTRUCTIONS FOR FORM ACTIVATION:
     * 1. Register a free account at https://www.emailjs.com/
     * 2. Connect an Email Service (e.g., Gmail) and note down your Service ID.
     * 3. Design an Email Template containing field injections: {{from_name}}, {{reply_to}}, and {{message}}.
     * 4. Paste your unique credentials inside the initialization string fields below.
     */
    
    // Replace "YOUR_PUBLIC_KEY" with the exact string key provided in your EmailJS profile dashboard
    emailjs.init({
        publicKey: "YOUR_PUBLIC_KEY",
    });

    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formResponse = document.getElementById("formResponse");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Visual Pipeline Lockdown State
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Transmission...`;
            
            const templateParams = {
                from_name: document.getElementById("name").value,
                reply_to: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            // Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" with your unique Dashboard IDs
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(() => {
                    // Successful Transmission UI Response
                    formResponse.style.display = "block";
                    formResponse.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
                    formResponse.style.color = "#10b981";
                    formResponse.innerHTML = `<i class="fa-solid fa-circle-check"></i> Project parameters routed successfully. I will connect shortly!`;
                    
                    contactForm.reset();
                })
                .catch((error) => {
                    // Errant Transmission UI Response
                    console.error("Routing Error Context:", error);
                    formResponse.style.display = "block";
                    formResponse.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                    formResponse.style.color = "#ef4444";
                    formResponse.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Network path interrupted. Please route direct via WhatsApp link above.`;
                })
                .finally(() => {
                    // Release UI Controls
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Dispatch Transmission`;
                });
        });
    }
});
