// Connects your website form to your live cloud server
const API_BASE_URL = "https://portfolio-backend-rmoy.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const statusElement = document.getElementById("api-status");
    const contactForm = document.getElementById("contactForm");
    const formResponse = document.getElementById("formResponse");

    // Ping the backend server to check if it's active
    fetch(`${API_BASE_URL}/api/status`)
        .then(response => {
            if (!response.ok) throw new Error("Server network issue");
            return response.json();
        })
        .then(data => {
            // Update the status banner smoothly when connected
            statusElement.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i> ${data.message}`;
            statusElement.style.color = "#2ecc71";
            statusElement.style.background = "rgba(46, 204, 113, 0.1)";
        })
        .catch(error => {
            console.error("Status Ping Error:", error);
            statusElement.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: #e74c3c;"></i> Server sleeping. Wake-up takes ~30 seconds.`;
            statusElement.style.color = "#e74c3c";
            statusElement.style.background = "rgba(231, 76, 60, 0.1)";
        });

    // Handle Form Submissions Interactively
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            // Simple user loading feedback
            formResponse.innerHTML = "<p style='color: #34495e;'><i class='fa-solid fa-spinner fa-spin'></i> Sending your message to Raymond...</p>";

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
                    formResponse.innerHTML = `<p style="color: #2ecc71; font-weight: 600;"><i class="fa-solid fa-square-check"></i> ${result.success}</p>`;
                    contactForm.reset();
                } else {
                    formResponse.innerHTML = `<p style="color: #e74c3c; font-weight: 600;"><i class="fa-solid fa-triangle-exclamation"></i> ${result.error}</p>`;
                }
            } catch (err) {
                console.error("Form Submission Error:", err);
                formResponse.innerHTML = `<p style="color: #e74c3c; font-weight: 600;"><i class="fa-solid fa-triangle-exclamation"></i> Could not transmit message. Please try again later.</p>`;
            }
        });
    }
});
