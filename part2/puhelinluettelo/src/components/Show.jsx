import Button from "./Button"

const Show = ({personsToShow, handleRemove}) => {
    return (
        <div>
            {personsToShow.map(person => 
                <p key={person.name}>{person.name} {person.number}
                <Button handleRemove={handleRemove} id={person.id} /> 
                </p>
                )
            }
        </div>
    )
}

export default Show