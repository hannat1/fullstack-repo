import Part from "./Part"

const Content = ({parts}) => {
    const total = parts.reduce((sum, part) => {
        return sum + part.exercises
      }, 0)

    return (
        <div>
            {parts.map (part =>
                <Part key={part.id} part={part.name} exercises={part.exercises} />
                        )
            }
            <strong>
                total of {total} exercises
            </strong>
    </div>
    )
  }

  export default Content