const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');


const csrfProtection = csrf({sessionKey: 'session'});

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {'flags': 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret-session-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals._path = req.path;
    res.locals._flashSuccess = req.flash('success');
    res.locals._flashError = req.flash('error');
    next();
});

const errorController = require('./controllers/error');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

app.use(homeRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(errorController.get404);

const db = require('./utils/database');
db.sync({force: false})
    .then(result => {
        app.listen(process.env.PORT || 8080);
    })
    .catch(console.log);