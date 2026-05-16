// Local testing URL. When we deploy to Render, we will swap this with the production live URL.
const BACKEND_URL = "http://localhost:5000";

// 1. Check Backend Server Connection status on page load
document.addEventListener("DOMContentLoaded", () => {
    fetch(`${BACKEND_URL}/api/status`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("api-status").innerText = `Server Status: ${data.message}`;
            document.getElementById("api-status").style.color = "green";
        })
        .catch(error => {
            console.log("Backend offline or still loading...", error);
            document.getElementById("api-status").innerText = "Server Status: Offline (Local)";
        });
});

// 2. Handle Contact Form Submission to Backend API
document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const responseDiv = document.getElementById("formResponse");

    try {
        const response = await fetch(`${BACKEND_URL}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            responseDiv.innerHTML = `<p style="color: green;">${data.success}</p>`;
            document.getElementById("contactForm").reset();
        } else {
            responseDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
        }
    } catch (error) {
        responseDiv.innerHTML = `<p style="color: red;">Could not connect to the backend server right now.</p>`;
    }
});