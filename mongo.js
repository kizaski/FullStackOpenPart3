const mongoose = require( 'mongoose' )

if ( process.argv.length < 3 )
{
    console.log( 'give password as argument' )
    process.exit( 1 )
}

const password = process.argv[ 2 ]
const name = process.argv[ 3 ]
const number = process.argv[ 4 ]

const url =
    `mongodb+srv://kizaski:${ password }@cluster0.npuskb8.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set( 'strictQuery', false )
mongoose.connect( url )


const personSchema = new mongoose.Schema( {
    name: String,
    number: String,
} )

const Person = mongoose.model( 'Person', personSchema )

if ( !name || !number )
{
    console.log( "number or name not supplied" )
    console.log( "listing entries" )
    Person.find({}).then(persons => {
        console.log( `persons: ${persons}`)
    })
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