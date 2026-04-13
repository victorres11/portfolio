const SIGNALS_API_PATH = '/api/signals';
const SIGNALS_STORAGE_KEY = 'vt_portfolio_anonymous_id';
const SIGNALS_CLICK_PARAM = 'portfolio_click_id';

function getAnonymousId() {
    try {
        const existing = window.localStorage.getItem(SIGNALS_STORAGE_KEY);
        if (existing) return existing;

        const generated = `anon_${window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`}`;
        window.localStorage.setItem(SIGNALS_STORAGE_KEY, generated);
        return generated;
    } catch {
        return `anon_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }
}

function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || params.get('src') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        portfolio_click_id: params.get(SIGNALS_CLICK_PARAM) || undefined,
    };
}

function trackSignal(event, properties = {}) {
    const payload = {
        event,
        anonymous_id: getAnonymousId(),
        path: `${window.location.pathname}${window.location.search}`,
        referrer: document.referrer || undefined,
        occurred_at: new Date().toISOString(),
        ...getUtmParams(),
        properties,
    };
    if (properties.portfolio_click_id) {
        payload.portfolio_click_id = properties.portfolio_click_id;
    }

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(SIGNALS_API_PATH, blob)) return;
    }

    fetch(SIGNALS_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
    }).catch(() => {});
}

function createPortfolioClickId(projectId) {
    const randomPart = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    return `clk_${projectId || 'portfolio'}_${randomPart}`.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function addPortfolioAttribution(url, clickId) {
    try {
        const parsed = new URL(url, window.location.href);
        parsed.searchParams.set('src', 'portfolio');
        parsed.searchParams.set(SIGNALS_CLICK_PARAM, clickId);
        return parsed.toString();
    } catch {
        return url;
    }
}

function escapeAttribute(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

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

const sectionViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.getAttribute('id');
        if (sectionId === 'about') {
            trackSignal('about_section_viewed');
        } else if (sectionId === 'projects') {
            trackSignal('project_section_viewed');
        }
        sectionViewObserver.unobserve(entry.target);
    });
}, { threshold: 0.35 });

const projectCardViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        trackSignal('project_card_viewed', {
            project_id: card.dataset.projectId,
            project_title: card.dataset.projectTitle,
        });
        projectCardViewObserver.unobserve(card);
    });
}, { threshold: 0.45 });

// Apply initial state and observe reveal elements
document.addEventListener('DOMContentLoaded', () => {
    trackSignal('page_viewed', {
        title: document.title,
    });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionViewObserver.observe(section);
    });

    const revealItems = document.querySelectorAll('.reveal, .project-card, .client-card');

    revealItems.forEach((item, index) => {
        const delay = (item.classList.contains('project-card') || item.classList.contains('client-card')) ? index * 0.08 : 0;
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
    document.querySelectorAll('.reveal, .project-card, .client-card').forEach(item => {
        item.classList.add('visible');
        item.style.transition = 'none';
        item.style.transitionDelay = '0s';
    });
}

// Load projects from JSON
let projectsData = [];

async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('projects.json');
        projectsData = await response.json();

        container.innerHTML = projectsData.map((project, index) => {
            const tagsHtml = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
            const badgeHtml = project.badge ? ` <span class="badge badge-${project.badge.toLowerCase()}">${project.badge}</span>` : '';

            return `
                <article class="project-card" data-project-index="${index}" data-project-id="${escapeAttribute(project.id)}" data-project-title="${escapeAttribute(project.title)}" role="button" tabindex="0"
                         aria-label="View details for ${project.title}"
                         style="transition-delay: ${index * 0.08}s">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}${badgeHtml}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">${tagsHtml}</div>
                    </div>
                </article>
            `;
        }).join('');

        // Re-observe for reveal animation
        container.querySelectorAll('.project-card').forEach((item, idx) => {
            item.style.transitionDelay = `${idx * 0.08}s`;
            revealObserver.observe(item);
            projectCardViewObserver.observe(item);
        });

        // Add click and keyboard handlers for modal
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => openModal(Number(card.dataset.projectIndex)));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(Number(card.dataset.projectIndex));
                }
            });
        });

    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Modal logic
let previouslyFocused = null;

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
    const clickId = createPortfolioClickId(project.id);
    const attributedUrl = addPortfolioAttribution(project.url, clickId);

    trackSignal('project_card_clicked', {
        project_id: project.id,
        project_title: project.title,
    });
    trackSignal('project_detail_viewed', {
        project_id: project.id,
        project_title: project.title,
    });

    modalBody.innerHTML = `
        ${imagesHtml}
        <h3 class="modal-title" id="modal-title">${project.title}${badgeHtml}</h3>
        <p class="modal-description">${project.description}</p>
        ${project.longDescription ? `<p class="modal-description">${project.longDescription}</p>` : ''}
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-links">
            <a href="${attributedUrl}" target="_blank" rel="noopener noreferrer" class="project-link" data-signal-event="project_link_clicked" data-project-id="${escapeAttribute(project.id)}" data-project-title="${escapeAttribute(project.title)}" data-portfolio-click-id="${escapeAttribute(clickId)}">View Project →</a>
            ${noteHtml}
        </div>
    `;

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

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
            closeModal();
        }
    });
});

// Initialize projects
document.addEventListener('DOMContentLoaded', loadProjects);

document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-signal-event]');
    if (!link) return;

    trackSignal(link.dataset.signalEvent, {
        project_id: link.dataset.projectId,
        project_title: link.dataset.projectTitle,
        link_location: link.dataset.linkLocation,
        destination_url: link.href,
        portfolio_click_id: link.dataset.portfolioClickId,
    });
});
// Keyboard navigation for mobile menu
navToggle?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Play animation background
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroCanvas = document.querySelector('.play-canvas');
    if (heroCanvas && typeof window.initPlayAnimation === 'function') {
        window.initPlayAnimation(heroCanvas);
    }
}
