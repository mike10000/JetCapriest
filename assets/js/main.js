/**
 * Jetcapriest Website - Main JavaScript
 * 
 * Handles navigation, smooth scrolling, events loading,
 * and scroll-based animations.
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Vercel API endpoint
    eventsApiUrl: '/api/events',
    
    // Fallback/demo events if API fails
    demoEvents: [
        {
            id: '1',
            date: 'Sat, Mar 15, 2026',
            time: '8:00 PM',
            venue: 'Crossroads Chantilly',
            city: 'Chantilly',
            state: 'VA',
            ticketUrl: '#'
        },
        {
            id: '2',
            date: 'Fri, Mar 28, 2026',
            time: '9:00 PM',
            venue: 'The Blue Note Lounge',
            city: 'Arlington',
            state: 'VA',
            ticketUrl: '#'
        },
        {
            id: '3',
            date: 'Sat, Apr 12, 2026',
            time: '7:30 PM',
            venue: 'Faith Community Church',
            city: 'Fairfax',
            state: 'VA',
            ticketUrl: null,
            isFree: true
        }
    ],
    
    // Use demo data if true (set to false for production)
    useDemoData: true
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
}

// ============================================
// EVENTS LOADING
// ============================================
async function loadEvents() {
    try {
        let events;
        
        if (CONFIG.useDemoData) {
            // Use demo data
            events = CONFIG.demoEvents;
        } else {
            // Fetch from Netlify function
            const response = await fetch(CONFIG.eventsApiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            events = data.events || data;
        }
        
        // Hide loading
        elements.eventsLoading.style.display = 'none';
        
        if (events && events.length > 0) {
            renderEvents(events);
        } else {
            showNoEvents();
        }
        
    } catch (error) {
        console.error('Error loading events:', error);
        
        // Try demo data as fallback
        if (!CONFIG.useDemoData && CONFIG.demoEvents.length > 0) {
            elements.eventsLoading.style.display = 'none';
            renderEvents(CONFIG.demoEvents);
        } else {
            showEventsError();
        }
    }
}

/**
 * Render events to the DOM
 */
function renderEvents(events) {
    elements.eventsList.innerHTML = events.map(event => createEventCard(event)).join('');
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
    elements.eventsLoading.style.display = 'none';
    elements.eventsList.innerHTML = '';
    elements.noEvents.style.display = 'block';
}

/**
 * Show error message
 */
function showEventsError() {
    elements.eventsLoading.style.display = 'none';
    elements.eventsList.innerHTML = '';
    elements.eventsError.style.display = 'block';
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
