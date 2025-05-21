/**
 * Calendar-specific functionality
 * Handles loading and rendering of the calendar view
 */

/**
 * Loads the calendar content into the main content area
 */
function loadCalendarContent() {
    const contentArea = document.getElementById('content-area');
    
    if (!contentArea) return;
    
    // Get the current month and year
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate the calendar data
    const calendarData = generateCalendarData(currentMonth, currentYear);
    
    // Set the calendar content
    contentArea.innerHTML = `
        <div class="fade-in">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Calendar View</h1>
                    <p class="text-sm text-gray-500">View and manage appointments by date</p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div class="flex">
                        <button id="prev-month" class="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="px-4 py-2 border-t border-b border-gray-300 bg-white flex items-center min-w-[150px] justify-center">
                            <span id="current-month-display">${calendarData.monthName} ${currentYear}</span>
                        </div>
                        <button id="next-month" class="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <button onclick="openQuickAddModal()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow-sm flex items-center justify-center">
                        <i class="fas fa-plus mr-2"></i> Add Appointment
                    </button>
                </div>
            </div>
            
            <!-- Calendar View -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <!-- Week days header -->
                <div class="grid grid-cols-7 border-b border-gray-200">
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Sun</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Mon</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Tue</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Wed</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Thu</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200">Fri</div>
                    <div class="py-2 text-center text-sm font-medium text-gray-700">Sat</div>
                </div>
                
                <!-- Calendar grid -->
                <div class="grid grid-cols-7 grid-rows-6">
                    ${calendarData.days.map((day, index) => {
                        const isToday = day.date && day.date.getDate() === today.getDate() && 
                                        day.date.getMonth() === today.getMonth() && 
                                        day.date.getFullYear() === today.getFullYear();
                        
                        const isOtherMonth = day.date && day.date.getMonth() !== currentMonth;
                        
                        let classList = "calendar-day min-h-[100px] p-2 border-r border-b border-gray-200";
                        if ((index + 1) % 7 === 0) classList = classList.replace('border-r', ''); // Remove right border for last column
                        if (isToday) classList += " today";
                        if (isOtherMonth) classList += " other-month";
                        
                        return `
                            <div class="${classList}">
                                ${day.date ? `
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="text-sm font-medium ${isOtherMonth ? 'text-gray-400' : 'text-gray-700'} ${isToday ? 'h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center' : ''}">${day.date.getDate()}</span>
                                        ${day.appointmentsCount > 0 ? `
                                            <span class="text-xs px-1.5 py-0.5 bg-primary bg-opacity-10 text-primary rounded-full">${day.appointmentsCount}</span>
                                        ` : ''}
                                    </div>
                                    
                                    <div class="space-y-1">
                                        ${day.appointments.slice(0, 3).map(apt => `
                                            <div class="text-xs py-0.5 px-1.5 rounded truncate ${getAppointmentClassByStatus(apt.status)}" title="${apt.time} - ${apt.patient} with ${apt.doctor}">
                                                ${apt.time} - ${apt.patient}
                                            </div>
                                        `).join('')}
                                        
                                        ${day.appointmentsCount > 3 ? `
                                            <div class="text-xs text-gray-500 hover:text-primary font-medium cursor-pointer">
                                                +${day.appointmentsCount - 3} more
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Legend & Summary -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Legend -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden col-span-1 p-4">
                    <h3 class="font-medium text-gray-700 mb-3">Legend</h3>
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-sm bg-green-100 border border-green-200"></div>
                            <span class="ml-2 text-sm">Confirmed Appointment</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-sm bg-yellow-100 border border-yellow-200"></div>
                            <span class="ml-2 text-sm">Pending Appointment</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-sm bg-red-100 border border-red-200"></div>
                            <span class="ml-2 text-sm">Canceled Appointment</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded-sm bg-blue-100 border border-blue-200"></div>
                            <span class="ml-2 text-sm">Completed Appointment</span>
                        </div>
                        <div class="flex items-center">
                            <div class="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">15</div>
                            <span class="ml-2 text-sm">Today</span>
                        </div>
                    </div>
                </div>
                
                <!-- Monthly Summary -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden col-span-2 p-4">
                    <h3 class="font-medium text-gray-700 mb-3">Monthly Summary</h3>
                    <div class="flex flex-wrap gap-4">
                        <div class="bg-gray-50 rounded-lg p-3 flex-1 min-w-[120px]">
                            <div class="text-sm text-gray-500">Total Appointments</div>
                            <div class="text-2xl font-bold text-gray-800 mt-1">248</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3 flex-1 min-w-[120px]">
                            <div class="text-sm text-gray-500">Confirmed</div>
                            <div class="text-2xl font-bold text-green-600 mt-1">175</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3 flex-1 min-w-[120px]">
                            <div class="text-sm text-gray-500">Pending</div>
                            <div class="text-2xl font-bold text-yellow-600 mt-1">36</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3 flex-1 min-w-[120px]">
                            <div class="text-sm text-gray-500">Canceled</div>
                            <div class="text-2xl font-bold text-red-600 mt-1">18</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3 flex-1 min-w-[120px]">
                            <div class="text-sm text-gray-500">Completed</div>
                            <div class="text-2xl font-bold text-blue-600 mt-1">167</div>
                        </div>
                    </div>
                    
                    <!-- Month Progress Bar -->
                    <div class="mt-6">
                        <div class="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Month Progress</span>
                            <span>${Math.round((today.getDate() / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) * 100)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-primary h-2.5 rounded-full" style="width: ${Math.round((today.getDate() / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) * 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for month navigation
    document.getElementById('prev-month').addEventListener('click', () => {
        navigateMonth(-1);
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        navigateMonth(1);
    });
}

/**
 * Navigates to the previous or next month
 * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
 */
function navigateMonth(direction) {
    // Get current displayed month
    const monthDisplay = document.getElementById('current-month-display');
    const [monthName, year] = monthDisplay.textContent.split(' ');
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let monthIndex = monthNames.indexOf(monthName);
    let yearNum = parseInt(year);
    
    // Calculate new month and year
    monthIndex += direction;
    
    if (monthIndex < 0) {
        monthIndex = 11;
        yearNum--;
    } else if (monthIndex > 11) {
        monthIndex = 0;
        yearNum++;
    }
    
    // Generate new calendar data
    const calendarData = generateCalendarData(monthIndex, yearNum);
    
    // Update month display
    monthDisplay.textContent = `${calendarData.monthName} ${yearNum}`;
    
    // Update calendar grid
    const calendarGrid = document.querySelector('.grid-rows-6');
    
    if (calendarGrid) {
        const today = new Date();
        
        calendarGrid.innerHTML = calendarData.days.map((day, index) => {
            const isToday = day.date && day.date.getDate() === today.getDate() && 
                            day.date.getMonth() === today.getMonth() && 
                            day.date.getFullYear() === today.getFullYear();
            
            const isOtherMonth = day.date && day.date.getMonth() !== monthIndex;
            
            let classList = "calendar-day min-h-[100px] p-2 border-r border-b border-gray-200";
            if ((index + 1) % 7 === 0) classList = classList.replace('border-r', ''); // Remove right border for last column
            if (isToday) classList += " today";
            if (isOtherMonth) classList += " other-month";
            
            return `
                <div class="${classList}">
                    ${day.date ? `
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-sm font-medium ${isOtherMonth ? 'text-gray-400' : 'text-gray-700'} ${isToday ? 'h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center' : ''}">${day.date.getDate()}</span>
                            ${day.appointmentsCount > 0 ? `
                                <span class="text-xs px-1.5 py-0.5 bg-primary bg-opacity-10 text-primary rounded-full">${day.appointmentsCount}</span>
                            ` : ''}
                        </div>
                        
                        <div class="space-y-1">
                            ${day.appointments.slice(0, 3).map(apt => `
                                <div class="text-xs py-0.5 px-1.5 rounded truncate ${getAppointmentClassByStatus(apt.status)}" title="${apt.time} - ${apt.patient} with ${apt.doctor}">
                                    ${apt.time} - ${apt.patient}
                                </div>
                            `).join('')}
                            
                            ${day.appointmentsCount > 3 ? `
                                <div class="text-xs text-gray-500 hover:text-primary font-medium cursor-pointer">
                                    +${day.appointmentsCount - 3} more
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
}

/**
 * Generates calendar data for a specific month and year
 * @param {number} month - The month (0-11)
 * @param {number} year - The year
 * @returns {Object} Calendar data object with month name and array of day data
 */
function generateCalendarData(month, year) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Array to hold all days in the calendar grid (6 rows x 7 columns = 42)
    const days = [];
    
    // Add days from previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPrevMonth - i);
        
        // Generate random number of appointments (0-2)
        const appointmentsCount = Math.floor(Math.random() * 3);
        const appointments = generateAppointmentsForDay(appointmentsCount, date);
        
        days.push({
            date: date,
            appointmentsCount: appointmentsCount,
            appointments: appointments
        });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        
        // Generate more appointments for weekdays (1-7)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const maxAppointments = isWeekend ? 3 : 8;
        
        // Randomly determine if this is a busy day
        const isBusyDay = Math.random() < 0.3; // 30% chance of being busy
        
        // Generate random number of appointments (0-maxAppointments)
        const appointmentsCount = isBusyDay 
            ? Math.floor(Math.random() * (maxAppointments - 4) + 4) // 4 to maxAppointments
            : Math.floor(Math.random() * 4); // 0 to 3
        
        const appointments = generateAppointmentsForDay(appointmentsCount, date);
        
        days.push({
            date: date,
            appointmentsCount: appointmentsCount,
            appointments: appointments
        });
    }
    
    // Add days from next month to fill the grid (up to 42 cells)
    const remainingDays = 42 - days.length;
    
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        
        // Generate random number of appointments (0-2)
        const appointmentsCount = Math.floor(Math.random() * 3);
        const appointments = generateAppointmentsForDay(appointmentsCount, date);
        
        days.push({
            date: date,
            appointmentsCount: appointmentsCount,
            appointments: appointments
        });
    }
    
    return {
        monthName: monthNames[month],
        days: days
    };
}

/**
 * Generates a list of appointments for a specific day
 * @param {number} count - Number of appointments to generate
 * @param {Date} date - The date for which to generate appointments
 * @returns {Array} Array of appointment objects
 */
function generateAppointmentsForDay(count, date) {
    const appointments = [];
    
    const statuses = ['Confirmed', 'Pending', 'Canceled', 'Completed'];
    const doctors = ['Dr. Naveen', 'Dr. Sameer', 'Dr. Anjali', 'Dr. Rajesh'];
    const patients = [
        'Mohan K.', 'Priya S.', 'Rahul J.', 'Anita M.', 'Vikram S.',
        'Deepa N.', 'Anil V.', 'Sunita P.', 'Ramesh G.', 'Kavita I.'
    ];
    
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
    ];
    
    // Create a set of already used time slots to avoid duplicates
    const usedTimeSlots = new Set();
    
    for (let i = 0; i < count; i++) {
        let timeSlot;
        
        // Try to find an unused time slot
        do {
            timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        } while (usedTimeSlots.has(timeSlot) && usedTimeSlots.size < timeSlots.length);
        
        // If all time slots are used, just use a random one
        if (usedTimeSlots.size >= timeSlots.length) {
            timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        }
        
        usedTimeSlots.add(timeSlot);
        
        // Determine status based on whether the date is in the past
        const isPastDate = date < new Date();
        const statusOptions = isPastDate ? 
            ['Completed', 'Canceled'] : 
            ['Confirmed', 'Pending', 'Canceled'];
        
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        appointments.push({
            time: timeSlot,
            patient: patients[Math.floor(Math.random() * patients.length)],
            doctor: doctors[Math.floor(Math.random() * doctors.length)],
            status: status
        });
    }
    
    // Sort appointments by time
    appointments.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    return appointments;
}

/**
 * Returns the CSS class for an appointment based on its status
 * @param {string} status - The appointment status
 * @returns {string} CSS class
 */
function getAppointmentClassByStatus(status) {
    switch (status) {
        case 'Confirmed':
            return 'bg-green-100 text-green-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'Canceled':
            return 'bg-red-100 text-red-800';
        case 'Completed':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
