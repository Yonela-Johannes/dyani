const assert = require('assert');
const ShoesDb = require('../sql/shoesDb.js');
const pgp = require('pg-promise')();

const local = 'postgres://postgres:juanesse@123@localhost:5432/shoe_catalogue_test';
const connectionString = process.env.DATABASE_URL || local
const config = {
    connectionString,
    max: 20
}

const db = pgp(config)
const shoesDb = ShoesDb(db)


describe('Shoe Catalogue Tests', () => {
    describe("Get All Shoes", () => {
        it('should store and fetch all Shoes from database', async () => {
            const allShoes = await shoesDb.getAllShoes()
            assert.deepEqual([], allShoes)
        })
    });
    describe("search shoe by name", () => {
        it('should store and fetch Shoes by name from database', async () => {
            const allShoes = await shoesDb.search('Alpha')
            assert.deepEqual([], allShoes)
        })
    });
    describe("search shoe by brand", () => {
        it('should store and fetch Shoes by brand from database', async () => {
            const allShoes = await shoesDb.search('Dyani')
            assert.deepEqual([], allShoes)
        })
    });
    describe("search shoe size", () => {
        it('should store and fetch Shoes by from database', async () => {
            const allShoes = await shoesDb.search(7)
            assert.deepEqual([], allShoes)
        })
    });
    describe("search shoe by gender", () => {
        it('should store and fetch Shoes by gender from database', async () => {
            const allShoes = await shoesDb.search('Male')
            assert.deepEqual([], allShoes)
        })
    });
    describe("search shoe by colors", () => {
        it('should store and fetch all Shoes from database', async () => {
            const allShoes = await shoesDb.search('Alpha')
            assert.deepEqual([], allShoes)
        })
    });
})
