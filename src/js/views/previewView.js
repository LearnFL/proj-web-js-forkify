import icons from 'url:../../img/icons.svg'; // Parcel 2 for all static file add 'url:'
import View from './view.js';
import { state } from '../model.js';

class PreviewView extends View {
  _parentElement = '';
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    //prettier-ignore

    return `
        <li class="preview">
            <a class="preview__link preview__link${
              id === this._recipe.id ? '--active' : ''
            }" href="#${this._recipe.id}">
              <figure class="preview__fig">
                <img src="${this._recipe.image}" alt="${this._recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._recipe.title}</h4>
                <p class="preview__publisher">${this._recipe.publisher}</p>
              </div>  

              <div class="preview__user-generated ${
                this._recipe.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
              
            </a>
        </li>
    `;
  }
}

export default new PreviewView();
