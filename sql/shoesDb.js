const ShoesDb = (db) => {
    // Get all Shoes
    const getAllShoes = async () => {
        return await db.manyOrNone('select id, name, image, brand, price, size, in_stock from shoes;')
    }
    const postShoe = async (name, image, brand, gender, price, size, in_stock, color) => {
        const existShoe = await db.any('select * from shoes where name = $1;', [name])
        if (existShoe.name == name) {
            return await db.any('select * from shoes where name = $1, brand = $2;', [name, brand])
        }
        return await db.any('insert into shoes (name, image, brand, gender, price, size, in_stock, color) values($1,$2,$3,$4,$5,$6,$7,$8)', [name, image, brand, gender, price, size, in_stock, color])
    }

    // create user
    const createUser = async (name, lastname, email, password) => {
        const existCustomer = await db.oneOrNone('select * from users where name = $1 and lastname = $2 and email = $3;', [name, lastname, email])
        if(!existCustomer){
            await db.oneOrNone('insert into users (name, lastname, email, password) values ($1, $2, $3, $4);', [name, lastname, email, password])
            return await db.oneOrNone('select * from users where name = $1 and lastname = $2 and email = $3;', [name, lastname, email])
        }
        return await db.oneOrNone('select * from users where name = $1 and lastname = $2 and email = $3;', [name, lastname, email])
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
        return await db.oneOrNone("select * from shoes where id = $1;", [id])
    }

    const getShoesByName = async (name) => {
        console.log(name)
        const searchSQL = `select * from shoes where name ILIKE '${name}%';`
        return await db.manyOrNone(searchSQL)
    }

    const getByBrand = async (brand) => {
        return await db.manyOrNone(`select * from shoes where brand = $1;`, [brand])
    }
    const brandSize = async (brand, size) => {
        return await db.manyOrNone(`select * from shoes where brand = $1 AND size = $2;`, [brand, size])
    }
    const getBySize = async (size) => {
        return await db.manyOrNone(`select * from shoes where size = $1;`, [size])
    }
    const byGender = async (gender) => {
        return await db.manyOrNone(`select * from shoes where gender = $1;`, [gender])
    }

    const updateShoes = async (cart) => {
        for (let x in cart) {
            await db.any('update shoes set in_stock = in_stock - $2 where id = $1', [cart[x].id, cart[x].buying_amount])
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
        getBySize,
        getByBrand,
        brandSize,
        byGender,
        getShoesByName
    }
}

module.exports = ShoesDb