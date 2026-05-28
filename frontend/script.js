// =========================================================================
// 1. THEME ENGINE SWITCHING MANAGEMENT LOGIC
// =========================================================================
const themeButton = document.getElementById('theme-switcher');
const htmlElement = document.documentElement;

themeButton.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', targetTheme);
});

// =========================================================================
// 2. MOBILE LAYOUT NAV OPEN-CLOSE TOGGLE FUNCTION
// =========================================================================
const menuIcon = document.getElementById('menu-icon');
const navLinksList = document.querySelector('nav ul');

menuIcon.addEventListener('click', () => {
    navLinksList.classList.toggle('active');
});

// Smooth close navigation links upon mobile interaction selection
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
    });
});

// =========================================================================
// 3. EMAILJS TRANSMIT SUBSYSTEM FRAMEWORK 
// =========================================================================
emailjs.init("ouZgiQcXpiQ0t3jST"); 

const form = document.getElementById('contactForm');
const responseDiv = document.getElementById('formResponse');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    // Activate loading overlay states
    responseDiv.style.display = "block";
    responseDiv.style.backgroundColor = "rgba(26, 188, 156, 0.1)";
    responseDiv.style.color = "#1abc9c";
    responseDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing Routing Protocols...';
    submitBtn.disabled = true;

    // Package explicit object mapping metrics
    const templateParams = {
        user_name: document.getElementById('name').value,
        user_email: document.getElementById('email').value,
        project_message: document.getElementById('message').value
    };

    const SERVICE_ID = "service_9osk5to";   
    const TEMPLATE_ID = "template_u4d0rcq"; 

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(() => {
        // Successful API Response
        responseDiv.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
        responseDiv.style.color = "#2ecc71";
        responseDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Transmission successful! Raymond will reach out shortly.';
        form.reset(); 
    })
    .catch((error) => {
        console.error('EmailJS Routing Interrupt Node:', error);
        // Error handling fallback presentation
        responseDiv.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
        responseDiv.style.color = "#e74c3c";
        responseDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Transmission error. Please fallback to direct WhatsApp linking.';
    })
    .finally(() => {
        submitBtn.disabled = false;
    });
});
