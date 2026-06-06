/* ============================================
   VICOMETAL — Main JavaScript
   Navigation, Animations, Counters, Carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Footer active link ---
    (function() {
        try {
            var loc = decodeURIComponent(window.location.href).split('?')[0].split('#')[0];
            var page = loc.split('/').pop();
            if (!page || page === '') page = 'index';
            // Remove .html extension for comparison
            var pageBase = page.replace('.html', '');
            var links = document.querySelectorAll('.footer-nav a');
            for (var i = 0; i < links.length; i++) {
                var href = links[i].getAttribute('href');
                if (!href) continue;
                var hrefBase = href.split('#')[0].replace('.html', '');
                if (hrefBase === pageBase) {
                    links[i].className += ' active';
                    links[i].removeAttribute('href');
                    links[i].style.color = 'white';
                    links[i].style.fontWeight = '600';
                    links[i].style.textDecoration = 'underline';
                    links[i].style.textUnderlineOffset = '3px';
                    links[i].style.pointerEvents = 'none';
                }
            }
        } catch(e) {}
    })();

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.remove('no-scroll');
            }, 800);
        });
    }

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add('visible');
                }
                animObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in, .scale-in, .slide-left, .slide-right').forEach(el => {
        animObserver.observe(el);
    });

    // --- Counter Animation ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.floor(target * eased);
            
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(target);
            }
        }
        
        requestAnimationFrame(update);
    }

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('pt-PT');
        }
        return num.toString();
    }

    // --- Projects Carousel ---
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');
    const progressBar = document.getElementById('carouselProgress');
    const currentLabel = document.getElementById('carouselCurrent');
    const totalLabel = document.getElementById('carouselTotal');
    
    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;
        const cards = track.querySelectorAll('.project-card');
        const totalCards = cards.length;
        let visibleCards, maxSlide;

        function getCardScrollWidth() {
            if (cards.length < 2) return cards[0]?.offsetWidth || 400;
            return cards[1].offsetLeft - cards[0].offsetLeft;
        }

        function calcCarouselDimensions() {
            const containerWidth = track.parentElement.offsetWidth;
            const singleCard = getCardScrollWidth();
            visibleCards = Math.max(1, Math.round(containerWidth / singleCard));
            maxSlide = Math.max(0, totalCards - visibleCards);
            if (currentSlide > maxSlide) currentSlide = maxSlide;
        }

        calcCarouselDimensions();
        if (totalLabel) totalLabel.textContent = totalCards;

        function updateCarousel(animate) {
            if (animate !== false) {
                track.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';
            } else {
                track.style.transition = 'none';
            }
            const offset = currentSlide > 0 ? cards[currentSlide].offsetLeft : 0;
            track.style.transform = `translateX(-${offset}px)`;
            if (progressBar) {
                const progress = ((currentSlide + visibleCards) / totalCards) * 100;
                progressBar.style.width = Math.min(100, progress) + '%';
            }
            if (currentLabel) currentLabel.textContent = currentSlide + 1;
            prevBtn.style.opacity = currentSlide === 0 ? '0.4' : '1';
            nextBtn.style.opacity = currentSlide >= maxSlide ? '0.4' : '1';
        }

        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(maxSlide, index));
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Keyboard navigation
        const carousel = document.getElementById('projectsCarousel');
        if (carousel) {
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
                if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
            });
        }

        // Touch/drag support
        let startX = 0, isDragging = false, dragOffset = 0;
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            dragOffset = e.touches[0].clientX - startX;
            track.style.transition = 'none';
            const baseOffset = currentSlide > 0 ? cards[currentSlide].offsetLeft : 0;
            track.style.transform = `translateX(${-baseOffset + dragOffset}px)`;
        }, { passive: true });
        track.addEventListener('touchend', () => {
            isDragging = false;
            const threshold = getCardScrollWidth() * 0.25;
            if (Math.abs(dragOffset) > threshold) {
                goToSlide(dragOffset > 0 ? currentSlide - 1 : currentSlide + 1);
            } else {
                updateCarousel();
            }
            dragOffset = 0;
        });

        // Auto-play with pause on interaction
        let autoplay = setInterval(() => {
            currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
            updateCarousel();
        }, 5000);

        const pauseAutoplay = () => clearInterval(autoplay);
        const resumeAutoplay = () => {
            clearInterval(autoplay);
            autoplay = setInterval(() => {
                currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
                updateCarousel();
            }, 5000);
        };

        track.parentElement.addEventListener('mouseenter', pauseAutoplay);
        track.parentElement.addEventListener('mouseleave', resumeAutoplay);

        // Recalculate on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                calcCarouselDimensions();
                updateCarousel(false);
            }, 200);
        });

        updateCarousel(false);
    }

    // --- World Map Tooltips ---
    const mapPinGroups = document.querySelectorAll('.map-pin-group');
    const mapTooltip = document.getElementById('mapTooltip');
    const mapContainer = document.getElementById('worldMap');
    const tooltipCountry = document.getElementById('tooltipCountry');
    const tooltipProject = document.getElementById('tooltipProject');
    const tooltipMeta = document.getElementById('tooltipMeta');
    const tooltipAddress = document.getElementById('tooltipAddress');

    if (mapPinGroups.length && mapTooltip && mapContainer) {
        mapPinGroups.forEach(group => {
            const pin = group.querySelector('.map-pin');
            const glow = group.querySelector('.pin-glow-bg');
            const cx = pin.getAttribute('cx');
            const cy = pin.getAttribute('cy');
            const originalR = parseFloat(pin.getAttribute('r'));
            const glowOriginalR = parseFloat(glow.getAttribute('r'));

            group.addEventListener('mouseenter', () => {
                const country = group.getAttribute('data-country');
                const project = group.getAttribute('data-projects');
                const address = group.getAttribute('data-address');
                const year = group.getAttribute('data-year');
                const tonnage = group.getAttribute('data-tonnage');
                const type = group.getAttribute('data-type');
                
                if (tooltipCountry) tooltipCountry.textContent = country;
                if (tooltipProject) tooltipProject.textContent = project || '';
                if (tooltipMeta) {
                    const metaParts = [];
                    if (year) metaParts.push(year);
                    if (tonnage) metaParts.push(tonnage);
                    if (type) metaParts.push(type);
                    tooltipMeta.textContent = metaParts.join(' · ');
                }
                if (tooltipAddress) tooltipAddress.textContent = address || '';
                
                // Scale up pin on hover
                pin.setAttribute('r', originalR * 1.6);
                glow.setAttribute('r', glowOriginalR * 1.4);
                
                mapTooltip.classList.add('visible');
                
                const rect = mapContainer.getBoundingClientRect();
                const pinRect = pin.getBoundingClientRect();
                const tooltipW = mapTooltip.offsetWidth;
                const tooltipH = mapTooltip.offsetHeight;
                let left = pinRect.left - rect.left + pinRect.width / 2 - tooltipW / 2;
                left = Math.max(10, Math.min(left, rect.width - tooltipW - 10));
                let top = pinRect.top - rect.top - tooltipH - 14;
                if (top < 5) top = pinRect.bottom - rect.top + 10;
                mapTooltip.style.left = `${left}px`;
                mapTooltip.style.top = `${top}px`;
            });

            group.addEventListener('mouseleave', () => {
                mapTooltip.classList.remove('visible');
                // Restore original pin size
                pin.setAttribute('r', originalR);
                glow.setAttribute('r', glowOriginalR);
            });
        });
    }

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${8 + Math.random() * 12}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.width = `${1 + Math.random() * 2}px`;
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');

    if (cookieBanner && !localStorage.getItem('vicometal_cookies')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('vicometal_cookies', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            localStorage.setItem('vicometal_cookies', 'rejected');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax on scroll ---
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                document.querySelectorAll('.parallax-slow').forEach(el => {
                    const speed = 0.3;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
