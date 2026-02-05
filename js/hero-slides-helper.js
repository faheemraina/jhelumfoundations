
// Load Hero Slides from JSON
async function loadHeroSlides() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    try {
        const response = await fetch('hero-slides.json');
        const data = await response.json();
        const slides = data.slides;

        if (!slides || slides.length === 0) return;

        // Create slide elements
        // We prepend them so they are physically before the .hero-content (though z-index handles stacking too)
        // Reversing so the first one in the list is prepended last (closest to top effectively, though all are z:0)
        // Actually simpler: just append them and trust z-index.
        
        const slideElements = [];

        slides.forEach((slide, index) => {
            const div = document.createElement('div');
            div.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            div.style.backgroundImage = `url('${slide.image}')`;
            div.setAttribute('role', 'img');
            div.setAttribute('aria-label', slide.alt || 'Hero background image');
            
            // Insert before the overlay (::before is pseudo, so just prepend to container)
            // But pseudo-elements are children of the element.
            // .hero context:
            // Children: .hero-content
            // We want slides to be siblings of .hero-content.
            heroSection.appendChild(div);
            slideElements.push(div);
        });

        // Start cycling if more than 1 slide
        if (slideElements.length > 1) {
            let currentSlide = 0;
            setInterval(() => {
                slideElements[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slideElements.length;
                slideElements[currentSlide].classList.add('active');
            }, 5000); // 5 seconds per slide
        }

    } catch (error) {
        console.error('Error loading hero slides:', error);
    }
}
