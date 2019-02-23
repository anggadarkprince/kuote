const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const Session = require('./models/session');
const User = require('./models/user');
const Quote = require('./models/quote');
const QuoteTag = require('./models/quote-tag');
const Tag = require('./models/tag');

const errorController = require('./controllers/error');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const quoteRoutes = require('./routes/quote');
const authMiddleware = require('./middleware/must-authenticated');
const db = require('./utils/database');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = `./uploads/quotes/${(new Date()).getFullYear()}/${(new Date()).getMonth()}`;
        fs.mkdir(dir, {recursive: true}, err => callback(err, dir));
    },
    filename: (req, file, callback) => {
        callback(null, (new Date()).getTime() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].find(mime => mime === file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {'flags': 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({destination: 'images', storage: fileStorage, fileFilter: fileFilter}).single('featured'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'uploads', 'quotes')));

var SequelizeStore = require('connect-session-sequelize')(session.Store);
app.use(session({
    secret: 'secret-session-key',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: db,
        table: 'session'
    }),
}));
app.use(flash());

const csrfProtection = csrf({sessionKey: 'session'});
app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.userId) {
        return next();
    }
    User.findByPk(req.session.userId)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(console.log);
});

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals._path = req.path;
    res.locals._flashSuccess = req.flash('success');
    res.locals._flashError = req.flash('error');
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use(homeRoutes);
app.use(authRoutes);
app.use(authMiddleware, dashboardRoutes);
app.use('/quotes', quoteRoutes);
app.use(errorController.get404);

Quote.belongsToMany(Tag, {through: QuoteTag});

db.sync({force: false})
    .then(result => {
        app.listen(process.env.PORT || 8080);
    })
    .catch(console.log);