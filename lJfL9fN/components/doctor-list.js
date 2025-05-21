/**
 * Doctor list component for the admin panel
 * Handles doctor display and interactions
 */

/**
 * Updates the doctors grid with current data.
 */
function updateDoctorsGrid() {
    const doctorsGrid = document.getElementById('doctorsGrid');
    const doctorsCountEl = document.getElementById('doctorsCount'); // For the stats card on doctors page

    if (!doctorsGrid) {
        console.warn("Doctor grid element ('doctorsGrid') not found.");
        return;
    }

    const doctors = window.doctorsData || [];

    // Update count on the doctors page
    if (doctorsCountEl) {
        doctorsCountEl.textContent = doctors.length;
    }
    // Also update the total doctors count on the dashboard if that function exists
    if (typeof initializeDashboardCounts === 'function') {
        initializeDashboardCounts();
    }


    doctorsGrid.innerHTML = ''; // Clear previous entries

    if (doctors.length === 0) {
         doctorsGrid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">
                                    <i class="fas fa-user-md fa-3x mb-3"></i>
                                    <p>No doctors found. Click "Add Doctor" to get started.</p>
                                 </div>`;
         return;
    }

    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl';
        doctorCard.setAttribute('data-doctor-id', doctor.id);

        doctorCard.innerHTML = `
            <div class="h-48 w-full overflow-hidden">
                <img src="${doctor.profilePictureUrl || 'https://via.placeholder.com/150'}" alt="Profile of ${doctor.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <h3 class="text-xl font-semibold text-primary mb-1">${doctor.name}</h3>
                <p class="text-gray-700 text-sm mb-3 font-medium">${doctor.specialization}</p>
                
                <div class="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                    <div class="flex items-center">
                        <i class="fas fa-phone-alt w-5 text-gray-400 mr-2"></i>
                        <span>${doctor.contactNumber || 'N/A'}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-envelope w-5 text-gray-400 mr-2"></i>
                        <span class="truncate" title="${doctor.email || 'N/A'}">${doctor.email || 'N/A'}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-user-clock w-5 text-gray-400 mr-2"></i>
                        <span>${doctor.yearsOfExperience !== undefined ? `${doctor.yearsOfExperience} years exp.` : 'N/A'}</span>
                    </div>
                </div>

                <div class="mt-auto pt-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button class="edit-doctor-btn text-sm text-blue-600 hover:text-blue-800 font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition-colors" data-id="${doctor.id}">
                        <i class="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button class="delete-doctor-btn text-sm text-red-600 hover:text-red-800 font-medium py-2 px-3 rounded-md hover:bg-red-50 transition-colors" data-id="${doctor.id}">
                         <i class="fas fa-trash mr-1"></i> Delete
                    </button>
                </div>
            </div>
        `;
        doctorsGrid.appendChild(doctorCard);
    });

    attachDoctorActionListeners();
}

/**
 * Attaches event listeners to doctor action buttons (Edit, Delete).
 */
function attachDoctorActionListeners() {
    document.querySelectorAll('.edit-doctor-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const doctorId = e.currentTarget.getAttribute('data-id');
            const doctor = window.doctorsData.find(d => String(d.id) === String(doctorId));
            if (doctor && typeof window.prepareEditDoctorForm === 'function') {
                window.prepareEditDoctorForm(doctor);
            } else {
                console.error(`Doctor with ID ${doctorId} not found, or prepareEditDoctorForm is undefined.`);
                alert('Could not find doctor data to edit.');
            }
        });
    });

    document.querySelectorAll('.delete-doctor-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const doctorId = e.currentTarget.getAttribute('data-id');
            deleteDoctor(doctorId);
        });
    });
}

/**
 * Handles mock deletion of a doctor from the client-side list.
 * @param {string} doctorId - The ID of the doctor to delete.
 */
function deleteDoctor(doctorId) {
    if (confirm(`Are you sure you want to delete this doctor? This is a mock deletion and won't persist if you reload.`)) {
        if (window.doctorsData) {
            const initialCount = window.doctorsData.length;
            window.doctorsData = window.doctorsData.filter(d => String(d.id) !== String(doctorId));
            
            if (window.doctorsData.length < initialCount) {
                 console.log(`Mock: Doctor with ID ${doctorId} visually removed.`);
                 alert('Doctor visually removed (mock).');
                 updateDoctorsGrid(); // Re-render the list
                 // updateDoctorsGrid already calls initializeDashboardCounts and updates doctorsCountEl
                 if (typeof populateDoctorSelects === 'function') {
                     populateDoctorSelects(); // Update doctor dropdowns in forms
                 }
            } else {
                console.warn(`Mock: Doctor with ID ${doctorId} not found for deletion.`);
            }
        } else {
             console.warn("Mock: window.doctorsData not available for deletion.");
        }
    }
}

// Make updateDoctorsGrid globally available if it's not already (e.g. if admin.js relies on it)
window.updateDoctorsGrid = updateDoctorsGrid;

