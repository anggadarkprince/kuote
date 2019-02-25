const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const methodOverride = require('method-override');
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
const QuoteLike = require('./models/quote-like');
const QuoteComment = require('./models/quote-comment');

const errorController = require('./controllers/error');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const quoteRoutes = require('./routes/quote');
const db = require('./utils/database');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dir = path.join(__dirname, 'uploads', 'quotes', (new Date()).getFullYear().toString(), ((new Date()).getMonth() + 1).toString());
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
};

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {'flags': 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(multer({destination: 'images', storage: fileStorage, fileFilter: fileFilter}).single('featured'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SequelizeStore = require('connect-session-sequelize')(session.Store);
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
            res.locals.loggedUser = user;
            next();
        })
        .catch(console.log);
});

app.use((req, res, next) => {
    Tag.findAll({
        attributes: {
            include: [
                'tag.*',
                [
                    db.literal('(SELECT COUNT(*) FROM quote_tags WHERE quote_tags.tag_id = tag.id)'),
                    'total_quotes'
                ],
            ]
        },
        group: [db.col('tag.id')],
        order: [
            [db.literal('total_quotes'), 'DESC']
        ],
        limit: 8
    })
        .then(tags => {
            res.locals.popularTags = tags;
            next();
        })
        .catch(console.log);
});

app.use((req, res, next) => {
    console.log(req.get('host'));
    res.locals.baseUrl = `${req.protocol}://${req.get('host')}`;
    res.locals.csrfToken = req.csrfToken();
    res.locals._path = req.path;
    res.locals._flashSuccess = req.flash('success');
    res.locals._flashWarning = req.flash('warning');
    res.locals._flashError = req.flash('error');
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use('/quotes', quoteRoutes);
app.use(homeRoutes);
app.use(authRoutes);
app.use(errorController.get404);

Tag.hasMany(QuoteTag);
Quote.belongsToMany(Tag, {through: QuoteTag});
Quote.hasMany(QuoteLike);
Quote.hasMany(QuoteComment);
Quote.belongsTo(User);
User.hasMany(Quote);

db.sync({force: false})
    .then(result => {
        app.listen(process.env.PORT || 8080);
    })
    .catch(console.log);