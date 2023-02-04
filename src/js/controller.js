// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../img/icons.svg'; // Parcel 2 for all static file add 'url:'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Model, state } from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/BookmarksView.js';
import AddRecipeView from './views/AddRecipeView.js';
import { MODAL_CLOSE_SECONDS, MODAL_ERROR_SECONDS } from './config';

const recipeContainer = document.querySelector('.recipe');

// BLOCK RENDER RECIPES

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    RecipeView.renderSpinner();

    await Model.loadRecipe(id);
    const { recipe } = state;

    // .updateRecipe is a bad name. the function is generic fucntion to update DOM
    BookmarksView.updateRecipe(state.bookmarks);

    ResultsView.updateRecipe(Model.getSearchResultsPage());

    RecipeView.render(recipe);
  } catch (err) {
    RecipeView.renderError(`🚨${err}`);
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    const query = SearchView.getQuery();
    if (!query) return;

    state.search.page = 1;

    await Model.loadSearchResults(query);
    if (state.search.results.length === 0) {
      ResultsView.renderError();
    } else {
      ResultsView.render(Model.getSearchResultsPage());
      PaginationView.paginationRender(state.search);
    }
  } catch (err) {
    SearchView.renderError(`🚨${err}`);
  }
};

const controlPagination = function (page) {
  ResultsView.render(Model.getSearchResultsPage(page));
  PaginationView.paginationRender(state.search);
};

const controlServings = async function (newServings) {
  // Update the recipe servings (state)
  Model.updateServings(newServings);
  // Update the recipe view
  try {
    const { recipe } = state;
    RecipeView.updateRecipe(recipe);
  } catch (err) {
    RecipeView.renderError(`🚨${err}`);
  }
};

const controlAddBookmark = async function () {
  if (state.recipe.bookmarked) Model.deleteBookmark(state.recipe.id);
  else Model.addBookmark(state.recipe);
  RecipeView.updateRecipe(state.recipe);
  // BookmarksView.renderBookmarks(state.bookmarks);
  BookmarksView.render(state.bookmarks);
};

const controlBookmark = function () {
  Model.init();
  BookmarksView.render(state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await Model.uploadRecipe(newRecipe);
    AddRecipeView.renderMessage('Success');
    BookmarksView.render(state.bookmarks);
    RecipeView.render(state.recipe);
    // ResultsView.updateRecipe(Model.getSearchResultsPage());
    // Change ID from url.
    // Changes url without reloading (state, title, url)
    window.history.pushState(null, '', `#${state.recipe.id}`);

    setTimeout(() => {
      AddRecipeView.toggleWindow();
      AddRecipeView.generateMarkup();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    AddRecipeView.renderError(
      (message = `Error while uploading new recipe: ${err}`)
    );

    setTimeout(
      () => AddRecipeView.generateMarkup(),
      MODAL_ERROR_SECONDS * 1000
    );
  }
};

const init = function () {
  BookmarksView.addHandlerRender(controlBookmark);
  PaginationView.addHandlerPagination(controlPagination);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  AddRecipeView.addHandlerUpload(controlAddRecipe);

  // HASHCHANGE and LOAD event listeners
  RecipeView.addHandlerRender(controlRecipes);
  SearchView.addHandlerSearch(controlSearchResults);
};

init();

/* 
PLANNING.

User story:
1) Search for recipes.
2) Update number of servings.
3) Bookmark recipes.
4) Create recipes.
5) See bookmarks and my recipes.

Features:
1) Search:
  - search field
  - search results async
  - display results with pagination
  - rerender page buttons after user clicks on one
  - select recipe
  - load recipe async
2) Button to update servings.
3) Bookmarking.
4) Upload recipes and bookmark automatically. User can see only his recipes.
5) Store bookmarked data in the browser local storage.
*/
