/**
 * ANNAPURNA DEVELOPERS - RANCHI
 * High-Performance Interactive Architecture
 * Handles: Lenis Smooth Scrolling, Scroll Progress, Mobile Drawer,
 *          Interactive Before/After Slider, Cost Estimator, Service Filter Tabs,
 *          FAQ Accordion, Animated Counters, Luxury Toast Notifications,
 *          Circular Progress Back-To-Top.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 1. LENIS SMOOTH SCROLL INITIALIZATION
    // ==========================================
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ==========================================
    // 2. SCROLL PROGRESS BAR & BACK TO TOP
    // ==========================================
    const progressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTop');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle ? circle.r.baseVal.value : 21;
    const circumference = 2 * Math.PI * radius;

    if (circle) {
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;
    }

    function handleScrollDynamics() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Update top linear progress bar
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Update circular ring on back-to-top button
        if (circle) {
            const offset = circumference - (scrollPercent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        // Show/Hide Back to Top button
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Sticky Navbar effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollTop > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleScrollDynamics, { passive: true });
    handleScrollDynamics();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // 3. PRELOADER DISMISSAL
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        };

        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 600);
        });
        // Safety fallback: maximum 2.8s
        setTimeout(hidePreloader, 2800);
    }

    // ==========================================
    // 4. MOBILE OFF-CANVAS DRAWER
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        if (!mobileDrawer || !drawerOverlay) return;
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!mobileDrawer || !drawerOverlay) return;
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (navToggle) navToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Keyboard ESC to close drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // ==========================================
    // 5. SMOOTH ANCHOR SCROLLING FOR NAV LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar') ? 78 : 0;

                if (lenis) {
                    lenis.scrollTo(target, { offset: -navHeight, duration: 1.2 });
                } else {
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 6. ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');

    function highlightActiveNav() {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                desktopLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ==========================================
    // 7. STAT METRIC COUNTERS WITH EASING
    // ==========================================
    const metricsBar = document.querySelector('.hero-metrics-bar');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * target);

                counter.textContent = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });

        countersAnimated = true;
    }

    if (metricsBar && 'IntersectionObserver' in window) {
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    metricObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });

        metricObserver.observe(metricsBar);
    } else {
        animateCounters();
    }

    // ==========================================
    // 8. INTERACTIVE BEFORE & AFTER COMPARISON SLIDER
    // ==========================================
    const baSlider = document.getElementById('baSlider');
    const baAfterLayer = document.getElementById('baAfterLayer');
    const baHandle = document.getElementById('baHandle');

    if (baSlider && baAfterLayer && baHandle) {
        let isSliding = false;

        function setSliderPosition(x) {
            const rect = baSlider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;

            // Restrict between 5% and 95%
            position = Math.max(5, Math.min(95, position));

            baAfterLayer.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            baHandle.style.left = `${position}%`;
            baHandle.setAttribute('aria-valuenow', Math.round(position));
        }

        function onPointerDown(e) {
            isSliding = true;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            setSliderPosition(clientX);
        }

        function onPointerMove(e) {
            if (!isSliding) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX !== undefined) {
                setSliderPosition(clientX);
            }
        }

        function onPointerUp() {
            isSliding = false;
        }

        // Mouse Events
        baSlider.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        // Touch Events
        baSlider.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp);

        // Keyboard arrow navigation for accessibility
        baHandle.addEventListener('keydown', (e) => {
            const currentVal = parseInt(baHandle.getAttribute('aria-valuenow'), 10) || 50;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const newVal = Math.max(5, currentVal - 5);
                baAfterLayer.style.clipPath = `polygon(0 0, ${newVal}% 0, ${newVal}% 100%, 0 100%)`;
                baHandle.style.left = `${newVal}%`;
                baHandle.setAttribute('aria-valuenow', newVal);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const newVal = Math.min(95, currentVal + 5);
                baAfterLayer.style.clipPath = `polygon(0 0, ${newVal}% 0, ${newVal}% 100%, 0 100%)`;
                baHandle.style.left = `${newVal}%`;
                baHandle.setAttribute('aria-valuenow', newVal);
            }
        });
    }

    // ==========================================
    // 9. SERVICE CATEGORY FILTER TABS
    // ==========================================
    const tabButtons = document.querySelectorAll('.service-tabs .tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 40);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // 10. INTERACTIVE COST & WARRANTY ESTIMATOR
    // ==========================================
    const calcService = document.getElementById('calcService');
    const areaSlider = document.getElementById('areaSlider');
    const areaDisplay = document.getElementById('areaDisplay');
    const conditionRadios = document.querySelectorAll('input[name="condition"]');
    const resPrice = document.getElementById('resPrice');
    const resWarranty = document.getElementById('resWarranty');
    const resTech = document.getElementById('resTech');
    const claimEstimateBtn = document.getElementById('claimEstimateBtn');

    function calculateEstimate() {
        if (!calcService || !areaSlider || !resPrice) return;

        const selectedOption = calcService.options[calcService.selectedIndex];
        const baseRate = parseFloat(selectedOption.getAttribute('data-rate')) || 48;
        const warranty = selectedOption.getAttribute('data-warranty') || '10 to 15 Years';
        const tech = selectedOption.getAttribute('data-tech') || 'Advanced Polymer System';

        const area = parseInt(areaSlider.value, 10) || 1200;

        let conditionMultiplier = 1.0;
        conditionRadios.forEach(radio => {
            if (radio.checked && radio.value === 'existing') {
                conditionMultiplier = 1.05; // extra surface prep & crack repair
            } else if (radio.checked && radio.value === 'new') {
                conditionMultiplier = 0.95; // clean new substrate
            }
        });

        // Compute total estimation
        const total = Math.round(area * baseRate * conditionMultiplier);
        const formattedPrice = total.toLocaleString('en-IN');

        // Update UI
        if (areaDisplay) {
            areaDisplay.textContent = `${area.toLocaleString('en-IN')} sq.ft.`;
        }
        resPrice.textContent = `₹ ${formattedPrice}*`;
        if (resWarranty) resWarranty.textContent = warranty;
        if (resTech) resTech.textContent = tech;

        // Update WhatsApp CTA URL
        if (claimEstimateBtn) {
            const serviceName = selectedOption.text;
            const message = `Hello Annapurna Developers, I calculated an estimate on your website for ${serviceName}. Area: ${area} sq.ft. Estimated Cost: ₹${formattedPrice}. Please schedule a free site inspection to verify.`;
            claimEstimateBtn.href = `https://wa.me/916203364789?text=${encodeURIComponent(message)}`;
        }
    }

    if (calcService) calcService.addEventListener('change', calculateEstimate);
    if (areaSlider) areaSlider.addEventListener('input', calculateEstimate);
    conditionRadios.forEach(radio => radio.addEventListener('change', calculateEstimate));

    // Initialize calculation on load
    calculateEstimate();

    // ==========================================
    // 11. FAQ ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close others for clean single-expand presentation
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // 12. LUXURY TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(title, message, type = 'success') {
        const existing = document.querySelector('.luxury-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `luxury-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
            </div>
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        document.body.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => toast.remove());
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // ==========================================
    // 13. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const location = document.getElementById('location');
            const service = document.getElementById('service');
            const message = document.getElementById('message');

            // Phone Validation (10 digits)
            const cleanPhone = phone ? phone.value.replace(/[^0-9]/g, '') : '';
            if (cleanPhone.length !== 10) {
                showToast('Invalid Phone Number', 'Please enter a valid 10-digit mobile number so our engineer can reach you.', 'error');
                if (phone) phone.focus();
                return;
            }

            if (!name || name.value.trim().length < 2) {
                showToast('Name Required', 'Please provide your full name.', 'error');
                if (name) name.focus();
                return;
            }

            if (!service || !service.value) {
                showToast('Service Required', 'Please select the service required.', 'error');
                if (service) service.focus();
                return;
            }

            // Simulate form submission
            const originalBtnHtml = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting Request...</span>';
            formSubmitBtn.disabled = true;

            setTimeout(() => {
                formSubmitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Request Confirmed!</span>';
                formSubmitBtn.style.background = 'linear-gradient(135deg, #16654D, #1F8A69)';

                showToast(
                    'Free Site Audit Requested!',
                    `Thank you, ${name.value.trim()}! Our engineer will call you at ${cleanPhone} within 2 hours.`,
                    'success'
                );

                // Also construct WhatsApp fallback for convenience
                const waText = `Hello Annapurna Developers, I submitted a request on your website. Name: ${name.value.trim()}, Phone: ${cleanPhone}, Location: ${location ? location.value.trim() : 'Ranchi'}, Service: ${service.value}, Message: ${message ? message.value.trim() : ''}`;
                const waUrl = `https://wa.me/916203364789?text=${encodeURIComponent(waText)}`;

                setTimeout(() => {
                    contactForm.reset();
                    formSubmitBtn.innerHTML = originalBtnHtml;
                    formSubmitBtn.style.background = '';
                    formSubmitBtn.disabled = false;
                }, 3500);
            }, 1200);
        });
    }

    // ==========================================
    // 14. FOOTER YEAR DYNAMIC SYNC
    // ==========================================
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 15. AOS ANIMATION INITIALIZATION
    // ==========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: false
        });
    }
});
