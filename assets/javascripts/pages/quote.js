$(function () {
    var modalShare = $('#modal-share');
    $('.btn-share').on('click', function (e) {
        e.preventDefault();
        const title = $(this).data('title');
        const author = $(this).data('author');
        const url = $(this).data('url');

        modalShare.find('.quote-title').text(title);
        modalShare.find('.quote-author').text(author);

        modalShare.find('.btn-facebook').attr('href', `https://www.facebook.com/sharer/sharer.php?u=${url}`);
        modalShare.find('.btn-twitter').attr('href', `https://twitter.com/intent/tweet?text=${title}&url=${url}`);
        modalShare.find('.btn-linkedin').attr('href', `https://www.linkedin.com/shareArticle?mini=true&url=${url}title=${title}&summary=${title}&source=${url}`);
        modalShare.find('.btn-email').attr('href', `mailto:?subject=Awesome Quote&body=${title}`);
        modalShare.modal({
            backdrop: 'static',
            keyboard: false
        });
    })
});
