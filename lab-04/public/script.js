
if (document.getElementById('data-content')) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const dataContent = document.getElementById('data-content');
            dataContent.innerHTML = `
                <ul>
                    <li>Name: ${data.name}</li>
                    <li>Age: ${data.age}</li>
                    <li>Location: ${data.location}</li>
                </ul>
            `;
        })
        .catch(error => console.error('Error loading data:', error));
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
        alert('Thank you for your message!');
    });
}

