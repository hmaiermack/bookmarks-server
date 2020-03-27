const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        console.log(db.connection)
        app.set('db', db)
      })

      after('disconnect from db', () => db.destroy())

      before('clean data from table', () => db('bookmarks').truncate())

      afterEach('cleanup', () => db('bookmarks').truncate())

      describe(`GET /bookmarks`, () => {
          context(`Given no bookmarks`, () => {
              it('responds with 200 and empty array', () => {
                  return supertest(app)
                  .get('/bookmarks')
                  .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                  .expect(200, [])
              })
          })

          context('Given bookmarks', () => {
              const testBookmarks = makeBookmarksArray()

              beforeEach('insert bookmarks into fake db', () => {
                  return db
                  .into('bookmarks')
                  .insert(testBookmarks)
              })

              it('responds with 200 and array of bookmarks', () => {
                  return supertest(app)
                  .get('/bookmarks')
                  .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                  .expect(200, testBookmarks)
              })
          })
      })

      describe('GET /bookmarks/:id', () => {
          context('Given no bookmarks', () => {
              let id = 12345
            it('responds with 404', () => {
                return supertest(app)
                .get(`/bookmarks/${id}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404)
            })
          })

          context('Given bookmarks', () => {
              let id = 3;
              let bookmarkArray = makeBookmarksArray();
              let expectedArray = bookmarkArray[id - 1]

              beforeEach('insert bookmarks into db', () => {
                  return db.into('bookmarks').insert(bookmarkArray)
              })

              it('responds with 200 and the correct bookmark', () => {
                  return supertest(app)
                  .get(`/bookmarks/${id}`)
                  .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                  .expect(200, expectedArray)
              })
          })
      })
})