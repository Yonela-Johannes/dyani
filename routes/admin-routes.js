const moment = require('moment')
const axios = require('axios')
const AdminRoutes = (shoesDb) => {
    let homeRoute = '/admin'
    let navState = 'hide'
    let adminNavState = 'hide'
    const getAdmin = async (req, res) => {
        const error = req.flash()
        const users = await shoesDb.users()
        adminNavState = 'show'
        navState = 'hide'
        homeRoute = '/admin'
        res.render('admin-home', {
            homeRoute,
            adminNavState,
            navState,
            users,
            message: error ? error.error || error.Success || error.success : ''
        })
    }
    const userDetailsAdmin = async (req, res) => {
        const { name } = req.params
            const user = await shoesDb.getUser(name)
                const { id } = user
                const cartDetails = await shoesDb.getCart(id)
                let adminNavState = 'hide'
                adminNavState = 'show'
                let cartResults = []
                let homeRoute = '/admin'
                let navState = 'hide'
                if(cartDetails){
                    for(let data in cartDetails){
                        cartResults = [...cartResults, JSON.parse(cartDetails[data]["cart"])]
                    }
                    res.render('user-details-admin', {
                        adminNavState,
                        homeRoute,
                        navState,
                        cartResults,
                        user,
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
                    res.render('user-details-admin-two', {
                        adminNavState,
                        homeRoute,
                        user,
                        helpers: {
                            dateFormat: (date) => {
                                return moment(date).format("MMM-YY")
                            }
                        }
                    })
                }
    }
    return {
        getAdmin,
        userDetailsAdmin,
    }
}

module.exports = AdminRoutes