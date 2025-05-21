/**
 * Doctors-specific functionality
 * Handles loading and rendering of doctors list
 */

/**
 * Loads the doctors content into the main content area
 */
function loadDoctorsContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) return;
    
    // Generate doctor data (in a real app, this would come from an API)
    const doctors = generateDoctorData();
    
    // Set the doctors content
    contentArea.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Doctors</h1>
                    <p class="text-sm text-gray-500">Manage and view all doctors</p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div class="relative">
                        <input type="text" placeholder="Search doctors" class="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                    <button class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center justify-center">
                        <i class="fas fa-plus mr-2"></i> Add Doctor
                    </button>
                </div>
            </div>
            
            <!-- Doctors Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${doctors.map(doctor => `
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden hover-card">
                        <div class="h-40 bg-gray-200 relative">
                            ${doctor.image ? `
                                <img src="${doctor.image}" alt="${doctor.name}" class="w-full h-full object-cover">
                            ` : `
                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
                                    <span class="text-4xl font-bold text-white">${getInitials(doctor.name)}</span>
                                </div>
                            `}
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                                <h3 class="font-semibold text-lg">${doctor.name}</h3>
                                <p class="text-sm">${doctor.specialty}</p>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="flex mb-3">
                                <div class="mr-4">
                                    <span class="text-xs text-gray-500">Today's Appointments</span>
                                    <p class="font-semibold">${doctor.todayAppointments}</p>
                                </div>
                                <div class="mr-4">
                                    <span class="text-xs text-gray-500">Total Patients</span>
                                    <p class="font-semibold">${doctor.totalPatients}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-500">Experience</span>
                                    <p class="font-semibold">${doctor.experience} years</p>
                                </div>
                            </div>
                            <div class="flex items-center mb-3">
                                <i class="fas fa-phone-alt text-gray-400 mr-2"></i>
                                <span class="text-sm">${doctor.contact}</span>
                            </div>
                            <div class="flex items-center mb-4">
                                <i class="fas fa-envelope text-gray-400 mr-2"></i>
                                <span class="text-sm">${doctor.email}</span>
                            </div>
                            <div class="flex justify-between">
                                <div class="flex">
                                    ${doctor.status === 'Available' ? `
                                        <span class="badge badge-green">
                                            <i class="fas fa-check-circle mr-1"></i> Available
                                        </span>
                                    ` : doctor.status === 'On Leave' ? `
                                        <span class="badge badge-red">
                                            <i class="fas fa-times-circle mr-1"></i> On Leave
                                        </span>
                                    ` : `
                                        <span class="badge badge-yellow">
                                            <i class="fas fa-clock mr-1"></i> ${doctor.status}
                                        </span>
                                    `}
                                </div>
                                <div>
                                    <button class="text-gray-400 hover:text-primary" title="View Profile">
                                        <i class="fas fa-user"></i>
                                    </button>
                                    <button class="text-gray-400 hover:text-primary ml-2" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-gray-400 hover:text-red-500 ml-2" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 flex justify-between border-t border-gray-100">
                            <span class="text-sm text-gray-500">Working Hours:</span>
                            <span class="text-sm font-medium">${doctor.workingHours}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Pagination -->
            <div class="mt-6 flex items-center justify-center">
                <div class="flex space-x-1">
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-primary text-white">1</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate a set of sample doctor data
 * In a real application, this would come from an API call
 * @returns {Array} Array of doctor objects
 */
function generateDoctorData() {
    return [
        {
            name: 'Dr. Aarav Mehra',
            specialty: 'Orthopedic Surgeon, Sports Medicine',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            todayAppointments: 12,
            totalPatients: 1254,
            experience: 15,
            contact: '+91 9876543210',
            email: 'naveen@sportsorthopedics.example',
            status: 'Available',
            workingHours: '9:00 AM - 5:00 PM'
        },
        {
            name: 'Dr. Rohan Iyer',
            specialty: 'Shoulder & Knee Specialist',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80',
            todayAppointments: 8,
            totalPatients: 987,
            experience: 12,
            contact: '+91 8765432109',
            email: 'rohan@sportsorthopedics.example',
            status: 'Available',
            workingHours: '10:00 AM - 6:00 PM'
        },
        {
            name: 'Dr. Anjali Sharma',
            specialty: 'Joint Replacement Specialist',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
            todayAppointments: 0,
            totalPatients: 876,
            experience: 10,
            contact: '+91 7654321098',
            email: 'anjali@sportsorthopedics.example',
            status: 'On Leave',
            workingHours: '9:00 AM - 4:00 PM'
        },
        {
            name: 'Dr. Rajesh Patel',
            specialty: 'Sports Injury Specialist',
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
            todayAppointments: 4,
            totalPatients: 743,
            experience: 8,
            contact: '+91 6543210987',
            email: 'rajesh@sportsorthopedics.example',
            status: 'Arriving at 2 PM',
            workingHours: '2:00 PM - 8:00 PM'
        },
        {
            name: 'Dr. Meera Reddy',
            specialty: 'Spine Specialist',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
            todayAppointments: 6,
            totalPatients: 621,
            experience: 7,
            contact: '+91 9876543212',
            email: 'meera@sportsorthopedics.example',
            status: 'Available',
            workingHours: '9:00 AM - 5:00 PM'
        },
        {
            name: 'Dr. Prakash Menon',
            specialty: 'Hand & Wrist Specialist',
            image: null, // No image available
            todayAppointments: 5,
            totalPatients: 512,
            experience: 9,
            contact: '+91 8765432101',
            email: 'prakash@sportsorthopedics.example',
            status: 'Available',
            workingHours: '10:00 AM - 6:00 PM'
        }
    ];
}
