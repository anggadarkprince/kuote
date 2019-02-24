window.$ = window.jQuery = require('jquery');

require('jquery-validation');

require('typeahead/style.css');
require('bootstrap4-tagsinput-douglasanpa/tagsinput.js');
require('bootstrap4-tagsinput-douglasanpa/tagsinput.css');

require('./scripts/validation');
require('./scripts/custom-upload-button');
require('./scripts/one-touch-submit');
require('./scripts/miscellaneous');

require('../sass/styles.scss');

if ($('.btn-delete').length) {
    import("./components/delete").then(modalDelete => modalDelete.default());
}