// Neural Network Background
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('neural-network');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init();
    }

    init() {
        this.nodes = [];
        this.connections = [];
        
        // Create nodes
        for(let i = 0; i < 50; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        this.animate();
    }

    drawNode(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        this.ctx.fill();
    }

    drawConnection(x1, y1, x2, y2, distance) {
        const alpha = 1 - (distance / 150);
        if(alpha > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.2})`;
            this.ctx.stroke();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if(node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if(node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            this.drawNode(node.x, node.y);
        });

        // Draw connections
        for(let i = 0; i < this.nodes.length; i++) {
            for(let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < 150) {
                    this.drawConnection(
                        this.nodes[i].x, this.nodes[i].y,
                        this.nodes[j].x, this.nodes[j].y,
                        distance
                    );
                }
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Initialize Neural Network
const neuralNetwork = new NeuralNetwork();

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            animation: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'bubble'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 200,
                size: 4,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Cursor Light Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-light');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animated Gradient Text
const gradientText = document.querySelector('.gradient-text');
let gradientDegree = 0;

function animateGradient() {
    gradientDegree = (gradientDegree + 1) % 360;
    gradientText.style.background = `linear-gradient(${gradientDegree}deg, #06b6d4, #d946ef)`;
    gradientText.style.webkitBackgroundClip = 'text';
    gradientText.style.backgroundClip = 'text';
    gradientText.style.webkitTextFillColor = 'transparent';
    requestAnimationFrame(animateGradient);
}

animateGradient();

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Navbar Background Opacity on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Check for viewport resize
function handleResize() {
    if (window.innerWidth > 768) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

window.addEventListener('resize', handleResize);

// Timeline Animation
function initializeTimeline() {
    const timeline = document.querySelector('.timeline');
    const progress = document.querySelector('.timeline-progress');
    const items = document.querySelectorAll('.timeline-item');

    // Set initial timeline height
    progress.style.height = timeline.offsetHeight + 'px';

    // Intersection Observer for timeline items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2
    });

    items.forEach(item => observer.observe(item));
}

// Initialize timeline on load
window.addEventListener('load', initializeTimeline);

// Project Details Interaction
document.querySelectorAll('.view-code-btn, .view-arch-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const projectId = e.target.dataset.project;
        const detailsSection = document.getElementById(`${projectId}-details`);
        const isCodeBtn = e.target.classList.contains('view-code-btn');
        
        // Toggle active state
        const wasActive = detailsSection.classList.contains('active');
        document.querySelectorAll('.project-details').forEach(section => {
            section.classList.remove('active');
        });
        
        if (!wasActive) {
            detailsSection.classList.add('active');
            const codePreview = detailsSection.querySelector('.code-preview');
            const archDiagram = detailsSection.querySelector('.architecture-diagram');
            
            codePreview.classList.toggle('hidden', !isCodeBtn);
            archDiagram.classList.toggle('hidden', isCodeBtn);
            
            if (!isCodeBtn) {
                initArchitectureDiagram(projectId);
            }
        }
    });
});

// Code Tab Switching
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tabContainer = e.target.closest('.code-tabs');
        const codeContainer = e.target.closest('.code-preview');
        const targetTab = e.target.dataset.tab;
        
        // Update active tab
        tabContainer.querySelectorAll('.tab-btn').forEach(t => {
            t.classList.toggle('active', t === e.target);
        });
        
        // Show selected code
        codeContainer.querySelectorAll('.code-block').forEach(block => {
            block.classList.toggle('hidden', block.dataset.code !== targetTab);
        });
    });
});

// Architecture Diagram Drawing
function initArchitectureDiagram(projectId) {
    const svg = document.getElementById(`${projectId}-arch`);
    if (!svg) return;
    
    // Clear previous content
    svg.innerHTML = '';
    
    if (projectId === 'chat-assistant') {
        drawChatAssistantArchitecture(svg);
    } else if (projectId === 'macd') {
        drawMacdArchitecture(svg);
    }
}

function drawChatAssistantArchitecture(svg) {
    // Add architecture diagram drawing logic here
    // This would use SVG elements to create a flowchart
    const diagramContent = `
        <g transform="translate(50,50)">
            <rect width="120" height="60" rx="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4"/>
            <text x="60" y="35" text-anchor="middle" fill="#e2e8f0">Client App</text>
        </g>
        <!-- Add more SVG elements for complete architecture -->
    `;
    svg.innerHTML = diagramContent;
}

function drawMacdArchitecture(svg) {
    // Add MACD application architecture diagram
    const diagramContent = `
        <g transform="translate(50,50)">
            <rect width="120" height="60" rx="5" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4"/>
            <text x="60" y="35" text-anchor="middle" fill="#e2e8f0">Angular UI</text>
        </g>
        <!-- Add more SVG elements for complete architecture -->
    `;
    svg.innerHTML = diagramContent;
}

// Skills Sphere
const skillsData = [
    'Azure OpenAI', 'Semantic Kernel', 'RAG', 'LLM', 'Prompt Engineering',
    '.NET Core', 'Angular', 'C#', 'JavaScript', 'TypeScript',
    'Azure', 'AWS', 'CI/CD', 'Docker', 'Git'
];

const skillDescriptions = {
    'Azure OpenAI': 'Expert in Azure OpenAI services and API integration',
    'Semantic Kernel': 'Building AI applications with Semantic Kernel framework',
    'RAG': 'Implementing Retrieval Augmented Generation patterns',
    'LLM': 'Working with Large Language Models and fine-tuning',
    'Prompt Engineering': 'Creating effective prompts for AI models',
    '.NET Core': 'Building scalable backend services with .NET Core',
    'Angular': 'Creating modern web applications with Angular',
    'C#': 'Developing enterprise applications in C#',
    'JavaScript': 'Frontend development with JavaScript',
    'TypeScript': 'Type-safe development with TypeScript',
    'Azure': 'Cloud solutions and services on Azure',
    'AWS': 'AWS cloud infrastructure and services',
    'CI/CD': 'Implementing continuous integration and deployment',
    'Docker': 'Containerization and orchestration with Docker',
    'Git': 'Version control and collaboration with Git'
};

// Initialize TagCloud
const skillsSphere = document.querySelector('#skills-sphere');
const skillDetail = document.querySelector('#skill-detail');
const radius = Math.min(window.innerWidth / 4, window.innerHeight / 4);

const tagCloud = TagCloud('.skills-sphere', skillsData, {
    radius: radius,
    maxSpeed: 'normal',
    initSpeed: 'slow',
    direction: 135,
    keep: true,
    useContainerInlineStyles: true,
    useItemInlineStyles: true,
    containerClass: 'tagcloud',
    itemClass: 'tagcloud--item'
});

// Update skill detail on hover
document.querySelectorAll('.tagcloud--item').forEach(item => {
    item.addEventListener('mouseover', () => {
        const skill = item.textContent;
        if (skillDescriptions[skill]) {
            skillDetail.querySelector('h3').textContent = skill;
            skillDetail.querySelector('p').textContent = skillDescriptions[skill];
            skillDetail.classList.add('visible');
        }
    });

    item.addEventListener('mouseout', () => {
        skillDetail.classList.remove('visible');
    });
});

// Regular skill tags interaction
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseover', () => {
        const info = tag.getAttribute('data-info');
        skillDetail.querySelector('h3').textContent = tag.textContent;
        skillDetail.querySelector('p').textContent = info;
        skillDetail.classList.add('visible');
    });

    tag.addEventListener('mouseout', () => {
        skillDetail.classList.remove('visible');
    });
});

// Handle window resize for TagCloud
window.addEventListener('resize', () => {
    const newRadius = Math.min(skillsSphere.offsetWidth, skillsSphere.offsetHeight) / 2;
    tagCloud.update({ radius: newRadius });
});
