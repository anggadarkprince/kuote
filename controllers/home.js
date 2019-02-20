const fs = require('fs');
const path = require('path');

const getIndex = (req, res, next) => {
    res.render('home/index', {
        title: 'Home',
    });
};

module.exports = {
    getIndex: getIndex,
};