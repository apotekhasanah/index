        // ================================================
        // Hamburger
        // ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the hamburger button and navigation menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Function to toggle the menu state
    function toggleMenu() {
        // Toggle classes for hamburger animation
        hamburger.classList.toggle('is-active');
        
        // Toggle class for navigation visibility
        navLinks.classList.toggle('is-open');
        
        // Manage aria attributes for accessibility
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    }
    
    // Add click event only to the hamburger button
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu when clicking elsewhere (optional)
    document.addEventListener('click', function(e) {
        // Only if menu is open and click is outside the nav and hamburger
        if (
            navLinks.classList.contains('is-open') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)
        ) {
            toggleMenu();
        }
    });
    
    // Add escape key support for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            toggleMenu();
        }
    });
});

        // ================================================
        // Togle menu
        // ================================================
        // Collapsible sections
    document.querySelectorAll('.subsection-header').forEach(button => {
        button.addEventListener('click', () => {
          const subsection = button.parentElement;
          const isExpanded = subsection.classList.toggle('active');
          const content = subsection.querySelector('.subsection-content');
          
          // Update ARIA attributes
          button.setAttribute('aria-expanded', isExpanded);
          
          // Toggle content
          if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            content.style.maxHeight = null;
          }
        });
      });
