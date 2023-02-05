import icons from 'url:../../img/icons.svg'; // Parcel 2 for all static file add 'url:'
// without destructuring must use Fraction.Fraction.add(), with {destructuring} use Fraction.add()
import fracty from 'fracty';
import View from './view.js';
// import { state } from '../model.js';

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'We could not find your recipe. Please try again.';
  _message = 'Success';

  addHandlerRender(handler) {
    /*
    Must have load event, because if you copy a link and put it in the browser nothing will happen since hash has not changed.
    */
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();

      const btn = e.target.closest('.btn--tiny');
      if (!btn || !btn.classList.contains('btn--increase-servings')) return;
      const newServingNumber = +btn.dataset.action;
      if (newServingNumber > 0) handler(newServingNumber);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    // MUST USE .JOIN() BECAUE MAP() WILL RETURN AN ARRAY OF STRINGS, WE NEED STREENGS NOT AN ARRAY.
    // prettier-ignore
    return `
        <figure class="recipe__fig">
        <img src="${this._recipe.image}" alt="${
      this._recipe.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._recipe.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings" data-action="${
              +this._recipe.servings - 1
            }">
                <svg>
                <use href="${icons}#icon-minus-circle" ></use>
                </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-action="${
              +this._recipe.servings + 1
            }">
                <svg>
                <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        ${ this._recipe.key ?
          `
          <div class="recipe__user-generated">  
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          `
          :
          ''
          }
            
        <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._recipe.bookmarked ? '-fill' : ''}">
            </use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._recipe.ingredients.map(ing => {
                return `
                  <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${
                      ing.quantity ? fracty(ing.quantity).toString() : ''
                    }
                    </div>
                    <div class="recipe__description">
                      <span class="recipe__unit">${ing.unit}</span>
                      ${ing.description}
                    </div>
                  </li>`;
                }).join(' ')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
        `;
  }
}

export default new RecipeView();
