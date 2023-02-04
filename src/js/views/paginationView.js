import icons from 'url:../../img/icons.svg'; // Parcel 2 for all static file add 'url:'
import View from './view.js';
// import { state } from '../model.js'; // import * as model

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  paginationRender(data) {
    this._clearPagination();
    const markup = this._generateMarkup(data);
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup(data) {
    const numPages = Math.ceil(+data.results.length / data.resultsPerPage);
    const curPage = data.page;
    if (curPage === 1 && numPages > 1) {
      return `
            <button data-goto="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }

    if (curPage < numPages)
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }"class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;

    if (curPage > 1 && curPage === numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `;
    }

    // Only 1 page, return nothing.
    return '';
  }

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      this._clearPagination();
      handler(goToPage);
    });
  }

  _clearPagination() {
    this._parentEl.innerHTML = '';
  }
}

export default new PaginationView();
