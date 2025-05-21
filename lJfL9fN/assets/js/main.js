/**
 * Main Javascript file for Random Clinic website
 * Handles UI interactions and appointment booking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Booking modal functionality
    const openBookingBtn = document.getElementById('openBookingBtn');
    const heroBookingBtn = document.getElementById('heroBookingBtn');
    const doctorBookBtns = document.querySelectorAll('.doctor-book-btn');
    const bookingModal = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');
    
    // Functions to open and close modals
    function openBookingModal(doctorId = null) {
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        if (doctorId) {
            const doctorSelect = document.getElementById('bookingDoctor');
            if (doctorSelect) {
                doctorSelect.value = doctorId;
            }
        }
    }
    
    function closeBookingModal() {
        bookingModal.classList.add('hidden');
        document.body.style.overflow = '';
        appointmentForm.reset();
    }
    
    function openConfirmationModal() {
        confirmationModal.classList.remove('hidden');
        bookingModal.classList.add('hidden');
    }
    
    function closeConfirmationModal() {
        confirmationModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Event listeners for opening/closing modals
    if (openBookingBtn) {
        openBookingBtn.addEventListener('click', () => openBookingModal());
    }
    
    if (heroBookingBtn) {
        heroBookingBtn.addEventListener('click', () => openBookingModal());
    }
    
    if (doctorBookBtns) {
        doctorBookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const doctorId = btn.getAttribute('data-id');
                openBookingModal(doctorId);
            });
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeBookingModal);
    }
    
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', closeConfirmationModal);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        } else if (e.target === confirmationModal) {
            closeConfirmationModal();
        }
    });
    
    // Handle appointment form submission
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here we would normally send the form data to the server
            // For this demo, we'll just show the confirmation
            
            // First, we'll simulate a brief loading state
            const submitButton = e.submitter;
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitButton.disabled = true;
            
            // Simulate an API call
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show confirmation modal
                openConfirmationModal();
                
                // Reset the form
                appointmentForm.reset();
                
                // Save to localStorage for demo purposes
                saveAppointment();
            }, 1000);
        });
    }
    
    /**
     * Saves the appointment data to localStorage for demo purposes
     */
    function saveAppointment() {
        const appointmentData = {
            id: Date.now(),
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            doctorId: document.getElementById('bookingDoctor').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            reason: document.getElementById('bookingReason').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Get existing appointments or initialize an empty array
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Add the new appointment
        appointments.push(appointmentData);
        
        // Save back to localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        console.log('Appointment saved:', appointmentData);
    }
    
    // Set minimum date for booking date picker to today
    const today = new Date().toISOString().split('T')[0];
    const datePickerInput = document.getElementById('bookingDate');
    if (datePickerInput) {
        datePickerInput.min = today;
    }
    
    /**
     * Loads doctors from data and renders them to the page
     */
    function loadDoctors() {
        // For demo purposes, we'll use the doctors that are already in the HTML
        // In a real app, this would load from an API
        console.log('Doctors loaded from static HTML');
    }
    
    // Initialize page
    loadDoctors();
});


