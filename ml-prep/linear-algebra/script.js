// === MACHINE LEARNING PREPARATION INTERACTIVE SCRIPT ===

// Course progress tracking
let courseProgress = {
    linearAlgebra: {
        total: 7,
        completed: 0,
        available: 7,
        lessons: [
            { name: 'Vector Fundamentals', available: true, completed: false },
            { name: 'Dot Products & Orthogonality', available: true, completed: false },
            { name: 'Matrix Operations', available: true, completed: false },
            { name: 'Matrix Multiplication', available: true, completed: false },
            { name: 'Vector Spaces & Independence', available: true, completed: false },
            { name: 'Determinants & Inverses', available: true, completed: false },
            { name: 'Eigenvalues & Eigenvectors', available: true, completed: false }
        ]
    },
    calculus: {
        total: 2,
        completed: 0,
        available: 0,
        lessons: [
            { name: 'Derivatives & Gradients', available: false, completed: false },
            { name: 'Optimization Methods', available: false, completed: false }
        ]
    },
    probability: {
        total: 1,
        completed: 0,
        available: 0,
        lessons: [
            { name: 'Probability Fundamentals', available: false, completed: false }
        ]
    }
};

// Initialize page functionality
function initializePage() {
    updateProgressDisplay();
    loadProgressFromStorage();
    setupEventListeners();
    animateProgressBar();
}

// Update progress display based on current data
function updateProgressDisplay() {
    const totalLessons = courseProgress.linearAlgebra.total + 
                        courseProgress.calculus.total + 
                        courseProgress.probability.total;
    
    const availableLessons = courseProgress.linearAlgebra.available + 
                            courseProgress.calculus.available + 
                            courseProgress.probability.available;
    
    const completedLessons = courseProgress.linearAlgebra.completed + 
                            courseProgress.calculus.completed + 
                            courseProgress.probability.completed;
    
    // Update progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `Linear Algebra: ${courseProgress.linearAlgebra.available} of ${courseProgress.linearAlgebra.total} lessons available`;
    }
    
    // Update progress percentage
    const progressPercentage = document.getElementById('progress-percentage');
    const availablePercentage = Math.round((availableLessons / totalLessons) * 100);
    const completedPercentage = Math.round((completedLessons / totalLessons) * 100);
    
    if (progressPercentage) {
        if (completedPercentage > 0) {
            progressPercentage.textContent = `${completedPercentage}% Complete - Keep going! 🚀`;
        } else {
            progressPercentage.textContent = `${availablePercentage}% Available - Ready to start! 🌟`;
        }
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const fillPercentage = completedPercentage > 0 ? completedPercentage : availablePercentage;
        progressFill.style.width = `${fillPercentage}%`;
        
        // Change color based on completion
        if (completedPercentage > 0) {
            progressFill.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        } else {
            progressFill.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
        }
    }
}

// Animate progress bar on load
function animateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        // Start from 0 and animate to target width
        const targetWidth = progressFill.style.width;
        progressFill.style.width = '0%';
        
        setTimeout(() => {
            progressFill.style.width = targetWidth;
        }, 500);
    }
}

// Load progress from localStorage
function loadProgressFromStorage() {
    const savedProgress = localStorage.getItem('mlPrepProgress');
    if (savedProgress) {
        try {
            const parsed = JSON.parse(savedProgress);
            // Merge with current progress structure
            Object.assign(courseProgress, parsed);
            updateProgressDisplay();
        } catch (e) {
            console.log('Could not load saved progress');
        }
    }
}

// Save progress to localStorage
function saveProgressToStorage() {
    try {
        localStorage.setItem('mlPrepProgress', JSON.stringify(courseProgress));
    } catch (e) {
        console.log('Could not save progress');
    }
}

// Mark lesson as completed
function markLessonCompleted(category, lessonName) {
    const lessons = courseProgress[category]?.lessons;
    if (lessons) {
        const lesson = lessons.find(l => l.name === lessonName);
        if (lesson && !lesson.completed) {
            lesson.completed = true;
            courseProgress[category].completed++;
            updateProgressDisplay();
            saveProgressToStorage();
            showCompletionCelebration(lessonName);
        }
    }
}

// Show completion celebration
function showCompletionCelebration(lessonName) {
    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-emoji">🎉</div>
            <h3>Lesson Complete!</h3>
            <p>You've finished: <strong>${lessonName}</strong></p>
            <button onclick="this.parentElement.parentElement.remove()">Continue</button>
        </div>
    `;
    
    // Add styles
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = celebration.querySelector('.celebration-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    const emoji = celebration.querySelector('.celebration-emoji');
    emoji.style.cssText = `
        font-size: 4em;
        margin-bottom: 20px;
        animation: bounce 1s infinite;
    `;
    
    const button = celebration.querySelector('button');
    button.style.cssText = `
        background: #4CAF50;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(celebration);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (celebration.parentElement) {
            celebration.remove();
        }
    }, 5000);
}

// Setup event listeners
function setupEventListeners() {
    // Add click tracking for lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card.available');
    lessonCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Track lesson access
            const lessonTitle = this.querySelector('.lesson-title').textContent;
            console.log(`Accessing lesson: ${lessonTitle}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add hover effects for lesson cards
    const allLessonCards = document.querySelectorAll('.lesson-card');
    allLessonCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('available')) {
                this.style.background = 'rgba(255, 255, 255, 0.25)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('available')) {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
    
    // Add smooth scrolling for navigation
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Ensure focused elements are visible
            setTimeout(() => {
                const focused = document.activeElement;
                if (focused && focused.classList.contains('lesson-card')) {
                    focused.style.outline = '2px solid #FFD700';
                }
            }, 0);
        }
        
        if (e.key === 'Enter' && document.activeElement.classList.contains('lesson-card')) {
            document.activeElement.click();
        }
    });
    
    // Clear outline when clicking
    document.addEventListener('click', function() {
        const focused = document.activeElement;
        if (focused && focused.classList.contains('lesson-card')) {
            focused.style.outline = 'none';
        }
    });
}

// Create progress indicators for individual lessons
function createLessonProgressIndicator(lessonElement, isCompleted) {
    const indicator = document.createElement('div');
    indicator.className = 'lesson-progress-indicator';
    indicator.innerHTML = isCompleted ? '✓' : '';
    
    indicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${isCompleted ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    `;
    
    lessonElement.style.position = 'relative';
    lessonElement.appendChild(indicator);
}

// Add progress indicators to all lessons
function addProgressIndicators() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        const lessonTitle = card.querySelector('.lesson-title').textContent;
        
        // Check if lesson is completed
        let isCompleted = false;
        for (const category in courseProgress) {
            const lesson = courseProgress[category].lessons.find(l => l.name === lessonTitle);
            if (lesson && lesson.completed) {
                isCompleted = true;
                break;
            }
        }
        
        createLessonProgressIndicator(card, isCompleted);
    });
}

// Utility function to show tooltips
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        white-space: nowrap;
        transform: translateX(-50%);
        bottom: 100%;
        left: 50%;
        margin-bottom: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
    }, 2000);
}

// Export functions for use in lesson pages
window.MLPrepAPI = {
    markLessonCompleted,
    updateProgressDisplay,
    saveProgressToStorage,
    courseProgress
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializePage);

// Handle page visibility changes to update progress
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadProgressFromStorage();
    }
});

// Add service worker registration for offline functionality (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here for offline support
        console.log('ML Prep Course ready for offline enhancement');
    });
}
