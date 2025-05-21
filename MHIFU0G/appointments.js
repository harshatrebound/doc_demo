/**
 * Appointments-specific functionality
 * Handles loading and rendering of all appointments
 */

/**
 * Loads the appointments content into the main content area
 */
function loadAppointmentsContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) return;
    
    // Generate appointment data (in a real app, this would come from an API)
    const appointments = generateAppointmentData();
    
    // Set the appointments content
    contentArea.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">All Appointments</h1>
                    <p class="text-sm text-gray-500">Manage and view all appointments</p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div class="relative">
                        <input type="text" placeholder="Search appointments" class="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                    <button onclick="openQuickAddModal()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center justify-center">
                        <i class="fas fa-plus mr-2"></i> Add Appointment
                    </button>
                </div>
            </div>
            
            <!-- Filters -->
            <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-4">
                        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="">All Doctors</option>
                            <option value="1">Dr. Naveen Kumar</option>
                            <option value="2">Dr. Sameer K.M</option>
                            <option value="3">Dr. Anjali Sharma</option>
                            <option value="4">Dr. Rajesh Patel</option>
                        </select>
                        
                        <select class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="canceled">Canceled</option>
                            <option value="completed">Completed</option>
                        </select>
                        
                        <input type="date" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <button class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            <i class="fas fa-filter mr-1"></i> Filter
                        </button>
                        <button class="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            <i class="fas fa-sync-alt mr-1"></i> Reset
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Appointments Table -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th class="px-4 py-3 text-left">#ID</th>
                                <th class="px-4 py-3 text-left">Patient</th>
                                <th class="px-4 py-3 text-left">Date & Time</th>
                                <th class="px-4 py-3 text-left">Doctor</th>
                                <th class="px-4 py-3 text-left">Type</th>
                                <th class="px-4 py-3 text-left">Status</th>
                                <th class="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments.map(appointment => `
                                <tr id="appointment-${appointment.id}">
                                    <td class="px-4 py-3 align-middle">
                                        <span class="text-sm font-medium">#${appointment.id}</span>
                                    </td>
                                    <td class="px-4 py-3 align-middle">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                                <span class="text-xs font-medium">${getInitials(appointment.patient.name)}</span>
                                            </div>
                                            <div>
                                                <p class="font-medium">${appointment.patient.name}</p>
                                                <p class="text-xs text-gray-500">${appointment.patient.contact}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 align-middle">
                                        <div>
                                            <p class="text-sm">${appointment.date}</p>
                                            <p class="text-xs text-gray-500">${appointment.time}</p>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 align-middle">
                                        <span class="text-sm">${appointment.doctor}</span>
                                    </td>
                                    <td class="px-4 py-3 align-middle">
                                        <span class="text-sm">${appointment.type}</span>
                                    </td>
                                    <td class="px-4 py-3 align-middle status-cell">
                                        ${getStatusBadge(appointment.status)}
                                    </td>
                                    <td class="px-4 py-3 align-middle text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <button class="text-gray-400 hover:text-gray-600" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            
                                            ${appointment.status === 'Pending' ? `
                                                <button class="text-green-500 hover:text-green-700" title="Confirm Appointment" onclick="handleAppointmentAction('confirm', ${appointment.id})">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            ` : ''}
                                            
                                            ${appointment.status !== 'Canceled' && appointment.status !== 'Completed' ? `
                                                <button class="text-yellow-500 hover:text-yellow-700" title="Cancel Appointment" onclick="handleAppointmentAction('cancel', ${appointment.id})">
                                                    <i class="fas fa-ban"></i>
                                                </button>
                                            ` : ''}
                                            
                                            <button class="text-red-500 hover:text-red-700" title="Delete Appointment" onclick="handleAppointmentAction('delete', ${appointment.id})">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">50</span> appointments
                    </div>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-primary text-white">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">4</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">5</button>
                        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate a set of sample appointment data
 * In a real application, this would come from an API call
 * @returns {Array} Array of appointment objects
 */
function generateAppointmentData() {
    const statuses = ['Confirmed', 'Pending', 'Canceled', 'Completed'];
    const types = ['Consultation', 'Follow-up', 'Procedure', 'Emergency'];
    const doctors = ['Dr. Naveen Kumar L.V', 'Dr. Sameer K.M', 'Dr. Anjali Sharma', 'Dr. Rajesh Patel'];
    const patients = [
        { name: 'Mohan Kumar', contact: '9876543210' },
        { name: 'Priya Singh', contact: '8765432109' },
        { name: 'Rahul Joshi', contact: '7654321098' },
        { name: 'Anita Menon', contact: '6543210987' },
        { name: 'Vikram Sharma', contact: '9876543211' },
        { name: 'Deepa Nair', contact: '8765432100' },
        { name: 'Anil Verma', contact: '7654321099' },
        { name: 'Sunita Patel', contact: '6543210988' },
        { name: 'Ramesh Gupta', contact: '9876543212' },
        { name: 'Kavita Iyer', contact: '8765432101' }
    ];
    
    const appointments = [];
    
    // Generate dates
    const today = new Date();
    
    for (let i = 1; i <= 10; i++) {
        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() - Math.floor(Math.random() * 10)); // Random date within the last 10 days
        
        const hours = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
        const minutes = Math.random() > 0.5 ? 0 : 30; // Either on the hour or half past
        
        const formattedDate = formatDate(appointmentDate);
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
        
        appointments.push({
            id: 1000 + i,
            patient: patients[i % patients.length],
            date: formattedDate,
            time: formattedTime,
            doctor: doctors[i % doctors.length],
            type: types[i % types.length],
            status: statuses[i % statuses.length]
        });
    }
    
    return appointments;
}

/**
 * Gets the initials from a person's name
 * @param {string} name - The full name
 * @returns {string} The initials (first letter of first and last names)
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
}
