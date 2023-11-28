const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "el titulo debe ser un string",
    required_error: "el titulo es requerido",
  }),
  year: z
    .number({
      required_error: "el year es requerido",
      invalid_type_error: "year tiene que ser un numero",
    })
    .int()
    .positive()
    .min(1900),
  genre: z.array(
    z.enum([
      "Comedy",
      "Drama",
      "Action",
      "Terror",
      "Documentary",
      "Romance",
      "Thriller",
      "Sci-Fi",
      "Crime",
    ]),
    {
      required_error: "el genero es requerido",
      invalid_type_error: "el genero tiene que ser una lista de tipo genero",
    }
  ),
  rating: z.number({
    required_error: "el rating es requerido",
    invalid_type_error: "rating tiene que ser un numero",
  }),
  director: z.string({
    invalid_type_error: "el director debe ser un string",
    required_error: "el director es requerido",
  }),
  actors: z.array(
    z.string({
      invalid_type_error: "los actores deben ser un string",
    })
  ),
});

function validateMovie(movie) {
  return movieSchema.safeParse(movie);
}

function validatePartialMovie(movie) {
  /*
    lo que hace el partial es que, sobre el schema ya creado, hace 
    que todos los campos sean opcionales. En caso de que llegue un campo
    le aplica las validaciones que ya tenia definidas
  */
  return movieSchema.partial().safeParse(movie);
}
module.exports = { validateMovie, validatePartialMovie };
