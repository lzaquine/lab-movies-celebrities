// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const { populate } = require("../models/Celebrity.model");
const Celebrity = require('../models/Celebrity.model')
const Movie = require('../models/Movie.model')


// all your routes here
router.get('/movies/create', (req, res, next) => {
    Celebrity.find()
    .then((allCelebrities) => {
        res.render('movies/new-movie', {allCelebrities});

    }).catch((err) => {
        next(err);
    })
})

router.post('/movies/create', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;

    Movie.create({ title, genre, plot, cast })
    .then((createdMovie) => {
        console.log(`Created ${createdMovie.title}`);
        res.redirect('/movies')
    }).catch((err) => {
        next(err);
    });
})

router.get('/movies', (req, res, next) => {
    Movie.find()
    .then((createdMovie) => {
        res.render('movies/movies', {createdMovie})

    })
})

router.get('/movies/:id/delete', (req, res, next) => {
    const { id } = req.params;
    Movie.findByIdAndDelete(id)
      .then(() => res.redirect('/movies'))
      .catch((err) => next(err));
  });

router.get('/movies/:id', (req, res, next) => {
    const { id } = req.params;

    Movie.findById(id)
    .populate('cast')
    .then((movieDetails) => {
        console.log(movieDetails)
        res.render('movies/movie-details', movieDetails)
    }).catch((err) => next(err))
})

router.get('/movies/:id/edit', (req, res, next) => {
    const {id} = req.params;

    Movie.findById(id)
    .populate('cast')
    .then((movs) => {
        console.log(movs)
        res.render('movies/edit-movie', movs)
    }).catch((err) => next(err))
})

router.post('/movies/:id/edit', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
    const {id} = req.params

    Movie.findByIdAndUpdate(id, {title, genre, plot, cast})
    .then((editedMov) => {
        console.log(`Edited: ${editedMov}`);
        res.redirect('/movies')
    }).catch((err) => {
        next(err);
    });
})

router.post('/movies/:id/delete', async (req, res, next) => {
    const {id} = req.params
    try {
        await Movie.findByIdAndRemove(id)
        res.redirect('/movies')
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;