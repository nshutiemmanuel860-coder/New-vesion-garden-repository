// ========== PAGE NAVIGATION ==========
function showPage(pageId) {
    event.preventDefault();
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
        page.setAttribute('aria-hidden', 'true');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId + '-page');
    if (selectedPage) {
        selectedPage.classList.add('active');
        selectedPage.setAttribute('aria-hidden', 'false');
        
        // Update active navigation
        updateActiveNav(pageId);
        
        // Close mobile menu
        closeMobileMenu();
        
        // Initialize page-specific content
        if (pageId === 'faq') {
            initializeFAQ();
        } else if (pageId === 'boxes') {
            loadProducts();
            filterProducts('all');
        } else if (pageId === 'activities') {
            filterActivities('all');
        } else if (pageId === 'contact') {
            showContactForm('general');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Announce page change for screen readers
        announcePageChange(pageId);
    }
}

function updateActiveNav(pageId) {
    // Update desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        if (pageId === 'home') {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
}

function announcePageChange(pageId) {
    const pageNames = {
        'home': 'Home page',
        'boxes': 'Our Boxes page',
        'activities': 'Resources and Events page',
        'about': 'About page',
        'faq': 'Frequently Asked Questions page',
        'contact': 'Contact page'
    };
    
    // Create announcement for screen readers
    const announcement = document.getElementById('page-announcement') || createAnnouncementElement();
    announcement.textContent = `Navigated to ${pageNames[pageId] || pageId} page`;
}

function createAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'page-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// ========== THEME SYSTEM ==========
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', function() {
    document.body.className = currentTheme + '-mode';
    updateThemeUI();
    
    // Set appropriate aria-label for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        updateThemeToggleAriaLabel();
    }
});

// JavaScript addition for improved mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
});


function setTheme(theme) {
    event?.preventDefault();
    
    // Remove all theme classes
    document.body.classList.remove('light-mode', 'dark-mode', 'green-mode');
    
    // Add new theme class
    document.body.classList.add(theme + '-mode');
    
    // Save to localStorage
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update UI
    updateThemeUI();
    
    // Announce theme change for screen readers
    announceThemeChange(theme);
}

function updateThemeUI() {
    // Update desktop toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'light') {
            icon.className = 'fas fa-sun';
        } else if (currentTheme === 'dark') {
            icon.className = 'fas fa-moon';
        } else if (currentTheme === 'green') {
            icon.className = 'fas fa-leaf';
        }
        updateThemeToggleAriaLabel();
    }
    
    // Update mobile theme buttons
    document.querySelectorAll('.mobile-theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === currentTheme) {
            btn.classList.add('active');
        }
    });
}

function updateThemeToggleAriaLabel() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeNames = {
            'light': 'Light Mode',
            'dark': 'Dark Mode',
            'green': 'Green Mode'
        };
        const nextTheme = getNextTheme();
        themeToggle.setAttribute('aria-label', `Toggle theme. Current theme: ${themeNames[currentTheme]}. Click to switch to ${themeNames[nextTheme]}`);
    }
}

function getNextTheme() {
    const themes = ['light', 'dark', 'green'];
    const currentIndex = themes.indexOf(currentTheme);
    return themes[(currentIndex + 1) % themes.length];
}

function announceThemeChange(theme) {
    const themeNames = {
        'light': 'Light mode',
        'dark': 'Dark mode',
        'green': 'Green mode'
    };
    
    const announcement = document.getElementById('theme-announcement') || createThemeAnnouncementElement();
    announcement.textContent = `Theme changed to ${themeNames[theme]}`;
}

function createThemeAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'theme-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// Theme toggle button (cycles through themes)
document.getElementById('themeToggle').addEventListener('click', function() {
    const themes = ['light', 'dark', 'green'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
});

// ========== MOBILE MENU - IMPROVED ==========
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');

function toggleMobileMenu() {
    event.preventDefault();
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileNav.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.setAttribute('aria-hidden', isExpanded);
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    
    // Announce menu state change for screen readers
    announceMenuState(!isExpanded);
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (mobileNav.classList.contains('active') && 
        !mobileNav.contains(event.target) && 
        !mobileMenuToggle.contains(event.target)) {
        closeMobileMenu();
    }
});

// Close menu on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileMenu();
        mobileMenuToggle.focus();
    }
});

// Close menu when clicking on mobile nav links (IMPROVED)
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
        setTimeout(closeMobileMenu, 300); // Small delay for better UX
    });
});

function announceMenuState(isOpen) {
    const announcement = document.getElementById('menu-announcement') || createMenuAnnouncementElement();
    announcement.textContent = `Mobile menu ${isOpen ? 'opened' : 'closed'}`;
}

function createMenuAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'menu-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// ========== PRODUCTS SYSTEM ==========
const products = [
    {
        id: 1,
        category: 'oddbox',
        title: 'Oddbox',
        description: 'Affordable subscription of "wonky" vegetables that would otherwise go to waste. Perfect for budget-conscious gardeners who value sustainability.',
        features: ['Weekly deliveries', 'Seasonal vegetables', 'Reduces food waste', 'Perfect for beginners'],
        price: '£18.99/month',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        category: 'flourish',
        title: 'Flourish',
        description: 'Curated seasonal collections of premium seeds and plants. Each box is themed by season and includes planting guides for success.',
        features: ['Four boxes a year', 'Premium seeds', 'Seasonal themes', 'Expert planting guides'],
        price: '£29.99/season',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        category: 'cottage',
        title: 'Cottage',
        description: 'Wildflower gardening boxes designed to create beautiful, pollinator-friendly spaces. Includes native wildflower seeds and planting guide.',
        features: ['Monthly delivery', 'Wildflower seeds', 'Pollinator-friendly', 'Native species'],
        price: '£24.99/box',
        image: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 4,
        category: 'custom',
        title: 'Custom',
        description: 'Tailored corporate gift solutions and large-scale gardening projects. Perfect for employee wellness programs or corporate sustainability initiatives.',
        features: ['Fully customizable', 'Bulk pricing', 'Corporate branding', 'Flexible scheduling'],
        price: 'Custom Pricing',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}" role="article" aria-label="${product.title}">
            <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/800x600/1e7c1e/FFFFFF?text=${product.title}'">
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-features">
                    ${product.features.map(feature => `
                        <span class="product-feature"><i class="fas fa-check" aria-hidden="true"></i> ${feature}</span>
                    `).join('')}
                </div>
                <div class="product-price">${product.price}</div>
                <a href="#" class="btn btn-outline" onclick="showPage('contact')" aria-label="Inquire about ${product.title}">Inquire Now</a>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    event?.preventDefault();
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    const activeButton = event?.target || document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
    }
    
    // Filter products
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.setAttribute('aria-hidden', 'false');
        } else {
            card.style.display = 'none';
            card.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Announce filter change for screen readers
    announceFilterChange(category);
}

function announceFilterChange(category) {
    const categoryNames = {
        'all': 'All boxes',
        'oddbox': 'Oddbox',
        'flourish': 'Flourish',
        'cottage': 'Cottage',
        'custom': 'Custom'
    };
    
    const announcement = document.getElementById('filter-announcement') || createFilterAnnouncementElement();
    announcement.textContent = `Showing ${categoryNames[category]} products`;
}

function createFilterAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'filter-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// ========== PRODUCT CHOOSER QUIZ ==========
let chooserAnswers = {
    experience: '',
    interest: ''
};

function nextQuestion(questionNum, answer) {
    const currentQuestion = document.querySelector('.chooser-question.active');
    const nextQuestion = document.getElementById(`question${questionNum}`);
    
    if (currentQuestion && nextQuestion) {
        // Save answer
        if (questionNum === 2) {
            chooserAnswers.experience = answer;
        } else if (questionNum === 3) {
            chooserAnswers.interest = answer;
        }
        
        // Hide current question
        currentQuestion.classList.remove('active');
        currentQuestion.setAttribute('aria-hidden', 'true');
        
        // Show next question or result
        if (questionNum <= 3) {
            nextQuestion.classList.add('active');
            nextQuestion.setAttribute('aria-hidden', 'false');
            
            // Focus first option in next question
            const firstOption = nextQuestion.querySelector('.chooser-option');
            if (firstOption) {
                setTimeout(() => firstOption.focus(), 300);
            }
        } else {
            showRecommendation();
        }
    }
}

function showRecommendation() {
    const resultElement = document.getElementById('chooserResult');
    const boxElement = document.getElementById('recommendedBox');
    const reasonElement = document.getElementById('recommendationReason');
    
    // Determine recommendation based on answers
    let recommendedBox = '';
    let reason = '';
    
    if (chooserAnswers.experience === 'beginner') {
        if (chooserAnswers.interest === 'vegetables') {
            recommendedBox = 'Oddbox';
            reason = 'Perfect for beginners who want to grow fresh vegetables with minimal effort. Weekly deliveries keep you supplied throughout the season.';
        } else if (chooserAnswers.interest === 'flowers') {
            recommendedBox = 'Cottage';
            reason = 'Great for beginners wanting beautiful flowers. Monthly wildflower boxes are easy to grow and maintain.';
        } else {
            recommendedBox = 'Flourish';
            reason = 'Seasonal boxes provide variety and expert guidance perfect for beginners exploring different types of gardening.';
        }
    } else if (chooserAnswers.experience === 'intermediate') {
        if (chooserAnswers.interest === 'vegetables') {
            recommendedBox = 'Oddbox';
            reason = 'Intermediate gardeners will appreciate the variety and sustainability of our wonky vegetable subscription.';
        } else if (chooserAnswers.interest === 'flowers') {
            recommendedBox = 'Cottage';
            reason = 'Create stunning pollinator-friendly gardens with our curated wildflower collections.';
        } else {
            recommendedBox = 'Flourish';
            reason = 'Seasonal themes provide ongoing inspiration and new challenges for intermediate gardeners.';
        }
    } else { // expert
        if (chooserAnswers.interest === 'vegetables') {
            recommendedBox = 'Oddbox';
            reason = 'Expert gardeners will value the sustainability and unique varieties in our vegetable boxes.';
        } else if (chooserAnswers.interest === 'flowers') {
            recommendedBox = 'Cottage';
            reason = 'Create professional-quality wildflower gardens with our premium seed collections.';
        } else {
            recommendedBox = 'Flourish';
            reason = 'Challenge yourself with our seasonal premium collections and advanced gardening techniques.';
        }
    }
    
    // Update result display
    boxElement.textContent = recommendedBox;
    reasonElement.textContent = reason;
    
    // Show result
    const currentQuestion = document.querySelector('.chooser-question.active');
    if (currentQuestion) {
        currentQuestion.classList.remove('active');
        currentQuestion.setAttribute('aria-hidden', 'true');
    }
    
    resultElement.classList.add('active');
    resultElement.setAttribute('aria-hidden', 'false');
    
    // Focus on result
    setTimeout(() => {
        resultElement.querySelector('h3').focus();
    }, 300);
}

function restartChooser() {
    // Reset answers
    chooserAnswers = {
        experience: '',
        interest: ''
    };
    
    // Hide result
    const resultElement = document.getElementById('chooserResult');
    resultElement.classList.remove('active');
    resultElement.setAttribute('aria-hidden', 'true');
    
    // Show first question
    const firstQuestion = document.getElementById('question1');
    firstQuestion.classList.add('active');
    firstQuestion.setAttribute('aria-hidden', 'false');
    
    // Focus first option
    const firstOption = firstQuestion.querySelector('.chooser-option');
    if (firstOption) {
        setTimeout(() => firstOption.focus(), 300);
    }
}

// ========== ACTIVITIES FILTERING ==========
function filterActivities(category) {
    event?.preventDefault();
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = event?.target || document.querySelector(`[onclick="filterActivities('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Filter activities
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            card.setAttribute('aria-hidden', 'false');
        } else {
            card.style.display = 'none';
            card.setAttribute('aria-hidden', 'true');
        }
    });
}

// ========== FAQ SYSTEM ==========
const faqData = [
    {
        question: "How do I maintain my Gardens subscription box?",
        answer: "Each box comes with detailed maintenance instructions tailored to the specific plants and season. We also provide ongoing support through our online resources and customer service team."
    },
    {
        question: "Do Gardens boxes require special fertilizer?",
        answer: "Our boxes include organic fertilizer recommendations, but you can use any quality organic fertilizer. We provide specific guidelines based on what's in your box each season."
    },
    {
        question: "Are Gardens boxes drought tolerant? Do I need to water them?",
        answer: "We select plants with good drought tolerance where appropriate, but all plants need water. We provide specific watering guides for each box based on the plants included and your local climate."
    },
    {
        question: "How do Gardens boxes perform in shade?",
        answer: "We offer boxes specifically designed for different light conditions. When you order, you can specify your garden's light conditions, and we'll customize your box accordingly."
    },
    {
        question: "What are Gardens products?",
        answer: "We offer curated gardening boxes (Oddbox, Flourish, Cottage, Custom), gardening tools and supplies, and access to our community events and resources."
    },
    {
        question: "Are Gardens products safe for pets?",
        answer: "We prioritize pet-safe plants in our boxes, but always recommend checking specific plants if you have pets. Our product descriptions include pet safety information."
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time. We offer month-to-month subscriptions with no long-term commitment required."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries in Europe, Asia, and New Zealand. Shipping costs and times vary by location. Contact us for specific information about your country."
    }
];

function initializeFAQ() {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;
    
    // Clear any existing content
    faqContainer.innerHTML = '';
    
    faqContainer.innerHTML = faqData.map((item, index) => `
        <div class="faq-item" role="article">
            <div class="faq-question" id="faq-question-${index}" 
                 aria-expanded="false" 
                 aria-controls="faq-answer-${index}"
                 role="button"
                 tabindex="0"
                 onkeypress="if(event.key === 'Enter' || event.key === ' ') toggleFAQ(${index})">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down faq-toggle" aria-hidden="true"></i>
            </div>
            <div class="faq-answer" id="faq-answer-${index}" aria-labelledby="faq-question-${index}">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to FAQ questions
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.addEventListener('click', () => toggleFAQ(index));
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(index);
            }
        });
    });
}

function toggleFAQ(index) {
    const question = document.getElementById(`faq-question-${index}`);
    const answer = document.getElementById(`faq-answer-${index}`);
    const toggle = question.querySelector('.faq-toggle');
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Toggle current answer
    answer.classList.toggle('active');
    toggle.classList.toggle('active');
    question.setAttribute('aria-expanded', !isExpanded);
    
    // Announce state change for screen readers
    const announcement = document.getElementById('faq-announcement') || createFAQAnnouncementElement();
    announcement.textContent = `${isExpanded ? 'Collapsed' : 'Expanded'} FAQ: ${question.querySelector('span').textContent}`;
}

function createFAQAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'faq-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// ========== CONTACT FORM SYSTEM ==========
function showContactForm(formType) {
    event?.preventDefault();
    
    // Update active tab
    document.querySelectorAll('.contact-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
    });
    
    const activeTab = event?.target || document.querySelector(`[onclick="showContactForm('${formType}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        activeTab.setAttribute('tabindex', '0');
    }
    
    // Show selected form
    document.querySelectorAll('.contact-form').forEach(form => {
        form.classList.remove('active');
        form.hidden = true;
    });
    
    const selectedForm = document.getElementById(formType + 'Form');
    if (selectedForm) {
        selectedForm.classList.add('active');
        selectedForm.hidden = false;
        
        // Focus first input in form
        const firstInput = selectedForm.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Remove previous error states
        input.classList.remove('error');
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
        
        // Validate based on input type
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.value.trim() === '') {
            showError(input, 'This field is required');
            isValid = false;
        }
    });
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'display: block; color: #dc3545; font-size: 0.875rem; margin-top: 4px;';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    
    // Announce error for screen readers
    const announcement = document.getElementById('form-error-announcement') || createFormErrorAnnouncementElement();
    announcement.textContent = `Error: ${message}`;
}

function createFormErrorAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'form-error-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// Form Submission
document.getElementById('generalContactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm('generalContactForm')) {
        return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;
    
    // Show success message
    showSuccessMessage(`Thank you, ${name}! Your inquiry about ${interest} has been received. We'll contact you at ${email} within 24 hours.`);
    
    // Reset form
    this.reset();
});

document.getElementById('corporateContactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm('corporateContactForm')) {
        return;
    }
    
    const companyName = document.getElementById('companyName').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const boxQuantity = document.getElementById('boxQuantity').value;
    const corporateEmail = document.getElementById('corporateEmail').value;
    
    // Show success message
    showSuccessMessage(`Thank you for your corporate inquiry, ${contactPerson} from ${companyName}! We've received your request for ${boxQuantity} boxes and will provide a customized quote within 24 hours.`);
    
    // Reset form
    this.reset();
});

function showSuccessMessage(message) {
    // Remove any existing success message
    const existingMessage = document.getElementById('success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.id = 'success-message';
    successMessage.textContent = message;
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow-hover);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(successMessage);
    
    // Announce success for screen readers
    const announcement = document.getElementById('form-success-announcement') || createFormSuccessAnnouncementElement();
    announcement.textContent = message;
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 5000);
}

function createFormSuccessAnnouncementElement() {
    const announcement = document.createElement('div');
    announcement.id = 'form-success-announcement';
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcement);
    return announcement;
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Add keyboard navigation support for all interactive elements
document.addEventListener('keydown', function(e) {
    // Tab key navigation - ensure focus is visible
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 3px solid var(--focus-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardNavStyle);

// ========== INITIALIZE ON LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load initial content
    loadProducts();
    initializeFAQ();
    
    // Set active page
    updateActiveNav('home');
    
    // Make sure all images have fallbacks
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/800x600/1e7c1e/FFFFFF?text=Gardens';
        };
    });
    
    // Initialize product chooser
    const firstOption = document.querySelector('.chooser-option');
    if (firstOption) {
        firstOption.focus();
    }
    
    // Initialize contact form
    showContactForm('general');
    
    // Add performance monitoring
    monitorPerformance();
});

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfEntries = performance.getEntriesByType('navigation');
                if (perfEntries.length > 0) {
                    const navTiming = perfEntries[0];
                    console.log('Page load time:', navTiming.loadEventEnd - navTiming.startTime, 'ms');
                }
            }, 0);
        });
    }
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}