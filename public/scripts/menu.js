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

        // Add image and product name to the product card
        productItem.appendChild(img);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);

        // Add the product card to the container
        productContainer.appendChild(productItem);
    });
}

// Call the function to display the products on the page
displayProducts();
