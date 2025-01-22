const Filter = ({searchWord, handleSearchChange}) => {
    return (
        <form>
        filter shown with 
            <input 
                value={searchWord}
                onChange={handleSearchChange}
                />

        </form>
    )
}

export default Filter
