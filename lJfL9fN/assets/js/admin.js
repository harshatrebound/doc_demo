/**
 * Admin panel main JavaScript file
 * Handles overall admin panel functionality and initialization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    loadAllData();

    // Initialize the default view
    showSection('dashboard');

    // Set up event listeners for navigation
    setupNavigation();

    // Set up event listeners for modals
    setupAppointmentModalListeners(); 
    setupDoctorModalListeners(); 

    // Initialize UI elements
    initializeDateDisplay();

    // Setup sorting listeners for doctors
    setupDoctorSorting();

     // Setup filter listeners for appointments
    setupAppointmentFilters();
});

/**
 * Loads all required data for the admin panel
 */
function loadAllData() {
    // Load appointments data
    fetch('assets/data/appointments.json')
        .then(response => response.json())
        .then(data => {
            window.appointmentsData = data;
            updateAppointmentsDisplay(); // This will trigger rendering if the section is active
            initializeDashboardCounts();
            // populateDoctorSelects() will be called after doctors data is also loaded
        })
        .catch(error => {
            console.error('Error loading appointments data:', error);
            const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            window.appointmentsData = localAppointments;
            updateAppointmentsDisplay();
            initializeDashboardCounts();
        })
        .finally(() => {
             // Ensure doctor selects are populated after appointments potentially and doctors definitely load
             if (window.doctorsData) populateDoctorSelects();
        });

    // Load doctors data
    fetch('assets/data/doctors.json')
        .then(response => response.json())
        .then(data => {
            window.doctorsData = data;
            if (typeof updateDoctorsGrid === 'function') updateDoctorsGrid();
            initializeDashboardCounts(); 
        })
        .catch(error => {
            console.error('Error loading doctors data:', error);
             window.doctorsData = [
                { "id": "fallback001", "name": "Dr. Fallback", "specialization": "General Orthopedics", "contactNumber": "N/A", "email": "fallback@example.com", "yearsOfExperience": 5, "profilePictureUrl": "https://via.placeholder.com/80" }
            ];
            if (typeof updateDoctorsGrid === 'function') updateDoctorsGrid();
            initializeDashboardCounts();
        })
        .finally(() => {
            // Ensure doctor selects are populated after doctors data load (and potentially after appointments)
            populateDoctorSelects();
        });
}

/**
 * Updates the dashboard with appointment and doctor counts
 */
function initializeDashboardCounts() {
    const appointments = window.appointmentsData || [];
    const totalAppointmentsEl = document.getElementById('totalAppointments');
    const todayAppointmentsEl = document.getElementById('todayAppointments');
    const totalDoctorsEl = document.getElementById('totalDoctors');

    if (totalAppointmentsEl) {
        totalAppointmentsEl.textContent = appointments.length;
    }

    if (todayAppointmentsEl) {
        const today = new Date().toISOString().split('T')[0];
        const todayCount = appointments.filter(app => app.date === today).length;
        todayAppointmentsEl.textContent = todayCount;
    }

    if (totalDoctorsEl && window.doctorsData) {
        totalDoctorsEl.textContent = window.doctorsData.length;
    }

    const doctorsCountEl = document.getElementById('doctorsCount');
    if (doctorsCountEl && window.doctorsData) {
        doctorsCountEl.textContent = window.doctorsData.length;
    }
}

/**
 * Sets up navigation between different sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            // Visual active state is handled by sidebar.js or by direct class manipulation here
            navLinks.forEach(navLink => {
                navLink.classList.remove('bg-gray-100', 'text-primary', 'font-semibold');
                navLink.classList.add('text-gray-700');
            });
            link.classList.add('bg-gray-100', 'text-primary', 'font-semibold');
            link.classList.remove('text-gray-700');
        });
    });

     // Set initial active link for dashboard
     const initialDashboardLink = document.querySelector('.nav-link[data-section="dashboard"]');
     if (initialDashboardLink) {
         initialDashboardLink.classList.add('bg-gray-100', 'text-primary', 'font-semibold');
         initialDashboardLink.classList.remove('text-gray-700');
     }


    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full'); // For small screens
            // sidebar.classList.toggle('w-64'); // For larger screens, if using width toggle
            // sidebar.classList.toggle('w-20'); // Collapsed width for larger screens
        });
    }
}

/**
 * Shows a specific section and updates the page title
 */
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));

    const sectionToShow = document.getElementById(`${sectionName}-section`);
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');
    }

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        let formattedName = sectionName.replace(/-/g, ' ');
        formattedName = formattedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        pageTitle.textContent = formattedName;
    }

    // Call specific update functions based on section
    if (sectionName === 'appointments') {
         applyAppointmentFilters(); // Render/filter appointment list
    } else if (sectionName === 'today-appointments' && typeof window.updateTodayAppointments === 'function') {
        window.updateTodayAppointments();
    } else if (sectionName === 'calendar' && typeof window.initializeCalendarView === 'function') {
        window.initializeCalendarView();
    } else if (sectionName === 'doctors' && typeof window.updateDoctorsGrid === 'function') {
        updateDoctorsGrid();
    }
}

/**
 * Central function to update displays after data changes.
 * This function is called by components when their data (appointments, doctors) is modified.
 */
function updateAppointmentsDisplay() {
     const appointmentsSection = document.getElementById('appointments-section');
     if (appointmentsSection && !appointmentsSection.classList.contains('hidden')) {
          applyAppointmentFilters(); 
     }
     const todaySection = document.getElementById('today-appointments-section');
     if (todaySection && !todaySection.classList.contains('hidden') && typeof window.updateTodayAppointments === 'function') {
         window.updateTodayAppointments();
     }
     const calendarSection = document.getElementById('calendar-section');
     if (calendarSection && !calendarSection.classList.contains('hidden') && typeof window.initializeCalendarView === 'function') {
          window.initializeCalendarView(); // Calendar re-renders based on current data
     }
     // Dashboard counts are also important
     initializeDashboardCounts();
}
window.updateAppointmentsDisplay = updateAppointmentsDisplay; // Expose for components


/**
 * Populates the doctor select dropdowns in forms and filters
 */
function populateDoctorSelects() {
    const doctors = window.doctorsData || [];
    // Targets: #filterDoctor, #appointmentDoctor, #filterTodayDoctor
    const doctorSelects = [
        document.getElementById('filterDoctor'),
        document.getElementById('appointmentDoctor'),
        document.getElementById('filterTodayDoctor')
    ].filter(Boolean); // Filter out nulls if some don't exist

    doctorSelects.forEach(selectElement => {
        const currentValue = selectElement.value;
        // Clear existing options except the first placeholder
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} (${doctor.specialization})`;
            selectElement.appendChild(option);
        });
        // Try to restore previous value, otherwise it stays on placeholder
        if (doctors.some(d => d.id === currentValue)) {
            selectElement.value = currentValue;
        } else if (selectElement.options.length > 0) {
            // If current value invalid (e.g. doctor deleted), reset to placeholder
            selectElement.value = selectElement.options[0].value; 
        }
    });
}

/**
 * Sets up event listeners for Appointment modals
 */
function setupAppointmentModalListeners() {
    const addAppointmentBtn = document.getElementById('addAppointmentBtn'); 
    const quickAddBtn = document.getElementById('quickAddBtn'); 
    const closeAppointmentModalBtn = document.getElementById('closeAppointmentModalBtn');
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
    const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
    const appointmentModal = document.getElementById('appointmentModal');

    function openAppointmentModal() {
        if (typeof window.prepareNewAppointmentForm === 'function') {
            window.prepareNewAppointmentForm(); 
        } else {
            console.error('prepareNewAppointmentForm function not defined.');
            const form = document.getElementById('appointmentForm');
            if(form) form.reset();
            if(document.getElementById('appointmentId')) document.getElementById('appointmentId').value = '';
            if(document.getElementById('appointmentModalTitle')) document.getElementById('appointmentModalTitle').textContent = 'Add New Appointment';
            if(appointmentModal) appointmentModal.classList.remove('hidden');
        }
        populateDoctorSelects(); // Ensure doctor list is fresh
    }

    function closeAppointmentModal() {
        if(appointmentModal) appointmentModal.classList.add('hidden');
    }

    if (addAppointmentBtn) addAppointmentBtn.addEventListener('click', openAppointmentModal);
    if (quickAddBtn) quickAddBtn.addEventListener('click', openAppointmentModal);
    if (closeAppointmentModalBtn) closeAppointmentModalBtn.addEventListener('click', closeAppointmentModal);
    if (cancelAppointmentBtn) cancelAppointmentBtn.addEventListener('click', closeAppointmentModal);
    
    if (saveAppointmentBtn && typeof window.saveAppointment === 'function' && typeof window.validateAppointmentForm === 'function') {
        saveAppointmentBtn.addEventListener('click', function() {
             if (!window.validateAppointmentForm()) {
                 alert('Please fill in all required fields correctly. Check highlighted fields.');
                 return;
             }
             window.saveAppointment(); 
        });
    } else if(saveAppointmentBtn) {
        console.error('saveAppointment or validateAppointmentForm function not defined.');
    }
    
    if(appointmentModal) {
        window.addEventListener('click', (e) => {
            if (e.target === appointmentModal) closeAppointmentModal();
        });
    }
}

/**
 * Sets up event listeners for the Doctor modal
 */
function setupDoctorModalListeners() {
    const addDoctorBtnPage = document.getElementById('addDoctorBtnPage'); // Renamed ID in HTML
    const doctorModal = document.getElementById('doctorModal');
    const closeDoctorModalBtn = document.getElementById('closeDoctorModalBtn');
    const cancelDoctorBtn = document.getElementById('cancelDoctorBtn'); 
    const saveDoctorBtn = document.getElementById('saveDoctorBtn'); 

    if (addDoctorBtnPage) {
        addDoctorBtnPage.addEventListener('click', () => {
            if (typeof window.prepareNewDoctorForm === 'function') {
                window.prepareNewDoctorForm();
            } else {
                console.error('prepareNewDoctorForm function is not defined globally.');
            }
        });
    }

    if (closeDoctorModalBtn && doctorModal) {
        closeDoctorModalBtn.addEventListener('click', () => doctorModal.classList.add('hidden'));
    }
    if (cancelDoctorBtn && doctorModal) {
        cancelDoctorBtn.addEventListener('click', () => doctorModal.classList.add('hidden'));
    }

    if (saveDoctorBtn && typeof window.saveDoctor === 'function' && typeof window.validateDoctorForm === 'function') {
        saveDoctorBtn.addEventListener('click', function() {
             if (!window.validateDoctorForm()) {
                  alert('Please fill in all required fields correctly. Check highlighted fields.');
                  return;
             }
            window.saveDoctor(); 
        });
    } else if(saveDoctorBtn) {
        console.error('saveDoctor or validateDoctorForm function is not defined globally.');
    }

    if (doctorModal) {
        window.addEventListener('click', (e) => {
            if (e.target === doctorModal) doctorModal.classList.add('hidden');
        });
    }
}


/**
 * Sets up sorting functionality for the Doctors List
 */
function setupDoctorSorting() {
    const sortByNameBtn = document.getElementById('sortByName');
    const sortBySpecializationBtn = document.getElementById('sortBySpecialization');
    let currentSort = { field: null, direction: 'asc' }; 

    function updateSortIcon(button, field) {
        button.innerHTML = ''; 
        const textSpan = document.createElement('span');
        textSpan.textContent = field === 'name' ? 'Name ' : 'Specialization ';
        button.appendChild(textSpan);
        const icon = document.createElement('i');
        icon.classList.add('fas', 'ml-1');
        if (currentSort.field === field) {
            icon.classList.add(currentSort.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
        } else {
            icon.classList.add('fa-sort');
        }
        button.appendChild(icon);
    }
    
    function resetOtherSortButtonIcon(activeButtonField) {
        [
            { btn: sortByNameBtn, field: 'name' },
            { btn: sortBySpecializationBtn, field: 'specialization' }
        ].forEach(({ btn, field }) => {
            if (btn && field !== activeButtonField) {
                 btn.innerHTML = `${field === 'name' ? 'Name' : 'Specialization'} <i class="fas fa-sort ml-1"></i>`;
            }
        });
    }

    if (sortByNameBtn) {
        sortByNameBtn.addEventListener('click', () => {
            const field = 'name';
            currentSort = (currentSort.field === field && currentSort.direction === 'asc') ? 
                          { field, direction: 'desc' } : { field, direction: 'asc' };
            sortDoctorsList(currentSort.field, currentSort.direction);
            updateSortIcon(sortByNameBtn, field);
            resetOtherSortButtonIcon(field);
        });
    }

    if (sortBySpecializationBtn) {
        sortBySpecializationBtn.addEventListener('click', () => {
            const field = 'specialization';
            currentSort = (currentSort.field === field && currentSort.direction === 'asc') ? 
                          { field, direction: 'desc' } : { field, direction: 'asc' };
            sortDoctorsList(currentSort.field, currentSort.direction);
            updateSortIcon(sortBySpecializationBtn, field);
            resetOtherSortButtonIcon(field);
        });
    }
}

function sortDoctorsList(field, direction) {
    if (!window.doctorsData) return;
    window.doctorsData.sort((a, b) => {
        const valA = String(a[field] || '').toLowerCase();
        const valB = String(b[field] || '').toLowerCase();
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    if (typeof updateDoctorsGrid === 'function') updateDoctorsGrid();
}

/**
 * Initializes date displays on the page
 */
function initializeDateDisplay() {
    const todayDateElement = document.getElementById('todayDate');
    if (todayDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        todayDateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

/**
 * Sets up event listeners for appointment filters and search.
 */
function setupAppointmentFilters() {
    const filterElements = [
        document.getElementById('filterDoctor'),
        document.getElementById('filterStatus'),
        document.getElementById('filterStartDate'),
        document.getElementById('filterEndDate'),
        document.getElementById('appointmentSearch')
    ].filter(Boolean);

    filterElements.forEach(filter => {
        const eventType = (filter.tagName === 'SELECT') ? 'change' : 'input';
        filter.addEventListener(eventType, applyAppointmentFilters);
    });
    // Initial population of doctor filter is handled by loadAllData -> populateDoctorSelects
}

/**
 * Applies the current filters and search to the appointments list display.
 */
function applyAppointmentFilters() {
     const appointments = window.appointmentsData || [];
     const doctors = window.doctorsData || [];

     const filterDoctorValue = document.getElementById('filterDoctor')?.value || '';
     const filterStatusValue = document.getElementById('filterStatus')?.value || '';
     const filterStartDateValue = document.getElementById('filterStartDate')?.value || '';
     const filterEndDateValue = document.getElementById('filterEndDate')?.value || '';
     const searchTerm = document.getElementById('appointmentSearch')?.value.toLowerCase().trim() || '';

     const filteredAppointments = appointments.filter(app => {
         const doctor = doctors.find(d => String(d.id) === String(app.doctorId));

         if (filterDoctorValue && String(app.doctorId) !== String(filterDoctorValue)) return false;
         if (filterStatusValue && app.status !== filterStatusValue) return false;
         if (filterStartDateValue && app.date < filterStartDateValue) return false;
         if (filterEndDateValue && app.date > filterEndDateValue) return false;

         if (searchTerm) {
             const searchFields = [
                 app.id,
                 app.name,
                 app.email,
                 app.phone,
                 doctor?.name,
                 app.date,
                 app.time,
                 app.status,
                 app.reason
             ].map(field => String(field || '').toLowerCase());
             if (!searchFields.some(field => field.includes(searchTerm))) return false;
         }
         return true;
     });
     renderAppointmentsTable(filteredAppointments);
}
window.applyAppointmentFilters = applyAppointmentFilters; // Expose for components

/**
 * Renders the appointments into the table body.
 * @param {Array} appointmentsToRender - The array of appointment objects to display.
 */
function renderAppointmentsTable(appointmentsToRender) {
    const tableBody = document.getElementById('appointmentsTableBody');
    const totalAppointmentsCountEl = document.getElementById('totalAppointmentsCount'); // In pagination
    if (!tableBody) return;

    const doctors = window.doctorsData || [];
    tableBody.innerHTML = ''; // Clear existing rows

     if (appointmentsToRender.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" class="text-center py-10 text-gray-500">No appointments found matching your criteria.</td></tr>`;
     } else {
        appointmentsToRender.forEach(appointment => {
            const doctor = doctors.find(d => String(d.id) === String(appointment.doctorId));
            const doctorName = doctor ? doctor.name : 'Unknown Doctor';
            
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 transition-colors duration-150";
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${appointment.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.name || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.phone || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title="${appointment.email || ''}">${appointment.email || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${doctorName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatDate(appointment.date)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatTime(appointment.time)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}">
                        ${capitalizeFirstLetter(appointment.status)}
                    </span>
                </td>
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.createdAt ? formatDate(appointment.createdAt.split('T')[0]) : 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                    <button class="text-indigo-600 hover:text-indigo-900 edit-appointment-btn p-1 rounded hover:bg-indigo-100" data-id="${appointment.id}" title="Edit Appointment">
                        <i class="fas fa-edit"></i>
                    </button>
                     <select class="status-change-select text-xs border border-gray-300 rounded-md px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary" data-id="${appointment.id}" title="Change Status">
                         <option value="confirmed" ${appointment.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                         <option value="pending" ${appointment.status === 'pending' ? 'selected' : ''}>Pending</option>
                         <option value="completed" ${appointment.status === 'completed' ? 'selected' : ''}>Completed</option>
                         <option value="cancelled" ${appointment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                     </select>
                    <button class="text-red-600 hover:text-red-800 delete-appointment-btn p-1 rounded hover:bg-red-100" data-id="${appointment.id}" title="Delete Appointment">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
     }

    if (totalAppointmentsCountEl) {
        totalAppointmentsCountEl.textContent = appointmentsToRender.length;
        // Basic pagination display update (assuming 10 per page for display text only)
        const showingTo = Math.min(10, appointmentsToRender.length);
        const parentDiv = totalAppointmentsCountEl.parentElement;
        if(parentDiv) parentDiv.innerHTML = `Showing <span class="font-medium">${appointmentsToRender.length > 0 ? 1 : 0}</span> to <span class="font-medium">${showingTo}</span> of <span class="font-medium" id="totalAppointmentsCount">${appointmentsToRender.length}</span> appointments`;

    }
    attachAppointmentActionListeners();
}

/**
 * Attaches event listeners to appointment action buttons (Edit, Delete, Status Change)
 */
function attachAppointmentActionListeners() {
    document.querySelectorAll('.edit-appointment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appointmentId = e.currentTarget.getAttribute('data-id');
            if (typeof window.editAppointment === 'function') window.editAppointment(appointmentId);
        });
    });
    
    document.querySelectorAll('.delete-appointment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const appointmentId = e.currentTarget.getAttribute('data-id');
            if (typeof window.deleteAppointment === 'function') window.deleteAppointment(appointmentId);
        });
    });

    document.querySelectorAll('.status-change-select').forEach(select => {
         select.addEventListener('change', (e) => {
             const appointmentId = e.target.getAttribute('data-id');
             const newStatus = e.target.value;
             if (newStatus && typeof window.updateAppointmentStatus === 'function') {
                  window.updateAppointmentStatus(appointmentId, newStatus);
             }
         });
     });
}


// Helper functions
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
     try { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options); } // Ensure date is parsed as local
     catch (e) { return dateStr; }
}
function formatTime(timeStr) {
    if (!timeStr) return 'N/A';
     try {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes || '00'} ${ampm}`;
     } catch (e) { return timeStr; }
}
function formatTimeShort(timeStr) { // For Today's Appointments
    if (!timeStr) return 'N/A';
     try {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}${minutes && minutes !== '00' ? ':' + minutes : ''}${ampm}`;
     } catch (e) { return timeStr; }
}
function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
function getStatusBackgroundColor(status) { // For calendar, today's appointment cards
    switch (status?.toLowerCase()) {
        case 'confirmed': return 'bg-green-50 hover:bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700';
        case 'cancelled': return 'bg-red-50 hover:bg-red-100 text-red-700';
        case 'completed': return 'bg-blue-50 hover:bg-blue-100 text-blue-700';
        default: return 'bg-gray-50 hover:bg-gray-100 text-gray-700';
    }
}
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

