// ==========================
// Samparyá Bloom Cart Manager
// ==========================

/* 
   JS FOR SAMPARYA BLOOM
   Author: Sophia Casey M. ong
   Section: WD - 202
   Date: OCTOBER 19, 2025
*/

const cartManager = {
    cart: [],

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('samparyaCart');
        this.cart = saved ? JSON.parse(saved) : [];
        this.updateCartDisplay();
    },

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('samparyaCart', JSON.stringify(this.cart));
    },

    // Add an item
    addItem(item) {
        const existing = this.cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            this.cart.push({ ...item, quantity: item.quantity || 1 });
        }
        this.saveCart();
        this.updateCartDisplay();
        this.showToast(`${item.name} added to cart!`);
    },

    // Remove an item
    removeItem(id) {
        this.cart = this.cart.filter(i => i.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    },

    // Change quantity
    changeQuantity(id, change) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) this.removeItem(id);
            else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    },

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    // Calculate shipping (free for ₱6000+)
    calculateShipping(subtotal) {
        return subtotal >= 6000 ? 0 : 150;
    },

    // Update entire cart display
    updateCartDisplay() {
        const emptyCart = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        const list = document.getElementById('cartItemsList');

        if (!list) return;

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartWithItems.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartWithItems.style.display = 'block';

        list.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <div class="item-header">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p>${item.description || ''}</p>
                        </div>
                        <div class="item-price">₱${(item.price * item.quantity).toLocaleString('en-PH')}</div>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cartManager.changeQuantity(${item.id}, -1)">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.changeQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="cartManager.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateSummary();
    },

    // Update subtotal, shipping, tax, and total
    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping(subtotal);
        const tax = subtotal * 0.12;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `₱${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `₱${shipping.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        document.getElementById('tax').textContent = `₱${tax.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
        document.getElementById('total').textContent = `₱${total.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    },

    // Proceed to checkout
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty. Add items first!');
            return;
        }
        const summary = {
            cart: this.cart,
            subtotal: this.calculateSubtotal(),
            shipping: this.calculateShipping(this.calculateSubtotal()),
            tax: this.calculateSubtotal() * 0.12,
            total: this.calculateSubtotal() + this.calculateShipping(this.calculateSubtotal()) + this.calculateSubtotal() * 0.12
        };
        localStorage.setItem('checkoutSummary', JSON.stringify(summary));
        window.location.href = 'checkout.html';
    },

    // Show toast message
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = '#8b2e3e';
        toast.style.color = 'white';
        toast.style.padding = '10px 18px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(toast);
        requestAnimationFrame(() => (toast.style.opacity = '1'));
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cartManager.loadCart();
});

