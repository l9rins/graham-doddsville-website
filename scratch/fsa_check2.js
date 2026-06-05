
function toggleMobileMenu() {
            const mobileDrawer = document.getElementById('mobile-drawer');
            if (mobileDrawer) {
                if (mobileDrawer.classList.contains('open')) {
                    mobileDrawer.classList.remove('open');
                    document.body.style.overflow = '';
                } else {
                    mobileDrawer.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            }
        }
    