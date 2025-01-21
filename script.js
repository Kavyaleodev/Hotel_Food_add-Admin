let allFoodItems = []; // Store all food items globally

// Fetch food items from the server and display them in card format
async function loadFoodItems() {
    try {
        const response = await fetch("/api/foods");
        allFoodItems = await response.json(); // Store the fetched items
        displayFoodItems(allFoodItems);
    } catch (error) {
        console.error("Error loading food items:", error);
        const container = document.getElementById("food-container");
        container.innerHTML = "<p>Error loading food items. Please try again later.</p>";
    }
}

// Display food items in the container
// Function to redirect to the order page with food name and price
function orderNow(foodName, price) {
    window.location.href = `order.html?foodName=${encodeURIComponent(foodName)}&price=${price}`;
}

// Display food items with updated "Order Now" button
function displayFoodItems(foodItems) {
    const container = document.getElementById("food-container");
    container.innerHTML = foodItems.map(item => {
        return `
            <div class="food-card">
                <h3>${item.food_name}</h3>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Price:</strong> $${item.price}</p>
                <p><strong>Description:</strong> ${item.description || "No description available."}</p>
                ${item.image ? `<img src="${item.image}" alt="${item.food_name}" class="food-image">` : ""}
                <button onclick="orderNow('${item.food_name}', ${item.price})">Order Now</button>
            </div>
        `;
    }).join("");
}

// Filter food items based on search query and selected category
function filterFoodItems() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value.toLowerCase();
    
    const filteredItems = allFoodItems.filter(item => 
        // Match the search query with the beginning of food name (case insensitive)
        item.food_name.toLowerCase().startsWith(searchQuery) &&
        // Match the selected category
        (selectedCategory === "" || item.category.toLowerCase() === selectedCategory)
    );
    
    // Display the filtered items
    displayFoodItems(filteredItems);
}

// Initialize the page by loading all food items
loadFoodItems();
