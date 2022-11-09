module.exports = (shoesDb) => {
	// Get all shoes
	const allShoes = async (req, res, next) => {
		try {
			let shoes = await shoesDb.getAllShoes(); 
			res.json({
				shoes,
				"status": "success"
			});
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get shoes by shoe id
	const shoe = async (req, res) => {
		const { id } = req.params
		try {
			let shoe = await shoesDb.shoeId(id); 
			return res.json({
				shoe
			});
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get shoe by name
    const getName = async (req, res, next) => {
		const { name } = req.body
		try {
			const allShoes = await shoesDb.getShoesByName(name)
			return res.json({
				shoes: allShoes,
				"status": "success"
			})
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get shoes by brand name
	const getBrand = async (req, res, next) => {
		const {brandname} = req.params
		try {
			const allShoes = await shoesDb.getByBrand(brandname)
			return res.json({
				shoes: allShoes,
				"status": "success"
			})
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get shoes by brand name and size
	const getBrandSize = async (req, res, next) => {
		const { brandname, size } = req.params
		try {
			const allShoes = await shoesDb.brandSize(brandname, size)
			return res.json({
				shoes: allShoes,
				"status": "success"
			})
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get shoes by size
	const getSize = async (req, res, next) => {
		const { size } = req.params
		try {
			const allShoes = await shoesDb.getBySize(size)
			return res.json({
				shoes: allShoes,
				"status": "success"
			})
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Add shoe
	const addShoe = async (req, res, next) => {
		const { name, image, brand, gender, price, in_stock, size, color } = req.body
		try {        
			await shoesDb.postShoe(name, image, brand, gender, Number(price), Number(size), Number(in_stock), color)
			return res.json({
				"status": "success",
			});
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
	// Get All users
	const users = async (req, res) => {
		try {
			let users = await shoesDb.users(); 
			return res.json({
				users
			});
		}
		catch (err) {
			res.json({
				status: "error",
				error: err.stack
			});
		}
	};
    return {
        allShoes,
		shoe,
		getName,
		getBrand,
		getBrandSize,
		getSize,
		addShoe,
		users
    }
}