const express = require("express");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const cors = require("cors");

const { validateMovie, validatePartialMovie } = require("./movies");
//agregamos lo del port porque el servicio donde hospedemos el servicio
//va a meter el puerto en una variable de entorno
const PORT = process.env.PORT ?? 3000;
const app = express();
app.disable("x-powered-by"); //desabilita el header powered by express

app.use(express.json()); //middleware que parsea el body a json
app.use(cors());
app.get("/", (req, res) => {
  res.statusCode = 200;
  // res.send("hello world");
  //express automaticamente puede detectar el content type por ejemplo
  //res.send("<h1>hola mundo </h1>"); //nunca le expresamos que es un text/html y aun asi lo detecta
  res.send("hello world"); //por dentro hace el stringif
});

app.get("/movies", (req, res) => {
  console.log(req.query);

  //con el aterisco decimos que cualquier origen puede acceder a nuestra api
  //tambien en lugar del aterisco podemos poner el dominio y/o puerto de nuestra app
  res.header("Access-Control-Allow-Origin", "*");

  const { title } = req.query;
  if (title) {
    const movieFiltered = movies.movies.find((movie) => movie.title === title);
    if (!movieFiltered) {
      return res.json({ ok: false, message: "no se encontro la pelucula" });
    }
    return res.json({ ok: true, data: movieFiltered });
  }
  res.json(movies.movies);
});

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;

  const movie = movies.movies.find((movie) => movie.id === Number(id));

  if (!movie) {
    return res.json({ ok: false, message: "no se encontro la pelicula" });
  }
  return res.json({ ok: true, data: movie });
});

//path to regexp
//app.get("/movies/:id/:name", (req, res) => {
//en lugar de /movies/:id podriamos poner regex
//pero pasa que son dificiles..
//express usa path to regex
//nostros usamos paths mas legibles y se pasan a regex
//podemos poner paths como:
/*
    '/ab+cd' => abbcd, abbbbbcd, abcd (quiere decir que la b puede estar 1 o mas veces)
    '/ab?cd' => acd, abcd (quiere decir que la b puede estar 0 o 1 vez)
    '/ab(cd)e' => abe, abcde, abce, abde (quiere decir que la c y la d, pueden estar o no)

  */

//de todas formas, si nosotros queremos, podemos usar REGEX en lugar de un path
//});

app.get("/movies/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  console.log({ genre });
  if (!genre) {
    return res.json({ ok: false, message: "debes enviar un genero" });
  }
  const moviesFiltered = movies.movies.filter((movie) => movie.genre === genre);

  return res.json({ ok: true, data: moviesFiltered });
});

app.post("/movies", (req, res) => {
  const movie = validateMovie(req.body);

  if (movie.error) {
    return res
      .status(400)
      .json({ ok: false, message: JSON.parse(movie.error.message)[0].message });
  }
  const { title, genre, year, rating, director, actors } = req.body;

  const newMovie = {
    title,
    genre,
    year,
    rating,
    director,
    actors,
    id: crypto.randomUUID(),
  };

  movies.movies.push(newMovie);

  //devolvemos un 201 porque estamos creando un recurso
  res.status(201).json({ ok: true, data: newMovie });
});

//ACTUALIZAMOS UNA PELICULA

app.patch("/movies/:id", (req, res) => {
  const id = req.params.id;
  const movieIndex = movies.movies.findIndex(
    (movie) => movie.id === Number(id)
  );

  if (movieIndex === -1) {
    return res
      .status(404)
      .json({ ok: false, message: "no se encontro la pelicudadala" });
  }

  const movie = validatePartialMovie(req.body);

  if (!movie.success) {
    return res
      .status(400)
      .json({ ok: false, message: JSON.parse(movie.error.message)[0].message });
  }

  const newMovie = {
    ...movies.movies[movieIndex],
    ...movie.data,
  };

  movies.movies[movieIndex] = newMovie;

  return res.json({ ok: true, data: movies.movies[movieIndex] });
});

app.listen(PORT, () => {
  console.log("server listen at ", PORT);
});
