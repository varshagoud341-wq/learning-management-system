/* =========================================
   LEARNHUB - MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   HELPER FUNCTIONS
   ========================================= */

// Get data from localStorage
function getData(key, defaultValue) {
    const data = localStorage.getItem(key);

    if (data) {
        return JSON.parse(data);
    }

    return defaultValue;
}

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Format price
function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}


/* =========================================
   REGISTRATION
   ========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms = document.getElementById("terms").checked;
        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        if (!terms) {

            message.textContent =
                "Please accept the Terms and Conditions.";

            message.style.color = "red";
            return;
        }

        const user = {
            name: name,
            email: email,
            phone: phone,
            password: password
        };

        saveData("learnhubUser", user);

        message.textContent =
            "Registration successful! Redirecting to login...";

        message.style.color = "green";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    });
}


/* =========================================
   LOGIN
   ========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        const user = getData("learnhubUser", null);

        if (!user) {

            message.textContent =
                "No account found. Please register first.";

            message.style.color = "red";
            return;
        }

        if (email === user.email && password === user.password) {

            localStorage.setItem("isLoggedIn", "true");

            message.textContent =
                "Login successful! Redirecting...";

            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {

            message.textContent =
                "Invalid email or password.";

            message.style.color = "red";
        }
    });
}


/* =========================================
   COURSE SEARCH
   ========================================= */

const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("courseSearch");

if (searchButton && searchInput) {

    searchButton.addEventListener("click", function () {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const courseCards =
            document.querySelectorAll(".course-card");

        courseCards.forEach(function (card) {

            const title =
                card.querySelector("h3").textContent.toLowerCase();

            const description =
                card.querySelector("p").textContent.toLowerCase();

            if (
                title.includes(searchText) ||
                description.includes(searchText)
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}


/* =========================================
   CATEGORY FILTER
   ========================================= */

const categoryButtons =
    document.querySelectorAll(".category-btn");

const courseCards =
    document.querySelectorAll(".course-card");

if (categoryButtons.length > 0) {

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            categoryButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const selectedCategory =
                button.getAttribute("data-category");

            courseCards.forEach(function (card) {

                const cardCategory =
                    card.getAttribute("data-category");

                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}


/* =========================================
   CART
   ========================================= */

let cart = getData("learnhubCart", []);


/* Add course to cart */

const addCartButtons =
    document.querySelectorAll(".add-cart-btn");

addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const courseName =
            button.getAttribute("data-course");

        const price =
            Number(button.getAttribute("data-price"));

        const existingCourse =
            cart.find(function (course) {
                return course.name === courseName;
            });

        if (existingCourse) {

            alert("This course is already in your cart.");
            return;
        }

        cart.push({
            name: courseName,
            price: price
        });

        saveData("learnhubCart", cart);

        alert("Course added to cart!");

        updateCartCount();
    });
});


/* Update cart count */

function updateCartCount() {

    const cartCountElements =
        document.querySelectorAll(".cart-count");

    cartCountElements.forEach(function (element) {
        element.textContent = cart.length;
    });
}

updateCartCount();


/* =========================================
   DISPLAY CART
   ========================================= */

const cartItemsContainer =
    document.getElementById("cartItems");

if (cartItemsContainer) {

    displayCart();
}


function displayCart() {

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <h2>Your cart is empty</h2>
                <p>Add some courses to start learning.</p>
                <a href="courses.html" class="btn primary-btn">
                    Browse Courses
                </a>
            </div>
        `;

        updateCartSummary();
        return;
    }

    cartItemsContainer.innerHTML = "";

    cart.forEach(function (course, index) {

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <div class="cart-item-info">
                <h3>${course.name}</h3>

                <p>Online Learning Course</p>

                <p class="cart-item-price">
                    ${formatPrice(course.price)}
                </p>

                <button
                    class="remove-cart-btn"
                    onclick="removeFromCart(${index})">
                    Remove
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(item);
    });

    updateCartSummary();
}


/* Remove course */

function removeFromCart(index) {

    cart.splice(index, 1);

    saveData("learnhubCart", cart);

    displayCart();

    updateCartCount();
}


/* =========================================
   CART SUMMARY
   ========================================= */

function updateCartSummary() {

    const countElement =
        document.getElementById("cartCount");

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const discountElement =
        document.getElementById("cartDiscount");

    const totalElement =
        document.getElementById("cartTotal");

    let subtotal = 0;

    cart.forEach(function (course) {
        subtotal += Number(course.price);
    });

    const discount = subtotal * 0.10;

    const total = subtotal - discount;

    if (countElement) {
        countElement.textContent = cart.length;
    }

    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }

    if (discountElement) {
        discountElement.textContent =
            formatPrice(discount);
    }

    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }
}


/* =========================================
   BUY NOW
   ========================================= */

const buyNowButton =
    document.getElementById("buyNowBtn");

if (buyNowButton) {

    buyNowButton.addEventListener("click", function () {

        const courseName =
            document
                .getElementById("addToCartBtn")
                .getAttribute("data-course");

        const price =
            Number(
                document
                    .getElementById("addToCartBtn")
                    .getAttribute("data-price")
            );

        const existingCourse =
            cart.find(function (course) {
                return course.name === courseName;
            });

        if (!existingCourse) {

            cart.push({
                name: courseName,
                price: price
            });

            saveData("learnhubCart", cart);
        }

        window.location.href = "checkout.html";
    });
}


/* =========================================
   CHECKOUT
   ========================================= */

const checkoutForm =
    document.getElementById("checkoutForm");

if (checkoutForm) {

    displayCheckoutSummary();

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {

            const message =
                document.getElementById("checkoutMessage");

            message.textContent =
                "Your cart is empty.";

            message.style.color = "red";

            return;
        }

        const checkoutData = {

            name:
                document.getElementById("checkoutName").value,

            email:
                document.getElementById("checkoutEmail").value,

            phone:
                document.getElementById("checkoutPhone").value,

            address:
                document.getElementById("address").value,

            city:
                document.getElementById("city").value,

            state:
                document.getElementById("state").value,

            pincode:
                document.getElementById("pincode").value,

            paymentMethod:
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                ).value
        };

        saveData("learnhubCheckout", checkoutData);

        window.location.href = "payment.html";
    });
}


function displayCheckoutSummary() {

    const itemsElement =
        document.getElementById("checkoutItems");

    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const discountElement =
        document.getElementById("checkoutDiscount");

    const taxElement =
        document.getElementById("checkoutTax");

    const totalElement =
        document.getElementById("checkoutTotal");

    if (!itemsElement) {
        return;
    }

    let subtotal = 0;

    itemsElement.innerHTML = "";

    cart.forEach(function (course) {

        subtotal += Number(course.price);

        const item = document.createElement("p");

        item.textContent =
            course.name + " - " + formatPrice(course.price);

        itemsElement.appendChild(item);
    });

    const discount = subtotal * 0.10;

    const afterDiscount = subtotal - discount;

    const tax = afterDiscount * 0.05;

    const total = afterDiscount + tax;

    subtotalElement.textContent =
        formatPrice(subtotal);

    discountElement.textContent =
        formatPrice(discount);

    taxElement.textContent =
        formatPrice(tax);

    totalElement.textContent =
        formatPrice(total);
}


/* =========================================
   PAYMENT
   ========================================= */

const paymentForm =
    document.getElementById("paymentForm");

if (paymentForm) {

    displayPaymentSummary();

    paymentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message =
            document.getElementById("paymentMessage");

        message.textContent =
            "Processing demo payment...";

        message.style.color = "green";

        /*
           This is only a demo payment.
           No real payment is processed.
        */

        setTimeout(function () {

            const orderId =
                "LH" + Date.now();

            saveData("learnhubOrderId", orderId);

            saveData("learnhubPaymentStatus", "Successful");

            saveData("learnhubEnrolledCourses", cart);

            // Clear cart
            localStorage.removeItem("learnhubCart");

            cart = [];

            window.location.href =
                "payment-success.html";

        }, 1500);
    });
}


function displayPaymentSummary() {

    const itemsElement =
        document.getElementById("paymentItems");

    const subtotalElement =
        document.getElementById("paymentSubtotal");

    const discountElement =
        document.getElementById("paymentDiscount");

    const taxElement =
        document.getElementById("paymentTax");

    const totalElement =
        document.getElementById("paymentTotal");

    if (!itemsElement) {
        return;
    }

    let subtotal = 0;

    itemsElement.innerHTML = "";

    cart.forEach(function (course) {

        subtotal += Number(course.price);

        const item = document.createElement("p");

        item.textContent =
            course.name + " - " + formatPrice(course.price);

        itemsElement.appendChild(item);
    });

    const discount = subtotal * 0.10;

    const afterDiscount = subtotal - discount;

    const tax = afterDiscount * 0.05;

    const total = afterDiscount + tax;

    subtotalElement.textContent =
        formatPrice(subtotal);

    discountElement.textContent =
        formatPrice(discount);

    taxElement.textContent =
        formatPrice(tax);

    totalElement.textContent =
        formatPrice(total);
}


/* =========================================
   PAYMENT SUCCESS
   ========================================= */

const orderIdElement =
    document.getElementById("orderId");

if (orderIdElement) {

    const orderId =
        localStorage.getItem("learnhubOrderId");

    if (orderId) {
        orderIdElement.textContent = orderId;
    }
}


/* =========================================
   PROFILE
   ========================================= */

const profileForm =
    document.getElementById("profileForm");

if (profileForm) {

    loadProfile();

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const profile = {

            name:
                document.getElementById("profileName").value,

            email:
                document.getElementById("profileEmail").value,

            phone:
                document.getElementById("profilePhone").value,

            dateOfBirth:
                document.getElementById("dateOfBirth").value,

            gender:
                document.getElementById("gender").value,

            bio:
                document.getElementById("profileBio").value
        };

        saveData("learnhubProfile", profile);

        document.getElementById("profileMessage").textContent =
            "Profile saved successfully!";

        document.getElementById("profileMessage").style.color =
            "green";

        loadProfile();
    });
}


function loadProfile() {

    const user =
        getData("learnhubUser", null);

    const profile =
        getData("learnhubProfile", {});

    const name =
        profile.name || (user ? user.name : "");

    const email =
        profile.email || (user ? user.email : "");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const dateOfBirth =
        document.getElementById("dateOfBirth");

    const gender =
        document.getElementById("gender");

    const profileBio =
        document.getElementById("profileBio");

    if (profileName) {
        profileName.value = name;
    }

    if (profileEmail) {
        profileEmail.value = email;
    }

    if (profilePhone) {
        profilePhone.value =
            profile.phone || (user ? user.phone : "");
    }

    if (dateOfBirth) {
        dateOfBirth.value =
            profile.dateOfBirth || "";
    }

    if (gender) {
        gender.value =
            profile.gender || "";
    }

    if (profileBio) {
        profileBio.value =
            profile.bio || "";
    }

    const displayName =
        document.getElementById("profileDisplayName");

    const displayEmail =
        document.getElementById("profileDisplayEmail");

    if (displayName) {
        displayName.textContent =
            name || "Student";
    }

    if (displayEmail) {
        displayEmail.textContent =
            email || "student@example.com";
    }
}


/* =========================================
   LOGOUT
   ========================================= */

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("isLoggedIn");

        alert("You have been logged out.");

        window.location.href = "login.html";
    });
}


/* =========================================
   FAQ
   ========================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const faqItem =
            question.parentElement;

        faqItem.classList.toggle("active");

        const icon =
            question.querySelector(".faq-icon");

        if (faqItem.classList.contains("active")) {

            icon.textContent = "−";

        } else {

            icon.textContent = "+";
        }
    });
});


/* =========================================
   CONTACT FORM
   ========================================= */

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message =
            document.getElementById("contactFormMessage");

        message.textContent =
            "Thank you! Your message has been submitted.";

        message.style.color = "green";

        contactForm.reset();
    });
}


/* =========================================
   DASHBOARD DATA
   ========================================= */

const totalCoursesElement =
    document.getElementById("totalCourses");

if (totalCoursesElement) {

    const enrolledCourses =
        getData("learnhubEnrolledCourses", []);

    totalCoursesElement.textContent =
        enrolledCourses.length;
}


/* =========================================
   PREVENT CHECKOUT WITH EMPTY CART
   ========================================= */

const checkoutButton =
    document.getElementById("checkoutBtn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", function (event) {

        if (cart.length === 0) {

            event.preventDefault();

            alert(
                "Your cart is empty. Please add a course first."
            );
        }
    });
}


/* =========================================
   WISHLIST
   ========================================= */

let wishlist =
    getData("learnhubWishlist", []);


/* Add course to wishlist */

const wishlistButton =
    document.getElementById("wishlistBtn");

if (wishlistButton) {

    wishlistButton.addEventListener("click", function () {

        const courseName =
            document
                .getElementById("addToCartBtn")
                .getAttribute("data-course");

        const price =
            Number(
                document
                    .getElementById("addToCartBtn")
                    .getAttribute("data-price")
            );

        const alreadySaved =
            wishlist.find(function (course) {
                return course.name === courseName;
            });

        if (alreadySaved) {

            alert("Course is already in your wishlist.");
            return;
        }

        wishlist.push({
            name: courseName,
            price: price
        });

        saveData("learnhubWishlist", wishlist);

        alert("Course added to wishlist!");
    });
}


/* =========================================
   CONSOLE MESSAGE
   ========================================= */

console.log(
    "LearnHub LMS JavaScript loaded successfully."
);