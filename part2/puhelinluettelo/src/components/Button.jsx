const Button = ({handleRemove, id}) => {
    return (
        <button 
        onClick={handleRemove} 
        value={id}>
        delete
        </button>
        )
    }

export default Button