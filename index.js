const express = require('express')
const pgp = require('pg-promise')();
const local = 'postgres://postgres:juanesse@123@localhost:5432/shoe_catalogue';
const bodyParser = require('body-parser')
const cors = require('cors')
const handlebars = require('express-handlebars')
const session = require('express-session')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const ShoesDb = require('./sql/shoesDb.js')
const ShoesFe = require('./app.js')
const Routes = require('./routes/routes.js')
const AdminRoutes = require('./routes/admin-routes.js')
const Auth = require('./controllers/auth')
const ShoeApi = require('./api/shoes-api')

const connectionString = process.env.DATABASE_URL || local

const config = {
    connectionString,
    max: 20,
    ssl: {
        rejectUnauthorized: false
    }
}
const db = pgp(config)
// server port number
const app = express()
dotenv.config()
const shoesFe = ShoesFe()
const shoesDb = ShoesDb(db)

const auth = Auth(shoesDb)
const shoeApi = ShoeApi(shoesDb)

const routes = Routes(shoesDb, shoesFe)
const adminRoutes = AdminRoutes(shoesDb, shoesFe)

app.use(flash())
app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
    layoutsDir: `./views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main',
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'good',
    resave: false,
    saveUninitialized: false,
}))

// Admin page handlers
app.get('/admin', adminRoutes.getAdmin)
app.get('/admin/:name', adminRoutes.userDetailsAdmin)

// Handlebar Handlers
app.get('/', routes.home)
app.get('/shop', routes.getShoes)
// get shoe and details of shoe
app.get('/shoe/:id', routes.viewShoe)

// admin insert updating shoe
app.post('/admin/add-shoe', routes.postShoeDb)

app.post('/add-to-cart/:id', routes.addToCart)
app.post('/add-to-cart/shoe/:id', routes.addToCartTwo)
app.post('/add-to-cart-three/shoe/:id', routes.addToCartThree)
app.post('/minus-from-cart/:id', routes.removeFromCart)
app.get('/checkout', routes.getCheckout)

app.get('/checkout/:name', routes.payment)
app.get('/signup', routes.getSignup)
app.post('/signup', routes.postSignup)

app.get('/signin', routes.getSignin)
app.post('/signin', routes.postSignin)

app.get('/cart', routes.getCart)

app.post("/shoes/search", routes.search)
app.post('/logout', routes.logout)

// AUTHENTICATION
app.post('/api/auth/signup', auth.register)
app.post('/api/auth/signin', auth.login)
app.post('/api/auth/signout', auth.logout)
// ALL SHOES
app.get('/api/shoes', shoeApi.allShoes)
// UPLOAD NEW SHOE
app.post('/api/shoes/add-shoe', shoeApi.addShoe)
// SHOE BY ID
app.get('/api/shoe/:id', shoeApi.shoe)
// SHOE BY NAME
app.get('/api/shoes/name/:name', shoeApi.getName)
// SHOE BY BRANDNAME
app.get('/api/shoes/brand/:brandname', shoeApi.getBrand)
// SHOE BY  SHOE SIZE
app.get('/api/shoes/size/:size', shoeApi.getSize)
// SHOE BY BRANDNAME & SHOE SIZE
app.get('/api/shoes/brand/:brandname/size/:size', shoeApi.getBrandSize)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('Your app is running on port: ', port)
})