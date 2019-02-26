$(function () {
    $('[data-role="tags"]').tagsinput({
        onTagExists: function(item, $tag) {
        },
    });

    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });
});
