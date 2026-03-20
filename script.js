// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
        scrollTimeout = null;
    }, 100);
});

window.addEventListener('load', updateActiveNav);

// Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial state and observe reveal elements
document.addEventListener('DOMContentLoaded', () => {
    const revealItems = document.querySelectorAll('.reveal, .project-card');

    revealItems.forEach((item, index) => {
        const delay = item.classList.contains('project-card') ? index * 0.08 : 0;
        item.style.transitionDelay = `${delay}s`;
        revealObserver.observe(item);
    });

    // Add lazy loading for GIFs (pause until in view)
    const gifImages = document.querySelectorAll('img[src$=\".gif\"]');
    const gifObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Force reload to start animation when visible
                const src = img.src;
                img.src = '';
                img.src = src;
                gifObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    gifImages.forEach(img => gifObserver.observe(img));
});

// Reduce motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .project-card').forEach(item => {
        item.classList.add('visible');
        item.style.transition = 'none';
        item.style.transitionDelay = '0s';
    });
}

// Load projects from JSON
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('projects.json');
        const projects = await response.json();

        container.innerHTML = projects.map((project, index) => {
            let imagesHtml = '';
            if (project.id === 'spotting-grid' && project.images && project.images.length >= 3) {
                imagesHtml = `
                    <div class="grid-top">
                        <img src="${project.images[0]}" alt="Project image" class="grid-image" loading="lazy">
                        <img src="${project.images[1]}" alt="Project image" class="grid-image" loading="lazy">
                    </div>
                    <img src="${project.images[2]}" alt="Project image" class="grid-explainer" loading="lazy">
                `;
                imagesHtml = `<div class="project-image project-image-triple">${imagesHtml}</div>`;
            } else if (project.images && project.images.length > 0) {
                imagesHtml = `<div class="project-image"><img src="${project.images[0]}" alt="${project.title}" loading="lazy"></div>`;
            }

            const tagsHtml = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
            const noteHtml = project.note ? `<p class="project-note">${project.note}</p>` : '';

            return `
                <article class="project-card" style="transition-delay: ${index * 0.08}s">
                    ${imagesHtml}
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        ${project.longDescription ? `<p class="project-description">${project.longDescription}</p>` : ''}
                        <div class="project-tags">${tagsHtml}</div>
                        <div class="project-links">
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Project →</a>
                            ${noteHtml}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Re-observe for reveal animation
        container.querySelectorAll('.project-card').forEach((item, idx) => {
            item.style.transitionDelay = `${idx * 0.08}s`;
            revealObserver.observe(item);
        });

    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Initialize projects
document.addEventListener('DOMContentLoaded', loadProjects);

// Keyboard navigation for mobile menu
navToggle?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Subtle parallax for hero background
const heroBg = document.querySelector('.hero-bg');
let heroTicking = false;

function updateHeroParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY || 0;
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
    heroTicking = false;
}

window.addEventListener('scroll', () => {
    if (!heroBg || heroTicking) return;
    heroTicking = true;
    window.requestAnimationFrame(updateHeroParallax);
});

window.addEventListener('load', updateHeroParallax);
