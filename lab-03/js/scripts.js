document.addEventListener("DOMContentLoaded", function () {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            if (document.getElementById("home-content")) {
                document.getElementById("intro-text").textContent = data.home.introText;
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            if (document.getElementById("gallery-container")) {
                const galleryContainer = document.getElementById("gallery-container");
                data.gallery.forEach(image => {
                    const imgElement = document.createElement("img");
                    imgElement.src = image.src;
                    imgElement.alt = image.title;
                    galleryContainer.appendChild(imgElement);
                });
            }
        })
        .catch(error => console.error('Error loading gallery:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let subject = document.getElementById("subject").value.trim();
            let message = document.getElementById("message").value.trim();
            let formMessage = document.getElementById("form-message");

            if (!name || !email || !subject || !message) {
                formMessage.textContent = "All fields are required!";
                formMessage.style.color = "red";
                return;
            }

            if (!email.includes("@")) {
                formMessage.textContent = "Enter a valid email address!";
                formMessage.style.color = "red";
                return;
            }

            formMessage.textContent = "Message sent successfully!";
            formMessage.style.color = "green";
            form.reset();
        });
    }
});