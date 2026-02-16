// ===================================
// Main JavaScript Functions
// ===================================

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Load flagship programs from JSON
    loadFlagshipPrograms();

    // Load partners carousel from JSON
    loadPartnersCarousel();

    // Load hero slides
    loadHeroSlides();

    // Smooth scroll
    initSmoothScroll();

    // Header scroll effect
    initHeaderScroll();

    // Mobile menu toggle
    initMobileMenu();
});

// Load Flagship Programs from JSON
async function loadFlagshipPrograms() {
    const programsGrid = document.getElementById('programs-grid');

    if (!programsGrid) return;

    try {
        const response = await fetch('flagship-programs.json');
        const data = await response.json();

        programsGrid.innerHTML = data.programs.map(program => `
            <div class="program-card">
                <div class="program-image" style="background-image: url('${program.image}')"></div>
                <div class="program-content">
                    <h3>${program.title}</h3>
                    <p>${program.description}</p>
                    <div class="program-tags">
                        ${program.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${program.link ? `<a href="${program.link}" class="program-link" target="_blank">Learn More →</a>` : ''}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading flagship programs:', error);
        programsGrid.innerHTML = '<p>Unable to load programs. Please try again later.</p>';
    }
}

// Partner Icon SVGs
const partnerIcons = {
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    certificate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
};

// Load Partners Carousel from JSON
async function loadPartnersCarousel() {
    const track = document.getElementById('partners-track');
    const dotsContainer = document.getElementById('partners-dots');
    const prevBtn = document.getElementById('partnersPrev');
    const nextBtn = document.getElementById('partnersNext');

    if (!track) return;

    try {
        const response = await fetch('partners.json');
        const data = await response.json();

        // Render partner cards
        track.innerHTML = data.partners.map(partner => `
            <div class="partner-slide">
                <div class="partner-card">
                    ${partner.image ?
                        `<div class="partner-logo">
                            <img src="${partner.image}" alt="${partner.name}">
                        </div>` : ''
                    }
                    <h3>${partner.name}</h3>
                    <p>${partner.description}</p>
                    ${partner.link ? `<a href="${partner.link}" class="partner-link" target="_blank">Learn More →</a>` : ''}
                </div>
            </div>
        `).join('');

        // Initialize carousel
        initCarousel(track, dotsContainer, prevBtn, nextBtn, data.partners.length);

    } catch (error) {
        console.error('Error loading partners:', error);
        track.innerHTML = '<p>Unable to load partners. Please try again later.</p>';
    }
}

// Initialize Carousel
function initCarousel(track, dotsContainer, prevBtn, nextBtn, totalSlides) {
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let autoPlayInterval;

    // Create dots
    function createDots() {
        const totalDots = Math.ceil(totalSlides / slidesPerView);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Get slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    // Update carousel position
    function updateCarousel() {
        const slideWidth = 100 / slidesPerView;
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

    // Next slide
    function nextSlide() {
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateCarousel();
    }

    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            currentIndex = 0;
            createDots();
            updateCarousel();
        }
    });

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', stopAutoPlay);
    track.parentElement.addEventListener('mouseleave', startAutoPlay);

    // Initialize
    createDots();
    updateCarousel();
    startAutoPlay();
}

// Smooth Scroll Function
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (navLinks && 
        navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        
        // Reset hamburger menu
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});

// Load Hero Slides from JSON
async function loadHeroSlides() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    try {
        const response = await fetch('hero-slides.json');
        const data = await response.json();
        const slides = data.slides;

        if (!slides || slides.length === 0) return;

        const slideElements = [];

        // Helper to trigger image download for a specific slide
        const loadSlideImage = (index) => {
            if (index >= 0 && index < slideElements.length) {
                const el = slideElements[index];
                if (el.dataset.bg) {
                    el.style.backgroundImage = `url('${el.dataset.bg}')`;
                    el.removeAttribute('data-bg'); // Clean up
                }
            }
        };

        slides.forEach((slide, index) => {
            const div = document.createElement('div');
            div.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            
            // LAZY LOADING LOGIC:
            // Only set background-image immediately for the first slide.
            // For others, store it in dataset.bg to be loaded later.
            if (index === 0) {
                div.style.backgroundImage = `url('${slide.image}')`;
            } else {
                div.dataset.bg = slide.image;
            }
            
            div.setAttribute('role', 'img');
            div.setAttribute('aria-label', slide.alt || 'Hero background image');
            
            heroSection.appendChild(div);
            slideElements.push(div);
        });

        // Optimization: Buffer the 2nd slide immediately so the first transition is smooth
        if (slideElements.length > 1) {
            loadSlideImage(1);
        }

        // Start cycling
        if (slideElements.length > 1) {
            let currentSlide = 0;
            setInterval(() => {
                // 1. Move to next slide
                slideElements[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slideElements.length;
                slideElements[currentSlide].classList.add('active');

                // 2. Pre-load the NEXT slide that will be needed in 5 seconds
                // (This ensures we always have one buffered ahead)
                const nextUpIndex = (currentSlide + 1) % slideElements.length;
                loadSlideImage(nextUpIndex);

            }, 5000); 
        }

    } catch (error) {
        console.error('Error loading hero slides:', error);
    }
}