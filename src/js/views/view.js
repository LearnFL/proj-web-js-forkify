import icons from 'url:../../img/icons.svg'; // Parcel 2 for all static file add 'url:'

export default class View {
  _recipe;

  /**
   * Render the received object to the DOM
   * @param {object | object[]} data The data to be rendered
   * @param {boolean} [render=true] if false, create markup string insted of rendering to the DOM
   * @returns {undefines | string} A markup string is returned if render =false
   * @this {object} View instance object
   * @author Dennis Rotnov
   * @todo Finish implementation
   */
  render(recipe, render = true) {
    if (!recipe || (Array.isArray(recipe) && recipe.length === 0))
      return this.renderError();

    this._recipe = recipe;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  updateRecipe(data) {
    // if (!data || data.length === 0) return;
    this._recipe = data;
    const newMarkup = this._generateMarkup();
    // New DOM node object
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Convert to arrays
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentEl.querySelectorAll('*'));

    // Compare elements
    newElements.forEach((newEl, index) => {
      const curEl = currentElements[index];
      // Element is an element, child is what contains text
      // nodeValue is true is content is text otherwise it is null
      // Trim white space
      // Also must replace attributes on buttons that contain servings info
      // Update text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  // Spinner place holder when loading recipe
  renderSpinner() {
    this._clear();

    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> `;

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
            <svg>
                <use href="${icons}/icons.svg#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;

    this._clear();
    // this._parentEl;
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}/#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  _clearSearchResults() {
    this._parentEl.innerHTML = '';
  }
}
