document.getElementById('food-add-form').addEventListener('submit', function(event){
    event.preventDefault();

    const food_name = document.getElementById('food_name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    console.table(
        [
            {Field : 'Food Name', Value : food_name},
            {Field : 'Category', Value : category},
            {Field : 'Price', Value : price},
            {Field : 'Description', Value : description},
        ]
    );

    alert('New Food is Added');
});