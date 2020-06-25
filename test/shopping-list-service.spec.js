const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');

describe('shoppingListService', () => {

    let db;

    let testItems = [
        {
            id: 1,
            name: 'Turnip the Beet',
            price: '0.20',
            category: 'Lunch',
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'Mascarphony',
            price: '1.80',
            category: 'Lunch',
            checked: true,
            date_added: new Date('2100-05-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'Burgatory',
            price: '1.50',
            category: 'Main',
            checked: false,
            date_added: new Date('1919-12-22T16:28:32.615Z'),
        }
    ]

    before('setup', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before('clean db', () => db('shopping_list').truncate());
    afterEach('clean db', () => db('shopping_list').truncate());

    after('destroy db connection', () => db.destroy());

    describe('getAllItems', () => {
        it('returns an empty array', () => {
            return ShoppingListService
                .getAllItems(db)
                .then(list => expect(list).to.eql([]))
        })

        context('when there is data in shopping list', () => {
            beforeEach('insert test data', () => 
                db('shopping_list')
                    .insert(testItems)
            );

            it('returns the correct data', () => {
                return ShoppingListService
                    .getAllItems(db)
                    .then(actual => expect(actual).to.eql(testItems));
            });
        });
    });
})

