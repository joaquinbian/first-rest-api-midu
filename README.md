# REST API

## que es una API REST?

- REST (Representational State Transfer)
- Es una arquitectura de software

## Principios de REST

- escalabiliad
- simplicidad
- visibilidad
- portabilidad
- fiabilidad
- facil de modificar

## Fundamentos

- Todo en REST es un recurso
  - Por ejemplo, una entidad (un libro, un usuario etc)
  - O tambien una coleccion (lista de libros, lista de usuarios)
- Cada recurso se identifica con una URL
- Metodos HTTP
  - GET, POST, DELETE, PATCH, ETC
  - Definen las operaciones que se pueden hacer con los recursos
  - Normalmente representan las acciones basicas de un CRUD
- Representaciones
  - No todas las APIS tienen que ser JSON
  - Los recursos pueden tener multiples representaciones, como JSON, XML, HTML, etc
  - El cliente deberia poder elegir la representacion del recurso
  - Estaria bueno que el recurso este separado de su representacion, por ejemplo, que el recurso per se no sea un JSON,
- Stateless
  - Cada solicitud que le hacemos al servidor, debe tener TODA la info necesaria para entenderla
  - No deberia guardar info para saber como responder..
- Interfaz Uniforme
  - Los endpoints siempre se tienen que llamar de la misma forma y siempre deben hacer lo mismo
- Separacion de conceptos
  - Permite que cliente y servidor evolucione de forma separada

## POST vs PUT vs PATCH

- Ideompotencia: Propiedad de realizar una operacion varias veces y aun asi, obtener SIEMPRE el mismo resultado
- POST:
  - Crea un nuevo recurso en el servidor
  - NO es ideompotente. Porque SIEMPRE CREA UN NUEVO RECURSO
  - Ejemplo de URL: `/movies`
- PUT:
  - Actualiza totalmente un nuevo elemento ya existente (o crearlo, si no existe...)
  - Es ideompotente. Porque siempre el resultado sera el mismo, ya que nosotros indicamos que recurso modificar siempre, no creamos uno nuevo nunca
  - Ejemplo de URL: `/movies/{id}`
- PATCH:
  - Actualiza parcialmente un elemento/recurso...
  - En principio SI, es ideompotente, pero depende, ya que quiza puede ser que tengamos un campo `updatedAt` que vaya cambiando, pero tambien podria tenerlo el PUT... asi que...
  - Ejemplo de URL: `/movies/{id}`

## Error de CORS

- CORS -> Cross Origin Resource Shared
- Es un mecanismo que solo funciona en el browser, ya que desde la consola si hacemos un curl a nuestra api, funciona
- Es un mecanismo que restringe un recurso en una pagina web, para evitar que un origen/dominio fuera de otro dominio (desde el que se sirvio el recurso), pueda acceder
- Solo funciona en navegadores, porque los navegadores hacen la peticion y le consultan al origen (en este caso, localhost) puede acceder a sus recursos, estando en otro dominio (en el dominio de la web)
  - Entonces cuando ocurre este error, es porque el dominio al que la web le consulta lo rechaza
  - La forma en la que el server lo rechaza es respondiendo sin un header
  - y el navegador responde a eso con el error de CORS
- La solucion del problema del cors depende del metodo, con PUT, PATCH y DELTE es mas dificil
  - Para estos metodos complejos existe lo que se conoce como `CORS PRE-FLIGHT`
  - Cuando hacemos una request usando estos metodos, requiere una peticion especial llamada `options`
  - Entonces, antes de hacer el POST/PUT/DELETE, hace una peticion `options` donde le pregunta a la API usando el verbo `options` para saber si puede hacer la peticion o no
  - Entonces agregamos la peticion con el verbo `options` con la ruta donde esta el PUT/PATCH/DELETE y ahi, agregar lo del `Access-Control-Allow-Origin`
  - ADEMAS, debemos indicar en ese `options`, cuales son los metodos que puede utilizar
- En express hay un middleware para usar el CORS

  ```
    app.use(cors());

  ```

  - Esto igual, agrega el `'*'`, por lo que cualquiera puede acceder a los recursos
  - De todas formas, eso se puede configurar
