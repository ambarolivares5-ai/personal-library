'use strict';

const Book = require('../models/Book');

module.exports = function (app) {

  app.route('/api/books')

    .get(async function(req, res) {

      try {

        const books = await Book.find();

        const response = books.map(book => ({
          title: book.title,
          _id: book._id,
          commentcount: book.comments.length
        }));

        res.json(response);

      } catch(err) {
        res.send('error');
      }

    })

    .post(async function(req, res) {

      const title = req.body.title;

      if(!title) {
        return res.send('missing required field title');
      }

      try {

        const newBook = new Book({
          title: title,
          comments: []
        });

        await newBook.save();

        res.json({
          title: newBook.title,
          _id: newBook._id
        });

      } catch(err) {
        res.send('error');
      }

    })

    .delete(async function(req, res) {

      try {

        await Book.deleteMany({});

        res.send('complete delete successful');

      } catch(err) {
        res.send('error');
      }

    });




  app.route('/api/books/:id')

    .get(async function(req, res) {

      const bookid = req.params.id;

      try {

        const book = await Book.findById(bookid);

        if(!book) {
          return res.send('no book exists');
        }

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });

      } catch(err) {
        res.send('no book exists');
      }

    })

    .post(async function(req, res) {

      const bookid = req.params.id;
      const comment = req.body.comment;

      if(!comment) {
        return res.send('missing required field comment');
      }

      try {

        const book = await Book.findById(bookid);

        if(!book) {
          return res.send('no book exists');
        }

        book.comments.push(comment);

        await book.save();

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });

      } catch(err) {
        res.send('no book exists');
      }

    })

    .delete(async function(req, res) {

      const bookid = req.params.id;

      try {

        const deletedBook = await Book.findByIdAndDelete(bookid);

        if(!deletedBook) {
          return res.send('no book exists');
        }

        res.send('delete successful');

      } catch(err) {
        res.send('no book exists');
      }

    });

};