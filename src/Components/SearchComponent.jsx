import React, { useState } from 'react';
import axios from 'axios';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5001/search', {
                params: { query }, // Send user's input dynamically
            });
            console.log(response.data); // or response.data.results if your backend sends `results`
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ marginTop: "150px" }}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>

            <div>
                {results.map((item, idx) => (
                    <div key={idx}>
                        <img src={`images/${item.image}`} alt="Search result" style={{ width: '200px' }} />
                        <p>Distance: {item.distance.toFixed(4)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchComponent;
