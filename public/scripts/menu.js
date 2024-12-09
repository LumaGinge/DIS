// Product data
const productList = [
    {
        productName: "Turkey",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251542/tcmfzr4uchvzfqkmhspc.png",
        price: 75.00
    },
    {
        productName: "JOE's Club",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251348/yfrhnotuvxtrxdqtp2uh.png",
        price: 75.00
    },
    {
        productName: "Serrano",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251349/sv18ngadtqvspyx8thgg.png",
        price: 75.00
    },
    {
        productName: "Tunacado",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251349/f4tx0ebqyorf0sdfwgez.png",
        price: 75.00
    },
    {
        productName: "Tunacado",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251349/f4tx0ebqyorf0sdfwgez.png",
        price: 75.00
    },
    {
        productName: "Americano",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251799/ehwbv5me6c8x5ui9yjb5.png",
        price: 36.00
    },
    {
        productName: "Latte",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251798/o36km7nmdasewogiqby7.png",
        price: 55.00
    },
    {
        productName: "Cappuccino",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251799/gcokdg58mqqdjebvibpv.png",
        price: 49.00
    },
    {
        productName: "Iced Latte",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251799/khpiz58iehs33qy3rmtf.png",
        price: 55.00
    },
    {
        productName: "Espresso",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731251846/lza6wa3pz1pqxabus0ev.png",
        price: 30.00
    },
    {
        productName: "Power Shake",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731252529/ulussiugkzsoufowpwtu.png",
        price: 65.00
    },
    {
        productName: "Pick Me up",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731252529/tpip8swfipxcwwxhg5rm.png",
        price: 65.00
    },
    {
        productName: "Green Tonic",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731252530/a76cogivnaezmnoejqrb.png",
        price: 65.00
    },
    {
        productName: "Go Away DOC",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731252530/k56vdyrdgren5q2wgadl.png",
        price: 65.00
    },
    {
        productName: "Sports Juice",
        imgsrc: "https://res.cloudinary.com/dlmwcu9am/image/upload/v1731252530/x3rgljnc5tmn0uzu7znz.png",
        price: 65.00
    },

];

let basket = {}; // Store added products

function displayProducts() {
    const productContainer = document.getElementById("product-list");

    productContainer.innerHTML = ""; // Clear previous content

    productList.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        const img = document.createElement("img");
        img.src = product.imgsrc;
        img.alt = product.productName;

        const productName = document.createElement("h3");
        productName.innerText = product.productName;

        const productPrice = document.createElement("p");
        productPrice.innerText = `Price: ${product.price.toFixed(2)} kr.`;

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.max = 10;
        quantityInput.classList.add("quantity-input");

        const addButton = document.createElement("button");
        addButton.innerText = "Add";
        addButton.classList.add("add-button");
        addButton.addEventListener("click", () => {
            const quantity = parseInt(quantityInput.value, 10);
            if (quantity >= 1 && quantity <= 10) {
                fetchProductIdAndAddToBasket(product.productName, product.price, quantity); // Dynamically fetch `product_id`
            } else {
                alert("Please enter a quantity between 1 and 10.");
            }
        });        

        productItem.appendChild(img);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);
        productItem.appendChild(quantityInput);
        productItem.appendChild(addButton);

        productContainer.appendChild(productItem);
    });
}


function addToBasket(productName, price, quantity, productId) {
    if (basket[productName]) {
        basket[productName].quantity += quantity;
        if (basket[productName].quantity > 10) {
            basket[productName].quantity = 10;
            alert(`${productName} quantity limited to 10.`);
        }
    } else {
        basket[productName] = { quantity, price, productId }; // Store productId
    }

    calculateTotal();
    displayBasket();
}



// Function to calculate and display the total price of the basket
function calculateTotal() {
    let total = 0;
    console.log("Basket Contents:");
    for (let item in basket) {
        console.log(`${item}: x ${basket[item].quantity}, Price per unit = ${basket[item].price.toFixed(2)} kr`);
        total += basket[item].price * basket[item].quantity;
    }
    console.log(`Total Price: ${total.toFixed(2)} kr`); // Display the total price in the console
}

// Function to display the basket contents on the html page
function displayBasket() {
    const basketContainer = document.getElementById("basket-details");
    basketContainer.innerHTML = "";  // Clear previous contents
    let total = 0;

    const basketTitle = document.createElement("h2"); // Create a title for the basket
    basketTitle.textContent = "Basket Contents";
    basketContainer.appendChild(basketTitle); 

    for (let item in basket) {
        const basketEntry = document.createElement("p");
        basketEntry.textContent = `${basket[item].quantity} x ${item} ${basket[item].price.toFixed(2)} kr`;
        basketContainer.appendChild(basketEntry);
        total += basket[item].price * basket[item].quantity;
    }

    const totalDisplay = document.createElement("p");
    totalDisplay.textContent = `Total Price: ${total.toFixed(2)} kr`;
    basketContainer.appendChild(totalDisplay);
}
// Call the function to display the products on the page
displayProducts();

function fetchAndDisplayProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(productList => {
            displayProducts(productList); // Pass the fetched data to displayProducts
        })
        .catch(err => console.error("Error fetching products:", err));
}

function getUserIdFromCookie() {
    console.log("Current cookies:", document.cookie); // Debug log for cookies
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(cookie => cookie.startsWith('user='));
    if (!userCookie) {
        console.error("User cookie not found!");
        return null;
    }

    try {
        const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        console.log("Parsed user cookie:", user); // Debug log for parsed user
        return user.id; // Replace with the correct key for the user ID
    } catch (err) {
        console.error("Error parsing user cookie:", err.message);
        return null;
    }
}



function submitOrder() {
    const userId = getUserIdFromCookie(); // Fetch the userId dynamically
    if (!userId) {
        alert("User not logged in! Cannot place an order.");
        return;
    }

    const orderItems = Object.keys(basket).map(productName => {
        const product = basket[productName];
        return { productId: product.productId, quantity: product.quantity, price: product.price };
    });

    const totalPrice = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Debugging logs
    console.log("Order items being sent:", orderItems);
    console.log("Total Price:", totalPrice);
    console.log("Submitting order for userId:", userId);

    fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: orderItems, totalPrice }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Order saved:", data);
        alert(`Order saved successfully! Order ID: ${data.orderId}`);
    })
    .catch(err => console.error("Error saving order:", err.message));
}



function fetchProductIdAndAddToBasket(productName, price, quantity) {
    fetch(`/api/products?name=${encodeURIComponent(productName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch product ID for ${productName}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.product_id) {
                addToBasket(productName, price, quantity, data.product_id); // Add to basket with `product_id`
            } else {
                alert(`Product ID not found for ${productName}`);
            }
        })
        .catch(err => console.error("Error fetching product ID:", err.message));
}
