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
            checked: true,
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

    context('when there is data in shopping list', () => {
        beforeEach('insert test data', () =>
            db('shopping_list')
                .insert(testItems)
        );

        it('getAllItems() returns the correct data', () => {
            return ShoppingListService
                .getAllItems(db)
                .then(actual => expect(actual).to.eql(testItems));
        });


        it('getById()returns the correct item', () => {
            const testId = 2;
            const expectedItem = testItems[testId - 1]
            return ShoppingListService
                .getById(db, testId)
                .then(actual => expect(actual).to.eql(expectedItem));
        });


        it('deleteItem() deletes the correct item', () => {
            const deleteItemId = 1;
            const expected = testItems.filter(item => { item.id !== deleteItemId })
            return ShoppingListService
                .deleteItem(db, deleteItemId)
                .then(rowsAffected => {
                    expect(rowsAffected).to.eq(1)
                    return db('blogful_articles').select('*');
                })
                .then(actual => {
                    expect(actual).to.eql(expected);
                })
        });



        it('updates an item correctly', () => {

            const testItemId = 2;
            const testItem = testItems.find(itm => itm.id == testItemId)
            const updatedItem = { ...testItem, checked: false }

            return ShoppingListService
                .updateItem(db, testItemId, updatedItem)
                .then(rowAffected => {
                    expect(rowAffected).to.eql(testItemId - 1)
                    return db('shopping_list').select('*').where({ id: testItemId }).first();
                })
                .then(item => expect(item).to.eql(updatedItem));
        });
    });

    context('when there is no data in db', () => {
        it('getAllItems() returns an empty array', () => {
            return ShoppingListService
                .getAllItems(db)
                .then(list => expect(list).to.eql([]))
        })

        it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            }

            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    })
                })
        })
    })
})