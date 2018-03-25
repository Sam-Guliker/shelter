'use strict'

var express = require('express')
var db = require('../db')
var helpers = require('./helpers')
var path = require('path')
var bodyParser = require('body-parser')
var multer  = require('multer')
var fs = require('fs')

var upload = multer({
  dest: 'db/image/',
})

module.exports = express()
  .use(express.static('static'))
  .use('/image', express.static('db/image'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', all)
  // .get('/:id', get)
  .get('/add', form)
  .post('/', upload.single('image'), add)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .listen(1902)

function all(req, res) {
  var result = {errors: [], data: db.all()}

  /* Use the following to support just HTML:  */
  res.render('list.ejs', Object.assign({}, result, helpers))

  /* Support both a request for JSON and a request for HTML  */
  res.format({
    json: () => res.json(result),
    html: () => res.render('list.ejs', Object.assign(
      {},
      result,
      helpers)
    )
  })

}

function get(req, res) {
  var id = req.params.id
  // If id is availible in the database, render as JSON or HTML
  try {
      // If id is availible in the database, render as JSON or HTML
      if (db.has(id)) {
          var result = {errors: [], data: db.get(id)}
          res.format({
              json: () => res.json(result),
              html: () => res.render('detail.ejs', Object.assign({}, result, helpers))
          })
      }
      // If id did exist before but has been removed
      else if (db.removed(id)) {
          var result = {errors: [{id: 410, title: '410', detail: 'Gone'}]}
          res.status(410).render('error.ejs', Object.assign(
            {},
            result,
            helpers)
          )
      }
      // If id is not in the database give
      else {
          var result = {errors: [{id: 404, title: '404', detail: 'Not Found'}]}
          res.status(404).render('error.ejs', Object.assign(
            {},
            result,
            helpers)
          )
      }
  }
  // Handle invalid identifiers like ('/-')
  catch(err) {
      var result = {errors: [{id: 400, title: '400', detail: 'Bad request'}]}
      res.status(400).render('error.ejs', Object.assign(
        {},
        result,
        helpers)
      )
      return
  }


}
// Handle invalid identifiers like ('/-')

function form(req, res){
  res.render('form.ejs')
}

function add(req, res){
  try{
    console.log('hi')
  }
}
