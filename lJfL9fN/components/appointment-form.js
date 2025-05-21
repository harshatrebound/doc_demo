/**
 * Appointment form component for the admin panel
 * Handles appointment creation and editing
 */

/**
 * Prepares the appointment form for adding a new appointment
 */
function prepareNewAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.reset();
        document.getElementById('appointmentId').value = '';
        document.getElementById('appointmentModalTitle').textContent = 'Add New Appointment';
        document.getElementById('appointmentDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentStatus').value = 'confirmed';
        form.querySelectorAll('input, select, textarea').forEach(input => {
             input.classList.remove('border-red-500');
             input.classList.add('border-gray-300'); 
        });
        document.getElementById('appointmentModal').classList.remove('hidden');
        if (typeof populateDoctorSelects === 'function') populateDoctorSelects(); // Ensure doctors are populated
    }
}
window.prepareNewAppointmentForm = prepareNewAppointmentForm;

/**
 * Prepares the appointment form for editing an existing appointment
 * @param {string|number} appointmentId - The ID of the appointment to edit
 */
function editAppointment(appointmentId) {
    const appointments = window.appointmentsData || [];
    const appointment = appointments.find(a => String(a.id) === String(appointmentId));
    
    if (!appointment) {
        alert('Error: Appointment not found.');
        return;
    }
    
    document.getElementById('appointmentModalTitle').textContent = 'Edit Appointment';
    document.getElementById('appointmentId').value = appointment.id;
    document.getElementById('patientName').value = appointment.name || '';
    document.getElementById('patientEmail').value = appointment.email || '';
    document.getElementById('patientPhone').value = appointment.phone || '';
    document.getElementById('appointmentDoctor').value = appointment.doctorId || '';
    document.getElementById('appointmentDate').value = appointment.date || '';
    document.getElementById('appointmentTime').value = appointment.time || '';
    document.getElementById('appointmentReason').value = appointment.reason || '';
    document.getElementById('appointmentStatus').value = appointment.status || 'pending';
    
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-300');
        });
    }
    document.getElementById('appointmentModal').classList.remove('hidden');
    if (typeof populateDoctorSelects === 'function') populateDoctorSelects(); // Ensure doctors are populated
}
window.editAppointment = editAppointment;

/**
 * Saves the appointment form data.
 */
function saveAppointment() {
    const form = document.getElementById('appointmentForm');
    if(!form) return;

    const appointmentId = document.getElementById('appointmentId').value;
    const isNew = !appointmentId;
    
    const appointmentData = {
        id: isNew ? Date.now() : parseInt(appointmentId), // Ensure ID is number for consistency
        name: document.getElementById('patientName').value.trim(),
        email: document.getElementById('patientEmail').value.trim(),
        phone: document.getElementById('patientPhone').value.trim(),
        doctorId: document.getElementById('appointmentDoctor').value, // doctorId is usually string
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        reason: document.getElementById('appointmentReason').value.trim(),
        status: document.getElementById('appointmentStatus').value,
        createdAt: isNew ? new Date().toISOString() : 
            (window.appointmentsData.find(a => String(a.id) === String(appointmentId))?.createdAt || new Date().toISOString())
    };
    
    if (isNew) {
        window.appointmentsData.push(appointmentData);
    } else {
        const index = window.appointmentsData.findIndex(a => String(a.id) === String(appointmentData.id));
        if (index !== -1) window.appointmentsData[index] = appointmentData;
        else { alert('Error updating appointment.'); return; }
    }
    
    localStorage.setItem('appointments', JSON.stringify(window.appointmentsData));
    document.getElementById('appointmentModal').classList.add('hidden');
    
    if(typeof window.updateAppointmentsDisplay === 'function') {
        window.updateAppointmentsDisplay();
    } else {
        console.error("updateAppointmentsDisplay is not defined. UI might not refresh.");
    }
    alert(isNew ? 'Appointment created successfully! (Mock)' : 'Appointment updated successfully! (Mock)');
}
window.saveAppointment = saveAppointment;

/**
 * Deletes an appointment (mock implementation).
 * @param {string|number} appointmentId - The ID of the appointment to delete
 */
function deleteAppointment(appointmentId) {
    const appointment = window.appointmentsData.find(a => String(a.id) === String(appointmentId));
    if (!appointment) {
         alert('Error: Appointment not found for deletion.');
         return;
    }

    if (confirm(`Are you sure you want to delete the appointment for ${appointment.name} (${formatDate(appointment.date)})? This is a mock action.`)) {
        window.appointmentsData = window.appointmentsData.filter(a => String(a.id) !== String(appointmentId));
        localStorage.setItem('appointments', JSON.stringify(window.appointmentsData));
        
        if(typeof window.updateAppointmentsDisplay === 'function') {
            window.updateAppointmentsDisplay();
        } else {
            console.error("updateAppointmentsDisplay is not defined. UI might not refresh.");
        }
        alert('Appointment deleted. (Mock)');
    }
}
window.deleteAppointment = deleteAppointment;

/**
 * Validates appointment form input before saving.
 * @returns {boolean} True if valid, false otherwise
 */
function validateAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = ['patientName', 'patientEmail', 'patientPhone', 'appointmentDoctor', 
                            'appointmentDate', 'appointmentTime', 'appointmentReason'];
                      
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const isSelect = field.tagName === 'SELECT';
            const value = field.value.trim();
            if ((isSelect && !value) || (!isSelect && !value)) {
                field.classList.add('border-red-500');
                field.classList.remove('border-gray-300');
                isValid = false;
            } else {
                field.classList.remove('border-red-500');
                field.classList.add('border-gray-300');
            }
        }
    });
    
    const emailField = document.getElementById('patientEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField && emailField.value.trim() && !emailRegex.test(emailField.value.trim())) {
        emailField.classList.add('border-red-500');
        emailField.classList.remove('border-gray-300');
        isValid = false;
    } else if (emailField && emailField.classList.contains('border-red-500') && emailRegex.test(emailField.value.trim())) {
        // If it was red but now valid
        emailField.classList.remove('border-red-500');
        emailField.classList.add('border-gray-300');
    }
    
    // Basic phone validation (e.g., at least 7 digits)
    const phoneField = document.getElementById('patientPhone');
    if (phoneField && phoneField.value.trim() && phoneField.value.replace(/\D/g, '').length < 7) {
        phoneField.classList.add('border-red-500');
        phoneField.classList.remove('border-gray-300');
        isValid = false;
    } else if (phoneField && phoneField.classList.contains('border-red-500') && phoneField.value.replace(/\D/g, '').length >= 7) {
        phoneField.classList.remove('border-red-500');
        phoneField.classList.add('border-gray-300');
    }
    return isValid;
}
window.validateAppointmentForm = validateAppointmentForm;

// Re-expose populateDoctorSelects if it was defined here or ensure it's globally available from admin.js
if (typeof populateDoctorSelects !== 'function' && typeof window.populateDoctorSelects === 'function') {
    // already global, good.
} else if (typeof populateDoctorSelects !== 'function') {
    // Fallback if not defined elsewhere, though admin.js should provide it.
    window.populateDoctorSelects = function() { console.warn("populateDoctorSelects stub used in appointment-form.js"); };
}


// Helper functions (ensure these are available, admin.js should provide them)
if (typeof formatDate !== 'function') {
    function formatDate(dateStr) { // Minimal fallback
        if (!dateStr) return 'N/A';
        return new Date(dateStr  + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}
