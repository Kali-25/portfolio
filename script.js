/* =====================================================
   KALI SAIKIRAN - DEVOPS ENGINEER PORTFOLIO
   JavaScript - Navigation & Interactivity (Enhanced)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initNavigation();
    initSmoothScroll();
    initScrollSpy();
    initContactForm();
    initStaggeredReveal();
    initTypingEffect();
    initParticles();
    initScrollToTop();
    initChatbot();

    initMagneticButtons();
    initCardTilt();
    initNavbarScroll();
    initParallax();
    initTagHover();
    initDashboardAnimations();

    console.log('Portfolio loaded successfully! 🚀');
});

/* =====================================================
   PAGE LOADER
   ===================================================== */
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    const line2 = document.getElementById('loaderLine2');
    const line3 = document.getElementById('loaderLine3');
    const line4 = document.getElementById('loaderLine4');

    setTimeout(() => { if (line2) line2.style.opacity = '1'; }, 400);
    setTimeout(() => { if (line3) line3.style.opacity = '1'; }, 900);
    setTimeout(() => { if (line4) line4.style.opacity = '1'; }, 1400);

    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('loaded'), 2000);
    });
    // Fallback
    setTimeout(() => loader.classList.add('loaded'), 4000);
}



/* Stats counter removed — replaced by What I Do section */

/* =====================================================
   STAGGERED SCROLL REVEAL
   ===================================================== */
function initStaggeredReveal() {
    const elements = document.querySelectorAll('.glass-card, .section-title, .timeline-item, .section-subtitle, .reveal-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on sibling position
                const siblings = entry.target.parentElement.children;
                let index = 0;
                for (let j = 0; j < siblings.length; j++) {
                    if (siblings[j] === entry.target) { index = j; break; }
                }
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        if (!el.classList.contains('reveal-up')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
        }
        observer.observe(el);
    });
}

/* =====================================================
   MAGNETIC BUTTONS
   ===================================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* =====================================================
   CARD TILT EFFECT
   ===================================================== */
function initCardTilt() {
    document.querySelectorAll('.glass-card').forEach(card => {
        // Skip tilt on content-heavy sections (experience, projects) for readability
        if (card.closest('.experience') || card.closest('.projects')) return;

        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* =====================================================
   NAVBAR SCROLL EFFECT
   ===================================================== */
function initNavbarScroll() {
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
}

/* =====================================================
   PARALLAX SCROLLING
   ===================================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    const floatingIcons = document.querySelector('.floating-icons');

    window.addEventListener('scroll', function () {
        const scrolled = window.scrollY;
        if (hero) {
            hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
        }
        if (floatingIcons && scrolled < window.innerHeight) {
            floatingIcons.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
}

/* =====================================================
   TAG HOVER
   ===================================================== */
function initTagHover() {
    let activeTag = null;
    let activeDescArea = null;

    // Create a hidden desc area inside each skill card
    document.querySelectorAll('.skill-card').forEach(card => {
        const descArea = document.createElement('div');
        descArea.className = 'skill-desc-area';
        descArea.innerHTML = '<span class="desc-tool-name"></span><span class="desc-text"></span>';
        card.appendChild(descArea);
    });

    function closeActive() {
        if (activeTag) {
            activeTag.classList.remove('tag-active');
            activeTag = null;
        }
        if (activeDescArea) {
            activeDescArea.classList.remove('open');
            activeDescArea = null;
        }
    }

    document.querySelectorAll('.tag[data-desc]').forEach(tag => {
        tag.addEventListener('click', function (e) {
            e.stopPropagation();
            const desc = this.dataset.desc;
            if (!desc) return;

            const card = this.closest('.skill-card');
            if (!card) return;
            const descArea = card.querySelector('.skill-desc-area');
            if (!descArea) return;

            // If clicking same tag, close
            if (activeTag === this) {
                closeActive();
                return;
            }

            // If switching within the same card — just swap text, no close animation needed
            const sameCard = activeDescArea === descArea;

            // Close previous (from another card)
            if (!sameCard) closeActive();

            // Update text
            descArea.querySelector('.desc-tool-name').textContent = this.textContent + ':';
            descArea.querySelector('.desc-text').textContent = ' ' + desc;

            // Open the desc area
            descArea.classList.add('open');

            // Update active tag styling
            if (activeTag) activeTag.classList.remove('tag-active');
            this.classList.add('tag-active');

            activeTag = this;
            activeDescArea = descArea;
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.skill-card')) {
            closeActive();
        }
    });
}

/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* =====================================================
   SMOOTH SCROLLING
   ===================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* =====================================================
   SCROLL SPY
   ===================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
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
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

/* =====================================================
   CONTACT FORM
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:saikiran2k25@gmail.com?subject=${subject}&body=${body}`;

        showNotification('Opening email client...', 'success');
        form.reset();
    });
}

/* =====================================================
   NOTIFICATION (Enhanced)
   ===================================================== */
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = type === 'success' ? '✓' : 'ℹ';
    notification.innerHTML = `<span style="font-size:18px;margin-right:8px">${icon}</span>${message}`;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 28px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
        color: white;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        transform: translateX(120%);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    `;

    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/* =====================================================
   TYPING EFFECT
   ===================================================== */
function initTypingEffect() {
    const element = document.querySelector('.hero-description');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';
    element.style.visibility = 'visible';

    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 25);
        }
    }
    // Delay start to let loader finish
    setTimeout(type, 800);
}

/* =====================================================
   SCROLL TO TOP
   ===================================================== */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =====================================================
   PARTICLE SYSTEM
   ===================================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;
    const colors = [
        'rgba(59, 130, 246, 0.3)',
        'rgba(34, 211, 238, 0.2)',
        'rgba(168, 85, 247, 0.2)',
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        const count = Math.min((canvas.width * canvas.height) / 15000, 100);
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - distance / 1200})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
}

/* =====================================================
   DASHBOARD ANIMATIONS
   ===================================================== */
// Dashboard animations removed as component was replaced
function initDashboardAnimations() {
    // Placeholder for future profile stats
}

/* =====================================================
   AI CHATBOT WIDGET
   ===================================================== */
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSuggestions = document.getElementById('chatbotSuggestions');
    
    if (!chatbotToggle || !chatbotContainer) return;
    
    // Knowledge base with portfolio data
    const knowledgeBase = {
        skills: {
            keywords: ['skill', 'skills', 'expertise', 'tech', 'technologies', 'know', 'experience with'],
            answer: `<p><strong>Cloud Platforms:</strong> AWS (primary), Azure, GCP</p>
<p><strong>Infrastructure as Code:</strong> Terraform, Ansible, CloudFormation, Packer</p>
<p><strong>Containerization:</strong> Docker, Kubernetes (EKS), Helm, ArgoCD, Karpenter</p>
<p><strong>CI/CD:</strong> Jenkins, GitHub Actions, Bitbucket Pipelines, Bitrise</p>
<p><strong>Monitoring:</strong> CloudWatch, Prometheus, Grafana, ELK Stack, Graylog, Loki</p>
<p><strong>Programming:</strong> Bash, Python, Golang, Shell scripting</p>
<p><strong>GenAI Tools:</strong> Factory.ai, Augment, Claude, Gemini, Warp Terminal</p>`
        },
        experience: {
            keywords: ['experience', 'work', 'job', 'career', 'company', 'employment', 'role'],
            answer: `<p><strong>AssuredTechmatics</strong> (Apr 2024 - Present)<br>
DevOps Engineer for Apollo ELD fleet solution. Led on-prem to cloud migration on AWS, containerized workloads with Docker/EKS. Built CI/CD with GitHub Actions & Bitrise, established observability with Prometheus & Grafana. Leveraged GenAI for pipeline generation, log debugging, documentation, and AI-powered PR review automation.</p>
<p><strong>Wenable Technologies</strong> (Nov 2023 - Present)<br>
DevOps Engineer for WeGuard EMM Platform (Google Gold Partner). Managing multiple EKS clusters with microservices, led Bitbucket to GitHub migration. Segregated API and consumer layers for microservices with GenAI-assisted refactoring. Leveraged AI tools for pipeline generation, log debugging, and PR review. Focus on Terraform, ArgoCD, Karpenter autoscaling, and observability with Graylog, Loki, and OpenSearch.</p>
<p>He concurrently manages DevOps for both products across different domains.</p>`
        },
        contact: {
            keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'connect'],
            answer: `<p>📧 <strong>Email:</strong> saikiran2k25@gmail.com</p>
<p>📱 <strong>Phone:</strong> +91-9160382920</p>
<p>💼 <strong>LinkedIn:</strong> linkedin.com/in/saikirankali</p>
<p>💻 <strong>GitHub:</strong> github.com/Kali-25</p>
<p>🌐 <strong>Portfolio:</strong> saikiran.cloud</p>`
        },
        projects: {
            keywords: ['project', 'projects', 'built', 'developed', 'created', 'worked on'],
            answer: `<p><strong>E-KYC using Blockchain:</strong> Decentralized KYC system using Ethereum, Metamask, and Web3.js for immutable record keeping.</p>
<p><strong>Rubik's Cube Solver:</strong> AI/ML-powered mobile app using Flask, Flutter, and Dart for real-time cube state recognition and solving.</p>`
        },
        certifications: {
            keywords: ['certification', 'certified', 'certificate', 'license'],
            answer: `<p>🏆 <strong>AWS Certified Cloud Practitioner</strong> - Foundational AWS cloud concepts</p>
<p>🏆 <strong>AWS Cloud Architecture</strong> - Designing scalable infrastructure on AWS</p>
<p>🏆 <strong>Cisco CCNA</strong> - Networking fundamentals and security essentials</p>`
        },
        about: {
            keywords: ['about', 'who', 'background', 'summary', 'intro', 'bio'],
            answer: `<p>Hi! I'm <strong>Kali Saikiran</strong>, a DevOps Engineer with 2+ years of experience managing multiple Kubernetes clusters with microservices and CI/CD pipelines across two concurrent products.</p>
<p>I led on-prem to cloud migrations on AWS, modernized legacy stacks with Docker and Kubernetes, drove SCM migration from Bitbucket to GitHub, and integrate GenAI tools for pipeline generation, log debugging, documentation, and automated PR reviews. Currently handling DevOps for an enterprise mobility platform and a fleet management product simultaneously.</p>`
        },
        education: {
            keywords: ['education', 'degree', 'college', 'university', 'b.tech', 'batch'],
            answer: `<p>🎓 <strong>B.Tech in Information Technology</strong><br>
Vignana Bharathi Institute of Technology, Hyderabad<br>
Aug 2019 - June 2023</p>`
        },
        achievements: {
            keywords: ['achievement', 'achievements', 'accomplish', 'impact', 'result', 'migration'],
            answer: `<p>🚀 Migrated legacy on-prem workloads to AWS cloud, reducing deployment time</p>
<p>🔄 Led SCM migration from Bitbucket to GitHub with zero disruption to the development team</p>
<p>💰 Reduced AWS cloud costs through autoscaling and right-sizing</p>
<p>☸️ Built and maintained multiple EKS clusters running containerized microservices</p>
<p>🔀 Segregated API and consumer layers for microservices with GenAI-assisted refactoring</p>
<p>🤖 Integrated GenAI tools for pipeline generation, log debugging, documentation, and AI-powered PR reviews</p>
<p>📊 Established end-to-end observability stacks reducing incident resolution time</p>`
        },
        default: {
            keywords: [],
            answer: `<p>I'm Kali's portfolio assistant! I can help you learn about:</p>
<ul>
<li>His skills and expertise</li>
<li>Work experience</li>
<li>Key achievements</li>
<li>Projects he's built</li>
<li>Certifications</li>
<li>How to contact him</li>
</ul>
<p>Just ask me a question! 😊</p>`
        }
    };
    
    // Toggle chatbot open/close
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            setTimeout(() => chatbotInput.focus(), 300);
        }
    });
    
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
    
    // Handle suggestion clicks
    chatbotSuggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
            const question = e.target.dataset.question;
            handleMessage(question);
        }
    });
    
    // Handle form submission
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (message) {
            handleMessage(message);
            chatbotInput.value = '';
        }
    });
    
    // Process user message
    function handleMessage(message) {
        // Add user message
        addMessage(message, 'user');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get response after delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = getResponse(message);
            addMessage(response, 'bot');
        }, 800 + Math.random() * 400);
    }
    
    // Get response based on keywords
    function getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check each category
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;
            
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return data.answer;
                }
            }
        }
        
        // Return default response
        return knowledgeBase.default.answer;
    }
    
    // Add message to chat
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }
    
}
