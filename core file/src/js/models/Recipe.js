import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      // ! console.log(res);

    } catch (error) {
      console.log(error);
      alert('Something went wrong :(')
    }
  }

  calcTime() {
    // * assuming that we need 15 minutes for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitShort, 'kg', 'g']

    const newIngredients = this.ingredients.map(el => {
      // * Uniform units
      let ingredient = el.toLowerCase();
      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      // * Remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // * Parse ingredients into count, unit, ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };

      } else if (unitIndex === -1) {
        // There is no unit and NO number in 1st element
        objIng = {
          count: 1,
          unit: '',
          ingredient: ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  };

  updateServings(type) {
    // * Update Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // * Update Ingredients
    this.ingredients.forEach(ing => {
      //ing.count = ing.count * (newServings / this.servings);
      ing.count *= (newServings / this.servings);
    })

    this.servings = newServings;
  }
}