const recipes = [
      /*
      new Recipe(
        this.currentUserEmail,
        'A Recipe for Disaster',
        'This is simply a test',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg'
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg'
      ),
      new Recipe(
        this.currentUserEmail,
        'Magnificent Pizza',
        'Best pizza ever',
        'https://vignette2.wikia.nocookie.net/le-miiverse-resource/images/5/5d/Delicious_pizza_t2.jpg/revision/latest?cb=20141016025745'
      )
      
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        `<p>A filling and fresh dish. Topping with the homemade salsa is a must!</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptatibus ipsum debitis provident animi recusandae molestiae natus iure aspernatur, voluptate, explicabo nemo! Dignissimos laboriosam dolor accusantium suscipit excepturi commodi non?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quaerat odio possimus, nemo, natus commodi asperiores quam molestias architecto, est animi vero libero. Quia voluptatibus incidunt tempora cum sit distinctio.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quaerat odio possimus, nemo, natus commodi asperiores quam molestias architecto, est animi vero libero. Quia voluptatibus incidunt tempora cum sit distinctio.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quaerat odio possimus, nemo, natus commodi asperiores quam molestias architecto, est animi vero libero. Quia voluptatibus incidunt tempora cum sit distinctio.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quaerat odio possimus, nemo, natus commodi asperiores quam molestias architecto, est animi vero libero. Quia voluptatibus incidunt tempora cum sit distinctio.</p>`,
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Skillet Chicken and Quinoa with Fresh Salsa',
        'A filling and fresh dish. Topping with the homemade salsa is a must!',
        'http://images.media-allrecipes.com/userphotos/720x405/4535588.jpg',
        [new Ingredient('Chicken', 200), new Ingredient('Tomato', 4)]
      ),
      new Recipe(
        this.currentUserEmail,
        'Delicious Lasagna',
        'Test lasagna',
        'https://static01.nyt.com/images/2015/10/15/dining/15RECIPE20DIN/15RECIPE20DIN-articleLarge.jpg',
        [new Ingredient('Meat', 100), new Ingredient('Tomato', 7)]
      )*/
    ];