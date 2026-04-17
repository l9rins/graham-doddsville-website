document.addEventListener('DOMContentLoaded', function() {
    // Get the position of the Wealth Creation menu item
    const wealthCreation = document.querySelector('.secondary-nav-list > li:first-child');
    const rect = wealthCreation.getBoundingClientRect();
    
    // Set the CSS variables for positioning
    document.documentElement.style.setProperty('--wealth-creation-left', `${rect.left}px`);
    document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom}px`);
    
    // Update positions on window resize
    window.addEventListener('resize', function() {
        const updatedRect = wealthCreation.getBoundingClientRect();
        document.documentElement.style.setProperty('--wealth-creation-left', `${updatedRect.left}px`);
        document.documentElement.style.setProperty('--dropdown-top', `${updatedRect.bottom}px`);
    });
});