// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// Theme Management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Check for saved theme preference or system preference
function initializeTheme() {
    setTheme('dark');
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //     setTheme(savedTheme);
    // } else {
    //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //     setTheme(prefersDark ? 'dark' : 'light');
    // }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
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
document.querySelectorAll('.view-arch-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const projectId = e.target.dataset.project;
        const detailsSection = document.getElementById(`${projectId}-details`);
        
        // Toggle active state
        const wasActive = detailsSection.classList.contains('active');
        
        // Close all other project details
        document.querySelectorAll('.project-details').forEach(section => {
            section.classList.remove('active');
        });
        
        if (!wasActive) {
            detailsSection.classList.add('active');
            const archDiagram = detailsSection.querySelector('.architecture-diagram');
            
            // Show architecture diagram
            archDiagram.classList.remove('hidden');
            
            // For projects that need SVG generation
            if (projectId === 'macd') {
                initArchitectureDiagram(projectId);
            }
        }
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
