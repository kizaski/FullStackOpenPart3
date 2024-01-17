import { react, useState } from 'react'
import personService from '../services/persons'

const PersonForm = ( props ) =>
{
  const persons = props.persons
  const setPersons = props.setPersons

  const [ newName, setNewName ] = useState( '' )
  const [ newNumber, setNewNumber ] = useState( '' )

  const nameInput = ( event ) => { setNewName( event.target.value ) }
  const numberInput = ( event ) => { setNewNumber( event.target.value ) }

  const newPerson = { name: newName, number: newNumber }

  const submitPerson = ( event ) =>
  {
    event.preventDefault()

    if ( persons.every( p => p.name !== newName ) )
    {
      personService.create( newPerson ).then( response =>
      {
        props.setMessageType( "info" )
        props.setMessage( `Added person '${ newPerson.name }'` )
        setTimeout( () => { props.setMessage( null ) }, 5000 )

        console.log( "personService.create response.data: ", response.data )
        setPersons( [ ...persons, response.data ] )
      } )
    }
    else
    {
      const dupe = props.persons.find( p => p.name == newName )
      if ( window.confirm( `${ dupe.name } is already added to the phonebook. Replace the old one?` ) )
      {
        personService
          .update( dupe.id, newPerson )
          .then( response =>
          {
            props.setMessageType( "info" )
            props.setMessage( `Updated person '${ newPerson.name }'` )
            setTimeout( () => { props.setMessage( null ) }, 5000 )

            console.log( "personService.update response.data: ", response.data )
            setPersons( persons.map( person => person.id !== dupe.id ? person : response.data ) )
          } )
          .catch( error =>
          {
            props.setMessageType( "error" )
            props.setMessage( `Person '${ newPerson }' was already removed from server` )
            setTimeout( () => { props.setMessage( null ) }, 5000 )
            
            setPersons( persons.filter( p => p.id !== dupe.id ) )
          } )
      }
    }
  }

  return (
    <form onSubmit={ submitPerson }>
      <div>
        name: <input
          value={ newName }
          onChange={ nameInput } />
        <br />
        number: <input
          value={ newNumber }
          onChange={ numberInput } />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form >
  )
}

export default PersonForm