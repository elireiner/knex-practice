require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByProduceName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

//searchByProduceName('urger')

function paginateList(num) {
    let productsPerPage = 6;
    let offset = productsPerPage * (num = 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

//paginateList(3)

function selectGreaterThan(daysAgo) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('date_added',
            '>',
            knexInstance.raw(`now() - '?? day':: INTERVAL`, daysAgo))
        .then(result => {
            console.log(result)
        })
}

selectGreaterThan(7)

function addCategories() {
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

//addCategories()