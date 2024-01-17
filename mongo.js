const mongoose = require( 'mongoose' )
require( 'dotenv' ).config()

if ( process.argv.length < 3 )
{
    console.log( 'give password as argument' )
    process.exit( 1 )
}

//const password = process.argv[ 2 ]
const name = process.argv[ 3 ]
const number = process.argv[ 4 ]

const url = process.env.MONGODB_URI

mongoose.set( 'strictQuery', false )
mongoose.connect( url )


const personSchema = new mongoose.Schema( {
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function ( v )
            {
                console.log('v: ',v)
                return /\d{2,3}-\d{7,8}/.test( v )
            },
            message: props => `${ props.value } is not a valid phone number!`
        },
        required: [ true, 'User phone number required' ]
    }
} )

const Person = mongoose.model( 'Person', personSchema )

if ( !name || !number )
{
    console.log( 'number or name not supplied' )
    console.log( 'listing entries' )
    Person.find( {} ).then( persons =>
    {
        console.log( `persons: ${ persons }` )
        mongoose.connection.close()
    } )
}

const person = new Person( {
    name: name,
    number: number,
} )

person.save().then( result =>
{
    console.log( `added ${ result.name } ${ result.number } to phonebook\n` )
    mongoose.connection.close()
} )