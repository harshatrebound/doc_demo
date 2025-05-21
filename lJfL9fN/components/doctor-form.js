/**
 * Doctor form component for the admin panel
 * Handles doctor creation and editing modals
 */

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for modal buttons (Add Doctor on page, Save in modal, Close, Cancel)
    // are now primarily managed by admin.js. This component focuses on providing the 
    // core logic functions (prepareNewDoctorForm, prepareEditDoctorForm, saveDoctor)
    // which are exposed to the global window scope.
});


/**
 * Prepares the doctor form for adding a new doctor.
 * Opens the doctor modal.
 */
function prepareNewDoctorForm() {
    const form = document.getElementById('doctorForm');
    const modalTitle = document.getElementById('doctorModalTitle');
    const modal = document.getElementById('doctorModal');

    if (form && modalTitle && modal) {
        form.reset(); 
        document.getElementById('doctorId').value = ''; 
        modalTitle.textContent = 'Add New Doctor';

        form.querySelectorAll('input, textarea').forEach(input => {
             input.classList.remove('border-red-500');
        });
        
        // Set default profile picture URL or leave it for user input
        const imageUrlField = document.getElementById('doctorImageUrl');
        if (imageUrlField) {
            imageUrlField.value = 'https://via.placeholder.com/80'; // Default placeholder
        }

        modal.classList.remove('hidden');
    } else {
        console.error("Doctor form or modal elements not found for 'prepareNewDoctorForm'.");
    }
}

/**
 * Prepares the doctor form for editing an existing doctor.
 * Populates the form with doctor data and opens the modal.
 * @param {object} doctor - The doctor object to edit.
 */
function prepareEditDoctorForm(doctor) {
    const form = document.getElementById('doctorForm');
    const modalTitle = document.getElementById('doctorModalTitle');
    const modal = document.getElementById('doctorModal');

    if (form && modalTitle && modal && doctor) {
        document.getElementById('doctorId').value = doctor.id || '';
        document.getElementById('doctorName').value = doctor.name || '';
        document.getElementById('doctorSpecialization').value = doctor.specialization || '';
        document.getElementById('doctorContact').value = doctor.contactNumber || '';
        document.getElementById('doctorEmail').value = doctor.email || '';
        document.getElementById('doctorExperience').value = doctor.yearsOfExperience || 0;
        document.getElementById('doctorImageUrl').value = doctor.profilePictureUrl || 'https://via.placeholder.com/80';
        
        document.getElementById('doctorAvailableDays').value = Array.isArray(doctor.availableDays) ? doctor.availableDays.join(', ') : (doctor.availableDays || '');
        document.getElementById('doctorAvailableHours').value = doctor.availableHours || '';
        document.getElementById('doctorBio').value = doctor.bio || '';
        document.getElementById('doctorEducation').value = doctor.education || '';

        modalTitle.textContent = `Edit Doctor: ${doctor.name}`;

        form.querySelectorAll('input, textarea').forEach(input => {
             input.classList.remove('border-red-500');
        });

        modal.classList.remove('hidden');
    } else {
         console.error("Doctor data or modal elements missing for 'prepareEditDoctorForm'.");
         if (!doctor) alert("Could not load doctor data for editing.");
    }
}


/**
 * Saves the doctor form data (mock implementation).
 */
function saveDoctor() {
    const form = document.getElementById('doctorForm');
    if (!form) {
        console.error("Doctor form not found for saving.");
        return;
    }
    
    const doctorId = document.getElementById('doctorId').value;
    const isNewDoctor = !doctorId; 

     if (!validateDoctorForm()) {
         alert('Please fill in all required fields correctly. Check highlighted fields.');
         return;
     }

    const doctorData = {
        id: doctorId || `doc_${Date.now()}`, 
        name: document.getElementById('doctorName').value,
        specialization: document.getElementById('doctorSpecialization').value,
        contactNumber: document.getElementById('doctorContact').value,
        email: document.getElementById('doctorEmail').value,
        yearsOfExperience: parseInt(document.getElementById('doctorExperience').value) || 0,
        profilePictureUrl: document.getElementById('doctorImageUrl').value,
        availableDays: document.getElementById('doctorAvailableDays').value.split(',').map(day => day.trim()).filter(day => day !== ''),
        availableHours: document.getElementById('doctorAvailableHours').value.trim(),
        bio: document.getElementById('doctorBio').value.trim(),
        education: document.getElementById('doctorEducation').value.trim()
    };

    console.log('Mock Save Doctor Data:', doctorData);

    if (window.doctorsData) {
        if (isNewDoctor) {
            alert('Doctor added (mock). The list will update.');
            window.doctorsData.push(doctorData);
        } else {
            const index = window.doctorsData.findIndex(d => d.id == doctorId);
            if (index !== -1) {
                alert('Doctor updated (mock). The list will update.');
                window.doctorsData[index] = doctorData;
            } else {
                 console.error('Mock Save Error: Doctor not found for update ID:', doctorId);
                 alert('Error updating doctor data (mock). Doctor not found.');
                 return;
            }
        }

        localStorage.setItem('doctors', JSON.stringify(window.doctorsData));
        console.log("Mock: Doctors data updated in localStorage.");

        if (typeof updateDoctorsGrid === 'function') updateDoctorsGrid();
        if (typeof initializeDashboardCounts === 'function') initializeDashboardCounts();
        if (typeof populateDoctorSelects === 'function') populateDoctorSelects();

    } else {
         console.warn("Mock Save Error: window.doctorsData is not initialized.");
         alert('Error saving doctor data (mock). Data storage not available.');
    }

    const modal = document.getElementById('doctorModal');
    if (modal) {
         modal.classList.add('hidden');
    }
}

/**
 * Validates the doctor form inputs.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateDoctorForm() {
    const form = document.getElementById('doctorForm');
    if (!form) return false;

    const requiredFieldsConfig = {
        'doctorName': { required: true },
        'doctorSpecialization': { required: true },
        'doctorContact': { required: true }, // Add regex for phone if needed
        'doctorEmail': { required: true, regex: /\S+@\S+\.\S+/ },
        'doctorExperience': { required: true, type: 'number', min: 0 },
        'doctorImageUrl': { required: true, regex: /^(ftp|http|https):\/\/[^ "]+$/ }
    };
    
    let isValid = true;

    for (const fieldId in requiredFieldsConfig) {
        const field = document.getElementById(fieldId);
        if (!field) continue;

        const config = requiredFieldsConfig[fieldId];
        const fieldValue = field.value.trim();
        let fieldError = false;

        if (config.required && !fieldValue) {
            fieldError = true;
        }
        
        if (config.regex && fieldValue && !config.regex.test(fieldValue)) {
            fieldError = true;
        }

        if (config.type === 'number') {
            const numValue = parseInt(fieldValue);
            if (isNaN(numValue) || (config.min !== undefined && numValue < config.min) || (config.max !== undefined && numValue > config.max)) {
                fieldError = true;
            }
        }
        
        if (fieldError) {
            field.classList.add('border-red-500');
            field.classList.remove('border-gray-300');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
            field.classList.add('border-gray-300');
        }
    }
    return isValid;
}

window.prepareNewDoctorForm = prepareNewDoctorForm;
window.prepareEditDoctorForm = prepareEditDoctorForm;
window.saveDoctor = saveDoctor;

