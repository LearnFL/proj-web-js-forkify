import { API_URL, RES_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers.js';

export let state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export class Model {
  static async loadRecipe(id) {
    try {
      const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

      state.recipe = this.createRecipeObject(data);

      if (state.bookmarks.some(bookmark => bookmark.id === id)) {
        state.recipe.bookmarked = true;
      } else state.recipe.bookmarked = false;
    } catch (err) {
      throw err;
    }
  }

  static async loadSearchResults(query) {
    try {
      state.search.query = query;
      const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
      state.search.results = data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && { key: rec.key }),
        };
      });
    } catch (err) {
      throw err;
    }
  }

  static getSearchResultsPage(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
  }

  static updateServings(newServings) {
    if (!newServings) return;
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
  }

  static persistBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  }

  static addBookmark(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    this.persistBookmarks();
  }

  static deleteBookmark(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    this.persistBookmarks();
  }

  static init() {
    const storage = localStorage.getItem('bookmarks');
    // Convert back to object
    if (storage) {
      state.bookmarks = JSON.parse(storage);
    }
  }
  static clearBookmarks() {
    localStorage.clear('bookmarks');
  }

  static createRecipeObject(data) {
    const { recipe } = data.data;
    return (state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      // Conditionaly add property to a an object
      ...(recipe.key && { key: recipe.key }),
    });
  }

  static async uploadRecipe(data) {
    // Use map to create an object
    // Filter will return multiple arrays [key, value]

    try {
      const ingredients = Object.entries(data)
        .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
        .map(ing => {
          // remove spaces, introduces bugs as it removes space between multiple words
          // const ingArr = ing[1].trim().replaceAll(' ', '').split(',');
          const ingArr = ing[1].split(',').map(el => el.trim());

          if (ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient fromat! Please use the correct format :)'
            );

          const [quantity, unit, description] = ingArr;
          return {
            quantity: quantity ? +quantity : null,
            unit: unit,
            description: description,
          };
        });

      const recipe = {
        title: data.title,
        source_url: data.sourceUrl,
        image_url: data.image,
        publisher: data.publisher,
        cooking_time: +data.cookingTime,
        servings: +data.servings,
        ingredients,
      };

      const newRecipe = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
      state.recipe = this.createRecipeObject(newRecipe);
      this.addBookmark(state.recipe);
    } catch (err) {
      throw err;
    }
  }
}
