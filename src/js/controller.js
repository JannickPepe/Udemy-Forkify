import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable'; // pollyfilling everything else
import 'regenerator-runtime/runtime'; // pollyfilling a single await
import { async } from 'regenerator-runtime';

// coming from Parcel
//if (module.hot) {
//  module.hot.accept();
//}


const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Updates result view to marched selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    // the now imported recipeView is being rendered with the curtain hooked values
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};


const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage()); 

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch(err) {
    console.log(err); 
  }
};


//make the method controlPagination and have its funciton to have goToPage so it can be accepted in the handler
const controlPagination = function(goToPage) {
    // 1) Render NEW results
    //render overwrites the previously parentElement and add the new parentElement from the render method in View.js
    resultsView.render(model.getSearchResultsPage(goToPage)); 

    // 2) Render NEW initial pagination buttons
    paginationView.render(model.state.search);
};

// Make another eventhandler "controller"
const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // UPDATE the recipe view 
  //recipeView.render(model.state.recipe); // before refactor
  // update only updates text and attributes instead of render the state of entire view
  recipeView.update(model.state.recipe); 

};

const controlAddBookmark = function() {
  // 1) Addd/remove bookmark
  // First its not, with if 
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // Have the model object onto addBookmark with the values of state.recipe
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};


const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};


const controlAddRecipe = async function(newRecipe) {
  try {
    // Show a loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data and use await and async for the promise and if the promise gets rejected show this err msg catch blog
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    // Close form window
    setTimeout(function (){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000) // convert to miliseconds

  } catch(err) {
    console.error('🖖', err);
    addRecipeView.renderError(err.message);
  }
  
};


// take the file data from the different handlers in views folder
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  // now you can choose between different recipe
  recipeView.addHandlerRender(controlRecipes);

  //now you can either decrease or increase the servings amount
  recipeView.addHandlerUpdateServings(controlServings);

  // when we click at the selected element, we will now then add the bookmark 
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  // now you can enter search with the given string
  searchView.addHandlerSearch(controlSearchResults);

  // now you can call the fucntion addHandlerClick with the click event from pagiView.js
  paginationView.addHandlerClick(controlPagination);

  addRecipeView._addHandlerUpload(controlAddRecipe);
  
};
init();

