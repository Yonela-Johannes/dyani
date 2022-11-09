const FileReader = require('filereader')
const fs = require('fs');
let cart = []

const ShoesFE = () => {
    let username, shoeBrand, genderRes, imageRes, color = ''
    let priceRes, oldPriceRes, inStockRes, sizeRes = 0

    const setName = (name) => {
        username = name
    }
    const setShoeBrand = (brand) => {
        shoeBrand = brand
    }
    const setGender = (gender) => {
        genderRes = gender
    }
    const setShoePrice = (price) => {
        priceRes = price
    }
    const setShoeOldPrice = (old_price) => {
        oldPriceRes = old_price
    }
    const setShoeInStock = (quantity) => {
        inStockRes = quantity
    }
    const setShoeSize = (size) => {
        sizeRes = size
    }
    const setColor = (shoe_color) => {
        color = shoe_color
    }
    const setShoeImage = (image) => {
        let imageAsBase64 = fs.readFileSync(`./public/img/${image}`, 'base64');
        imageRes = imageAsBase64
    }
    const storeCart = (id, method) => {
          switch (method) {
            case 'ADD':
                shoe = {
                    id: id.id,
                    name: id.name,
                    brand: id.brand,
                    gender: id.gender,
                    color: id.color,
                    in_stock: id.in_stock,
                    price: id.price,
                    amount: id.price,
                    buying_amount: 1,
                    image: id.image,
                    payment_date: new Date()
                }
                let inCart = (cart.filter(item => item.id == shoe.id)).length !== 0
                if (!inCart) {
                    cart.push(shoe)
                } else {
                    cart.forEach((item, index) => {
                        if (item.id == shoe.id) {
                            if (cart[index].in_stock >= 2) {
                                cart[index].price += shoe.price
                                cart[index].buying_amount += shoe.buying_amount
                                cart[index].in_stock -= shoe.buying_amount
                            }
                        }
                    })
                }
                return cart
            case 'REMOVE':
                shoe = {
                    id: id.id,
                    name: id.name,
                    brand: id.brand,
                    gender: id.gender,
                    color: id.color,
                    price: id.price,
                    in_stock: id.in_stock,
                    amount: id.price,
                    buying_amount: 0,
                    image: id.image,
                    payment_date: new Date()
                }
                let itemsInCart = (cart.filter(item => item.id == shoe.id)).length !== 0
                if (!itemsInCart) {
                    cart.push(shoe)
                } else {
                    cart.forEach((item, index) => {
                        if (item.id == shoe.id) {
                            if (cart[index].buying_amount >= 1) {
                                cart[index].price -= shoe.price
                                cart[index].buying_amount--
                                cart[index].in_stock += shoe.buying_amount
                            }
                        }
                    })
                }
                return cart
                case 'CLEAR':
                    return cart = []
            default:
                return cart
        }
    }

    const getCart = () => cart
    const getName = () => username
    const getShoeBrand = () => shoeBrand
    const getGender = () => genderRes
    const getShoePrice = () => priceRes
    const getShoeOldPrice = () => oldPriceRes
    const getShoeInStock = () => inStockRes
    const getShoeSize = () => sizeRes
    const getShoeImage = () => imageRes
    const getShoeColor = () => color
    return {
        setName,
        setShoeBrand,
        setGender,
        setShoePrice,
        setShoeOldPrice,
        setShoeInStock,
        setShoeSize,
        setShoeImage,
        getName,
        getShoeBrand,
        getGender,
        getShoePrice,
        getShoeOldPrice,
        getShoeInStock,
        getShoeSize,
        getShoeImage,
        storeCart,
        getCart,
        setColor,
        getShoeColor

    }
}

module.exports = ShoesFE