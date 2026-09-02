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
    const revealItems = document.querySelectorAll('.reveal, .project-card, .client-card, .service-item');

    revealItems.forEach((item, index) => {
        const delay = (item.classList.contains('project-card') || item.classList.contains('client-card') || item.classList.contains('service-item')) ? index * 0.08 : 0;
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
    document.querySelectorAll('.reveal, .project-card, .client-card, .service-item').forEach(item => {
        item.classList.add('visible');
        item.style.transition = 'none';
        item.style.transitionDelay = '0s';
    });
}

// Safety net: if the IntersectionObserver never fires for an element (hidden tab,
// headless renderer, no scroll), reveal everything shortly after load so content can
// never stay stuck in its hidden pre-animation state.
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal, .service-item, .project-card, .client-card')
            .forEach(el => el.classList.add('visible'));
    }, 1500);
});

// Load projects from JSON
let projectsData = [];

async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Loading state — skeleton cards so the section never reads as empty mid-fetch
    container.setAttribute('aria-busy', 'true');
    container.innerHTML = Array.from({ length: 6 }, () =>
        '<div class="project-skeleton" aria-hidden="true"></div>'
    ).join('');

    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        projectsData = await response.json();

        if (!Array.isArray(projectsData) || projectsData.length === 0) {
            throw new Error('No projects returned');
        }

        container.removeAttribute('aria-busy');
        container.innerHTML = projectsData.map((project, index) => {
            const tagsHtml = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
            const badgeHtml = project.badge ? ` <span class="badge badge-${project.badge.toLowerCase()}">${project.badge}</span>` : '';
            const logoHtml = project.logo ? `<img src="${project.logo}" alt="" class="project-logo" aria-hidden="true">` : '';

            let thumbHtml = '';
            if (project.images && project.images.length) {
                thumbHtml = `<div class="project-thumb"><img src="${project.images[0]}" alt="" loading="lazy" aria-hidden="true"></div>`;
            } else if (project.video) {
                thumbHtml = `<div class="project-thumb"><video src="${project.video}" muted loop playsinline autoplay aria-hidden="true"></video></div>`;
            } else if (project.placeholder) {
                thumbHtml = `<div class="project-thumb project-thumb--placeholder" aria-hidden="true"><span>${project.placeholder.icon}</span></div>`;
            }

            return `
                <article class="project-card" data-project-index="${index}"
                         style="transition-delay: ${index * 0.08}s">
                    <div class="project-card-details" role="button" tabindex="0"
                         aria-label="View details for ${project.title}">
                        ${thumbHtml}
                        <div class="project-content">
                            <div class="project-header">
                                ${logoHtml}
                                <h3 class="project-title">${project.title}${badgeHtml}</h3>
                            </div>
                            <p class="project-description">${project.description}</p>
                            <div class="project-tags">${tagsHtml}</div>
                        </div>
                    </div>
                    <div class="project-card-actions">
                        <button type="button" class="project-card-request"
                                aria-label="Request a project similar to ${project.title}">
                            <span class="project-card-request-icon" aria-hidden="true">+</span>
                            <span>Request similar</span>
                            <span class="project-card-request-arrow" aria-hidden="true">→</span>
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        // Re-observe for reveal animation
        container.querySelectorAll('.project-card').forEach((item, idx) => {
            item.style.transitionDelay = `${idx * 0.08}s`;
            revealObserver.observe(item);
        });

        // Keep project details and project requests as separate, accessible actions.
        container.querySelectorAll('.project-card').forEach(card => {
            const projectIndex = Number(card.dataset.projectIndex);
            const details = card.querySelector('.project-card-details');
            const requestButton = card.querySelector('.project-card-request');

            details.addEventListener('click', () => openModal(projectIndex));
            details.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(projectIndex);
                }
            });
            requestButton.addEventListener('click', () => openRequestModal(projectsData[projectIndex]));
        });

    } catch (error) {
        console.error('Failed to load projects:', error);
        container.removeAttribute('aria-busy');
        container.innerHTML = `
            <div class="projects-fallback">
                <p>Recent work isn't loading right now. The portfolio spans broadcast tools, scouting reports, and analytics dashboards for clients like the Mariners, Big Ten Network, and a mid-market MLB franchise.</p>
                <a href="https://vtss-intake.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-ghost">Ask me about recent work &#8599;</a>
            </div>
        `;
    }
}

// Modal logic
let previouslyFocused = null;
let requestPreviouslyFocused = null;
let activeRequestProject = null;
let requestSubmissionId = 0;

function openModal(index) {
    const project = projectsData[index];
    if (!project) return;

    const overlay = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    // Build image HTML for the modal
    let imagesHtml = '';
    if (project.video) {
        imagesHtml = `<div class="modal-image"><video src="${project.video}" autoplay muted loop playsinline></video></div>`;
    } else if (project.placeholder) {
        imagesHtml = `<div class="modal-placeholder"><span class="modal-placeholder-icon">${project.placeholder.icon}</span><span class="modal-placeholder-text">${project.placeholder.text}</span></div>`;
    } else if (project.id === 'spotting-grid' && project.images && project.images.length >= 3) {
        imagesHtml = `
            <div class="modal-image-triple">
                <div class="grid-top">
                    <img src="${project.images[0]}" alt="Project image" class="grid-image">
                    <img src="${project.images[1]}" alt="Project image" class="grid-image">
                </div>
                <img src="${project.images[2]}" alt="Project image" class="grid-explainer">
            </div>`;
    } else if (project.images && project.images.length > 0) {
        imagesHtml = `<div class="modal-image"><img src="${project.images[0]}" alt="${project.title}"></div>`;
    }

    const tagsHtml = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const noteHtml = project.note ? `<p class="project-note">${project.note}</p>` : '';

    const badgeHtml = project.badge ? ` <span class="badge badge-${project.badge.toLowerCase()}">${project.badge}</span>` : '';

    modalBody.innerHTML = `
        ${imagesHtml}
        <h3 class="modal-title" id="modal-title">${project.title}${badgeHtml}</h3>
        <p class="modal-description">${project.description}</p>
        ${project.longDescription ? `<p class="modal-description">${project.longDescription}</p>` : ''}
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-links">
            ${project.links && project.links.length
                ? project.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-link">${link.label} →</a>`).join('')
                : `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Project →</a>`}
            <button type="button" class="project-link request-project-link">Request something similar →</button>
            ${noteHtml}
        </div>
    `;

    modalBody.querySelector('.request-project-link').addEventListener('click', () => {
        openRequestModal(project);
    });

    previouslyFocused = document.activeElement;
    overlay.removeAttribute('hidden');
    // Force reflow before adding active class for animation
    overlay.offsetHeight;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    overlay.querySelector('.modal-close').focus();
}

function closeModal() {
    const overlay = document.getElementById('project-modal');
    overlay.classList.remove('active');

    overlay.addEventListener('transitionend', function handler() {
        overlay.setAttribute('hidden', '');
        overlay.removeEventListener('transitionend', handler);
    });

    document.body.style.overflow = '';

    if (previouslyFocused) {
        previouslyFocused.focus();
        previouslyFocused = null;
    }
}

function openRequestModal(project) {
    const overlay = document.getElementById('request-modal');
    const projectOverlay = document.getElementById('project-modal');
    const form = document.getElementById('request-form');
    const success = document.getElementById('request-success');
    const message = document.getElementById('request-form-message');
    const submitButton = form.querySelector('.request-submit');

    requestSubmissionId += 1;
    activeRequestProject = project;
    requestPreviouslyFocused = document.activeElement;
    document.getElementById('request-project-name').textContent = project.title;
    form.reset();
    document.getElementById('request-email').setCustomValidity('');
    document.getElementById('request-phone').setCustomValidity('');
    form.removeAttribute('hidden');
    success.setAttribute('hidden', '');
    message.setAttribute('hidden', '');
    message.textContent = '';
    submitButton.disabled = false;
    submitButton.textContent = 'Send request →';
    projectOverlay.setAttribute('aria-hidden', 'true');
    projectOverlay.inert = true;

    overlay.removeAttribute('hidden');
    overlay.offsetHeight;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('request-email').focus();
}

function closeRequestModal() {
    const overlay = document.getElementById('request-modal');
    const projectOverlay = document.getElementById('project-modal');
    requestSubmissionId += 1;
    overlay.classList.remove('active');

    overlay.addEventListener('transitionend', function handler(e) {
        if (e.target !== overlay) return;
        overlay.setAttribute('hidden', '');
        overlay.removeEventListener('transitionend', handler);
    });

    projectOverlay.removeAttribute('aria-hidden');
    projectOverlay.inert = false;

    if (projectOverlay.hasAttribute('hidden')) {
        document.body.style.overflow = '';
    }

    if (requestPreviouslyFocused && document.body.contains(requestPreviouslyFocused)) {
        requestPreviouslyFocused.focus();
    }
    requestPreviouslyFocused = null;
    activeRequestProject = null;
}

function trapModalFocus(event, overlay) {
    const focusable = overlay.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

async function submitProjectRequest(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const emailInput = document.getElementById('request-email');
    const phoneInput = document.getElementById('request-phone');
    const detailsInput = document.getElementById('request-details');
    const honeypot = document.getElementById('request-company');
    const message = document.getElementById('request-form-message');
    const submitButton = form.querySelector('.request-submit');
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    message.setAttribute('hidden', '');
    message.textContent = '';
    emailInput.setCustomValidity('');
    phoneInput.setCustomValidity('');

    if (!email && !phone) {
        const validationMessage = 'Enter an email address or phone number.';
        emailInput.setCustomValidity(validationMessage);
        message.textContent = validationMessage;
        message.removeAttribute('hidden');
        emailInput.focus();
        return;
    }

    if (email && !emailInput.validity.valid) {
        const validationMessage = 'Enter a valid email address.';
        emailInput.setCustomValidity(validationMessage);
        message.textContent = validationMessage;
        message.removeAttribute('hidden');
        emailInput.focus();
        return;
    }

    if (phone && phone.replace(/\D/g, '').length < 7) {
        const validationMessage = 'Enter a valid phone number.';
        phoneInput.setCustomValidity(validationMessage);
        message.textContent = validationMessage;
        message.removeAttribute('hidden');
        phoneInput.focus();
        return;
    }

    if (honeypot.value) return;

    const submissionId = ++requestSubmissionId;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
        const payload = {
            _subject: `Portfolio request: ${activeRequestProject?.title || 'Project inquiry'}`,
            _template: 'table',
            _captcha: 'false',
            project: activeRequestProject?.title || 'Project inquiry',
            phone: phone || 'Not provided',
            additional_info: detailsInput.value.trim() || 'Not provided',
            page: window.location.href
        };

        if (email) {
            payload.email = email;
        } else {
            payload.contact_email = 'Not provided';
        }

        const response = await fetch('https://formsubmit.co/ajax/victorres11@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || result.success === false || result.success === 'false') {
            throw new Error(result.message || 'Request submission failed.');
        }

        if (submissionId === requestSubmissionId) {
            form.setAttribute('hidden', '');
            document.getElementById('request-success').removeAttribute('hidden');
            document.querySelector('.request-done').focus();
        }
    } catch (error) {
        console.error('Failed to submit project request:', error);
        if (submissionId === requestSubmissionId) {
            message.textContent = 'I couldn’t send that request. Please try again.';
            message.removeAttribute('hidden');
        }
    } finally {
        if (submissionId === requestSubmissionId) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send request →';
        }
    }
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('project-modal');
    const requestOverlay = document.getElementById('request-modal');
    if (!overlay || !requestOverlay) return;

    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    requestOverlay.querySelector('.request-modal-close').addEventListener('click', closeRequestModal);
    requestOverlay.querySelector('.request-done').addEventListener('click', closeRequestModal);
    document.getElementById('request-form').addEventListener('submit', submitProjectRequest);

    ['request-email', 'request-phone'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            document.getElementById('request-email').setCustomValidity('');
            document.getElementById('request-phone').setCustomValidity('');
            const message = document.getElementById('request-form-message');
            message.setAttribute('hidden', '');
            message.textContent = '';
        });
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    requestOverlay.addEventListener('click', (e) => {
        if (e.target === requestOverlay) closeRequestModal();
    });

    document.addEventListener('keydown', (e) => {
        if (!requestOverlay.hasAttribute('hidden')) {
            if (e.key === 'Escape') {
                closeRequestModal();
            } else if (e.key === 'Tab') {
                trapModalFocus(e, requestOverlay);
            }
            return;
        }

        if (overlay.hasAttribute('hidden')) return;

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            trapModalFocus(e, overlay);
        }
    });
});

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

// About section rotating text
(function () {
    const phrases = [
        'five <em>extra</em> hours every week?',
        'one fewer <em>late night</em> before game day?',
        'your next game\'s prep done before you <em>land</em>?',
        'more time on <em>film,</em> less on spreadsheets?',
    ];
    const el = document.getElementById('about-rotate');
    if (!el) return;
    const wrap = el.parentElement;
    let i = 0;

    function setHeight() {
        el.innerHTML = phrases[i];
        wrap.style.height = el.scrollHeight + 'px';
    }

    setHeight();
    window.addEventListener('resize', setHeight);

    setInterval(() => {
        el.classList.add('fade-out');
        setTimeout(() => {
            i = (i + 1) % phrases.length;
            el.innerHTML = phrases[i];
            wrap.style.height = el.scrollHeight + 'px';
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classList.remove('fade-in');
                });
            });
        }, 500);
    }, 3500);
})();

// Play animation background
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroCanvas = document.querySelector('.play-canvas');
    if (heroCanvas && typeof window.initPlayAnimation === 'function') {
        window.initPlayAnimation(heroCanvas);
    }
}
