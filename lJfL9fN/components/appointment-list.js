/**
 * Appointment list component for the admin panel
 * Handles specific appointment list functionalities like "Today's Appointments"
 * and interactions like status updates.
 * The main "All Appointments" table rendering and filtering is primarily in admin.js.
 */

/**
 * Updates today's appointments list.
 * Expects window.appointmentsData and window.doctorsData to be available.
 */
function updateTodayAppointments() {
    const container = document.getElementById('todayAppointmentsContainer');
    const filterTodayDoctorSelect = document.getElementById('filterTodayDoctor');
    if (!container) return;
    
    const today = new Date().toISOString().split('T')[0];
    const appointments = window.appointmentsData || [];
    const doctors = window.doctorsData || [];
    const filterDoctorId = filterTodayDoctorSelect?.value || '';
    
    const todayAppointments = appointments.filter(app => 
        app.date === today &&
        (filterDoctorId === '' || String(app.doctorId) === String(filterDoctorId))
    ).sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00")); // Sort by time, handle undefined time
    
    if (todayAppointments.length === 0) {
        container.innerHTML = `
            <div class="py-12 text-center">
                <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
                <p class="text-gray-500 text-lg">No appointments scheduled for today${filterDoctorId ? ' for the selected doctor' : ''}.</p>
            </div>`;
        return;
    }
    
    let html = '<div class="relative px-4 space-y-8">'; // Added space-y-8 for gap between items
    
    todayAppointments.forEach((appointment, index) => {
        const doctor = doctors.find(d => String(d.id) === String(appointment.doctorId));
        const doctorName = doctor ? doctor.name : 'Unknown Doctor';
        
        html += `
            <div class="flex items-start relative">
                <!-- Timeline Dot and Line -->
                <div class="flex flex-col items-center mr-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold z-10">
                        ${formatTimeShort(appointment.time)}
                    </div>
                    ${index < todayAppointments.length - 1 ? `
                        <div class="mt-2 w-px h-full bg-gray-300"></div>
                    ` : ''}
                </div>

                <div class="flex-grow bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-bold text-gray-900 text-md">${appointment.name}</h3>
                            <p class="text-sm text-gray-600">with ${doctorName}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}">
                            ${capitalizeFirstLetter(appointment.status)}
                        </span>
                    </div>
                    <div class="flex flex-wrap text-sm text-gray-600 space-y-1">
                        <div class="w-full flex items-center">
                            <i class="fas fa-phone-alt w-4 text-gray-400 mr-2"></i> ${appointment.phone || 'N/A'}
                        </div>
                        <div class="w-full flex items-center">
                            <i class="fas fa-envelope w-4 text-gray-400 mr-2"></i> 
                            <span class="truncate inline-block max-w-[calc(100%-1.5rem)]" title="${appointment.email || ''}">${appointment.email || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-2">
                        <i class="fas fa-notes-medical w-4 text-gray-400 mr-2"></i> ${appointment.reason || 'No reason provided.'}
                    </div>
                    <div class="mt-3 flex justify-end space-x-2">
                        <button class="text-indigo-600 hover:text-indigo-900 text-sm edit-appointment-btn p-1 rounded hover:bg-indigo-100" data-id="${appointment.id}" title="Edit Appointment">
                            <i class="fas fa-edit mr-1"></i> Edit
                        </button>
                         <select class="status-change-select text-xs border border-gray-300 rounded-md px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary" data-id="${appointment.id}" title="Change Status">
                            <option value="confirmed" ${appointment.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="pending" ${appointment.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="completed" ${appointment.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${appointment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                         <button class="text-red-600 hover:text-red-800 text-sm delete-appointment-btn p-1 rounded hover:bg-red-100" data-id="${appointment.id}" title="Delete Appointment">
                            <i class="fas fa-trash mr-1"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Re-attach event listeners using the main admin.js function for consistency
    if (typeof attachAppointmentActionListeners === 'function') {
        attachAppointmentActionListeners();
    } else {
        console.warn("attachAppointmentActionListeners not found in admin.js for Today's Appointments.");
    }
}
window.updateTodayAppointments = updateTodayAppointments;


/**
 * Updates an appointment's status (mock implementation).
 * @param {string|number} appointmentId - The appointment ID
 * @param {string} status - The new status
 */
function updateAppointmentStatus(appointmentId, status) {
    const appointments = window.appointmentsData || [];
    const appointmentIndex = appointments.findIndex(a => String(a.id) === String(appointmentId));

    if (appointmentIndex === -1) {
        alert('Error: Appointment not found for status update.');
        return;
    }

    const appointment = appointments[appointmentIndex];
    const oldStatus = appointment.status;
    const newStatus = status.toLowerCase();

    if (oldStatus === newStatus) return; // No change

    // Confirmation for critical changes might be good, but prompt asks for visual update.
    // For a real app, confirm 'cancelled'.
    // if (newStatus === 'cancelled' && !confirm(`Are you sure you want to cancel this appointment?`)) {
    //     // Revert dropdown if user cancels. This needs access to the select element.
    //     const selectEl = document.querySelector(`.status-change-select[data-id="${appointmentId}"]`);
    //     if (selectEl) selectEl.value = oldStatus;
    //     return;
    // }

    appointment.status = newStatus;
    window.appointmentsData[appointmentIndex] = appointment;
    localStorage.setItem('appointments', JSON.stringify(window.appointmentsData));
    
    console.log(`Mock: Appointment ID ${appointmentId} status updated to "${newStatus}".`);
    
    if (typeof window.updateAppointmentsDisplay === 'function') {
        window.updateAppointmentsDisplay(); // This central function handles refreshing all relevant views
    } else {
        console.error('updateAppointmentsDisplay function not defined in admin.js.');
        // Fallback if the central updater isn't available
        if (typeof window.applyAppointmentFilters === 'function') window.applyAppointmentFilters(); // Refresh main list
        if (typeof window.updateTodayAppointments === 'function') window.updateTodayAppointments(); // Refresh today's list
        if (typeof window.initializeCalendarView === 'function') window.initializeCalendarView(); // Refresh calendar
    }
    // No alert here, the visual change is the feedback. Or a small toast/notification.
}
window.updateAppointmentStatus = updateAppointmentStatus;


// Helper functions (ensure these are available or defined, admin.js should provide them)
if (typeof formatTimeShort !== 'function') {
    function formatTimeShort(timeStr) {
        if (!timeStr) return 'N/A';
        try {
            const [hours, minutes] = timeStr.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}${minutes && minutes !== '00' ? ':' + minutes : ''}${ampm}`;
        } catch (e) { return timeStr; }
    }
}
if (typeof getStatusColor !== 'function') {
    function getStatusColor(status) {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}
if (typeof capitalizeFirstLetter !== 'function') {
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}
// editAppointment, deleteAppointment, attachAppointmentActionListeners are expected from other files/admin.js

