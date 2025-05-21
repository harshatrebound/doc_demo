// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
// --- OMITTED_CODE_BLOCK_START --- (Original code, irrelevant to current modifications: Initialization of FAQ and Testimonial slider) ---
// Initialize the FAQ accordion
    initFaqAccordion();
    
    // Initialize testimonial slider
    initTestimonialSlider();
// --- OMITTED_CODE_BLOCK_END ---

    // Initialize appointment modal
    initAppointmentModal();
});

// --- OMITTED_CODE_BLOCK_START --- (Original code, irrelevant to current modifications: FAQ Accordion Function) ---
/** 
 * Initializes the FAQ accordion functionality
 * Handles opening/closing of FAQ items and styling active items
 */
function initFaqAccordion() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-faq');
            const targetContent = document.getElementById(targetId);
            
            // Toggle active class for styling
            this.classList.toggle('active');
            
            // Toggle the content visibility
            if (targetContent.classList.contains('hidden')) {
                targetContent.classList.remove('hidden');
                this.querySelector('i').classList.add('transform', 'rotate-180');
            } else {
                targetContent.classList.add('hidden');
                this.querySelector('i').classList.remove('transform', 'rotate-180');
            }
        });
    });
}
// --- OMITTED_CODE_BLOCK_END ---

// --- OMITTED_CODE_BLOCK_START --- (Original code, irrelevant to current modifications: Testimonial Slider Functions) ---
/**
 * Handles the testimonial slider functionality
 * Shows/hides testimonials based on selected index
 */
function initTestimonialSlider() {
    // Show the first testimonial by default
    showTestimonial(1);
}

/**
 * Shows the testimonial at the specified index and hides others
 * @param {number} index - The index of the testimonial to show (1-based)
 */
function showTestimonial(index) {
    // Hide all testimonials
    const testimonials = document.querySelectorAll('[id^="testimonial"]');
    testimonials.forEach(testimonial => {
        testimonial.classList.add('hidden');
    });
    
    // Show the selected testimonial
    const selectedTestimonial = document.getElementById(`testimonial${index}`);
    if (selectedTestimonial) {
        selectedTestimonial.classList.remove('hidden');
    }
    
    // Update navigation dots
    const dots = document.querySelectorAll('button[aria-label^="Testimonial"]');
    dots.forEach((dot, i) => {
        if (i + 1 === index) {
            dot.classList.remove('bg-gray-300', 'opacity-50');
            dot.classList.add('bg-primary', 'opacity-100');
        } else {
            dot.classList.remove('bg-primary', 'opacity-100');
            dot.classList.add('bg-gray-300', 'opacity-50');
        }
    });
}
// --- OMITTED_CODE_BLOCK_END ---

/**
 * Initializes the appointment booking modal functionality
 * Handles opening, closing, and form submission/validation
 */
function initAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const openButtons = [
        document.getElementById('bookAppointmentBtn'),
        document.getElementById('heroBookBtn')
    ];
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelButton = document.getElementById('cancelModalBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const successMessageDiv = document.getElementById('successMessage'); // Changed variable name for clarity

    // Function to display error message for a field
    function displayError(inputElement, message) {
        const errorElement = document.getElementById(inputElement.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            errorElement.setAttribute('role', 'alert'); // For screen readers
            inputElement.classList.add('invalid'); 
            inputElement.setAttribute('aria-invalid', 'true');
        }
    }

    // Function to hide all error messages
    function hideErrorMessages() {
        document.querySelectorAll('[id$="Error"]').forEach(errorElement => {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
            errorElement.removeAttribute('role');
        });
        document.querySelectorAll('input.invalid, select.invalid').forEach(inputElement => {
            inputElement.classList.remove('invalid');
            inputElement.removeAttribute('aria-invalid');
        });
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        appointmentForm.reset(); 
        hideErrorMessages(); 
        successMessageDiv.classList.add('hidden'); // Ensure success message is hidden
        appointmentForm.classList.remove('hidden'); // Ensure form is visible for next time
    }

    // Open modal when booking buttons are clicked
    openButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                appointmentForm.reset();
                hideErrorMessages();
                successMessageDiv.classList.add('hidden'); // Ensure success message is hidden
                appointmentForm.classList.remove('hidden'); // Ensure form is visible
                document.getElementById('patientName').focus(); // Focus on the first field for accessibility
            });
        }
    });
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when cancel button is clicked
    if (cancelButton) {
        cancelButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Client-side validation and form submission handling
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            let isValid = true;
            hideErrorMessages(); // Hide previous errors

            // Validate Patient Name
            const patientName = document.getElementById('patientName');
            if (patientName.value.trim() === '') {
                displayError(patientName, 'Patient Name is required.');
                isValid = false;
            }

            // Validate Contact Number
            const contactNumber = document.getElementById('contactNumber');
            if (contactNumber.value.trim() === '') {
                displayError(contactNumber, 'Contact Number is required.');
                isValid = false;
            } else if (!/^[0-9]{10,15}$/.test(contactNumber.value.trim())) {
                 displayError(contactNumber, 'Enter a valid phone number (10-15 digits).');
                 isValid = false;
            }

            // Validate Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                displayError(email, 'Email is required.');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                displayError(email, 'Enter a valid email address.');
                isValid = false;
            }

            // Validate Preferred Doctor
            const preferredDoctor = document.getElementById('preferredDoctor');
            if (preferredDoctor.value === '') {
                displayError(preferredDoctor, 'Preferred Doctor is required.');
                isValid = false;
            }

            // Validate Preferred Date
            const preferredDate = document.getElementById('preferredDate');
            const selectedDate = new Date(preferredDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day for comparison

            if (preferredDate.value === '') {
                displayError(preferredDate, 'Preferred Date is required.');
                isValid = false;
            } else if (selectedDate < today) {
                displayError(preferredDate, 'Date cannot be in the past.');
                 isValid = false;
            }

            // Validate Preferred Time Slot
            const preferredTime = document.getElementById('preferredTime');
            if (preferredTime.value === '') {
                displayError(preferredTime, 'Preferred Time Slot is required.');
                isValid = false;
            }

            if (isValid) {
                console.log('Form validated successfully. Simulating submission.');
                console.log('Appointment Details:', {
                    patientName: patientName.value,
                    contactNumber: contactNumber.value,
                    email: email.value,
                    preferredDoctor: preferredDoctor.value,
                    preferredDate: preferredDate.value,
                    preferredTime: preferredTime.value
                });

                // Show success message, hide form
                appointmentForm.classList.add('hidden');
                successMessageDiv.classList.remove('hidden');

                // Automatically close the modal after a few seconds
                setTimeout(() => {
                    closeModal(); // This will reset everything, including hiding successMessageDiv and showing form
                }, 3000); // Display success for 3 seconds

            } else {
                console.log('Form validation failed.');
                // Errors are displayed by displayError(). Form remains visible.
                const firstInvalidField = appointmentForm.querySelector('.invalid, [aria-invalid="true"]');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
    }

    // Ensure future dates for date input (HTML5 min attribute)
    const preferredDateInput = document.getElementById('preferredDate');
    if (preferredDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const minDate = `${year}-${month}-${day}`;
        preferredDateInput.setAttribute('min', minDate);
    }
}


// --- OMITTED_CODE_BLOCK_START --- (Original code, irrelevant to current modifications: Smooth scroll function) ---
/**
 * Smooth scroll functionality for navigation links
 * @param {string} elementId - The ID of the element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
// --- OMITTED_CODE_BLOCK_END ---

// --- OMITTED_CODE_BLOCK_START --- (Original code, irrelevant to current modifications: Scroll animation listener) ---
// Add animation to elements when they come into view
window.addEventListener('load', function() {
    // Add animated entrance to sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = "0"; // Start with opacity 0
        observer.observe(section);
    });
});
// --- OMITTED_CODE_BLOCK_END ---
