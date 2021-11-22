import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

// child class of view
class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet, however find a recipe and bookmark it';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return this._data
        .map(bookmark => previewView.render(bookmark, false))
        .join(''); // set the render parameter to false
    }
};

export default new BookmarksView();