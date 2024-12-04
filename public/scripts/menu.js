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

// Function to display the products
function displayProducts() {
    const productContainer = document.getElementById("product-list");

    // Clear the container before adding new products
    productContainer.innerHTML = "";

    // Iterate through the product list and add each product to the DOM
    productList.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        // Image
        const img = document.createElement("img");
        img.src = product.imgsrc;  // Image source (adjust based on your structure)
        img.alt = product.productName;

        // Product name
        const productName = document.createElement("h3");
        productName.innerText = product.productName;


        // Product price
        const productPrice = document.createElement("p");
        productPrice.innerText = `Price: ${product.price.toFixed(2)} kr.`;

        // Quantity input
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = 1; // Default quantity
        quantityInput.min = 1; // Minimum quantity
        quantityInput.max = 10; // Maximum quantity
        quantityInput.classList.add("quantity-input");

        const addButton = document.createElement("button");
        addButton.innerText = "Add";
        addButton.classList.add("add-button");
        addButton.addEventListener("click", () => {
            const quantity = parseInt(quantityInput.value, 10);
            if (quantity >= 1 && quantity <= 10) {
                addToBasket(product.productName, product.price, quantity);
            } else {
                alert("Please enter a quantity between 1 and 10.");
            }
        });

        // Add image and product name to the product card
        productItem.appendChild(img);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);
        productItem.appendChild(quantityInput);
        productItem.appendChild(addButton);

        // Add the product card to the container
        productContainer.appendChild(productItem);
    });
}

// Function to add a product to the basket
function addToBasket(productName, price, quantity) {
    // Check if the product already exists in the basket
    if (basket[productName]) {
        basket[productName].quantity += quantity; // Update quantity
        if (basket[productName].quantity > 10) {
            basket[productName].quantity = 10; // Limit the quantity
            alert(`${productName} quantity limited to 10.`);
        }
    } else {
        basket[productName] = { quantity, price }; // Create a new entry if not exists
    }

    calculateTotal(); // Call to calculate and display the total
    displayBasket(); // Call to display the basket contents
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
