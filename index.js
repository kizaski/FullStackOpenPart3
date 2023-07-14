const express = require( 'express' )
const morgan = require( 'morgan' )
const cors = require( 'cors' )

require( 'dotenv' ).config()
const Person = require( './models/person' )
const PORT = process.env.PORT || 3001

const app = express()
app.use( express.static( 'build' ) )
app.use( express.json() )
app.use( cors() )

morgan.token( 'body', req =>
{
    return JSON.stringify( req.body )
} )
app.use( morgan( ':method :url :status :res[content-length] - :response-time ms :body' ) )


const errorHandler = ( error, request, response, next ) =>
{
    console.error( error.message )

    if ( error.name === 'CastError' )
    {
        return response.status( 400 ).send( { error: 'malformatted id' } )
    }

    next( error )
}
// this has to be the last loaded middleware.
app.use( errorHandler )

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendieck",
//         number: "39-23-6423122"
//     },
//     {
//         id: 5,
//         name: "WUT",
//         number: "DUFUQ2343454545454545"
//     },
// ]

app.get( '/info', ( request, response ) =>
{
    now = new Date()
    count = Person.length + 1
    response.send( `
        <p>Phonebook has info for ${ count } people </p>
        <p>${ now }</p>
    ` )
} )

app.get( '/api/persons', ( request, response ) =>
{
    Person.find( {} ).then( persons =>
    {
        response.json( persons )
    } )
} )


app.get( '/api/persons/:id', ( request, response, next ) =>
{
    Person.findById( request.params.id )
        .then( person =>
        {
            if ( person )
            {
                response.json( person )
            } else
            {
                response.status( 404 ).end()
            }
        } )
        .catch( error => next( error ) )
} )

//
app.delete( '/api/persons/:id', ( request, response ) =>
{
    const id = Number( request.params.id )
    persons = persons.filter( p => p.id !== id )

    response.status( 204 ).end()
} )


app.post( '/api/persons', async ( request, response ) =>
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

    people = await Person.find( { name: body.name } )

    if ( people.some( e => e.name === body.name ) )
    {
        return response.status( 400 ).json( {
            error: 'name must be unique'
        } )
    }

    const person = new Person( {
        name: body.name,
        number: body.number
    } )

    person.save().then( savedPerson =>
    {
        response.json( savedPerson )
    } )
} )

app.listen( PORT, () =>
{
    console.log( `Server running on port ${ PORT }` )
} )