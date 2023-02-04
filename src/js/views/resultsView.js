import View from './view.js';
import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes were found, try a new query!';
  _message = 'Success';

  _generateMarkup() {
    return this._recipe
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
