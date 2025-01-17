import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({text, value}) => {
  return (
      <tbody>
        <tr>
          <td style={{textAlign: "left" }}>{text}</td>
          <td style={{textAlign: "right" }}>{value}</td>
        </tr>
      </tbody>
  )
}

const Statistics = ({good, neutral, bad, all}) => {
  const average = ((good - bad) / (all))
  const pos = ((good) / (all) * 100 )

  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
    return (
      <div>
          <h1>statistics</h1>
          <table>
            <StatisticsLine text="good" value={good} />
            <StatisticsLine text="neutral" value={neutral} />
            <StatisticsLine text="bad" value={bad} />
            <StatisticsLine text="all" value={all} />
            <StatisticsLine text="average" value={average} />
            <StatisticsLine text="positive" value={pos + " %"} />
          </table>
      </div>
    )

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="good"/>
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} all={good + bad + neutral}/>
    </div>
  )
}

export default App
