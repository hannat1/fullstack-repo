const Notification = ({ message }) => { 
    if (message === null) {
      return null
    } 
    if (message.includes('succesfully') === true) {
      console.log((message.includes('succesfully')), "include")
      return (
        <div className="success">
          {message}
        </div>
      )
    } 
    console.log((message.includes('succesfully')), "include")

    return (
      <div className="error">
        {message}
      </div>
    )
  }

  export default Notification