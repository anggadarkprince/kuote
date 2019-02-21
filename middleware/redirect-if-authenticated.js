module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        console.log('hello', req.session.isLoggedIn);
        return res.redirect('/dashboard');
    }
    next();
}