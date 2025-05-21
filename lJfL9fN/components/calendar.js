/**
 * Calendar component for the admin panel
 * Handles calendar rendering and event handling
 */

/**
 * Initializes the calendar with the current month
 */
function initializeCalendarView() {
    const today = new Date();
    renderMonthCalendar(today.getFullYear(), today.getMonth());
    
    // Set up navigation
    setupCalendarNavigation();
}

/**
 * Sets up event listeners for calendar navigation
 */
function setupCalendarNavigation() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    // Variables to keep track of current view
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderMonthCalendar(currentYear, currentMonth);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderMonthCalendar(currentYear, currentMonth);
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            const today = new Date();
            currentYear = today.getFullYear();
            currentMonth = today.getMonth();
            renderMonthCalendar(currentYear, currentMonth);
        });
    }
}

/**
 * Renders a month calendar view
 * @param {number} year - The year to display
 * @param {number} month - The month to display (0-11)
 */
function renderMonthCalendar(year, month) {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) return;
    
    // Update month/year display
    updateMonthYearDisplay(year, month);
    
    // Get the number of days in the month and the first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create calendar grid
    let calendarHTML = `
        <div class="grid grid-cols-7 gap-1">
            <div class="text-center font-medium py-2 text-gray-600">Sun</div>
            <div class="text-center font-medium py-2 text-gray-600">Mon</div>
            <div class="text-center font-medium py-2 text-gray-600">Tue</div>
            <div class="text-center font-medium py-2 text-gray-600">Wed</div>
            <div class="text-center font-medium py-2 text-gray-600">Thu</div>
            <div class="text-center font-medium py-2 text-gray-600">Fri</div>
            <div class="text-center font-medium py-2 text-gray-600">Sat</div>
    `;
    
    // Get appointments for this month
    const appointments = window.appointmentsData || [];
    
    // Calculate rows needed (maximum 6)
    const rows = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
    
    // Generate calendar days
    let dayCount = 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDayOfMonth) || dayCount > daysInMonth) {
                // Empty cell
                calendarHTML += `<div class="bg-gray-50 p-1 h-24 md:h-32 border border-gray-200"></div>`;
            } else {
                // Format date for comparison
                const cellDate = new Date(year, month, dayCount);
                const cellDateStr = cellDate.toISOString().split('T')[0];
                const isToday = new Date().toISOString().split('T')[0] === cellDateStr;
                
                // Get appointments for this day
                const dayAppointments = appointments.filter(app => app.date === cellDateStr);
                
                calendarHTML += `
                    <div class="bg-white p-1 h-24 md:h-32 border ${isToday ? 'border-primary' : 'border-gray-200'} overflow-hidden">
                        <div class="flex justify-between items-center mb-1">
                            <span class="${isToday ? 'bg-primary text-white' : 'text-gray-700'} ${isToday ? 'px-2 py-1 rounded-full' : ''} text-sm font-medium">
                                ${dayCount}
                            </span>
                            ${dayAppointments.length > 0 ? `
                                <span class="text-xs font-medium text-primary">
                                    ${dayAppointments.length} appt${dayAppointments.length > 1 ? 's' : ''}
                                </span>
                            ` : ''}
                        </div>
                        
                        <div class="overflow-y-auto max-h-20 md:max-h-24 text-xs">
                            ${dayAppointments.slice(0, 3).map(app => {
                                return `
                                    <div class="mb-1 py-0.5 px-1 rounded ${getStatusBackgroundColor(app.status)}">
                                        <div class="truncate font-medium">${formatTime(app.time)} ${app.name}</div>
                                    </div>
                                `;
                            }).join('')}
                            
                            ${dayAppointments.length > 3 ? `
                                <div class="text-xs text-primary mt-1">
                                    +${dayAppointments.length - 3} more
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                
                dayCount++;
            }
        }
    }
    
    calendarHTML += `</div>`;
    calendarContainer.innerHTML = calendarHTML;
    
    // Add event listeners to appointment cells
    const appointmentCells = document.querySelectorAll('.calendar-appointment');
    appointmentCells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            const appointmentId = e.currentTarget.getAttribute('data-id');
            if (appointmentId) {
                editAppointment(appointmentId);
            }
        });
    });
}

/**
 * Update the month/year display in the calendar header
 */
function updateMonthYearDisplay(year, month) {
    const monthYearElement = document.getElementById('currentMonthYear');
    if (monthYearElement) {
        const date = new Date(year, month, 1);
        const options = { month: 'long', year: 'numeric' };
        monthYearElement.textContent = date.toLocaleDateString('en-US', options);
    }
}

/**
 * Returns CSS classes for appointment status colors
 * @param {string} status - The appointment status
 * @returns {string} CSS classes
 */
function getStatusBackgroundColor(status) {
    switch (status) {
        case 'confirmed':
            return 'bg-green-50 text-green-800';
        case 'pending':
            return 'bg-yellow-50 text-yellow-800';
        case 'cancelled':
            return 'bg-red-50 text-red-800';
        default:
            return 'bg-gray-50 text-gray-800';
    }
}

/**
 * Format time string for display
 * @param {string} timeStr - Time string in format "HH:MM"
 * @returns {string} Formatted time string
 */
function formatTime(timeStr) {
    if (!timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':');
    const hourNum = parseInt(hours, 10);
    const isPM = hourNum >= 12;
    const hour12 = hourNum % 12 || 12;
    
    return `${hour12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
}


