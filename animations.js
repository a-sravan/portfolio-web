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

// Particle.js Configuration is in its own library file, so we don't need to move it.

// Cursor Light Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-light');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Animated Gradient Text
const gradientText = document.querySelector('.gradient-text');
if (gradientText) {
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
}