import './SearchResults.css';

interface SearchResultsProps {
  inSearch: boolean,
}

export const SearchResults = ({inSearch}:SearchResultsProps) => {

  return (
    <>
      {inSearch && (
        <div className="search-results">
          <p>test</p>
        </div>
      )}
    </>
    
  )
}