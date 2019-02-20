const fs = require('fs');
const path = require('path');

const getIndex = (req, res, next) => {
    res.render('home/index', {
        title: 'Home',
    });
};

const getQuoteOfTheDay = (req, res, next) => {
    res.render('home/featured', {
        title: 'Quote of the day',
    });
};

const getMostPopular = (req, res, next) => {
    res.render('home/popular', {
        title: 'Most popular',
    });
};

const getQuoteByCategory = (req, res, next) => {
    res.render('home/category', {
        title: 'Category',
    });
};

module.exports = {
    getIndex: getIndex,
    getQuoteOfTheDay: getQuoteOfTheDay,
    getMostPopular: getMostPopular,
    getQuoteByCategory: getQuoteByCategory,
};