// ---------------------------
// PRODUCT LOADER
// ---------------------------
let PRODUCTS_DATA = [];

async function loadProductsData() {
    try {
        const [productsResponse, translationsResponse] = await Promise.all([
            fetch('assets/data/product.json'),
            fetch('assets/data/producttranslation.json')
        ]);
        
        if (!productsResponse.ok) {
            throw new Error(`HTTP error! status: ${productsResponse.status}`);
        }
        
        PRODUCTS_DATA = await productsResponse.json();
        
        // Завантажуємо переклади в languageManager
        if (translationsResponse.ok) {
            const productTranslations = await translationsResponse.json();
            if (window.languageManager) {
                window.languageManager.productTranslations = productTranslations;
                console.log('✅ Product translations loaded into languageManager');
            }
        }
        
        initializeProductPage();
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
        // Використовуємо тестові дані як fallback
        PRODUCTS_DATA = getFallbackProducts();
        initializeProductPage();
    }
}

function getFallbackProducts() {
    return [
        {
            id: 1,
            title: "T-Shirt with tape details",
            price: 240,
            oldPrice: null,
            category: "T-Shirts",
            image: "assets/images/blacktshirt.png",
            rating: 4.5,
            colors: ["black", "white"],
            sizes: ["Small", "Medium", "Large"],
            style: "Casual",
            inStock: true,
            discount: null,
            description: "This comfortable t-shirt features unique tape details for a modern look."
        },
        {
            id: 2,
            title: "Skinny Fit Jeans",
            price: 240,
            oldPrice: 260,
            category: "Jeans",
            image: "assets/images/blackjeans.png",
            rating: 3.5,
            colors: ["blue", "black"],
            sizes: ["Small", "Medium", "Large"],
            style: "Casual",
            inStock: true,
            discount: 20,
            description: "Classic skinny fit jeans with comfortable stretch fabric."
        },
        {
            id: 3,
            title: "Checkered Shirt",
            price: 180,
            oldPrice: null,
            category: "Shirts",
            image: "assets/images/chekeredshirt.png",
            rating: 4.5,
            colors: ["red", "blue"],
            sizes: ["Small", "Medium", "Large"],
            style: "Casual",
            inStock: true,
            discount: null,
            description: "Stylish checkered shirt perfect for casual occasions."
        },
        {
            id: 4,
            title: "Sleeve Striped T-shirt",
            price: 130,
            oldPrice: 160,
            category: "T-shirts",
            image: "assets/images/stripedtshirt.png",
            rating: 4.5,
            colors: ["orange", "black"],
            sizes: ["Medium", "Large"],
            style: "Casual",
            inStock: true,
            discount: 30,
            description: "Striped t-shirt with comfortable sleeve design."
        }
    ];
}

// ---------------------------
// GET PRODUCT ID FROM URL
// ---------------------------
function initializeProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const container = document.getElementById("product-page");

    if (!container) {
        return;
    }

    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2>Продукт не знайдено</h2>
                <p>Доступні ID: ${PRODUCTS_DATA.map(p => p.id).join(', ')}</p>
                <a href="shop.html" style="color: #000; text-decoration: underline;">Повернутися до магазину</a>
            </div>
        `;
        return;
    }

    renderProduct(product, container);
    setupProductInteractions(container, product);
}

function showError(message) {
    const container = document.getElementById("product-page");
    if (container) {
        container.innerHTML = `<div style="padding:20px; text-align:center;"><strong>${message}</strong></div>`;
    }
}

// ---------------------------
// ФУНКЦІЇ ПЕРЕКЛАДУ ПРОДУКТІВ
// ---------------------------
function getProductTitle(product) {
    if (!window.languageManager || !window.languageManager.isInitialized) {
        console.log('⚠️ LanguageManager not ready, using default title');
        return product.title;
    }
    
    const translated = window.languageManager.getProductTranslation(product.id, 'title');
    console.log(`🔍 Product page translation for product ${product.id}:`, { 
        original: product.title, 
        translated: translated 
    });
    
    return translated || product.title;
}

function getProductDescription(product) {
    if (!window.languageManager || !window.languageManager.isInitialized) {
        return product.description;
    }
    
    const translated = window.languageManager.getProductTranslation(product.id, 'description');
    return translated || product.description;
}

function getColorTranslation(color) {
    if (!window.languageManager) {
        return color;
    }
    
    return window.languageManager.getColorTranslation(color) || color;
}

function getSizeTranslation(size) {
    if (!window.languageManager) {
        return size;
    }
    
    return window.languageManager.getSizeTranslation(size) || size;
}

function getCategoryTranslation(category) {
    if (!window.languageManager) {
        return category;
    }
    
    return window.languageManager.getCategoryTranslation(category) || category;
}

// ---------------------------
// RENDER HELPERS
// ---------------------------
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < full; i++) {
        stars += `<i class="fa-solid fa-star" style="color:#ffc633"></i>`;
    }
    if (half) {
        stars += `<i class="fa-solid fa-star-half-stroke" style="color:#ffc633"></i>`;
    }
    return stars;
}

function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`;
}

function mapColor(color) {
    const colors = {
        white: "#ffffff",
        black: "#000000",
        blue: "#1e40af",
        red: "#dc2626",
        orange: "#f97316",
        pink: "#ec4899",
        green: "#22c55e",
        brown: "#92400e"
    };
    return colors[color?.toLowerCase()] || "#999";
}

function renderColors(colors = []) {
    if (!colors.length) return "";
    return `
        <div class="color-options">
            ${colors.map(c => `
                <div class="color-swatch" style="background:${mapColor(c)}" data-color="${c}" title="${getColorTranslation(c)}"></div>
            `).join("")}
        </div>
    `;
}

function renderSizes(sizes = []) {
    if (!sizes.length) return `<div class="muted">No sizes available</div>`;
    return `
        <div class="size-options">
            ${sizes.map(s => `<div class="size-pill" data-size="${s}">${getSizeTranslation(s)}</div>`).join("")}
        </div>
    `;
}

// ---------------------------
// BUILD PRODUCT HTML - ОНОВЛЕНА З ПЕРЕКЛАДАМИ
// ---------------------------
function renderProduct(product, container) {
    const translatedTitle = getProductTitle(product);
    const translatedDescription = getProductDescription(product);
    
    console.log(`🎨 Rendering product ${product.id}:`, {
        originalTitle: product.title,
        translatedTitle: translatedTitle,
        originalDescription: product.description,
        translatedDescription: translatedDescription
    });

    const html = `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${translatedTitle}" onerror="this.src='assets/images/placeholder.png'">
            </div>

            <div class="product-info">
                <h1 class="product-title" data-product-title>${escapeHtml(translatedTitle)}</h1>

                <div class="rating">
                    ${renderStars(product.rating)}
                    <span class="count">${product.rating.toFixed(1)}/5</span>
                </div>

                <div class="pricing">
                    <div class="current-price">${formatPrice(product.price)}</div>
                    ${product.oldPrice ? `<div class="old-price">${formatPrice(product.oldPrice)}</div>` : ""}
                    ${product.discount ? `<div class="discount">-${product.discount}%</div>` : ""}
                </div>

                <p class="description" data-product-description>${escapeHtml(translatedDescription || "No description available.")}</p>

                <div class="options-block">
                    <div class="line"></div>

                    <div class="option-title">Select color</div>
                    ${renderColors(product.colors)}

                    <div class="line"></div>

                    <div class="option-title">Choose size</div>
                    ${renderSizes(product.sizes)}

                    <div class="line"></div>
                </div>

                <div class="bottom-row">
                    <div class="qty-box">
                        <button type="button" class="qty-minus">−</button>
                        <span class="qty-value">1</span>
                        <button type="button" class="qty-plus">+</button>
                    </div>

                    <button class="add-to-cart" ${!product.inStock ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
                        ${product.inStock ? 'Add to cart' : 'Out of stock'}
                    </button>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Fix hyphens in title
    setTimeout(fixHyphensInTitle, 200);
}

// ---------------------------
// INTERACTIONS - ОНОВЛЕНА ФУНКЦІЯ
// ---------------------------
function setupProductInteractions(container, product) {
    // Color selection
    const swatches = container.querySelectorAll(".color-swatch");
    if (swatches.length > 0) {
        swatches[0].classList.add("selected"); // Auto-select first color
        swatches.forEach(s => {
            s.addEventListener("click", () => {
                swatches.forEach(el => el.classList.remove("selected"));
                s.classList.add("selected");
            });
        });
    }

    // Size selection
    const sizePills = container.querySelectorAll(".size-pill");
    if (sizePills.length > 0) {
        sizePills[0].classList.add("selected"); // Auto-select first size
        sizePills.forEach(s => {
            s.addEventListener("click", () => {
                sizePills.forEach(el => el.classList.remove("selected"));
                s.classList.add("selected");
            });
        });
    }

    // Quantity logic
    let qty = 1;
    const qtyValue = container.querySelector(".qty-value");
    const qtyMinus = container.querySelector(".qty-minus");
    const qtyPlus = container.querySelector(".qty-plus");

    qtyMinus.addEventListener("click", () => {
        if (qty > 1) {
            qty--;
            qtyValue.textContent = qty;
        }
    });

    qtyPlus.addEventListener("click", () => {
        qty++;
        qtyValue.textContent = qty;
    });

    // Add to cart - ВИКОРИСТОВУЄМО ГЛОБАЛЬНИЙ ОБ'ЄКТ cart
    const addBtn = container.querySelector(".add-to-cart");
    addBtn.addEventListener("click", () => {
        const selectedColorEl = container.querySelector(".color-swatch.selected");
        const selectedSizeEl = container.querySelector(".size-pill.selected");

        const selectedColor = selectedColorEl ? selectedColorEl.dataset.color : "Default";
        const selectedSize = selectedSizeEl ? selectedSizeEl.dataset.size : "One Size";

        // Перевірка обов'язкового вибору розміру
        if (product.sizes && product.sizes.length > 0 && !selectedSizeEl) {
            alert("Please select a size.");
            return;
        }

        // Додаємо товар до кошика - ВИКОРИСТОВУЄМО ГЛОБАЛЬНИЙ cart
        if (window.cart && typeof window.cart.addItem === 'function') {
            window.cart.addItem(product, selectedSize, selectedColor, qty);
            // Сповищення більше не показуємо - тільки анімація іконки
        } else {
            // Fallback якщо кошик не завантажений
            console.log('Cart item:', { product, size: selectedSize, color: selectedColor, quantity: qty });
        }
    });
} 

// ---------------------------
// UTILITY FUNCTIONS
// ---------------------------
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

function fixHyphensInTitle() {
    const titleElement = document.querySelector('.product-title');
    if (!titleElement) return;

    const parts = titleElement.textContent.split('-');
    if (parts.length <= 1) return;

    let newHTML = "";
    for (let i = 0; i < parts.length; i++) {
        newHTML += parts[i];
        if (i < parts.length - 1) {
            newHTML += '<span style="font-family: Satoshi, Arial; font-weight: 1200;">-</span>';
        }
    }
    titleElement.innerHTML = newHTML;
}

// ---------------------------
// ОНОВЛЕННЯ ПЕРЕКЛАДІВ ПРОДУКТУ
// ---------------------------
function updateProductTranslations() {
    console.log('🔄 Updating product page translations...');
    
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    
    if (!product) return;
    
    const container = document.getElementById("product-page");
    if (!container) return;
    
    // Оновлюємо назву продукту
    const titleElement = container.querySelector('[data-product-title]');
    if (titleElement) {
        const translatedTitle = getProductTitle(product);
        titleElement.textContent = translatedTitle;
        
        // Оновлюємо alt атрибут зображення
        const imageElement = container.querySelector('.product-image img');
        if (imageElement) {
            imageElement.alt = translatedTitle;
        }
    }
    
    // Оновлюємо опис продукту
    const descriptionElement = container.querySelector('[data-product-description]');
    if (descriptionElement) {
        const translatedDescription = getProductDescription(product);
        descriptionElement.textContent = translatedDescription;
    }
    
    // Оновлюємо кольори
    const colorSwatches = container.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        const originalColor = swatch.dataset.color;
        swatch.title = getColorTranslation(originalColor);
    });
    
    // Оновлюємо розміри
    const sizePills = container.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
        const originalSize = pill.dataset.size;
        pill.textContent = getSizeTranslation(originalSize);
    });
    
    // Fix hyphens again after translation
    setTimeout(fixHyphensInTitle, 200);
}

// ---------------------------
// LOAD PRODUCT REVIEWS
// ---------------------------
function loadProductReviews(productId) {
    const reviewsContainer = document.querySelector(".product-reviews");
    if (!reviewsContainer) return;

    fetch("assets/data/reviews.json")
        .then(r => r.json())
        .then(data => {
            const productData = data.products.find(p => p.productId == productId);

            if (!productData || productData.reviews.length === 0) {
                reviewsContainer.innerHTML = `<p class="no-reviews">No reviews yet.</p>`;
                return;
            }

            reviewsContainer.innerHTML = productData.reviews.map(review => `
                <div class="review-card">
                    <div class="review-stars">
                        ${renderStarsReview(review.rating)}
                    </div>
                    <h5 class="review-author">${review.name}</h5>
                    <p class="review-text">"${review.text}"</p>
                    <div class="review-date">Posted on ${formatDateLong(review.date)}</div>
                </div>
            `).join("");

        })
        .catch(error => {
            reviewsContainer.innerHTML = `<p class="no-reviews">Error loading reviews.</p>`;
        });
}

function renderStarsReview(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Повні зірочки
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fa-solid fa-star"></i>';
    }
    
    // Половина зірочки
    if (hasHalfStar) {
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    return stars;
}

function formatDateLong(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// ---------------------------
// TABS FUNCTIONALITY
// ---------------------------
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// ---------------------------
// INITIALIZATION
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Чекаємо на ініціалізацію LanguageManager
    const waitForLanguageManager = () => {
        return new Promise((resolve) => {
            const checkManager = () => {
                if (window.languageManager && window.languageManager.isInitialized) {
                    resolve(true);
                } else {
                    setTimeout(checkManager, 100);
                }
            };
            checkManager();
        });
    };

    // Ініціалізація сторінки продукту
    async function initializePage() {
        await waitForLanguageManager();
        console.log('✅ LanguageManager ready, loading product data...');
        
        // Завантажуємо продукти
        await loadProductsData();
        
        // Налаштовуємо таби
        setupTabs();
        
        // Завантажуємо відгуки (якщо є ID продукту)
        const params = new URLSearchParams(window.location.search);
        const productId = Number(params.get("id"));
        if (productId) {
            loadProductReviews(productId);
        }
    }

    initializePage();
    
    // Додаємо обробник зміни мови
    window.addEventListener('languageChanged', function(e) {
        console.log('🌍 Language changed on product page, updating...');
        updateProductTranslations();
    });
});

// Глобальна функція для оновлення контенту продукту
window.updateProductContent = function(lang) {
    console.log('🔄 Global updateProductContent called with lang:', lang);
    updateProductTranslations();
};