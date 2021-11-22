import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js';

// child class of view
class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was succesfully uploaded';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    // have this constructor method that will execute the this._addHandlers
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();

    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    // you can now use this. keyword with handlers with the current object for the toogleWindow method - when the btnOpen gets activated
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    // now you when you press the close X or click outside the window it will close
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    // make the upload by creating addEventListener on the uploadForm parentElement where we then will use "form data" API, whenever someone press submit
    _addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            // construct dataArr where we will create a new array that will contain the values from FormData / API calls happens in the controller.js
            const dataArr = [...new FormData(this)];
            // construct data where we will take the values with the method fromEntries and make the array into an object
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    _generateMarkup() {
        
    }
};

export default new AddRecipeView();