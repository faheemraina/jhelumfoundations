// ===================================
// Animation Effects
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize intersection observer for fade-in animations
    initScrollAnimations();
    
    // Initialize counter animations for stats
    initCounterAnimations();
});

// Scroll-triggered Fade-in Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and important elements
    const elementsToAnimate = document.querySelectorAll(
        '.program-card, .partner-card, .founder-card, .fact-card, .stat-item'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Counter Animation for Stats
function initCounterAnimations() {
    const counters = document.querySelectorAll('.fact-number, .stat-item h3');
    const speed = 200; // Animation speed

    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target;
                const target = counter.innerText;
                
                // Extract number from text (handles "1000+", "30%", etc.)
                const numMatch = target.match(/[\d,]+/);
                if (numMatch) {
                    const targetNum = parseInt(numMatch[0].replace(/,/g, ''));
                    const suffix = target.replace(/[\d,]+/, '');
                    
                    animateCounter(counter, targetNum, suffix, speed);
                    counter.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate individual counter
function animateCounter(element, target, suffix, speed) {
    let current = 0;
    const increment = target / speed;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target + suffix;
            clearInterval(timer);
        } else {
            element.innerText = Math.ceil(current) + suffix;
        }
    }, 10);
}

// Parallax effect for hero section (optional)
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.backgroundPositionY = parallax + 'px';
        });
    }
}

// Initialize parallax if needed
// initParallax();