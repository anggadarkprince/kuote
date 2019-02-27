import showAlert from "../components/alert";

$(document).on('change', '.custom-file-input', function () {
    if (this.files && this.files[0]) {
        let maxFile = $(this).data('max-size');
        if (this.files[0].size > maxFile) {
            showAlert('File too large', `Maximum file must be less than ${maxFile / 1000000} MB`);
        } else {
            $(this).closest('.custom-file').find('.custom-file-label').text(this.files[0].name);
        }
    }
});