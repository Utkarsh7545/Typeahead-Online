import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get(`https://api.github.com/search/users?q=${query}`);
          setSuggestions(response.data.items || []);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = (username) => {
    setQuery(username);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleClick(suggestions[highlightedIndex].login);
      }
    }
  };

  return (
    <div><h1>Typeahead (Online)</h1>
      <input
        type="text"
        placeholder="Search GitHub users..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && query && (
        <ul>
          {suggestions.length ? (
            suggestions.map((user, index) => (
              <li
                key={user.id}
                onClick={() => handleClick(user.login)}
                style={{
                  backgroundColor: highlightedIndex === index ? "yellow" : "transparent",
                  cursor: "pointer",
                }}
              >
                {user.login}
              </li>
            ))
          ) : (
            <li>No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
