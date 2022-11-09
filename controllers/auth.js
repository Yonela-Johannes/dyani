const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = (shoesDb) =>{
    // CREATE USER
    const register = async (req, res) => {
        // CHECK IF USER EXIST
        const {name, lastname, email, password} = req.body
        // CREATE NEW USER
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPasssword = bcrypt.hashSync(password, salt)
            const createUser = await shoesDb.createUser(name, lastname, email, hashPasssword);
            if(createUser) return res.status(200).json('User has been created.')
        } catch (err) {res.json(err.stack)}
    }
    // LOGIN
    const login = async (req, res) => {
        const { email, password } = req.body
        try{
            const user = await shoesDb.byEmail(email);
            if(user){
                let oldPassword =  user?.password
                const verifyPassword = bcrypt.compareSync(password, oldPassword)
                if(verifyPassword){
                    const token = jwt.sign({id: user.id}, "secretkey")
                    const {password, ...others} = user
                    res.cookie("accessToken", token, {
                        httpOnly: true,
                    }).status(200).json(others)
                }else{
                    return res.status(400).json("Password incorrect!")
                }
            }else{
                return res.status(500).json("User do not exist!")
            }
        }
        catch (err){ return res.json(err.stack)}
    }
    // SIGN OUT
    const logout = (req, res) => {
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none",
        }).status(200).json("User has been logged out.")
    }

    return{
        register,
        login,
        logout
    }
}