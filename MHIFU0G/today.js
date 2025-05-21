/**
 * Today's Appointments specific functionality
 * Handles loading and rendering of today's appointments
 */

/**
 * Loads the today's appointments content into the main content area
 */
function loadTodayAppointmentsContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) return;
    
    // Generate today's appointment data (in a real app, this would come from an API)
    const appointments = generateTodayAppointmentData();
    
    // Group appointments by time slot
    const appointmentsByTime = groupAppointmentsByTime(appointments);
    const timeSlots = Object.keys(appointmentsByTime).sort();
    
    // Get today's date for the header
    const today = new Date();
    const formattedDate = formatDate(today);
    
    // Set the today's appointments content
    contentArea.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Today's Appointments</h1>
                    <p class="text-sm text-gray-500">${formattedDate}</p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button onclick="openQuickAddModal()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center justify-center">
                        <i class="fas fa-plus mr-2"></i> Add Appointment
                    </button>
                    <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 shadow-sm flex items-center justify-center">
                        <i class="fas fa-print mr-2"></i> Print Schedule
                    </button>
                </div>
            </div>
            
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg border border-gray-200 p-4 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                            <i class="fas fa-calendar-check text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Total Appointments</h3>
                            <p class="text-2xl font-bold">${appointments.length}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg border border-gray-200 p-4 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                            <i class="fas fa-check-circle text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Confirmed</h3>
                            <p class="text-2xl font-bold">${appointments.filter(a => a.status === 'Confirmed').length}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg border border-gray-200 p-4 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                            <i class="fas fa-clock text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Pending</h3>
                            <p class="text-2xl font-bold">${appointments.filter(a => a.status === 'Pending').length}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg border border-gray-200 p-4 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                            <i class="fas fa-times-circle text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Canceled</h3>
                            <p class="text-2xl font-bold">${appointments.filter(a => a.status === 'Canceled').length}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Today's Schedule Timeline -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">Today's Schedule</h2>
                </div>
                
                <div class="divide-y divide-gray-200">
                    ${timeSlots.length > 0 ? timeSlots.map(timeSlot => `
                        <div class="p-4">
                            <div class="flex items-center mb-4">
                                <div class="w-16 text-center">
                                    <span class="text-sm font-medium">${timeSlot}</span>
                                </div>
                                <div class="ml-4 flex-1 border-t border-gray-200"></div>
                            </div>
                            
                            <div class="pl-16">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${appointmentsByTime[timeSlot].map(appointment => `
                                        <div id="appointment-${appointment.id}" class="border border-gray-200 rounded-lg p-3 hover:border-primary hover:bg-purple-50 transition-colors duration-200">
                                            <div class="flex justify-between mb-2">
                                                <span class="text-xs font-medium text-gray-500">#${appointment.id}</span>
                                                <div class="status-cell">
                                                    ${getStatusBadge(appointment.status)}
                                                </div>
                                            </div>
                                            <div class="flex items-center mb-2">
                                                <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                                    <span class="text-xs font-medium">${getInitials(appointment.patient.name)}</span>
                                                </div>
                                                <div>
                                                    <p class="font-medium">${appointment.patient.name}</p>
                                                    <p class="text-xs text-gray-500">${appointment.patient.contact}</p>
                                                </div>
                                            </div>
                                            <div class="mb-2 flex items-center">
                                                <i class="fas fa-user-md text-gray-400 w-5"></i>
                                                <span class="text-sm ml-1">${appointment.doctor}</span>
                                            </div>
                                            <div class="mb-2 flex items-center">
                                                <i class="fas fa-tag text-gray-400 w-5"></i>
                                                <span class="text-sm ml-1">${appointment.type}</span>
                                            </div>
                                            ${appointment.notes ? `
                                                <div class="mb-3 flex">
                                                    <i class="fas fa-sticky-note text-gray-400 w-5 mt-1"></i>
                                                    <span class="text-sm ml-1">${appointment.notes}</span>
                                                </div>
                                            ` : ''}
                                            <div class="flex justify-end space-x-2 mt-2">
                                                ${appointment.status === 'Pending' ? `
                                                    <button class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200" onclick="handleAppointmentAction('confirm', ${appointment.id})">
                                                        <i class="fas fa-check mr-1"></i> Confirm
                                                    </button>
                                                ` : ''}
                                                
                                                ${appointment.status !== 'Canceled' && appointment.status !== 'Completed' ? `
                                                    <button class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" onclick="handleAppointmentAction('cancel', ${appointment.id})">
                                                        <i class="fas fa-ban mr-1"></i> Cancel
                                                    </button>
                                                ` : ''}
                                                
                                                <button class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onclick="handleAppointmentAction('delete', ${appointment.id})">
                                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="p-8 text-center">
                            <div class="mb-4 text-gray-400">
                                <i class="fas fa-calendar-times text-4xl"></i>
                            </div>
                            <h3 class="text-xl font-medium text-gray-700 mb-2">No Appointments Today</h3>
                            <p class="text-gray-500 mb-4">There are no appointments scheduled for today.</p>
                            <button onclick="openQuickAddModal()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i> Add New Appointment
                            </button>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Doctors Availability -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">Doctors Availability Today</h2>
                </div>
                
                <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Doctor 1 -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-purple-50 transition-colors duration-200">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Dr. Naveen Kumar" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="font-medium">Dr. Aarav Mehra</h4>
                                <p class="text-xs text-gray-500">9:00 AM - 5:00 PM</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="badge badge-green">Available</span>
                            <span class="text-sm font-medium">12 Appointments</span>
                        </div>
                    </div>
                    
                    <!-- Doctor 2 -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-purple-50 transition-colors duration-200">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                                <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80" alt="Dr. Rohan Iyer" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="font-medium">Dr. Rohan Iyer</h4>
                                <p class="text-xs text-gray-500">10:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="badge badge-green">Available</span>
                            <span class="text-sm font-medium">8 Appointments</span>
                        </div>
                    </div>
                    
                    <!-- Doctor 3 -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-purple-50 transition-colors duration-200">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                                <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="Dr. Anjali Sharma" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="font-medium">Dr. Anjali Sharma</h4>
                                <p class="text-xs text-gray-500">9:00 AM - 4:00 PM</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="badge badge-red">On Leave</span>
                            <span class="text-sm font-medium">0 Appointments</span>
                        </div>
                    </div>
                    
                    <!-- Doctor 4 -->
                    <div class="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-purple-50 transition-colors duration-200">
                        <div class="flex items-center mb-3">
                            <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                                <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="Dr. Rajesh Patel" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h4 class="font-medium">Dr. Rajesh Patel</h4>
                                <p class="text-xs text-gray-500">2:00 PM - 8:00 PM</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="badge badge-yellow">Arriving at 2 PM</span>
                            <span class="text-sm font-medium">4 Appointments</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate a set of sample today's appointment data
 * In a real application, this would come from an API call
 * @returns {Array} Array of appointment objects
 */
function generateTodayAppointmentData() {
    const statuses = ['Confirmed', 'Pending', 'Canceled', 'Completed'];
    const types = ['Consultation', 'Follow-up', 'Procedure', 'Emergency'];
    const doctors = ['Dr. Aarav Mehra', 'Dr. Rohan Iyer', 'Dr. Anjali Sharma', 'Dr. Rajesh Patel'];
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
    
    const notes = [
        'Patient has knee pain after playing football',
        'Follow-up after shoulder surgery',
        'Recurring ankle sprain',
        'Pre-surgery consultation',
        'Lower back pain',
        null
    ];
    
    const appointments = [];
    
    // Generate appointments for today at different times
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];
    
    // Generate random number of appointments (between 12 and 20)
    const appointmentCount = 12 + Math.floor(Math.random() * 9);
    
    const usedTimeSlots = {}; // To track which doctor is booked at what time
    
    for (let i = 1; i <= appointmentCount; i++) {
        // Select a random doctor
        const doctorIndex = Math.floor(Math.random() * doctors.length);
        const doctor = doctors[doctorIndex];
        
        // Select a random time slot
        let timeSlotIndex;
        let timeSlot;
        
        // Ensure we don't double-book a doctor
        do {
            timeSlotIndex = Math.floor(Math.random() * timeSlots.length);
            timeSlot = timeSlots[timeSlotIndex];
        } while (usedTimeSlots[doctor + timeSlot]);
        
        usedTimeSlots[doctor + timeSlot] = true;
        
        // Determine if the time has passed (appointment potentially completed)
        const now = new Date();
        const appointmentTime = new Date();
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        appointmentTime.setHours(hours, parseInt(minutes), 0, 0);
        
        // Past appointments have higher chance of being completed or canceled
        let statusOptions;
        if (appointmentTime < now) {
            statusOptions = Math.random() < 0.3 ? ['Canceled'] : ['Completed'];
        } else {
            statusOptions = statuses.filter(s => s !== 'Completed');
        }
        
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        appointments.push({
            id: 1000 + i,
            patient: patients[Math.floor(Math.random() * patients.length)],
            time: timeSlot,
            doctor: doctor,
            type: types[Math.floor(Math.random() * types.length)],
            status: status,
            notes: notes[Math.floor(Math.random() * notes.length)]
        });
    }
    
    // Sort appointments by time
    appointments.sort((a, b) => {
        const getTimeValue = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + parseInt(minutes);
        };
        
        return getTimeValue(a.time) - getTimeValue(b.time);
    });
    
    return appointments;
}

/**
 * Groups appointments by time slot
 * @param {Array} appointments - Array of appointment objects
 * @returns {Object} Object with time slots as keys and arrays of appointments as values
 */
function groupAppointmentsByTime(appointments) {
    const result = {};
    
    appointments.forEach(appointment => {
        if (!result[appointment.time]) {
            result[appointment.time] = [];
        }
        
        result[appointment.time].push(appointment);
    });
    
    return result;
}
