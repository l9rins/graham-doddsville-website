// Shared navigation drawer behaviour for subpages (header markup in each page,
// styles in css/site-header.css).
//
// Clicks on the menu and close buttons are handled here in the capture phase
// and stopped, so older per-page handlers bound to the same buttons can't
// toggle the drawer a second time.
(function () {
    var drawer = document.getElementById('mobile-drawer');
    var toggle = document.getElementById('mobile-toggle');
    if (!drawer || !toggle) return;

    function setOpen(open) {
        drawer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    // Pages call these from inline handlers (e.g. drawer links).
    window.toggleMobileMenu = function () { setOpen(!drawer.classList.contains('open')); };
    window.closeMobileMenu = function () { setOpen(false); };

    document.addEventListener('click', function (e) {
        if (e.target.closest('#mobile-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleMobileMenu();
        } else if (e.target.closest('#drawer-close')) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
        } else if (drawer.classList.contains('open') && !drawer.contains(e.target)) {
            // A tap outside the open drawer only closes it
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
        }
    }, true);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Mark the current page in the menu
    var here = location.pathname.split('/').pop() || 'index.html';
    Array.prototype.forEach.call(drawer.querySelectorAll('.drawer-link'), function (link) {
        if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
    });
})();
