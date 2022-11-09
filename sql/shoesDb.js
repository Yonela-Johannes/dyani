const ShoesDb = (db) => {
    // Get all Shoes
    const getAllShoes = async () => {
        return await db.manyOrNone('select id, name, image, brand, price, old_price, size, in_stock from shoes;')
    }
    const postShoe = async (name, image, brand, gender, price, old_price, size, in_stock, color) => {
        const existShoe = await db.any('select * from shoes where name = $1;', [name])
        if (existShoe.name == name) {
            return await db.any('select * from shoes where name = $1, brand = $2;', [name, brand])
        }
        return await db.any('insert into shoes (name, image, brand, gender, price, old_price, size, in_stock, color) values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [name, image, brand, gender, price, old_price, size, in_stock, color])
    }

    // create user
    const createUser = async (name, lastname, phone, email, password) => {
        const existCustomer = await db.oneOrNone('select * from users where name = $1 and lastname = $2 and phone = $3 and email = $4;', [name, lastname, phone, email])
        if(!existCustomer){
            await db.oneOrNone('insert into users (name, lastname, phone, email, password) values ($1, $2, $3, $4, $5);', [name, lastname, phone, email, password])
            return await db.oneOrNone('select * from users where name = $1 and lastname = $2 and phone = $3 and email = $4;', [name, lastname, phone, email])
        }
    }
    // get users
    const users = async () => {
        return await db.manyOrNone('select * from users')
    }
    // get user by email
    const byEmail = async (email) => {
        return await db.oneOrNone('select * from users where email = $1;', [email])
    }

    const getUser = async (name) => {
        const searchSQL = `select * from users where name ILIKE '${name}%';`
        return await db.oneOrNone(searchSQL)
    }

    const getShoeDetails = async (id) => {
        return await db.one('select * from shoes where id = $1', [id])
    }
    const postBankingDetails = async (card_number, date, cvv, id) => {
        await db.oneOrNone('insert into banking_details (card_number, date, cvv, user_id) values ($1, $2, $3, $4);', [card_number, date, cvv, id])
    }
    const postAddress = async (street, city, code, id) => {
        const existAddress = await getAddressDetails(id)
        if(!existAddress){
            await db.manyOrNone('insert into address (street, city, code, user_id) values ($1, $2, $3, $4);', [street, city, code, id])
        }
    }

    const postCart = async (cart, id) => {
        await db.manyOrNone('insert into cart (cart, user_id) values ($1, $2);', [cart, id])
    }

    const getBankingDetails = async (id) => {
        return db.manyOrNone('select * from banking_details join users on user_id = users.id where user_id = $1', [id])
    }
    const getAddressDetails = async (id) => {
        return db.oneOrNone('select * from address join users on user_id = users.id where user_id = $1', [id])
    }

    const getCart = async (id) => {
        const result = await db.manyOrNone('select * from cart join users on user_id = users.id where user_id = $1', [id])
        return  result
    }

    // FILTERING SHOE by id 
    const shoeId = async (id) => {
        return await db.oneOrNone(`select * from shoes where id = $1;`, [id])
    }

    // FILTERING SHOES 
    const search = async (shoe_name, shoe_brand, shoe_size, gender, colors) => {
        if(shoe_name) return await getShoesByName(shoe_name)
        if(shoe_brand) return await brand(shoe_brand)
        if(shoe_size) return await size(shoe_size)
        if(gender) return await byGender(gender)
        if(colors) return await color(colors)
        if(shoe_name && shoe_brand) return await getShoesByNameBrand(shoe_name, shoe_brand)
        if(shoe_name && shoe_brand && shoe_size) return await nameBrandSize(shoe_name, shoe_brand, shoe_size)
        if(shoe_brand && shoe_size) return await brandSize(shoe_brand, shoe_size)
        if(shoe_name && shoe_size) return await nameSize(shoe_name, shoe_size)
        if(shoe_name && gender) return await nameGender(shoe_name, gender)
        if(shoe_name && colors) return await nameColor(shoe_name, colors)
        if(shoe_name && shoe_brand &&shoe_size && gender && colors) return await nameBrandSizeGenderColor(shoe_name, shoe_brand,shoe_size, gender, colors)
    }
    const getShoesByName = async (shoe_name) => {
        const searchSQL = `select * from shoes where name ILIKE '${shoe_name}%';`
        return await db.manyOrNone(searchSQL)
    }

    const getShoesByNameBrand = async (shoeName, brand) => {
        const searchSQL = `select * from shoes where name ILIKE '${shoeName}%' AND brand ILIKE '${brand}%';`
        return await db.manyOrNone(searchSQL)
    }
    const nameBrandSize = async (shoeName, brand, size) => {
        return await db.manyOrNone(`select * from shoes where name = $1 AND brand = $2 AND size = $3;`, [shoeName, brand, size])
    }

    const brand = async (brand) => {
        return await db.manyOrNone(`select * from shoes where brand = $1;`, [brand])
    }
    const brandSize = async (brand, size) => {
        return await db.manyOrNone(`select * from shoes where brand = $1 AND size = $2;`, [brand, size])
    }
    const nameSize = async (shoe_name, size) => {
        return await db.manyOrNone(`select * from shoes where name = $1 AND size = $2;`, [shoe_name, size])
    }
    const size = async (size) => {
        return await db.manyOrNone(`select * from shoes where size = $1;`, [size])
    }
    const byGender = async (gender) => {
        return await db.manyOrNone(`select * from shoes where gender = $1;`, [gender])
    }
    const nameGender = async (name, gender) => {
        return await db.manyOrNone(`select * from shoes where name = $1 AND gender = $2;`, [name, gender])
    }
    const color = async (color) => {
        return await db.manyOrNone(`select * from shoes where color = $1;`, [color])
    }
    const nameColor = async (name, color) => {
        return await db.manyOrNone(`select * from shoes where name = $1 AND color = $2;`, [name, color])
    }
    const nameBrandSizeGenderColor = async (name, brand, size, gender, color) => {
        return await db.manyOrNone(`select * from shoes where name = $1 AND brand = $2, AND size = $3 AND gender = $4 AND color = $5;`, [name, brand, size, gender, color])
    }
    const updateShoes = async (cartDetails) => {
        let cart = []
        let storedCart = []
        for (let x in cartDetails) {
            storedCart = JSON.parse(cartDetails[x].cart)
        }
        for(let y in storedCart){
            await db.any('update shoes set in_stock = in_stock - $2 where id = $1', [storedCart[y]?.id, storedCart[y]?.buying_amount])
        }
    }
    return {
        getUser,
        users,
        byEmail,
        getAllShoes,
        shoeId,
        postShoe,
        createUser,
        getShoeDetails,
        postBankingDetails,
        postAddress,
        postCart,
        getBankingDetails,
        getAddressDetails,
        getCart,
        updateShoes,
        search
    }
}

module.exports = ShoesDb