import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddPerson from './components/AddPerson'
import Show from './components/Show'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [message, setMessage] = useState(null)


  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
        }
      )
    }
  
  useEffect(hook, [])


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)
    console.log(existingPerson)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Do you want to replace the old number with the new one?`)) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : updatedPerson
              ))
              setMessage(`${existingPerson.name} updated succesfully!`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setNewName('')
              setNewNumber('')
            })  
      }
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`${returnedPerson.name} added succesfully!`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
  
    
    }
  }

  const handleRemove = (event) => {
    const id = event.target.value
    const person = persons.find(n => n.id === id)
    
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .remove(id, person)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
        setMessage(`${person.name} deleted`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchWord(event.target.value)
  }

  const personsToShow = searchWord
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchWord.toLowerCase())
        ||
        person.number.toLowerCase().includes(searchWord.toLowerCase())
      )
    : persons
    
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter searchWord={searchWord} handleSearchChange={handleSearchChange}/>
     
      <h3>Add a new</h3>
        <AddPerson addPerson={addPerson} newName={newName} 
        newNumber={newNumber} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />

      <h3>Persons</h3>
        <Show personsToShow={personsToShow} handleRemove={handleRemove}/>
    </div>
  )

}

export default App