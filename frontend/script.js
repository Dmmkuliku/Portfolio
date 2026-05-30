document.addEventListener("DOMContentLoaded", () => {
    // 1. THEME & MENU LOGIC
    const themeSwitcher = document.getElementById("theme-switcher");
    const menuIcon = document.getElementById("menu-icon");
    const navMenu = document.getElementById("nav-menu");
    
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");
    
    themeSwitcher.addEventListener("click", () => {
        let newTheme = (document.documentElement.getAttribute("data-theme") === "light") ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    if (menuIcon) menuIcon.addEventListener("click", () => navMenu.classList.toggle("mobile-active"));

    // 2. CONTACT ENGINE (Backend Integration)
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formResponse = document.getElementById("formResponse");
    const API_URL = "https://portfolio-backend-3r1v.onrender.com/api/contact";

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Dispatching...`;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: document.getElementById("name").value,
                        email: document.getElementById("email").value,
                        message: document.getElementById("message").value
                    })
                });

                if (response.ok) {
                    formResponse.style.display = "block";
                    formResponse.innerHTML = `Transmission successful. Routing complete.`;
                    contactForm.reset();
                } else {
                    throw new Error("Server error");
                }
            } catch (err) {
                formResponse.style.display = "block";
                formResponse.innerHTML = `Transmission error. Path unavailable.`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Dispatch Transmission`;
            }
        });
    }
});
