import Search from "./models/Search";
import Recipe from "./models/Recipe";
import ShoppingList from "./models/ShoppingList";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shoppingListView from "./views/shoppingListView";
import * as likesView from "./views/likesView";
import {
  elements,
  elementsString,
  renderLoader,
  clearLoader,
} from "./views/base";

/**
 * todo - Search Object;
 * todo - Current recipe object;
 * todo - Shopping list object
 * todo - Liked recipes
 */
const STATE = {};
window.STATE = STATE; // ! Testing

/** =================================================
 * todo *********** SEARCH CONTROLLER **************
 ===================================================*/
const controlSearch = async () => {
  // *1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // *2) New search object and add to state
    STATE.search = new Search(query);

    // *3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // *4) Search for recipes
      await STATE.search.getResult();

      // *5) Render result on ui
      clearLoader();
      searchView.renderResults(STATE.search.result);
    } catch (error) {
      clearLoader();
      alert("Something wrong with the search..");
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

// * Pagination button
elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  const goToPage = parseInt(btn.dataset.goto, 10);
  searchView.clearResults();
  searchView.renderResults(STATE.search.result, goToPage);
  //console.log(goToPage);
});

/** ================================================
 * todo *********** RECIPE CONTROLLER **************
 ==================================================*/
const controlRecipe = async () => {
  // get id from data
  const id = window.location.hash.replace("#", "");
  console.log(id); // ! testing

  if (id) {
    // * create new recipe object
    STATE.recipe = new Recipe(id);

    // * highlight selected search item
    if (STATE.search) searchView.highlightSelected(id);

    // * prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    try {
      // * get recipe data
      await STATE.recipe.getRecipe();
      STATE.recipe.parseIngredients();

      // * calculate servings and time
      STATE.recipe.calcTime();
      STATE.recipe.calcServings();

      // * Render recipe
      //console.log(STATE.recipe); // ! Testing
      clearLoader();
      recipeView.renderRecipe(STATE.recipe, STATE.likes.isLiked(id));
    } catch (error) {
      alert("Error processing recipe");
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
// * with load el data don't disappear after refresh
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/** =======================================================
 * todo *********** SHOPPING LIST CONTROLLER **************
 =========================================================*/
//window.l = new ShoppingList(); // ! testing
const controlShoppingList = () => {
  // * Create a new list if there is none yet
  if (!STATE.shoppingList) STATE.shoppingList = new ShoppingList();

  // * Add each ingredient to the list and UI
  STATE.recipe.ingredients.forEach((el) => {
    const item = STATE.shoppingList.addItem(el.count, el.unit, el.ingredient);
    shoppingListView.renderItem(item);
  });
};

/** ===============================================
 * todo *********** LIKES CONTROLLER **************
 =================================================*/
const controlLike = () => {
  if (!STATE.likes) STATE.likes = new Likes();
  const currentID = STATE.recipe.id;

  // User has NOT yet liked current recipe
  if (!STATE.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = STATE.likes.addLike(
      currentID,
      STATE.recipe.title,
      STATE.recipe.author,
      STATE.recipe.img
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    // User HAS liked current recipe
  } else {
    // Remove like from the state
    STATE.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(STATE.likes.getNumLikes());
};

// * RESTORE LIKES RECIPE ON PAGE LOAD
window, addEventListener('load', () => {
  STATE.likes = new Likes();

  // restores likes
  STATE.likes.readStorage();
  // toggle the like menu button
  likesView.toggleLikeMenu(STATE.likes.getNumLikes());
  // Render the existing like
  STATE.likes.likes.forEach(like => likesView.renderLike(like));
});

// =================================================
// todo *** Handle delete and update list item  ***
// =================================================
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete item
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // * Delete from STATE
    STATE.shoppingList.deleteItem(id);

    // * Delete from UI
    shoppingListView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    // * Handle the count update
    const val = parseFloat(e.target.value);
    STATE.shoppingList.updateCount(id, val);
  }
});

// =====================================================================
// todo *** Handle recipe btn click (Servings, shopping list, liked) ***
// =====================================================================
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // * Decrease btn is clicked
    if (STATE.recipe.servings > 1) {
      STATE.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(STATE.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // * increase btn is click
    STATE.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(STATE.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // * Add Ingredient to Shopping list
    controlShoppingList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // * like controller
    controlLike();
  }
});