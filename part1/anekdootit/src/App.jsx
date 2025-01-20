import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const TopAnecdote = ({votes, anecdotes}) => {
  const topVotes = Math.max(...votes)
  const topIndex = votes.indexOf(topVotes)

  return(
    <div>
      <p>{anecdotes[topIndex]}</p>
      <p>has {topVotes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))

  const handleSelect = () => {
    const newSelection = Math.floor((Math.random() * anecdotes.length));
    setSelected(newSelection)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1 
    setVote(copy)
  }    

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p></p>
      <Button handleClick={handleSelect} text="Show another anecdote" />
      <p>has {votes[selected]} votes</p>
      <Button handleClick={handleVote} text="vote" />

      <h1>Anecdote with the most votes</h1>
      <TopAnecdote votes={votes} anecdotes={anecdotes}/>
    </div>
  )
}

export default App