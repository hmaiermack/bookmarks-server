const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const bookmarks = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.send(bookmarks)
  })
  .post(bodyParser, (req, res) => {
      const {title, url, description, rating} = req.body;

      if(!title || !url || !rating){
          logger.error('Title, url, and rating all must be included');
          return res
            .status(400)
            .send('Invalid data')
      }

      const id = uuid();

      const bookmark = {
        id,
        title,
        url,
        description,
        rating
      };

      bookmarks.push(bookmark);

      logger.info(`Bookmark with id ${id} created`);

      res   
        .status(201)
        .location(`localhost:8000/bookmarks/${id}`)
        .json({id})

  })


bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res)=>{
      const {id} = req.params;
      const bookmark = bookmarks.find(bk => bk.id == id)

      if (!bookmark){
          logger.error(`Bookmark with id ${id} not found`)
          return res
            .status(404)
            .send('Bookmark not found')
      }
      res.json(bookmark)
  })
  .delete((req,res) => {
      const {id} = req.params;

      const bookmarkToDelete = bookmarks.findIndex(bk => bk.id == id);

      if (bookmarkToDelete === -1){
          return res
            .status(404)
            .send('Not found')
      }

      bookmarks.splice(bookmarkToDelete, 1);

      logger.info(`Bookmark with id ${id} deleted`)
      res
        .status(204)
        .end();
  })

  module.exports = bookmarksRouter;