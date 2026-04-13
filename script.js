// ============================================
// Israel Property Advisors - Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const nav = document.getElementById('nav');
    const handleScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Fade-in on scroll ---
    const fadeElements = document.querySelectorAll(
        '.service-card, .process-step, .testimonial-card, .about-grid, .why-grid, .contact-grid, .stats .stat'
    );

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => observer.observe(el));

    // --- Contact form handler ---
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                btn.textContent = 'Message Sent \u2713';
                btn.style.background = '#2d8a4e';
                btn.style.borderColor = '#2d8a4e';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Failed');
            }
        })
        .catch(() => {
            btn.textContent = 'Error \u2014 try again';
            btn.style.background = '#e74c3c';
            btn.style.borderColor = '#e74c3c';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 3000);
        });
    });

    // --- Testimonial Carousel ---
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-track .testimonial-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;
    let autoPlay;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlay = setInterval(() => {
            goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
        }, 6000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    startAutoPlay();

    // Touch/swipe support
    let touchStartX = 0;
    const trackContainer = document.querySelector('.carousel-track-container');
    trackContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    trackContainer.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextBtn.click();
            else prevBtn.click();
        }
    });

    // --- FAQ accordion ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
            btn.setAttribute('aria-expanded', !isActive);
        });
    });

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
});
