const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbynBODXfWKd9JhIxO4ZoHsTr7UgboMQQWt2SaOEXpixQhOkfJX8afI9DY5bW9_72yzzaA/exec";

const form = document.getElementById('tryout-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const loadingContent = document.getElementById('loading-content');
const errorMessage = document.getElementById('error-message');
const categoryError = document.getElementById('category-error');

async function handleFormSubmission(event) {
    event.preventDefault();

    if (GOOGLE_SHEET_WEB_APP_URL === "") {
        displayError("Please set your Google Apps Script Web App URL in the JavaScript code.");
        return;
    }
    
    // 1. Get Selected Categories
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                                     .map(checkbox => checkbox.value);

    if (selectedCategories.length === 0) {
        categoryError.classList.remove('hidden');
        return;
    } else {
        categoryError.classList.add('hidden');
    }

    // 2. Disable button and show loading state
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    buttonText.classList.add('hidden');
    loadingContent.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    // 3. Prepare Base Data (Full Name, Year, Section, Timestamp)
    const formData = new FormData(form);
    const baseData = {};
    // Extract non-category fields (Name, Year, Section)
    formData.forEach((value, key) => {
        if (key !== 'category') {
            baseData[key] = value;
        }
    });

    const TIMESTAMP_OPTIONS = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    baseData.timestamp = new Date().toLocaleString('en-US', TIMESTAMP_OPTIONS);
    
    let submissionSuccess = true;
    let failedCategories = [];

    // 4. LOOP through each selected category and send a separate request
    for (const category of selectedCategories) {
        const submissionData = { ...baseData, category: category }; // Create a copy and add the single category
        
        console.log(`Sending data for category "${category}":`, submissionData);

        try {
            await fetch(GOOGLE_SHEET_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', 
                body: JSON.stringify(submissionData),
            });
            // Since we are using 'no-cors', we assume success if the fetch promise resolves.

        } catch (error) {
            console.error(`Submission failed for category ${category}:`, error);
            submissionSuccess = false;
            failedCategories.push(category);
        }
    }

    // 5. Handle Final Result
    if (submissionSuccess) {
        showModal();
        form.reset();
        // Manually reset the category error message on successful submission
        categoryError.classList.add('hidden');
    } else {
        const errorMsg = `Submission failed for the following categories: ${failedCategories.join(', ')}. Check your network.`;
        displayError(errorMsg);
    }
    
    // 6. Reset loading state
    submitButton.disabled = false;
    submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    buttonText.classList.remove('hidden');
    loadingContent.classList.add('hidden');
}

/**
 * Displays a temporary error message on the form.
 * @param {string} message 
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 7000);
}



function showModal() {
    const modal = document.getElementById('confirmation-modal');
    

    modal.classList.remove('pointer-events-none');
    modal.classList.add('pointer-events-auto', 'opacity-100');


    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}


function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    
    
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');

    
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    
    setTimeout(() => {
        modal.classList.remove('pointer-events-auto');
        modal.classList.add('pointer-events-none');
    }, 300); 
}