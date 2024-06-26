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
    let now = new Date()
    let count = Person.length + 1
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

app.delete( '/api/persons/:id', ( request, response, next ) =>
{
    console.log( `DELETE request.params.id: ${ request.params.id }` )
    Person.findByIdAndRemove( request.params.id )
        .then( result =>
        {
            console.log('result: ', result)
            response.status( 204 ).end()
        } )
        .catch( error => next( error ) )
} )


app.post( '/api/persons', async ( request, response, next ) =>
{
    const body = request.body

    if ( !body.name || !body.number )
    {
        return response.status( 400 ).json( {
            error: 'name or number is missing'
        } )
    }

    let people = await Person.find( { name: body.name } )

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

    person.save()
        .then( savedPerson =>
        {
            response.json( savedPerson )
        } )
        .catch( error => next( error ) )
} )

app.put( '/api/persons/:id', async ( request, response, next ) =>
{
    const body = request.body

    const person = ( {
        name: body.name,
        number: body.number
    } )

    console.log( `UPDATE request.params.id: ${ request.params.id }` )
    Person.findByIdAndUpdate( request.params.id, person, { new: true, runValidators: true } ) // runValidators doesnt work
        .then( savedPerson =>
        {
            response.json( savedPerson )
        } )
        .catch( error => next( error ) )
} )


const unknownEndpoint = ( request, response ) =>
{
    response.status( 404 ).send( { error: 'unknown endpoint' } )
}
// handler of requests with unknown endpoint
app.use( unknownEndpoint )

const errorHandler = ( error, request, response, next ) =>
{
    console.error( error.message )

    if ( error.name === 'CastError' )
    {
        return response.status( 400 ).send( { error: 'malformatted id' } )
    } else if ( error.name === 'ValidationError' )
    {
        return response.status( 400 ).json( { error: error.message } )
    }

    next( error )
}
// this has to be the last loaded middleware.
app.use( errorHandler )


app.listen( PORT, () =>
{
    console.log( `Server running on port ${ PORT }` )
} )