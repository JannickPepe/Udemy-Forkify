import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
    _data;

    /**
     * Render the recieved Object to DOM
     * @param {Object | Object[]} data the data to be rendered (e.g recipe)
     * @param {boolean} [render = true] If false, create Markup string instead of rendering to the DOM  
     * @returns {undefined | string} A Markup string is returned  if render = false
     * @this {Object} View instance
     */

    render(data, render = true) {
        // if there isnt data or isnt an array with empty data
        if(!data || (Array.isArray(data) && data.length === 0)) 
        return this.renderError();

        this._data = data;
        // having the first child - markup as an value too for AdjacentHTML
        const markup = this._generateMarkup(); // every view that are connected to the user interface needs to have this method

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {

        this._data = data;
        // create newMarkup
        const newMarkup = this._generateMarkup(); // every view that are connected to the user interface needs to have this method

        // create a newDOM where we can use it on the page as a new memerory DOM
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        // create newElements onto the values from newDOM who now selects everything from the query in Array List
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        // create curElement onto the _pareneltElement where everything is selecting in an Array List
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));

            // Updates changed text
            if(
                !newEl.isEqualNode(curEl) && 
                newEl.firstChild?.nodeValue.trim() !== '' // added optional chaining with ? because firstchild might not always exist
            )   {
                    //console.log('🎣', newEl.firstChild.nodeValue.trim());
                    curEl.textContent = newEl.textContent;
                }
            
            // Updates changed atrributes
            if (!newEl.isEqualNode(curEl)) 
            Array.from(newEl.attributes).forEach(attr => 
                curEl.setAttribute(attr.name, attr.value)
            );
        });
    }
    
    // this will be avalible for all the views as long they got a parentElement property
    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    //have the renderError method to have the private field errorMessage as value
    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}

