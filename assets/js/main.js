/**
 * Jetcapriest Website - Main JavaScript
 * 
 * Handles navigation, smooth scrolling, events loading,
 * and scroll-based animations.
 */

// ============================================
// CONFIGURATION
// ============================================

function getEventsSite() {
    if (typeof document === 'undefined') return 'first-sunday';
    if (document.body.classList.contains('first-sunday-page')) return 'first-sunday';
    return 'jet-capriest';
}

const CONFIG = {
    eventsApiUrl: '/api/events',
    
    demoEventsBySite: {
        'first-sunday': [
            {
                id: '1',
                date: 'Fri, Jun 19, 2026',
                time: '6:00 PM',
                venue: 'Lifetime',
                city: 'Gainesville',
                state: 'VA',
                ticketUrl: '#'
            }
        ],
        'jet-capriest': [
            {
                id: '1',
                date: 'Thu, May 21, 2026',
                time: '2:00 PM',
                venue: "Nat's Bullpen",
                city: 'Sterling',
                state: 'VA',
                ticketUrl: '#'
            },
            {
                id: '2',
                date: 'Fri, May 22, 2026',
                time: '6:00 PM',
                venue: 'Commas Food Hall',
                city: 'Ashburn',
                state: 'VA',
                ticketUrl: '#'
            },
            {
                id: '3',
                date: 'Sat, May 23, 2026',
                time: '2:00 PM',
                venue: 'Naked Mountain Winery',
                city: 'Markham',
                state: 'VA',
                ticketUrl: '#'
            },
            {
                id: '4',
                date: 'Sat, May 30, 2026',
                time: '5:00 PM',
                venue: 'Mill St. Draft Garden',
                city: 'Occoquan',
                state: 'VA',
                ticketUrl: '#'
            },
            {
                id: '5',
                date: 'Fri, Jun 19, 2026',
                time: '6:00 PM',
                venue: 'Lifetime',
                city: 'Gainesville',
                state: 'VA',
                ticketUrl: '#'
            }
        ]
    },
    
    getEventsSite,
    
    // On Vercel, load from /api/events (see api/events.js). Fallback lists match site.
    useDemoData: false
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    nav: document.getElementById('nav'),
    navToggle: document.getElementById('navToggle'),
    navLinks: document.getElementById('navLinks'),
    eventsLoading: document.getElementById('eventsLoading'),
    eventsList: document.getElementById('eventsList'),
    noEvents: document.getElementById('noEvents'),
    eventsError: document.getElementById('eventsError'),
    currentYear: document.getElementById('currentYear')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initMobileNav();
    loadEvents();
    setCurrentYear();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    // Handle scroll state
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            elements.nav.classList.add('scrolled');
        } else {
            elements.nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const toggle = elements.navToggle;
    const links = elements.navLinks;
    
    if (!toggle || !links) return;
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target) && links.classList.contains('active')) {
            toggle.classList.remove('active');
            links.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL EFFECTS / ANIMATIONS
// ============================================
function initScrollEffects() {
    // Fade in elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero (subtle)
    const hero = document.querySelector('.hero-bg img');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scroll = window.pageYOffset;
            if (scroll < window.innerHeight) {
                hero.style.transform = `translateY(${scroll * 0.3}px)`;
            }
        });
    }
    
    // Mesh gradient parallax for First Sunday page
    const meshGradient = document.querySelector('.mesh-gradient');
    if (meshGradient) {
        window.addEventListener('scroll', () => {
            const scroll = window.pageYOffset;
            const rate = scroll * 0.15;
            meshGradient.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ============================================
// EVENTS LOADING
// ============================================
async function loadEvents() {
    const site = CONFIG.getEventsSite();
    const fallbackEvents = CONFIG.demoEventsBySite[site] || [];

    try {
        let events;

        if (CONFIG.useDemoData) {
            events = fallbackEvents;
        } else {
            const url = `${CONFIG.eventsApiUrl}?site=${encodeURIComponent(site)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            events = data.events || data;
        }

        if (elements.eventsLoading) {
            elements.eventsLoading.style.display = 'none';
        }

        if (events && events.length > 0) {
            renderEvents(events);
        } else {
            showNoEvents();
        }
    } catch (error) {
        console.error('Error loading events:', error);

        if (!CONFIG.useDemoData && fallbackEvents.length > 0) {
            if (elements.eventsLoading) {
                elements.eventsLoading.style.display = 'none';
            }
            renderEvents(fallbackEvents);
        } else {
            showEventsError();
        }
    }
}

/**
 * Render events to the DOM
 */
function renderEvents(events) {
    if (elements.eventsList) {
        elements.eventsList.innerHTML = events.map(event => createEventCard(event)).join('');
    }
}

/**
 * Create HTML for a single event card
 */
function createEventCard(event) {
    const location = [event.city, event.state].filter(Boolean).join(', ');
    const hasTickets = event.ticketUrl && event.ticketUrl !== '#';
    const isFree = event.isFree || event.price === 'Free' || event.price === '$0';
    
    let buttonHtml = '';
    if (hasTickets) {
        buttonHtml = `
            <a href="${event.ticketUrl}" target="_blank" rel="noopener" class="btn-ticket">
                <i class="fas fa-ticket-alt"></i>
                ${event.price ? event.price : 'Tickets'}
            </a>
        `;
    } else if (isFree) {
        buttonHtml = `
            <span class="btn-ticket" style="background: var(--color-secondary-light); cursor: default;">
                <i class="fas fa-heart"></i>
                Free Event
            </span>
        `;
    }
    
    return `
        <article class="event-card">
            <div class="event-date-wrapper">
                <div class="event-date">${event.date}</div>
                <div class="event-time">${event.time || 'TBA'}</div>
            </div>
            <div class="event-info">
                <h3 class="event-venue">${event.venue}</h3>
                <p class="event-location">${location || 'Location TBA'}</p>
            </div>
            <div class="event-action">
                ${buttonHtml}
            </div>
        </article>
    `;
}

/**
 * Show no events message
 */
function showNoEvents() {
    if (elements.eventsLoading) elements.eventsLoading.style.display = 'none';
    if (elements.eventsList) elements.eventsList.innerHTML = '<p style="text-align:center;color:#A0A0A0;">No upcoming shows. Check back soon!</p>';
    if (elements.noEvents) elements.noEvents.style.display = 'block';
}

/**
 * Show error message
 */
function showEventsError() {
    if (elements.eventsLoading) elements.eventsLoading.style.display = 'none';
    if (elements.eventsList) elements.eventsList.innerHTML = '<p style="text-align:center;color:#A0A0A0;">Unable to load events.</p>';
    if (elements.eventsError) elements.eventsError.style.display = 'block';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function setCurrentYear() {
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// EXPORT FOR MODULES (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadEvents, renderEvents };
}
