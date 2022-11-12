const moment = require('moment')
const FileReader = require('filereader')
const fs = require('fs');
const axios = require('axios')

const Routes = (shoesDb, shoesFE ) => {
    let cart = shoesFE.getCart()
    let cartTotal = 0
    // user from session
    let userCred = 'Sign in'
    // User route to details
    let routeState = 'hide'
    let adminNavState = 'hide'
    let homeRoute = '/'
    let userCredState = '/signin'
    // get all shoes

    const home = async (req, res, next) => {
        cart = shoesFE.getCart()
        let shoes = []
        await axios.get('https://dyani.herokuapp.com/api/shoes')
            .then((response) => {
            if(response?.data?.status === 'success'){
                shoes = response?.data?.shoes
            }
        })
        const displayMessage = 'Sorry, There is no Shoes in Shop'
        const success = req.flash()
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
            routeState = 'show'
        }
        let con = 'hide'
        if(!shoes){
            con = 'show'
        }
        const allShoes = shoes?.filter(elem => elem.in_stock >= 1)
        shoesFE.getCart()
        let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
        cartTotal = filterCart.length
        userCred = req.session.client ? req.session.client?.name : 'Sign in'

        res.render('homepage', {
            userCredState,
            adminNavState,
            userCredState,
            homeRoute,
            routeState,
            userCred,
            displayMessage,
            con,
            cart,
            cartLength: cartTotal,
            allShoes,
            message: success ? success.success : '',
            helpers: {
                inStock: (stock) => {
                    let result = 'out of stock'
                    if (stock >= 1) {
                        result = 'in stock'
                    }
                    return result
                }
            },
        })
}

    const getShoes = async (req, res, next) => {
            cart = shoesFE.getCart()
            let shoes = []
            await axios.get('https://dyani.herokuapp.com/api/shoes')
                .then((response) => {
                if(response?.data?.status === 'success'){
                    shoes = response?.data?.shoes
                }
            })
            const displayMessage = 'Sorry, There is no Shoes in Shop'
            const success = req.flash()
            userCred = req.session.client ? req.session.client?.name : 'Sign in'
            if(req.session.client){
                routeState = 'show'
                userCredState = '#'
                routeState = 'show'
            }
            let con = 'hide'
            if(!shoes){
                con = 'show'
            }
            const allShoes = shoes?.filter(elem => elem.in_stock >= 1)
            shoesFE.getCart()
            let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
            cartTotal = filterCart.length
            userCred = req.session.client ? req.session.client?.name : 'Sign in'
            const shoeBrands = shoes?.map(brand => brand.brand)
            const shoeSizes = shoes?.map(brand => brand.size)
            const brands = [...new Set(shoeBrands)]
            const sizes = [...new Set(shoeSizes)]
            res.render('home', {
                brands,
                sizes,
                userCredState,
                adminNavState,
                userCredState,
                homeRoute,
                routeState,
                userCred,
                displayMessage,
                con,
                cart,
                cartLength: cartTotal,
                allShoes,
                message: success ? success.success : '',
                helpers: {
                    inStock: (stock) => {
                        let result = 'out of stock'
                        if (stock >= 1) {
                            result = 'in stock'
                        }
                        return result
                    }
                },
            })
    }
    const viewShoe = async (req, res, next) => {
        const {id} = req.params
        let data = await axios
        .get(`https://dyani.herokuapp.com/api/shoe/${id}`)
        .then(res => res.data.shoe)
        const shoe = data
        let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
        cartTotal = filterCart.length
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
        }
        res.render('shoe', {
            userCredState,
            adminNavState,
            homeRoute,
            userCred,
            shoe,
            cartLength: cartTotal,
        })
        
    }
    const getSignup = async (req, res) => {
        const error = req.flash()
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
        }
        let message = ''
        if(error.error){
            message = error.error
        }else if(error.success){
            message = error.success
        }
        res.render('signup', {
            userCredState,
            adminNavState,
            homeRoute,
            routeState,
            userCred,
            cartLength: cartTotal,
            message,
        })
    }
    const postSignup = async (req, res) => {
        let { name, lastname, email, password } = req.body
        if(!name){
            req.flash("error", "Enter Name!")
            res.redirect('/signup')
        }
        else if(typeof name !== 'string'){
            req.flash("error", "Enter valid Name!")
            res.redirect('/signup')
        }
        else if(!email){
            req.flash("error", "Enter Email!")
            res.redirect('/signup')
        }
        else if(!lastname){
            req.flash("error", "Enter Last Name!")
            res.redirect('/signup')
        }
         else if(!password){
            req.flash("error", "Enter Password!")
            res.redirect('/signup')
        }
        else if(name && lastname && email && password){
            if(password.length < 8){
                req.flash("error", 'Password must be 8 characters of more!')
                res.redirect('/signup')
            }
            else if(name.length < 4){
                req.flash("error", 'Name must be 4 characters of more!')
                res.redirect('/signup')
            }
            else if(typeof name !== 'string'){
                req.flash("error", 'Enter correct name format!')
                res.redirect('/signup')
            }
            else{
                let emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                if(emailPattern.test(email)){
                    let user = await shoesDb.byEmail(email); 
                    if(user){
                        req.flash("error", 'Account already exist, sign in!')
                        res.redirect('/signin')
                    }else{ 
                    let data = {"name": name, "lastname": lastname, "email": email, "password": password}
                        const response = await fetch("https://dyani.herokuapp.com/api/auth/signup", {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify(data)
                        });
                        const result = await response.json()
                            req.flash("success", "Account successfully created. Sign in")
                            req.session.client = result.customer
                            res.redirect('/signin')     
                        }
                    }
                    else{
                        req.flash("error", 'invalid email!')
                        res.redirect('/signup')
                    }  
                }
            }
        }
    const getSignin = async (req, res) => {
        const error = req.flash()
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
        }
        res.render('signin', {
            userCredState,
            adminNavState,
            homeRoute,
            routeState,
            userCred,
            cartLength: cartTotal,
            message: error ? error?.error : ''
        })
    }

    const postSignin = async (req, res) => {
        let { email, password } = req.body
        if(!email){
            req.flash("error", "Enter email!")
			res.redirect('/signin')
        }
        else if(!password){
            req.flash("error", "Enter Password!")
			res.redirect('/signin')
        }
        else if(email && password){
            if(password.length < 8){
                req.flash("error", 'Password must be 8 characters of more!')
				res.redirect('/signin')
            }else{
                let emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                if(emailPattern.test(email)){
                    let data = {"email": email,"password": password}
                    const response = await fetch("https://dyani.herokuapp.com/api/auth/signin", {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        body: JSON.stringify(data)
                    });
                    const postResponse = await response.json()
                    if(typeof postResponse  !== "string"){
                        req.session.client = postResponse
                        req.flash("success", "Signed in Successfully")
                        res.redirect('/shop')
                    }else{
                        req.flash("error", "Invalid email or password input!")
                        res.redirect('/signin')
                    }
                }
            }
        }
    }

    const postShoeDb = async (req, res) => {
        const { name, brand, gender, price, in_stock, size, image, color } = req.body
        if(!name){
            req.flash("error", "Enter Shoe Name!")
            res.redirect('/admin') 
        }
        else if(typeof name !== 'string'){
            req.flash("error", "Enter valid Shoe Name!")
            res.redirect('/admin') 
        }
        else if(!brand){
            req.flash("error", "Enter Shoe Brand!")
            res.redirect('/admin') 
        }
        else if(typeof brand !== 'string'){
            req.flash("error", "Enter valid Shoe Brand!")
            res.redirect('/admin') 
        }
        else if(!gender){
            req.flash("error", "Select Shoe Gender!")
            res.redirect('/admin') 
        }
        else if(!price){
            req.flash("error", "Enter Shoe Price!")
            res.redirect('/admin') 
        }
        else if(!size){
            req.flash("error", "Enter Shoe Size!")
            res.redirect('/admin') 
        }
        else if(!in_stock){
            req.flash("error", "Enter Shoe Quantity!")
            res.redirect('/admin') 
        }
        else if(!image){
            req.flash("error", "Select Shoe Image!")
            res.redirect('/admin') 
        }
        else if(!color){
            req.flash("error", "Select Shoe Color!")
            res.redirect('/admin') 
        }
        else if(name && brand && gender && price && in_stock && size && image && color ){
        let imageAsBase64 = fs.readFileSync(`./public/img/${image}`, 'base64');
            let data = {"name": name, "brand": brand, "gender": gender, "price": price, "in_stock": in_stock, "size": size, "image": String(imageAsBase64), "color": color}
            await fetch("https://dyani.herokuapp.com/api/shoes/add-shoe", {
              method: 'POST',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
               },
              redirect: 'follow',
              referrerPolicy: 'no-referrer',
              body: JSON.stringify(data)
            });
                req.flash("success", "Shoe added successfully!")
                res.redirect('/admin')     
        }
    }

    const getCart = (req, res) => {
        cart = shoesFE.getCart()
        let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
        const totalsArr = filterCart?.map(obj => obj.price)
        const total = totalsArr?.reduce((acc, tot) => acc + tot, 0)
        cartTotal = filterCart.length
        let state = 'hide'
        let messageState = 'show'
        if (total > 0) {
            state = 'show'
            messageState = 'hide'
        } else {
            state = 'hide'
            messageState = 'show'
        }
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
        }
        res.render('cart', {
            userCredState,
            adminNavState,
            homeRoute,
            routeState,
            userCred,
            state,
            messageState,
            stateMessage: `Shopping Cart Is Empty. Shop Now`,
            filterCart,
            total,
            cartLength: cartTotal,
        })
    }

    const addToCart = async (req, res) => {
        const { id } = req.params
        const method = 'ADD'
        const shoeDetails = await shoesDb.getShoeDetails(id)
        if(shoeDetails?.in_stock < 1){
            req.flash('error', 'Shoe out of stock!')
            res.redirect('/shop')
        }else if(shoeDetails?.in_stock > 0){
            shoesFE.storeCart(shoeDetails, method)
            res.redirect('/shop')
        }
    }
    const addToCartTwo = async (req, res) => {
        const { id } = req.params
        const method = 'ADD'
        const shoeDetails = await shoesDb.getShoeDetails(id)
        if(shoeDetails?.in_stock < 1){
            res.redirect('/shop')
        }else if(shoeDetails?.in_stock > 0){
            shoesFE.storeCart(shoeDetails, method)
            res.redirect('/cart')
        }
    }
    const addToCartThree = async (req, res) => {
        const { id } = req.params
        const method = 'ADD'
        const shoeDetails = await shoesDb.getShoeDetails(id)
        if(shoeDetails?.in_stock < 1){
            res.redirect(`/cart`)
        }else if(shoeDetails?.in_stock > 0){
            shoesFE.storeCart(shoeDetails, method)
            res.redirect(`/cart`)
        }
    }

    const removeFromCart = async (req, res) => {
        const { id } = req.params
        const method = 'REMOVE'
        const shoeDetails = await shoesDb.getShoeDetails(id)
        shoesFE.storeCart(shoeDetails, method)
        res.redirect('/cart')
    }
    const getCheckout = async (req, res) => {
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
        }
        if(req.session.client){
            res.redirect(`/checkout/${req.session.client?.name}`)
        }else{
            res.redirect('/signin')
        }
    }

    const payment = async (req, res) => {
        if(req.session.client?.name){
            const user = await shoesDb.getUser(req.session.client?.name)
            if (req.session.client?.name) {
                const { id } = user
                let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
                if(filterCart.length > 0){
                    const formatCart = JSON.stringify(filterCart)
                    await shoesDb.postCart(formatCart, id)
                }
                const shoeDetails = await shoesDb.getShoeDetails(id)
                const method = 'CLEAR'
                shoesFE.storeCart(shoeDetails, method)
                cartTotal = 0
                const cartDetails = await shoesDb.getCart(id)
                await shoesDb.updateShoes(cartDetails)
                userCred = req.session.client ? req.session.client?.name : 'Sign in'
                if(req.session.client){
                    routeState = 'show'
                    userCredState = '#'
                }
                let cartResults = []
                if(cartDetails){
                    for(let data in cartDetails){
                        cartResults = [...cartResults, JSON.parse(cartDetails[data]["cart"])]
                    }
                    res.render('payment', {
                        userCredState,
                        adminNavState,
                        homeRoute,
                        routeState,
                        userCred,
                        cartResults,
                        user,
                        cartLength: cartTotal,
                        helpers: {
                            dateFormat: (date) => {
                                return moment(date).format("MMM-YY")
                            },
                            dateFormatTwo: (date) => {
                                return moment(date).format("DD-MMM-YYYY")
                            }
                        }
                    })
                }else{
                    res.render('payment_details', {
                        userCredState,
                        adminNavState,
                        homeRoute,
                        routeState,
                        userCred,
                        user,
                        bank,
                        address,
                        cartLength: cartTotal,
                        helpers: {
                            dateFormat: (date) => {
                                return moment(date).format("MMM-YY")
                            }
                        }
                    })
                }
    
            } else {
                res.redirect('/')
            }
        }else{
            res.redirect('/signin')
        }
    }

    const search = async (req, res) => {
        const {brand, size} = req.body
        cart = shoesFE.getCart()
        let shoes = []
        let getAllShoes;
        let displayMessage;
        if(brand){
            await axios.get(`https://dyani.herokuapp.com/api/shoes/brand/${brand}`)
            .then((response) => {
                if(response?.data?.status === 'success'){
                    shoes = response?.data?.shoes
                }
        })
        }else if(size){
            await axios.get(`https://dyani.herokuapp.com/api/shoes/size/${size}`)
            .then((response) => {
                if(response?.data?.status === 'success'){
                    shoes = response?.data?.shoes
                }
            })
        }else if(brand && size){
            await axios.get(`https://dyani.herokuapp.com/api/shoes/brand/${brand}/size/${size}`)
            .then((response) => {
                if(response?.data?.status === 'success'){
                    shoes = response?.data?.shoes
                }
            })
        }else{
            displayMessage = 'Enter Search fields.'
        }
        await axios.get('https://dyani.herokuapp.com/api/shoes')
        .then((response) => {
            if(response?.data?.status === 'success'){
                getAllShoes = response?.data?.shoes
            }
        })
        const success = req.flash()
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        if(req.session.client){
            routeState = 'show'
            userCredState = '#'
            routeState = 'show'
        }
        let con = 'hide'
        if(!shoes){
            con = 'show'
        }
        const allShoes = shoes?.filter(elem => elem.in_stock >= 1)
        shoesFE.getCart()
        let filterCart = cart?.filter(elem => elem.buying_amount >= 1)
        cartTotal = filterCart.length
        userCred = req.session.client ? req.session.client?.name : 'Sign in'
        const shoeBrands = getAllShoes?.map(brand => brand.brand)
        const shoeSizes = getAllShoes?.map(brand => brand.size)
        const brands = [...new Set(shoeBrands)]
        const sizes = [...new Set(shoeSizes)]
        res.render('home', {
            brands,
            sizes,
            userCredState,
            adminNavState,
            userCredState,
            homeRoute,
            routeState,
            userCred,
            displayMessage,
            con,
            cart,
            cartLength: cartTotal,
            allShoes,
            message: success ? success.success : '',
            helpers: {
                inStock: (stock) => {
                    let result = 'out of stock'
                    if (stock >= 1) {
                        result = 'in stock'
                    }
                    return result
                }
            },
        })
    }

    const logout = async (req, res) => {
       const response = await fetch("https://dyani.herokuapp.com/api/auth/signout", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
             },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: ''
          });
          req.flash("success", await response.json())
          delete req.session.client
          routeState = 'hide'
          res.redirect('/signin')
    }
    return {
        home,
        getSignup,
        postSignup,
        getSignin,
        postSignin,
        getShoes,
        viewShoe,
        postShoeDb,
        addToCart,
        addToCartTwo,
        addToCartThree,
        removeFromCart,
        getCart,
        getCheckout,
        payment,
        search,
        logout
    }
}

module.exports = Routes