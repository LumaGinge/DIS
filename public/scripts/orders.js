function getUserIdFromCookie() {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(cookie => cookie.startsWith('user='));
    if (!userCookie) {
        console.error("User cookie not found!");
        return null;
    }

    try {
        const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        return user.id;
    } catch (err) {
        console.error("Error parsing user cookie:", err.message);
        return null;
    }
}

function fetchAndDisplayOrders(userId) {
    console.log("Fetching orders for userId:", userId);
    fetch(`/api/get-orders/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(orders => {
            displayOrders(orders); // Display the orders
        })
        .catch(err => console.error("Error fetching orders:", err.message));
}

function fetchAndDisplayOrdersForLoggedInUser() {
    const userId = getUserIdFromCookie(); // Dynamically fetch the logged-in user's ID
    if (!userId) {
        console.error("User not logged in! Cannot fetch orders.");
        return;
    }

    fetchAndDisplayOrders(userId);
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; // Clear previous content

    if (orders.length === 0) {
        ordersContainer.innerHTML = "<p>No orders found.</p>";
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");

        const orderHeader = document.createElement("h3");
        orderHeader.textContent = `Order ID: ${order.orderId}, Total Price: ${order.totalPrice.toFixed(2)} kr`;
        orderDiv.appendChild(orderHeader);

        const itemsList = document.createElement("ul");
        order.items.forEach(item => {
            const itemLi = document.createElement("li");
            itemLi.textContent = `Product ID: ${item.productId}, Quantity: ${item.quantity}, Price: ${item.price.toFixed(2)} kr, Total: ${item.total.toFixed(2)} kr`;
            itemsList.appendChild(itemLi);
        });

        orderDiv.appendChild(itemsList);
        ordersContainer.appendChild(orderDiv);
    });
}

// Fetch and display orders for the logged-in user
fetchAndDisplayOrdersForLoggedInUser();
