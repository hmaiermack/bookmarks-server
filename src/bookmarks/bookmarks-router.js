const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const bookmarks = require('../store')
const BookmarksService = require('../bookmarks-service')
const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmarks => {
      if(!bookmarks){
        return res.status(200).send([])
      }
      res.json(bookmarks)
    })
    .catch(next)
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
  .get((req, res, next)=>{
      const {id} = req.params;
      BookmarksService.getBookmarkById(req.app.get('db'), id)
      .then(bookmark => {
        if (!bookmark){
          logger.error(`Bookmark with id ${id} not found`)
          return res
            .status(404)
            .send('Bookmark not found')
      }
      res.json(bookmark)
    })
    .catch(next)
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