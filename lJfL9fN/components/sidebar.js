/**
 * Sidebar component for the admin panel
 * Handles sidebar navigation and collapsing
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
});

/**
 * Initializes the sidebar functionality
 */
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle sidebar on mobile
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            
            // If sidebar is collapsed, add a class to the main content
            const mainContent = document.querySelector('.flex-1');
            if (mainContent) {
                mainContent.classList.toggle('pl-0');
                mainContent.classList.toggle('pl-64');
            }
        });
    }
    
    // Set active link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(navLink => {
                navLink.classList.remove('bg-gray-100', 'text-primary');
                navLink.classList.add('text-gray-700');
            });
            
            link.classList.add('bg-gray-100', 'text-primary');
            link.classList.remove('text-gray-700');
        });
    });
    
    // Set initial active link
    const initialActiveLink = document.querySelector('.nav-link[data-section="dashboard"]');
    if (initialActiveLink) {
        initialActiveLink.classList.add('bg-gray-100', 'text-primary');
        initialActiveLink.classList.remove('text-gray-700');
    }
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Initial check
    handleWindowResize();
}

/**
 * Handles responsive behavior when window is resized
 */
function handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        // If window is small, collapse sidebar
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        } else {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
        }
    }
}


