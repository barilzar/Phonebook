import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Number = function(props){
return <div>{props.name} {props.number} <button onClick={() => props.removePerson(props.id)}>Delete</button></div>
}

const Persons = function(props){
return props.persons.map(contact => 
  <Number name = {contact.name} number = {contact.number} key = {contact.id} removePerson = {props.removePerson} id = {contact.id} />)
}

const Filter = function(props){
return <input onChange = {props.onFilterChange} />
}

const Message = function({msg, error}){
return <div className = {(error ? "error" : "fine") + " message"}>{msg}</div>
}

const AddForm = function({newName, newNumber, onNameChange, onNumberChange, addContact}){
  return(
    <form onSubmit = {addContact}>
        <div>
          name: <input value = {newName} onChange = {onNameChange} />
          number: <input value = {newNumber} onChange = {onNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }
  , [])

  useEffect(() =>
    setPersonsToShow([...persons])
  , [persons])

  const onNameChange = function(event){
    setNewName(event.target.value)
  }

  const onNumberChange = function(event){
    setNewNumber(event.target.value)
  }

  const onFilterChange = function(event){
    let filter = event.target.value

    setPersonsToShow(filterPersons(filter))
  }

  const filterPersons = function(filter){
    if(filter !== '')
      return persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    else
      return persons
  }

  const addContact = function(event){
    event.preventDefault()
  
    const newContact = {
      name: newName,
      number: newNumber
    }

    for(let contact of persons){
      if(contact.name === newContact.name){
        if(contact.number === newNumber){
          alert(`${newContact.name} is already in contacts.`)
          return
        }
        if(window.confirm(`Do you want to change the number for ${newContact.name} ?`)){
          newContact.id = contact.id
          updatePerson(newContact)
          return
        }
      }
    }

    createPerson(newContact)
  }

  const createPerson = function(p){
    personService
      .create(p)
      .then(response =>{
        setPersons(persons.concat(response.data))
        setNewName("")
        setNewNumber("")
      })
      .then(() => {
        setMessage("Person added")
        setError(false)
        setTimeout(() =>
          setMessage(null), 5000)
      })
  }

  const updatePerson = function(p){
    personService
      .update(p.id, p)
      .then(() =>
        persons.find(po => po.id === p.id).number = p.number)
      .then(() => {
        setMessage("Person changed")
        setError(false)
        setTimeout(() =>
          setMessage(null), 5000)
      })
      .catch(error => {
        setMessage("Update failed")
        setError(true)
        setTimeout(() =>
          setMessage(null), 5000)
      })
  }

  const removePerson = function(id){

    if(window.confirm(`Are you sure you want to remove ${persons.find(p => p.id === id).name}`)){
      
      personService
        .remove(id)
        .then(() =>
          setPersons(persons.filter(p =>
            p.id !== id)))

      setMessage("person removed")
      setError(false)
      setTimeout(() =>
        setMessage(null), 5000)
    }
  }

  return (
    <div>
      { message
      ? <Message msg = {message} error = {error}/>
      : null
      }
      <h2>Phonebook</h2>
      <AddForm newNumber = {newNumber} addContact = {addContact} onNumberChange = {onNumberChange} newName = {newName} onNameChange = {onNameChange}/>
      <h2>Filter</h2>
      <Filter onFilterChange = {onFilterChange}/>
      <h2>Numbers</h2>
      <Persons persons = {personsToShow} removePerson = {removePerson} />
    </div>
  )

}

export default App