import io from 'socket.io-client';
import showAlert from "../components/alert";

$(function () {
    $('[data-role="tags"]').tagsinput({
        onTagExists: function (item, $tag) {
        },
    });

    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });

    const socket = io();
    socket.on('new-quote', function (msg) {
        showAlert('Quote of the day', msg);
    });
});
