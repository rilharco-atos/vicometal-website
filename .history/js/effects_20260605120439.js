/* ============================================
   VICOMETAL — Premium Effects Engine
   Parallax, Magnetic Buttons, 3D Tilt, 
   Text Reveal, Custom Cursor, Smooth Scroll
   ============================================ */

(function() {
    'use strict';

    // --- Custom Cursor ---
    class CustomCursor {
        constructor() {
            this.cursor = document.createElement('div');
            this.cursorDot = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            this.cursorDot.className = 'custom-cursor-dot';
            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorDot);

            this.pos = { x: 0, y: 0 };
            this.mouse = { x: 0, y: 0 };
            this.speed = 0.15;
            this.isHovering = false;

            this.init();
        }

        init() {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            });

            // Hover effects on interactive elements
            const interactives = document.querySelectorAll('a, button, .service-card, .project-card, .sector-item');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('cursor-hover');
                    this.isHovering = true;
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('cursor-hover');
                    this.isHovering = false;
                });
            });

            this.render();
        }

        render() {
            this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
            this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
            this.cursor.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px)`;
            requestAnimationFrame(() => this.render());
        }
    }

    // --- Magnetic Button Effect ---
    class MagneticElements {
        constructor() {
            this.elements = document.querySelectorAll('.btn, .carousel-btn, .nav-cta');
            this.init();
        }

        init() {
            this.elements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                    el.style.transition = 'transform 0.2s ease-out';
                });

                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(0, 0)';
                    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                });
            });
        }
    }

    // --- 3D Tilt on Cards ---
    class TiltEffect {
        constructor() {
            this.cards = document.querySelectorAll('.service-card, .group-card, .news-card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    const tiltX = (y - 0.5) * 8;
                    const tiltY = (x - 0.5) * -8;
                    
                    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
                    
                    // Dynamic shine effect
                    const shine = card.querySelector('.card-shine') || this.createShine(card);
                    shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                    card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                    const shine = card.querySelector('.card-shine');
                    if (shine) shine.style.background = 'none';
                });

                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'none';
                });
            });
        }

        createShine(card) {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            shine.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:1;';
            card.style.position = 'relative';
            card.appendChild(shine);
            return shine;
        }
    }

    // --- Parallax Multi-Layer Engine ---
    class ParallaxEngine {
        constructor() {
            this.layers = [];
            this.scrollY = 0;
            this.init();
        }

        init() {
            // Hero section parallax
            const heroContent = document.querySelector('.hero-content');
            const heroStats = document.querySelector('.hero-stats');
            const heroParticles = document.querySelector('.hero-particles');

            if (heroContent) this.layers.push({ el: heroContent, speed: 0.3, type: 'translate' });
            if (heroStats) this.layers.push({ el: heroStats, speed: 0.15, type: 'translate' });
            if (heroParticles) this.layers.push({ el: heroParticles, speed: -0.1, type: 'translate' });

            // Section backgrounds
            document.querySelectorAll('.cap-image').forEach(el => {
                this.layers.push({ el, speed: -0.15, type: 'scale-translate' });
            });

            document.querySelectorAll('.project-image img').forEach(el => {
                this.layers.push({ el, speed: -0.08, type: 'translate' });
            });

            // Start animation loop
            this.update();
            window.addEventListener('scroll', () => {
                this.scrollY = window.pageYOffset;
            }, { passive: true });
        }

        update() {
            this.layers.forEach(layer => {
                const rect = layer.el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const offset = (progress - 0.5) * layer.speed * 200;

                    switch (layer.type) {
                        case 'translate':
                            layer.el.style.transform = `translateY(${offset}px)`;
                            break;
                        case 'scale-translate':
                            layer.el.style.transform = `translateY(${offset}px) scale(1.1)`;
                            break;
                    }
                }
            });
            requestAnimationFrame(() => this.update());
        }
    }

    // --- Text Split & Reveal Animation ---
    class TextReveal {
        constructor() {
            // Only apply to hero title without HTML children
            this.elements = document.querySelectorAll('.hero-title');
            // Don't split - use CSS animation instead
        }
    }

    // --- Smooth Number Counter with Easing ---
    class SmoothCounter {
        constructor() {
            this.counters = document.querySelectorAll('[data-count]');
            this.observed = new Set();
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed.has(entry.target)) {
                        this.observed.add(entry.target);
                        this.animate(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(el => observer.observe(el));
        }

        animate(element) {
            const target = parseInt(element.dataset.count);
            const duration = 2500;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeOutQuart(progress);
                const value = Math.round(target * eased);
                
                element.textContent = this.formatNum(value);
                
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        }

        easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        formatNum(n) {
            return n >= 1000 ? n.toLocaleString('pt-PT') : n.toString();
        }
    }

    // --- Scroll Progress Indicator ---
    class ScrollProgress {
        constructor() {
            this.bar = document.createElement('div');
            this.bar.className = 'scroll-progress-bar';
            document.body.appendChild(this.bar);
            this.update();
        }

        update() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.bar.style.width = `${progress}%`;
            requestAnimationFrame(() => this.update());
        }
    }

    // --- Image Lazy Load with Fade ---
    class LazyImages {
        constructor() {
            this.images = document.querySelectorAll('img[loading="lazy"]');
            this.init();
        }

        init() {
            this.images.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';
                
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                }
            });
        }
    }

    // --- Horizontal Scroll Sections (for services on mobile) ---
    class SmoothHorizontalScroll {
        constructor() {
            this.containers = document.querySelectorAll('.projects-track');
            this.init();
        }

        init() {
            this.containers.forEach(container => {
                let isDown = false;
                let startX;
                let scrollLeft;

                container.addEventListener('mousedown', (e) => {
                    isDown = true;
                    container.classList.add('active-drag');
                    startX = e.pageX - container.offsetLeft;
                    scrollLeft = container.scrollLeft;
                });

                container.addEventListener('mouseleave', () => {
                    isDown = false;
                    container.classList.remove('active-drag');
                });

                container.addEventListener('mouseup', () => {
                    isDown = false;
                    container.classList.remove('active-drag');
                });

                container.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - container.offsetLeft;
                    const walk = (x - startX) * 2;
                    container.scrollLeft = scrollLeft - walk;
                });

                // Touch support
                let touchStartX = 0;
                container.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });

                container.addEventListener('touchmove', (e) => {
                    const diff = touchStartX - e.touches[0].clientX;
                    container.scrollLeft += diff * 0.5;
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });
            });
        }
    }

    // --- Reveal on Scroll with Stagger ---
    class StaggerReveal {
        constructor() {
            this.groups = document.querySelectorAll('.services-grid, .sectors-grid, .news-grid, .group-grid');
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, i * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            this.groups.forEach(group => observer.observe(group));
        }
    }

    // --- Navbar Auto-Hide on Scroll Down ---
    class SmartNavbar {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.lastScroll = 0;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 500) {
                    if (currentScroll > this.lastScroll) {
                        // Scrolling down
                        this.navbar.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up
                        this.navbar.style.transform = 'translateY(0)';
                    }
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
                
                this.lastScroll = currentScroll;
            }, { passive: true });
        }
    }

    // --- Initialize Everything ---
    function init() {
        new MagneticElements();
        new TiltEffect();
        new ParallaxEngine();
        new SmoothCounter();
        new ScrollProgress();
        new LazyImages();
        new SmoothHorizontalScroll();
        new StaggerReveal();
        new SmartNavbar();

        // Text reveal only on hero (others handled by scroll observer)
        new TextReveal();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
