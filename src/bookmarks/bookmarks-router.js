const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const bookmarks = require('../store')

const listRouter = express.Router()
const bodyParser = express.json()

listRouter
  .route('/list')
  .get((req, res) => {
    
  })