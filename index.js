const express = require( 'express' )

const app = express()

app.use(express.json())

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get( '/', ( request, response ) =>
{
    response.send( '<h1>Hello World!</h1>' )
} )

app.get( '/info', ( request, response ) =>
{
    now = new Date()
    response.send( 
    `
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${now}</p>
    ` )
} )


app.get( '/api/persons', ( request, response ) =>
{
    response.json( persons )
} )

app.get( '/api/persons/:id', ( request, response ) =>
{
    const id = Number( request.params.id )
    const person = persons.find( p => p.id === id )

    if ( person )
    {
        response.json( person )
    } else
    {
        response.status( 404 ).end()
    }
} )

app.delete( '/api/persons/:id', ( request, response ) =>
{
    const id = Number( request.params.id )
    persons = persons.filter( p => p.id !== id )

    response.status( 204 ).end()
} )

app.post('/api/persons', (request, response) => {
  const person = request.body
  console.log(person)
  response.json(person)
  //
  //
  // ...
})

const PORT = 3001
app.listen( PORT, () =>
{
    console.log( `Server running on port ${ PORT }` )
} )