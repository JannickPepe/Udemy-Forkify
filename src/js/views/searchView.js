class SearchView {
    // private parentEl has now the class search values
    _parentEl = document.querySelector('.search');

    getQuery() {
        // return values where the class search aka parentEl is taking values from the child class search field
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    };

    // make addHandlerSearch method with handler object values and now it can be placed in controller.js at const init
    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }
};

export default new SearchView();