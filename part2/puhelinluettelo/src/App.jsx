import { useState } from 'react'
import Filter from './components/Filter'
import AddPerson from './components/AddPerson'
import Show from './components/Show'

const App = () => {
  const [persons, setPersons] = useState([
      { name: 'Arto Hellas', number: '040-123456' },
      { name: 'Ada Lovelace', number: '39-44-5323523' },
      { name: 'Dan Abramov', number: '12-43-234345' },
      { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')


  const addPerson = (event) => {
    console.log(event, "event")
    console.log(persons)
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map(person => person.name).includes(newName)){
      console.log("alert")
      window.alert(`${newName} is already added to phonebook`)
    } else{
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
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
        <Filter searchWord={searchWord} handleSearchChange={handleSearchChange}/>
     
      <h3>Add a new</h3>
        <AddPerson addPerson={addPerson} newName={newName} 
        newNumber={newNumber} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h3>Persons</h3>
        <Show personsToShow={personsToShow} />
     
   
    </div>
  )

}

export default App