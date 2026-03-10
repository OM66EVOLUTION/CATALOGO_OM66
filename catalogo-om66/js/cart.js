// Variable global para almacenar el carrito
let cart = [];

// Elementos del DOM
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const modal = document.getElementById('cart-modal');
const closeButton = document.querySelector('.close-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Evento para abrir la modal
cartIcon.addEventListener('click', () => {
    renderCart();
    modal.style.display = 'block';
});

// Evento para cerrar la modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar la modal haciendo click fuera de ella
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Evento para agregar producto
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        // Aseguramos que la tarjeta es el elemento padre correcto
        const card = e.target.closest('.producto-card'); 
        
        // Obtenemos los datos de los atributos data-* del HTML
        const productId = card.getAttribute('data-id');
        const productName = card.getAttribute('data-nombre');
        const productPrice = parseFloat(card.getAttribute('data-precio'));

        addItemToCart(productId, productName, productPrice);
    });
});

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 */
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartCount();
    alert(`"${name}" agregado al carrito.`);
}

/**
 * Actualiza el número de productos en el ícono del carrito.
 */
function updateCartCount() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalCount;
}

/**
 * Renderiza la lista de productos dentro de la modal del carrito.
 */
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Limpia la lista
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li>El carrito está vacío.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            const subtotal = item.price * item.quantity;
            total += subtotal;

            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${subtotal.toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(li);
        });
    }

    cartTotalElement.textContent = total.toFixed(2);
}

/**
 * Crea el mensaje de WhatsApp con el resumen de la compra.
 */
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos para iniciar la compra.');
        return;
    }

    const phone = '529991287457'; // Tu número de WhatsApp (el que está en el footer)
    let message = `¡Hola! Me gustaría hacer un pedido con los siguientes productos:\n\n`;
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `* ${item.name} (${item.quantity} x $${item.price.toFixed(2)}) = $${subtotal.toFixed(2)}\n`;
    });

    message += `\n*TOTAL ESTIMADO: $${total.toFixed(2)}*\n\n`;
    message += 'Por favor, confírmenme la disponibilidad y el total final, incluyendo el envío. ¡Gracias!';

    // Codifica el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abre WhatsApp Web o la aplicación
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
});

// Inicializa el contador del carrito
updateCartCount();