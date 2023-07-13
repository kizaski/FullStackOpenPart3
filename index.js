const express = require( 'express' )
const morgan = require( 'morgan' )
const cors = require('cors')


const app = express()

app.use( express.json() )

app.use(cors())

morgan.token( 'body', req =>
{
    return JSON.stringify( req.body )
} )

app.use( morgan( ':method :url :status :res[content-length] - :response-time ms :body' ) )

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
    },
    {
        id: 5,
        name: "WUT",
        number: "DUFUQ2343454545454545"
    },
]

app.get( '/info', ( request, response ) =>
{
    now = new Date()
    response.send( `
        <p>Phonebook has info for ${ persons.length } people </p>
        <p>${ now }</p>
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
    console.log( person )
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

const generateId = () =>
{
    const maxId = persons.length > 0
        ? Math.max( ...persons.map( n => n.id ) )
        : 0
    return maxId + 1
}

app.post( '/api/persons', ( request, response ) =>
{
    const body = request.body

    if ( !body.name )
    {
        return response.status( 400 ).json( {
            error: 'name missing'
        } )
    }

    if ( !body.number )
    {
        return response.status( 400 ).json( {
            error: 'number missing'
        } )
    }

    if ( persons.some( e => e.name === body.name ) )
    {
        return response.status( 400 ).json( {
            error: 'name must be unique'
        } )
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat( person )

    response.json( person )
} )

const PORT = process.env.PORT || 3001
app.listen( PORT, () =>
{
    console.log( `Server running on port ${ PORT }` )
} )