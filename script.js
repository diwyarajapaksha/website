/* --- MAUCHO RANDOM HERO POSITIONING (TEXT VERSION) --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify all text badges
    const allBadges = document.querySelectorAll('.random-badge');

    // 2. Define Safety Zones (Coordinates are Top and Left percentages)
    // This keeps them floating nicely around the edges and top area
    const safetyZones = [
        { top: 12, left: 8,   width: 15, height: 15 },  // Top-Left Zone (Dehydrated)
        { top: 22, left: 52,  width: 15, height: 10 },  // Top-Middle-Right Zone (Spices)
        { top: 82, left: 38,  width: 20, height: 5 },   // Bottom-Middle Zone (Fresh Fruits)
        { top: 38, left: 75,  width: 12, height: 15 }   // Mid-Right Zone (Powders)
    ];

    // 3. Loop through each text badge, calculate position, and animate
    allBadges.forEach((badge, index) => {
        if (index < safetyZones.length) {
            const zone = safetyZones[index];

            // Randomize position slightly within its designated safety zone
            const randomX = Math.floor(Math.random() * zone.width) + zone.left;
            const randomY = Math.floor(Math.random() * zone.height) + zone.top;

            // Apply calculated positions
            badge.style.left = `${randomX}%`;
            badge.style.top = `${randomY}%`;

            // Staggered pop-in animation effect
            setTimeout(() => {
                badge.classList.add('loaded');
            }, 200 + (index * 150)); 
        }
    });
});

/* --- SCROLL REVEAL ANIMATIONS FOR ABOUT US SECTION --- */

const revealElements = () => {
    const textBlock = document.querySelector('.reveal-left');
    const imageBlock = document.querySelector('.reveal-right');
    
    // Using IntersectionObserver for ultra-smooth performance
    const observerOptions = {
        root: null, // evaluates relative to the viewport
        threshold: 0.25 // fires when 25% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the .active class to initiate the CSS slide and pop transitions
                textBlock.classList.add('active');
                imageBlock.classList.add('active');
                
                // Once it animates in, unobserve so it stays visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Track the entire container section
    const targetSection = document.querySelector('.about-founder-section');
    if(targetSection) {
        observer.observe(targetSection);
    }
};

// Fire the function after DOM compiles
document.addEventListener('DOMContentLoaded', () => {
    revealElements();
});
/* --- STAGGERED PRODUCT CARDS REVEAL --- */

const revealProductGrid = () => {
    const cards = document.querySelectorAll('.showroom-card');
    
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Loop through all elements with a minor staggered timing loop
                cards.forEach((card, idx) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, idx * 150); // 150ms delay multiplier creates a wave transition wave effect
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const gridContainer = document.querySelector('.showroom-grid');
    if (gridContainer) {
        // Prepare cards initial styling in script so it defaults safely without javascript
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        gridObserver.observe(gridContainer);
    }
};

// Append trigger call inside our dom container load event loop
document.addEventListener('DOMContentLoaded', () => {
    revealProductGrid();
});

const powderTrack = document.getElementById('powderCatalogTrack');
        const powderSlides = Array.from(powderTrack.children);
        const powderDotContainer = document.getElementById('powderDotContainer');
        const powderSliderOuterFrame = document.getElementById('powderSliderOuterFrame');
        
        let powderCurrentIndex = 0;
        let powderSlideInterval;
        let powderItemsPerView = getPowderItemsPerView();

        function getPowderItemsPerView() {
            if (window.innerWidth <= 680) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getPowderMaxIndex() {
            return powderSlides.length - getPowderItemsPerView();
        }

        // Generate matching navigation indicator control nodes dynamically
        function setupPowderDots() {
            powderDotContainer.innerHTML = '';
            const totalDots = getPowderMaxIndex() + 1;
            
            if (totalDots > 1) {
                for (let idx = 0; idx < totalDots; idx++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot-indicator');
                    if (idx === powderCurrentIndex) dot.classList.add('active');
                    dot.addEventListener('click', () => moveToPowderSlide(idx));
                    powderDotContainer.appendChild(dot);
                }
            }
        }

        function updatePowderSlidePosition() {
            const maxIndex = getPowderMaxIndex();
            if (powderCurrentIndex > maxIndex) powderCurrentIndex = maxIndex;
            
            const cardWidth = powderSlides[0].getBoundingClientRect().width;
            const gapWidth = 24; // Match layout track gap parameters
            const moveAmount = powderCurrentIndex * (cardWidth + gapWidth);
            
            powderTrack.style.transform = `translateX(-${moveAmount}px)`;
            
            const dots = Array.from(powderDotContainer.children);
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === powderCurrentIndex);
                });
            }
        }

        function nextPowderSlide() {
            const maxIndex = getPowderMaxIndex();
            if (maxIndex <= 0) return;
            
            powderCurrentIndex = (powderCurrentIndex + 1) > maxIndex ? 0 : powderCurrentIndex + 1;
            updatePowderSlidePosition();
        }

        function moveToPowderSlide(index) {
            powderCurrentIndex = index;
            updatePowderSlidePosition();
            restartPowderAutoplay();
        }

        // Automated 3000ms Carousel Slide Cycles
        function startPowderAutoplay() {
            if (getPowderMaxIndex() > 0) {
                powderSlideInterval = setInterval(nextPowderSlide, 3000);
            }
        }

        function stopPowderAutoplay() {
            clearInterval(powderSlideInterval);
        }

        function restartPowderAutoplay() {
            stopPowderAutoplay();
            startPowderAutoplay();
        }

        // Pause rotation sequences when mouse cursor is inside the carousel viewport boundaries
        powderSliderOuterFrame.addEventListener('mouseenter', stopPowderAutoplay);
        powderSliderOuterFrame.addEventListener('mouseleave', startPowderAutoplay);

        // Process real-time browser resize layout configurations cleanly
        window.addEventListener('resize', () => {
            powderItemsPerView = getPowderItemsPerView();
            setupPowderDots();
            updatePowderSlidePosition();
        });

        // Initialize Slider Setup
        setupPowderDots();
        startPowderAutoplay();

        /* ==========================================================================
           MODAL OPERATIONS SYSTEM CONTROL LOGIC 
           ========================================================================== */
        const modal = document.getElementById('inquiryModal');

        function openInquiryModal(productName) {
            stopPowderAutoplay(); // Instantly freeze layout loop layers on activation
            
            document.getElementById('selectedProduct').value = productName;
            document.getElementById('modalProductTitle').innerText = productName;
            
            modal.classList.add('active');
        }

        function closeInquiryModal() {
            modal.classList.remove('active');
            startPowderAutoplay(); // Safely restart slide cycle loops
        }

        function closeModalOnOuterClick(e) {
            if (e.target === modal) {
                closeInquiryModal();
            }
        }

        function handleFormSubmission(e) {
            e.preventDefault();
            alert(`Inquiry successfully generated for: ${document.getElementById('selectedProduct').value}.`);
            closeInquiryModal();
        }

        function handleCustomSubmission(e) {
            e.preventDefault();
            
            // Collect standard document parameters safely
            const representative = document.getElementById('corporateName').value;
            const requestedItem = document.getElementById('commodityName').value;
            const volume = document.getElementById('targetVolume').value;
            
            // Simulated transaction log confirmation alert mockups
            alert(`Thank you, ${representative}. Your custom procurement profile for ${volume}kg of "${requestedItem}" has been logged. Our corporate trade team will connect with you shortly.`);
            
            // Flush content structures safely back to native clear states
            e.target.reset();
        }
        function processContactSubmission(e) {
            e.preventDefault();
            
            // Extract field values for processing
            const sender = document.getElementById('contactName').value;
            const businessDepartment = document.getElementById('departmentTarget').value;
            
            // Confirmation alert notification mock
            alert(`Transmission Secure. Thank you, ${sender}. Your transmission has been queued for our ${businessDepartment} team. A tracking token has been allocated to your business email.`);
            
            // Clear all form inputs after successful mock submit
            e.target.reset();
        }