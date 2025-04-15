document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');

    function toggleTheme(icon) {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Desktop theme toggle
    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('i');
        const mobileIcon = themeToggleMobile.querySelector('i');
        toggleTheme(icon);
        mobileIcon.className = icon.className; // Sync mobile icon
    });

    // Mobile theme toggle
    themeToggleMobile.addEventListener('click', () => {
        const icon = themeToggleMobile.querySelector('i');
        const desktopIcon = themeToggle.querySelector('i');
        toggleTheme(icon);
        desktopIcon.className = icon.className; // Sync desktop icon
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        themeToggleMobile.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    // Add section tracking for navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking nav items
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
});

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});
