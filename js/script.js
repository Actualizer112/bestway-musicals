// BESTWAY MUSICALS SHOPPING CART

// Load saved cart items from the browser.
let cart = [];

try {
    cart = JSON.parse(
        localStorage.getItem("bestwayCart")
    ) || [];
} catch (error) {
    cart = [];
}

// Format prices in Nigerian Naira.
function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

// Save cart items in the browser.
function saveCart() {
    localStorage.setItem(
        "bestwayCart",
        JSON.stringify(cart)
    );
}

// Add a product to the cart.
function addToCart(productName, price) {

    let product = cart.find(
        item => item.name === productName
    );

    if (product) {
        product.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    renderCart();

    alert(productName + " added to your cart!");
}

// Display the shopping cart.
function renderCart() {

    const cartItems = document.getElementById(
        "cart-items"
    );

    const cartCount = document.getElementById(
        "cart-count"
    );

    const cartTotal = document.getElementById(
        "cart-total"
    );

    if (!cartItems || !cartCount || !cartTotal) {
        return;
    }

    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    cartCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>Your shopping cart is empty.</p>";

        return;
    }

    cartItems.innerHTML = cart.map(
        (item, index) => `

        <div class="cart-item">

            <div>
                <h4>${item.name}</h4>

                <p>
                    Price:
                    ${formatPrice(item.price)}
                </p>

                <p>
                    Subtotal:
                    ${formatPrice(
                        item.price * item.quantity
                    )}
                </p>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>
            </div>

            <button
                class="remove-button"
                onclick="removeItem(${index})">
                Remove
            </button>

        </div>

        `
    ).join("");
}

// Increase or decrease product quantity.
function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
}

// Remove a product completely.
function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
    renderCart();
}

// Empty the entire shopping cart.
function clearCart() {

    if (cart.length === 0) {
        alert("Your shopping cart is already empty.");
        return;
    }

    if (confirm("Are you sure you want to clear your cart?")) {

        cart = [];

        saveCart();
        renderCart();
    }
}

// Display saved cart items when the page opens.
renderCart();
// ======================================
// PRODUCT SEARCH AND CATEGORY FILTERING
// ======================================

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

function filterProducts() {

const searchTerm = searchInput.value
    .trim()
    .toLowerCase();

const selectedCategory = categoryFilter.value;

const productCards = document.querySelectorAll(
    "#products .product-card"
);

let visibleProducts = 0;

productCards.forEach(function(card) {

    const productName = card
        .querySelector("h3")
        .textContent
        .toLowerCase();

    const productCategory = card.dataset.category;

    const matchesSearch = productName.includes(searchTerm);

    const matchesCategory =
        selectedCategory === "all" ||
        productCategory === selectedCategory;

    if (matchesSearch && matchesCategory) {

        card.style.display = "";

        visibleProducts++;

    } else {

        card.style.display = "none";

    }

});

const noProducts = document.getElementById("no-products");

noProducts.hidden = visibleProducts > 0;

}

// Search as the customer types.
searchInput.addEventListener("input", filterProducts);

// Filter when a category is selected.
categoryFilter.addEventListener("change", filterProducts);

// ====================================
// BESTWAY MUSICALS CHECKOUT
// ====================================

// Replace this placeholder with the
// store's actual WhatsApp number.
// Use international format without +
// or spaces. Example: 2348012345678.

const STORE_WHATSAPP = "2348131686919";


// Update the checkout summary.

function updateCheckoutSummary() {

    const countElement =
        document.getElementById("checkout-count");

    const totalElement =
        document.getElementById("checkout-total");

    if (!countElement || !totalElement) {
        return;
    }

    let quantity = 0;
    let total = 0;

    cart.forEach(function(item) {

        quantity += item.quantity;

        total += item.price * item.quantity;

    });

    countElement.textContent = quantity;

    totalElement.textContent = formatPrice(total);

}


// Prepare the WhatsApp order.

const checkoutForm =
    document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const messageElement =
                document.getElementById("checkout-message");

            // Check whether the cart is empty.

            if (cart.length === 0) {

                messageElement.textContent =
                    "Your shopping cart is empty. Please add a product first.";

                return;

            }

            // Check the store's WhatsApp number.

            if (!/^\d{10,15}$/.test(STORE_WHATSAPP)) {

                messageElement.textContent =
                    "The store's WhatsApp number has not been configured yet.";

                return;

            }

            // Get customer information.

            const customerName =
                document.getElementById("customer-name")
                .value.trim();

            const customerPhone =
                document.getElementById("customer-phone")
                .value.trim();

            const customerAddress =
                document.getElementById("customer-address")
                .value.trim();

            const deliveryMethod =
                document.getElementById("delivery-method")
                .value;

            // Prepare the product list.

            let orderTotal = 0;

            let orderDetails = "";

            cart.forEach(function(item, index) {

                const subtotal =
                    item.price * item.quantity;

                orderTotal += subtotal;

                orderDetails +=
                    (index + 1) + ". " +
                    item.name + "\n" +
                    "   Quantity: " + item.quantity + "\n" +
                    "   Subtotal: " +
                    formatPrice(subtotal) + "\n\n";

            });

            // Build the WhatsApp message.

            const message =
                "NEW ORDER - BESTWAY MUSICALS\n\n" +

                "Customer: " + customerName + "\n" +

                "Phone: " + customerPhone + "\n" +

                "Address: " + customerAddress + "\n" +

                "Delivery: " + deliveryMethod + "\n\n" +

                "ORDER DETAILS\n\n" +

                orderDetails +

                "ORDER TOTAL: " +
                formatPrice(orderTotal) + "\n\n" +

                "Please confirm product availability " +
                "and delivery charges.";

            // Create the WhatsApp link.

            const whatsappURL =
                "https://wa.me/" +
                STORE_WHATSAPP +
                "?text=" +
                encodeURIComponent(message);

            // Show the order preparation message.

            messageElement.textContent =
                "Your order is ready. WhatsApp will open so you can review and send it to the store.";

            // Open WhatsApp.

            window.open(whatsappURL, "_blank");

        }
    );

}


// Update the checkout summary when the page loads.

updateCheckoutSummary();


// Keep the checkout summary updated whenever
// the shopping cart changes.

const originalRenderCart = renderCart;

renderCart = function() {

    originalRenderCart();

    updateCheckoutSummary();

};
// PRODUCT DETAILS FEATURE
const productDescriptions = {
"Keyboard": "Explore this keyboard for music practice, live performance, worship sessions and music production.",
"Acoustic Guitar": "A versatile acoustic guitar for practice, songwriting, performances and musical enjoyment.",
"Drum Set": "A drum set for musicians who want to build rhythm and perform with a band or music group.",
"Professional Microphone": "A microphone option for singing, presentations, recording and sound reinforcement."
};

function viewProductDetails(name, price) {
const modal = document.getElementById("product-modal");

document.getElementById("detail-name").textContent = name;
document.getElementById("detail-price").textContent =
"₦" + Number(price).toLocaleString("en-NG");

document.getElementById("detail-description").textContent =
productDescriptions[name] ||
"Contact BESTWAY MUSICALS for more information about this product.";

document.getElementById("detail-add-to-cart").onclick = function () {
addToCart(name, Number(price));
closeProductDetails();
};

modal.style.display = "flex";
}

function closeProductDetails() {
document.getElementById("product-modal").style.display = "none";
}

document.getElementById("product-modal").addEventListener("click", function (event) {
if (event.target === this) {
closeProductDetails();
}
});
