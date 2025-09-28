const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbynBODXfWKd9JhIxO4ZoHsTr7UgboMQQWt2SaOEXpixQhOkfJX8afI9DY5bW9_72yzzaA/exec";

const form = document.getElementById('tryout-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const loadingContent = document.getElementById('loading-content');
const errorMessage = document.getElementById('error-message');


async function handleFormSubmission(event) {
    event.preventDefault();

    if (GOOGLE_SHEET_WEB_APP_URL === "") {
        displayError("Please set your Google Apps Script Web App URL in the JavaScript code.");
        return;
    }
    
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    buttonText.classList.add('hidden');
    loadingContent.classList.remove('hidden');

    errorMessage.classList.add('hidden');

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    const TIMESTAMP_OPTIONS = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    data.timestamp = new Date().toLocaleString('en-US', TIMESTAMP_OPTIONS);
    
    console.log("Sending data:", data);

    try {
        const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        showModal();
        form.reset();

    } catch (error) {
        console.error('Submission failed:', error);
        displayError("Submission failed. Check your network connection or the script URL.");
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        
        buttonText.classList.remove('hidden');
        loadingContent.classList.add('hidden');
    }
}

/**
 * Displays a temporary error message on the form.
 * @param {string} message 
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    // Hide after a delay
    setTimeout(() => errorMessage.classList.add('hidden'), 5000);
}


// Function to display the modal (no change)
function showModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('hidden');
    // Trigger transition effects
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}

// Function to hide the modal (no change)
function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('opacity-100');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 600);
}

document.getElementById('year').addEventListener('change', function() {
    if (this.value === "") {
        this.classList.add('text-gray-400');
        this.classList.remove('text-white');
    } else {
        this.classList.remove('text-gray-400');
        this.classList.add('text-white');
    }
});


document.getElementById('year').dispatchEvent(new Event('change'));