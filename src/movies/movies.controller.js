const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const movieExists = async (req, res, next) => {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
};

const read = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.read(movie) });
};

const readTheatersByMovie = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.readTheatersByMovie(movie) });
};

const readReviewsByMovie = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
  res.json({ data: await moviesService.readReviewsByMovie(movie) });
};

const list = async (req, res, next) => {
  if (req.query) {
    req.query.is_showing === "true" &&
      res.json({ data: await moviesService.listMoviesCurrentlyShowing() });
  }
  res.json({ data: await moviesService.list() });
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readTheatersByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersByMovie),
  ],
  readReviewsByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviewsByMovie),
  ],
};


//Create a route that responds to the following request:
//GET /movies/:movieId


/*GET /movies/:movieId (incorrect ID)
If the given ID does not match an existing movie, a response like the following should be returned:
{
  "error": "Movie cannot be found."
}
The response must have 404 as the status code.
/*/

/*Update your route so that it responds to the following request:
GET /movies/:movieId/theaters
This route should return all the theaters where the movie is playing. This means you will need to check
the movies_theaters table
/*/

/*Update your route so that it responds to the following request:

GET /movies/:movieId/reviews
This route should return all the reviews for the movie, including all the critic details added to a critic key of the review./*/