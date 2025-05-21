/**
 * Main script file for the admin panel functionality
 * Handles sidebar navigation, content loading, and global UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin panel UI
    initAdminPanel();
});

/**
 * Initializes all admin panel functionality
 */
function initAdminPanel() {
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize dropdown menus
    initDropdownMenus();
    
    // Initialize quick add appointment modal
    initQuickAddModal();
    
    // Load the default section (dashboard)
    loadSection('dashboard');
}

/**
 * Initializes the sidebar navigation and mobile menu toggle
 */
function initSidebar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('translate-x-0');
    });
    
    // Close sidebar when clicking elsewhere on mobile
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth < 768;
        const isOutsideSidebar = !sidebar.contains(event.target) && !mobileMenuButton.contains(event.target);
        
        if (isMobile && isOutsideSidebar && !sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        }
    });
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Only process links with a data-section attribute
            const sectionName = this.getAttribute('data-section');
            if (sectionName) {
                event.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Load the selected section
                loadSection(sectionName);
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 768) {
                    sidebar.classList.add('-translate-x-full');
                    sidebar.classList.remove('translate-x-0');
                }
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            // Ensure sidebar is visible on larger screens
            sidebar.classList.remove('-translate-x-full');
        } else {
            // Hide sidebar on mobile by default
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        }
    });
}

/**
 * Loads the specified section content into the main content area
 * @param {string} sectionName - The name of the section to load
 */
function loadSection(sectionName) {
    const contentArea = document.getElementById('content-area');
    
    // Show loading indicator
    contentArea.innerHTML = `
        <div class="text-center py-8 text-gray-500">
            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p>Loading ${sectionName}...</p>
        </div>
    `;
    
    // Simulate loading time (remove in production)
    setTimeout(() => {
        // Call the appropriate section loader based on section name
        switch (sectionName) {
            case 'dashboard':
                loadDashboardContent();
                break;
            case 'appointments':
                loadAppointmentsContent();
                break;
            case 'doctors':
                loadDoctorsContent();
                break;
            case 'today':
                loadTodayAppointmentsContent();
                break;
            case 'calendar':
                loadCalendarContent();
                break;
            default:
                contentArea.innerHTML = `
                    <div class="text-center py-8">
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-yellow-700">
                                        Section not found: ${sectionName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button onclick="loadSection('dashboard')" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700">
                            Return to Dashboard
                        </button>
                    </div>
                `;
        }
    }, 500); // Simulate network delay
}

/**
 * Initializes dropdown menus (notifications and user menu)
 */
function initDropdownMenus() {
    // Notifications dropdown
    const notificationsButton = document.getElementById('notifications-button');
    const notificationsMenu = document.getElementById('notifications-menu');
    
    // User menu dropdown
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    // Toggle notifications dropdown
    notificationsButton.addEventListener('click', function(event) {
        event.stopPropagation();
        notificationsMenu.classList.toggle('hidden');
        userMenu.classList.add('hidden'); // Close user menu
    });
    
    // Toggle user menu dropdown
    userMenuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        userMenu.classList.toggle('hidden');
        notificationsMenu.classList.add('hidden'); // Close notifications
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function() {
        notificationsMenu.classList.add('hidden');
        userMenu.classList.add('hidden');
    });
    
    // Prevent closing when clicking inside dropdowns
    notificationsMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    userMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

/**
 * Initializes the quick add appointment modal
 */
function initQuickAddModal() {
    const quickAddModal = document.getElementById('quick-add-modal');
    const closeBtn = document.getElementById('close-quick-add-modal');
    const cancelBtn = document.getElementById('cancel-quick-add');
    const quickAddForm = document.getElementById('quick-add-form');
    
    // Function to open modal
    window.openQuickAddModal = function() {
        quickAddModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };
    
    // Function to close modal
    function closeModal() {
        quickAddModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        quickAddForm.reset();
    }
    
    // Close modal when close button is clicked
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when cancel button is clicked
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    quickAddModal.addEventListener('click', function(e) {
        if (e.target === quickAddModal) {
            closeModal();
        }
    });
    
    // Close modal on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !quickAddModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Handle form submission
    quickAddForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const formData = {
            patientName: document.getElementById('patient-name').value,
            patientContact: document.getElementById('patient-contact').value,
            doctor: document.getElementById('appointment-doctor').value,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            type: document.getElementById('appointment-type').value,
            notes: document.getElementById('appointment-notes').value
        };
        
        // In a real application, you would send this data to your server
        console.log('New appointment data:', formData);
        
        // Show success message
        const contentArea = document.getElementById('content-area');
        
        if (contentArea) {
            // Add a success notification at the top of the content area
            const successMessage = document.createElement('div');
            successMessage.className = 'bg-green-50 border-l-4 border-green-400 p-4 mb-4 fade-in';
            successMessage.innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-green-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-green-700">
                            Appointment for ${formData.patientName} with ${document.getElementById('appointment-doctor').options[document.getElementById('appointment-doctor').selectedIndex].text} was successfully added.
                        </p>
                    </div>
                    <button class="ml-auto text-green-500 hover:text-green-700" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            contentArea.insertBefore(successMessage, contentArea.firstChild);
            
            // Remove the message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
        
        // Reload the appropriate section if needed
        const currentSection = document.querySelector('.nav-link.active').getAttribute('data-section');
        if (currentSection === 'appointments' || currentSection === 'today' || currentSection === 'calendar') {
            loadSection(currentSection);
        }
        
        // Close the modal
        closeModal();
    });
    
    // Set minimum date for date input to today
    const appointmentDateInput = document.getElementById('appointment-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    appointmentDateInput.setAttribute('min', `${year}-${month}-${day}`);
    appointmentDateInput.value = `${year}-${month}-${day}`; // Set default to today
}

/**
 * Formats a date object to a human-readable string
 * @param {Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time in the formatted string
 * @returns {string} The formatted date string
 */
function formatDate(date, includeTime = false) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
}

/**
 * Gets the status badge HTML based on appointment status
 * @param {string} status - The appointment status
 * @returns {string} HTML string for the status badge
 */
function getStatusBadge(status) {
    let badgeClass = '';
    let icon = '';
    
    switch (status.toLowerCase()) {
        case 'confirmed':
            badgeClass = 'badge-green';
            icon = 'fa-check-circle';
            break;
        case 'pending':
            badgeClass = 'badge-yellow';
            icon = 'fa-clock';
            break;
        case 'canceled':
            badgeClass = 'badge-red';
            icon = 'fa-times-circle';
            break;
        case 'completed':
            badgeClass = 'badge-blue';
            icon = 'fa-check-square';
            break;
        default:
            badgeClass = 'badge-gray';
            icon = 'fa-question-circle';
    }
    
    return `
        <span class="badge ${badgeClass}">
            <i class="fas ${icon} mr-1"></i> ${status}
        </span>
    `;
}

/**
 * Handles confirming/deleting of appointments
 * @param {string} action - The action to perform (confirm, cancel, delete)
 * @param {string} id - The ID of the appointment
 */
window.handleAppointmentAction = function(action, id) {
    // In a real application, you would send an API request to update the appointment
    console.log(`Appointment ${action} action for ID: ${id}`);
    
    // Show a notification based on the action
    const contentArea = document.getElementById('content-area');
    let notificationClass = '';
    let icon = '';
    let message = '';
    
    switch (action) {
        case 'confirm':
            notificationClass = 'bg-green-50 border-green-400';
            icon = 'fa-check-circle text-green-400';
            message = `Appointment #${id} has been confirmed.`;
            break;
        case 'cancel':
            notificationClass = 'bg-yellow-50 border-yellow-400';
            icon = 'fa-exclamation-circle text-yellow-400';
            message = `Appointment #${id} has been canceled.`;
            break;
        case 'delete':
            notificationClass = 'bg-red-50 border-red-400';
            icon = 'fa-trash-alt text-red-400';
            message = `Appointment #${id} has been deleted.`;
            break;
    }
    
    const notification = document.createElement('div');
    notification.className = `border-l-4 p-4 mb-4 fade-in ${notificationClass}`;
    notification.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas ${icon}"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm">${message}</p>
            </div>
            <button class="ml-auto text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    contentArea.insertBefore(notification, contentArea.firstChild);
    
    // Remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Reload the current section if needed
    const currentSection = document.querySelector('.nav-link.active').getAttribute('data-section');
    if (currentSection === 'appointments' || currentSection === 'today') {
        // Update UI to reflect the change (in a real app, you'd fetch fresh data)
        // For demo purposes, we'll just remove the row from the table
        const row = document.getElementById(`appointment-${id}`);
        if (row && action === 'delete') {
            row.remove();
        } else if (row) {
            // Update the status badge
            const statusCell = row.querySelector('.status-cell');
            if (statusCell) {
                if (action === 'confirm') {
                    statusCell.innerHTML = getStatusBadge('Confirmed');
                } else if (action === 'cancel') {
                    statusCell.innerHTML = getStatusBadge('Canceled');
                }
            }
        }
    }
};
