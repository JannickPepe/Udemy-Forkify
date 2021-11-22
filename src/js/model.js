// live connection between export and import
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';   
import { AJAX } from './helpers.js';

// construct a state which can contain the recipe object values and search (storing data). 
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1, // set page number to deafult
        resultsPerPage: RES_PER_PAGE, // Have the value in config.js
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    // have the destructured recipe to have the data branch values + hook the state onto recipe
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url, // this is for the selected recipe
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }), 
    };
}

export const loadRecipe = async function(id) {
    // make a try catch for error handling and hook the data into it
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`) // it wont work without the /
        state.recipe = createRecipeObject(data);

        // with some method we check if its true of false
        if(state.bookmarks.some(bookmark => bookmark.id === id))
        state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log(state.recipe);
    } catch (err) {
        // Tempoary error handling from helpers getJSON
        console.error(`${err} 🌓🌓🌓`);
        throw err;
    } 
};

export const loadSearchResults = async function(query) {
    try {
        // take the state object onto search and query to set it as query object 
        state.search.query = query;

        // the object data will get the values from getJSON promise and the query with the state search values
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data);

        // map over these values from the recipes data data branch and return given values
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url, // this is for the searched recipe
                ...(rec.key && { key: rec.key }), 
            };
        });
        state.search.page = 1; // set the searh page to one if doing another search etc
    } catch (err) {
        console.error(`${err} 🌓🌓🌓`);
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start =  (page -1) * state.search.resultsPerPage; // 0;
    const end = page * state.search.resultsPerPage; // 9;

    // we want the search array function slice to give us result from 1 to 10 in the index
    return state.search.results.slice(start, end);
};

// this function will reach into the state of recipe ingredients to change the quantity in each ingre
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        //newQ = oldQ * newServings / oldServings // 2 * 8/4 = 4
    });

    // make newServings with the values from state
    state.recipe.servings = newServings;
};

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    // Add bookMark 
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = function(id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Unmark current recipe as bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    // JSON parse = convert string back to object and stringyfy otherway around
    if(storage) state.bookmarks = JSON.parse(storage);

};
init();

const clearBookmarks = function() {
    localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function(newRecipe) {
    try {
    const ingredients = Object.entries(newRecipe)
    // sort out only the ingredient data we want where 0 is the key and 1 is the value for the entry
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map( ing => { 
        // construc ingArr where we take the ing values cuz of [1] and remove any white space and seperate with , 
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());


        if(ingArr.length !== 3)
            throw new Error(
                'Wrong ingredient format! Please use a correct format :)'
            );

        // construc array list with 3 values 
        const [quantity, unit, description] = ingArr;
        // if there is a quantity convert it to a number with + if no quantity set it to null 
        return { quantity: quantity ? +quantity : null, unit, description};
    });

    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image, // Change? - this is for the bookmarked
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime, // convert to number
        servings: +newRecipe.servings, // convert to number
        ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    } catch(err){
        throw err;
    }   

    
};