// ============================
// Глобальні змінні
// ============================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// ============================
// Функції для роботи з кошиком
// ============================

// Збереження кошика в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    // Якщо ми на сторінці кошика, оновлюємо таблицю
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        renderCartItems();
    }
}

// Оновлення лічильника в шапці
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = cart.reduce((total, item) => total + 1, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
    
    // Оновлюємо видимість кошика на сторінці cart.html
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    
    if (cartEmpty && cartContent) {
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            cartContent.style.display = 'block';
        }
    }
}

// Додавання товару в кошик
function addToCart(productId, productName, productPrice, quantity) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
        });
    }
    
    saveCart();
}

// Видалення товару з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Оновлення кількості товару
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > 10) {
        newQuantity = 10;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
    }
}

// Збільшення кількості
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + 1;
        updateQuantity(productId, newQuantity);
    }
}

// Зменшення кількості
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity - 1;
        updateQuantity(productId, newQuantity);
    }
}

// Очищення кошика
function clearCart() {
    if (confirm('Ви впевнені, що хочете очистити кошик?')) {
        cart = [];
        saveCart();
    }
}

// Розрахунок загальної суми
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ============================
// Відображення кошика на cart.html
// ============================
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = item.price * item.quantity;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()} грн</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           min="1" max="10" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>${total.toLocaleString()} грн</td>
            <td>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        cartItems.appendChild(row);
    });
    
    cartTotal.textContent = calculateTotal().toLocaleString() + ' грн';
    
    // Додаємо обробники подій для кнопок в таблиці
    addCartItemEventListeners();
}

// Додавання обробників подій для елементів кошика
function addCartItemEventListeners() {
    // Кнопки видалення
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
    
    // Кнопки зменшення кількості
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            decreaseQuantity(productId);
        });
    });
    
    // Кнопки збільшення кількості
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            increaseQuantity(productId);
        });
    });
    
    // Поля введення кількості
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            const newQuantity = parseInt(this.value);
            
            if (newQuantity >= 1 && newQuantity <= 10) {
                updateQuantity(productId, newQuantity);
            } else {
                // Якщо значення поза діапазоном, повертаємо старе значення
                const item = cart.find(item => item.id === productId);
                if (item) {
                    this.value = item.quantity;
                }
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '' || parseInt(this.value) < 1) {
                this.value = 1;
                const productId = this.getAttribute('data-id');
                updateQuantity(productId, 1);
            }
        });
    });
}

// ============================
// Робота з модальними вікнами
// ============================

// Показати модальне вікно
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Приховати модальне вікно
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================
// Ініціалізація при завантаженні сторінки
// ============================
document.addEventListener('DOMContentLoaded', function() {
    // Оновлюємо лічильник кошика
    updateCartCount();
    
    // Якщо ми на сторінці кошика, відображаємо товари
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        renderCartItems();
        
        // Обробник очищення кошика
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        // Обробник оплати
        const checkoutBtn = document.getElementById('checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('Кошик порожній!');
                    return;
                }
                
                const checkoutTotal = document.getElementById('checkout-total');
                if (checkoutTotal) {
                    checkoutTotal.textContent = calculateTotal().toLocaleString();
                }
                showModal('checkoutModal');
            });
        }
        
        // Обробники модального вікна оплати
        const confirmCheckout = document.getElementById('confirmCheckout');
        if (confirmCheckout) {
            confirmCheckout.addEventListener('click', function() {
                alert('Дякуємо за покупку! Замовлення оформлено.');
                cart = [];
                saveCart();
                hideModal('checkoutModal');
            });
        }
        
        const cancelCheckout = document.getElementById('cancelCheckout');
        if (cancelCheckout) {
            cancelCheckout.addEventListener('click', function() {
                hideModal('checkoutModal');
            });
        }
    }
    
    // Обробники для головної сторінки
    if (window.location.pathname.includes('index.html') || !window.location.href.includes('cart.html')) {
        // Обробники кнопок "Додати в кошик"
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentProduct = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseInt(this.dataset.price)
                };
                
                // Скидання кількості на 1
                const quantityInput = document.getElementById('quantityInput');
                if (quantityInput) {
                    quantityInput.value = 1;
                }
                
                showModal('quantityModal');
            });
        });
        
        // Обробник кліку по іконці кошика в шапці
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                if (cart.length === 0) {
                    e.preventDefault();
                    showModal('emptyCartModal');
                }
            });
        }
        
        // Обробники модального вікна вибору кількості
        const quantityModal = document.getElementById('quantityModal');
        const closeQuantityModal = quantityModal?.querySelector('.close');
        
        if (closeQuantityModal) {
            closeQuantityModal.addEventListener('click', function() {
                hideModal('quantityModal');
            });
        }
        
        // Кнопки збільшення/зменшення кількості
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.getElementById('quantityInput');
        
        if (minusBtn && quantityInput) {
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        }
        
        if (plusBtn && quantityInput) {
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
            });
        }
        
        // Кнопка підтвердження додавання
        const confirmAddBtn = document.getElementById('confirmAdd');
        if (confirmAddBtn) {
            confirmAddBtn.addEventListener('click', function() {
                if (currentProduct) {
                    const quantity = parseInt(quantityInput.value);
                    addToCart(currentProduct.id, currentProduct.name, currentProduct.price, quantity);
                    hideModal('quantityModal');
                    showModal('confirmModal');
                }
            });
        }
        
        // Кнопка продовження покупок
        const continueShoppingBtn = document.getElementById('continueShopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                hideModal('confirmModal');
            });
        }
        
        // Обробники модального вікна порожнього кошика
        const closeEmptyCartBtn = document.getElementById('closeEmptyCart');
        if (closeEmptyCartBtn) {
            closeEmptyCartBtn.addEventListener('click', function() {
                hideModal('emptyCartModal');
            });
        }
        
        // Закриття модальних вікон при кліку поза контентом
        window.addEventListener('click', function(e) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    hideModal(modal.id);
                }
            });
        });
    }
});

// ============================
// Глобальні функції для використання в HTML
// ============================
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;