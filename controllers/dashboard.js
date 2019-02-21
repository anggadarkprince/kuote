const fs = require('fs');
const path = require('path');

const getIndex = (req, res, next) => {
    res.render('dashboard/index', {
        title: 'Dashboard',
    });
};

module.exports = {
    getIndex: getIndex,
};