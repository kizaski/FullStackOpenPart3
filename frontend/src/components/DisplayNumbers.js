import React from 'react'
import personService from '../services/persons'

const DisplayNumbers = ( props ) =>
{
  const persons = props.persons
  const setPersons = props.setPersons
  const filter = props.filter

  const deletePerson = person =>
  {
    if ( window.confirm( `Delete ${ person.name }, id: ${ person.id }?` ) )
    {
      personService
        .remove( person.id )
        .then( () =>
        {
          props.setMessageType( "info" )
          props.setMessage( `Deleted person '${ person.name }'` )
          setTimeout( () => { props.setMessage( null ) }, 5000 )

          setPersons( persons.filter( pp => pp.id !== person.id ) )
        } )
        .catch( error =>
        {
          props.setMessageType( "error" )
          props.setMessage( `Person '${ person.name }' was already removed from server` )
          setTimeout( () => { props.setMessage( null ) }, 5000 )

          setPersons( persons.filter( pp => pp.id !== person.id ) )
        } )
    }
  }

  const display = props.persons
    .filter( p => p.name.match( filter ) )
    .map( p =>
      <div>{ p.name } { p.number } <button onClick={ () => deletePerson( p ) }>delete</button> </div>
    )

  return (
    <>{ display }</>
  )
}

export default DisplayNumbers