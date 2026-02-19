// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initRevealAnimation();
    initNavbar();
    initHamburgerMenu();
    initCardFlips();
    initGallerySlider();
    initAlumniCarousel();
});

// Handle scroll reveal animations
window.addEventListener("scroll", handleScrollReveal);

/**
 * Initialize reveal animations for elements
 */
function initRevealAnimation() {
    const revealElements = document.querySelectorAll(
        "section, .team_card, .sponsor_card, .about_container, .hero_container, .text_section, img, h2, h3, p"
    );

    revealElements.forEach(el => el.classList.add("reveal"));
    handleScrollReveal(); // Fade in elements already in view
}

/**
 * Fade in navbar on load
 */
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.classList.add("visible");
    }
}

/**
 * Handle hamburger menu toggle and link clicks
 */
function initHamburgerMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        menuToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
            menuToggle.classList.remove("active");
        });
    });
}

/**
 * Initialize flip animations for sponsor, values, and team cards
 */
function initCardFlips() {
    // Sponsor cards
    document.querySelectorAll(".sponsor_card_wrapper").forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("flipped"));
    });

    // Values cards
    document.querySelectorAll(".values_card_wrapper").forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("flipped"));
    });

    // Team cards
    document.querySelectorAll(".team_card_wrapper").forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("flipped"));
    });
}

/**
 * Initialize gallery slider navigation
 */
function initGallerySlider() {
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const slide = document.querySelector(".slide");

    if (!prevBtn || !nextBtn || !slide) return;

    prevBtn.addEventListener("click", () => {
        const items = document.querySelectorAll(".item");
        if (items.length) {
            slide.prepend(items[items.length - 1]);
        }
    });

    nextBtn.addEventListener("click", () => {
        const items = document.querySelectorAll(".item");
        if (items.length) {
            slide.append(items[0]);
        }
    });
}

/**
 * Handle scroll reveal: fade in elements when they come into view
 */
function handleScrollReveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            el.classList.add("visible");
        }
    });
}

/**
 * Initialize alumni carousel navigation
 */
function initAlumniCarousel() {
    const alumniGrid = document.getElementById("alumniGrid");
    const prevBtn = document.getElementById("alumniBtnPrev");
    const nextBtn = document.getElementById("alumniBtnNext");

    if (!alumniGrid || !prevBtn || !nextBtn) return;

    // Dynamically compute card width + gap from rendered size
    const firstCard = alumniGrid.querySelector(".alumni_card");
    const computedStyle = getComputedStyle(alumniGrid);
    const gap = parseFloat(computedStyle.gap) || 30;
    const cardWidth = (firstCard ? firstCard.offsetWidth : 280) + gap;
    let isScrolling = false;
    
    // Get original cards
    const originalCards = [...alumniGrid.querySelectorAll(".alumni_card")];
    const totalCards = originalCards.length;
    
    // Clone 3 sets forward
    for (let i = 0; i < 3; i++) {
        originalCards.forEach(card => {
            alumniGrid.appendChild(card.cloneNode(true));
        });
    }
    
    // Clone 3 sets backward
    for (let i = 0; i < 3; i++) {
        [...originalCards].reverse().forEach(card => {
            alumniGrid.insertBefore(card.cloneNode(true), alumniGrid.firstChild);
        });
    }
    
    const setWidth = totalCards * cardWidth;
    
    // Disable CSS scroll-behavior so only our JS animation controls movement
    alumniGrid.style.scrollBehavior = 'auto';
    alumniGrid.scrollLeft = setWidth * 3;

    function smoothScrollBy(amount) {
        if (isScrolling) return;
        isScrolling = true;

        const start = alumniGrid.scrollLeft;
        const duration = 500;
        const startTime = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            alumniGrid.scrollLeft = start + amount * easeInOutCubic(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation done — silently reposition if near edges
                const pos = alumniGrid.scrollLeft;
                const maxScroll = alumniGrid.scrollWidth - alumniGrid.clientWidth;
                if (pos < setWidth * 1.5) {
                    alumniGrid.scrollLeft = pos + setWidth * 2;
                } else if (pos > maxScroll - setWidth * 1.5) {
                    alumniGrid.scrollLeft = pos - setWidth * 2;
                }
                isScrolling = false;
            }
        }

        requestAnimationFrame(animate);
    }

    prevBtn.addEventListener("click", () => smoothScrollBy(-cardWidth));
    nextBtn.addEventListener("click", () => smoothScrollBy(cardWidth));

    // Auto-scroll every 3.5 seconds, pause on hover
    let autoScrollInterval = setInterval(() => smoothScrollBy(cardWidth), 3500);

    alumniGrid.addEventListener("mouseenter", () => clearInterval(autoScrollInterval));
    alumniGrid.addEventListener("mouseleave", () => {
        autoScrollInterval = setInterval(() => smoothScrollBy(cardWidth), 3500);
    });

    // Also pause on touch (mobile)
    alumniGrid.addEventListener("touchstart", () => clearInterval(autoScrollInterval));
    alumniGrid.addEventListener("touchend", () => {
        autoScrollInterval = setInterval(() => smoothScrollBy(cardWidth), 3500);
    });
}
