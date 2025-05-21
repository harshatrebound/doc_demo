/**
 * Dashboard-specific functionality
 * Handles loading and rendering of dashboard content and charts
 */

/**
 * Loads the dashboard content into the main content area
 */
function loadDashboardContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) return;
    
    // Get today's date for the header
    const today = new Date();
    const formattedDate = formatDate(today);
    
    // Set the dashboard content
    contentArea.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-sm text-gray-500">${formattedDate}</p>
                </div>
                <div class="mt-4 md:mt-0">
                    <button onclick="openQuickAddModal()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center">
                        <i class="fas fa-plus mr-2"></i> Quick Add Appointment
                    </button>
                </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Total Appointments Card -->
                <div class="bg-white rounded-lg border border-gray-200 p-6 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
                            <i class="fas fa-calendar-check text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Total Appointments</h3>
                            <p class="text-2xl font-bold">248</p>
                            <span class="text-xs text-green-500 flex items-center mt-1">
                                <i class="fas fa-arrow-up mr-1"></i> 12% increase
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Today's Appointments Card -->
                <div class="bg-white rounded-lg border border-gray-200 p-6 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                            <i class="fas fa-calendar-day text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Today's Appointments</h3>
                            <p class="text-2xl font-bold">24</p>
                            <span class="text-xs text-green-500 flex items-center mt-1">
                                <i class="fas fa-arrow-up mr-1"></i> 5% from yesterday
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Active Doctors Card -->
                <div class="bg-white rounded-lg border border-gray-200 p-6 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                            <i class="fas fa-user-md text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Active Doctors</h3>
                            <p class="text-2xl font-bold">8</p>
                            <span class="text-xs text-gray-500 flex items-center mt-1">
                                <i class="fas fa-equals mr-1"></i> No change
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Pending Appointments Card -->
                <div class="bg-white rounded-lg border border-gray-200 p-6 hover-card">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                            <i class="fas fa-clock text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Pending Appointments</h3>
                            <p class="text-2xl font-bold">18</p>
                            <span class="text-xs text-red-500 flex items-center mt-1">
                                <i class="fas fa-arrow-up mr-1"></i> 8% from yesterday
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Charts and Tables Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Chart 1: Appointments by Date -->
                <div class="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
                    <h3 class="text-lg font-semibold mb-4">Appointments Overview</h3>
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <span class="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
                            <span class="text-xs text-gray-600 mr-3">Confirmed</span>
                            
                            <span class="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>
                            <span class="text-xs text-gray-600 mr-3">Pending</span>
                            
                            <span class="inline-block w-3 h-3 bg-red-400 rounded-full mr-1"></span>
                            <span class="text-xs text-gray-600">Canceled</span>
                        </div>
                        <select class="text-sm border-gray-300 rounded-md focus:ring-primary">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div class="h-64 flex items-end justify-between px-2">
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 65%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 20%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 10%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Mon</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 45%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 30%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 5%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Tue</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 70%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 15%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 8%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Wed</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 80%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 25%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 12%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Thu</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 90%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 35%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 15%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Fri</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 60%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 20%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 7%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Sat</span>
                        </div>
                        <div class="flex flex-col items-center space-y-1 w-1/7">
                            <div class="w-full flex justify-center items-end h-48">
                                <div class="bg-primary w-5 rounded-t" style="height: 30%"></div>
                                <div class="bg-yellow-400 w-5 rounded-t ml-1" style="height: 10%"></div>
                                <div class="bg-red-400 w-5 rounded-t ml-1" style="height: 5%"></div>
                            </div>
                            <span class="text-xs text-gray-500">Sun</span>
                        </div>
                    </div>
                </div>
                
                <!-- Chart 2: Appointments by Type -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold mb-4">Appointment Types</h3>
                    <div class="flex justify-center">
                        <div class="relative h-48 w-48">
                            <!-- Simulated donut chart -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <!-- Consultation slice (45%) -->
                                <div class="absolute inset-0 bg-blue-500" style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)"></div>
                                
                                <!-- Follow-up slice (30%) -->
                                <div class="absolute inset-0 bg-green-500" style="clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 30%)"></div>
                                
                                <!-- Procedure slice (15%) -->
                                <div class="absolute inset-0 bg-yellow-500" style="clip-path: polygon(50% 50%, 0% 30%, 0% 0%, 30% 0%)"></div>
                                
                                <!-- Emergency slice (10%) -->
                                <div class="absolute inset-0 bg-red-500" style="clip-path: polygon(50% 50%, 30% 0%, 50% 0%)"></div>
                                
                                <!-- Inner white circle for donut effect -->
                                <div class="absolute w-32 h-32 bg-white rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium">248 Total</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Legend -->
                    <div class="mt-6 space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                <span class="text-sm">Consultation</span>
                            </div>
                            <span class="text-sm font-medium">45%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span class="text-sm">Follow-up</span>
                            </div>
                            <span class="text-sm font-medium">30%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                <span class="text-sm">Procedure</span>
                            </div>
                            <span class="text-sm font-medium">15%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                <span class="text-sm">Emergency</span>
                            </div>
                            <span class="text-sm font-medium">10%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Two Sections: Latest Appointments and Doctor Availability -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Latest Appointments -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Recent Appointments</h3>
                        <a href="#" class="text-sm text-primary hover:text-purple-700" onclick="loadSection('appointments'); return false;">View all</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Doctor</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                            <span class="text-xs font-medium">MK</span>
                                        </div>
                                        <div>
                                            <p class="font-medium">Mohan Kumar</p>
                                            <p class="text-xs text-gray-500">mohan@example.com</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-sm">Today, 10:30 AM</span>
                                    </td>
                                    <td>
                                        <span class="text-sm">Dr. Naveen Kumar</span>
                                    </td>
                                    <td class="status-cell">
                                        ${getStatusBadge('Confirmed')}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                            <span class="text-xs font-medium">PS</span>
                                        </div>
                                        <div>
                                            <p class="font-medium">Priya Singh</p>
                                            <p class="text-xs text-gray-500">priya@example.com</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-sm">Today, 11:45 AM</span>
                                    </td>
                                    <td>
                                        <span class="text-sm">Dr. Sameer K.M</span>
                                    </td>
                                    <td class="status-cell">
                                        ${getStatusBadge('Pending')}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                            <span class="text-xs font-medium">RJ</span>
                                        </div>
                                        <div>
                                            <p class="font-medium">Rahul Joshi</p>
                                            <p class="text-xs text-gray-500">rahul@example.com</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-sm">Yesterday, 3:15 PM</span>
                                    </td>
                                    <td>
                                        <span class="text-sm">Dr. Naveen Kumar</span>
                                    </td>
                                    <td class="status-cell">
                                        ${getStatusBadge('Completed')}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-700">
                                            <span class="text-xs font-medium">AM</span>
                                        </div>
                                        <div>
                                            <p class="font-medium">Anita Menon</p>
                                            <p class="text-xs text-gray-500">anita@example.com</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-sm">Yesterday, 4:30 PM</span>
                                    </td>
                                    <td>
                                        <span class="text-sm">Dr. Sameer K.M</span>
                                    </td>
                                    <td class="status-cell">
                                        ${getStatusBadge('Canceled')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Doctor Availability -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Doctor Availability Today</h3>
                        <a href="#" class="text-sm text-primary hover:text-purple-700" onclick="loadSection('doctors'); return false;">View all doctors</a>
                    </div>
                    <div class="space-y-4">
                        <!-- Doctor 1 -->
                        <div class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div class="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Dr. Naveen Kumar" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium">Dr. Naveen Kumar L.V</h4>
                                <p class="text-xs text-gray-500">Orthopedic Surgeon, Sports Medicine</p>
                                <div class="mt-2 flex items-center">
                                    <span class="text-xs text-gray-600 mr-3">9:00 AM - 5:00 PM</span>
                                    <span class="badge badge-green text-xs">Available</span>
                                </div>
                            </div>
                            <div class="ml-4 flex flex-col items-center">
                                <span class="text-2xl font-bold text-primary">12</span>
                                <span class="text-xs text-gray-500">Appointments</span>
                            </div>
                        </div>
                        
                        <!-- Doctor 2 -->
                        <div class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div class="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                                <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80" alt="Dr. Sameer K.M" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium">Dr. Sameer K.M</h4>
                                <p class="text-xs text-gray-500">Shoulder & Knee Specialist</p>
                                <div class="mt-2 flex items-center">
                                    <span class="text-xs text-gray-600 mr-3">10:00 AM - 6:00 PM</span>
                                    <span class="badge badge-green text-xs">Available</span>
                                </div>
                            </div>
                            <div class="ml-4 flex flex-col items-center">
                                <span class="text-2xl font-bold text-primary">8</span>
                                <span class="text-xs text-gray-500">Appointments</span>
                            </div>
                        </div>
                        
                        <!-- Doctor 3 -->
                        <div class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div class="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                                <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" alt="Dr. Anjali Sharma" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium">Dr. Anjali Sharma</h4>
                                <p class="text-xs text-gray-500">Joint Replacement Specialist</p>
                                <div class="mt-2 flex items-center">
                                    <span class="text-xs text-gray-600 mr-3">9:00 AM - 4:00 PM</span>
                                    <span class="badge badge-red text-xs">On Leave</span>
                                </div>
                            </div>
                            <div class="ml-4 flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-400">0</span>
                                <span class="text-xs text-gray-500">Appointments</span>
                            </div>
                        </div>
                        
                        <!-- Doctor 4 -->
                        <div class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div class="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                                <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="Dr. Rajesh Patel" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium">Dr. Rajesh Patel</h4>
                                <p class="text-xs text-gray-500">Sports Injury Specialist</p>
                                <div class="mt-2 flex items-center">
                                    <span class="text-xs text-gray-600 mr-3">2:00 PM - 8:00 PM</span>
                                    <span class="badge badge-yellow text-xs">Arriving at 2 PM</span>
                                </div>
                            </div>
                            <div class="ml-4 flex flex-col items-center">
                                <span class="text-2xl font-bold text-primary">4</span>
                                <span class="text-xs text-gray-500">Appointments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
