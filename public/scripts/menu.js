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

let basket = {}; // basket objekt til at gemme produkterne

function displayProducts() { //viser produkterne på siden
    const productContainer = document.getElementById("product-list");

    productContainer.innerHTML = "";

    productList.forEach((product) => { //for hvert produkt i produktlisten element
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        const img = document.createElement("img"); 
        img.src = product.imgsrc;
        img.alt = product.productName;

        const productName = document.createElement("h3");
        productName.innerText = product.productName;

        const productPrice = document.createElement("p");
        productPrice.innerText = `Price: ${product.price.toFixed(2)} kr.`;

        const quantityInput = document.createElement("input"); //input felt til at indtaste antal
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
                fetchProductIdAndAddToBasket(product.productName, product.price, quantity); // her tilføjes produktet til kurven med navn, pris og antal
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


function addToBasket(productName, price, quantity, productId) { //funktion til at tilføje produkter til kurven
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



// funktion til at beregne den samlede pris for produkterne i kurven
function calculateTotal() {
    let total = 0;
    console.log("Basket Contents:");
    for (let item in basket) {
        console.log(`${item}: x ${basket[item].quantity}, Price per unit = ${basket[item].price.toFixed(2)} kr`);
        total += basket[item].price * basket[item].quantity;
    }
    console.log(`Total Price: ${total.toFixed(2)} kr`); // Total pris for produkterne i kurven
}

// funktion til at vise indholdet af kurven
function displayBasket() {
    const basketContainer = document.getElementById("basket-details");
    basketContainer.innerHTML = "";
    let total = 0;

    const basketTitle = document.createElement("h2");
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
// funktion til at hente produkterne fra databasen og vise dem på siden
displayProducts();

function fetchAndDisplayProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(productList => {
            displayProducts(productList); // produktlisten gives som argument til displayProducts funktionen
        })
        .catch(err => console.error("Error fetching products:", err));
}

async function fetchUserData() {
    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            credentials: 'include', //cookie sendes med i requesten
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data: HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('User data from server:', data.user);
        return data.user; 
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null;
    }
}

function submitOrder() { //funktion til at placere en ordre
    fetchUserData().then(user => {
        if (!user) {
            alert("User not logged in! Cannot place an order.");
            return;
        }

        const orderItems = Object.keys(basket).map(productName => {
            const product = basket[productName];
            return { productId: product.productId, quantity: product.quantity, price: product.price };
        });

        const totalPrice = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const location = document.getElementById('location').value;
        const timeOffset = parseInt(document.getElementById('time').value, 10);

        //udregner afhentningstidspunktet baseret på nuværrende tidspunkt og brugerens valgte tid
        const pickupTime = new Date();
        pickupTime.setMinutes(pickupTime.getMinutes() + timeOffset);
        const danishTime = new Intl.DateTimeFormat('da-DK', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'Europe/Copenhagen',
        }).format(pickupTime);

        const orderData = { //order data sendes til serveren
            orderItems,
            totalPrice,
            location,
            pickupTime: pickupTime.toISOString(), // sendes i ISO format
        };

        console.log(`Pickup Time (Danish Time): ${danishTime}`);

        fetch('/api/place-order', { //api endpoint til at placere en ordre
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Order placed successfully:", data);
                alert(`Order placed successfully! Order ID: ${data.orderId}\nPickup Time: ${danishTime}`);
            })
            .catch(err => {
                console.error("Error placing order:", err.message);
                alert("Error placing order. Please try again.");
            });
    });
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
