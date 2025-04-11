import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5001/search', { query });
            const results = response.data.results;

            // Take top 5 results
            const topImages = results.slice(0, 1);
            setImages(topImages);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    return (
        <div className="p-6" style={{marginTop:"130px"}}>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for images..."
                className="border p-2 rounded w-64 mr-2"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
                Search
            </button>

            <div className="gap-4">
                {images.map((img, idx) => (
                    <div key={idx} className=" p-2 rounded shadow">
                        <img
                            src={`http://localhost:5001/${img.image.replace('./', '')}`}
                            alt={`result-${idx}`}
                            className="w-full h-auto rounded"
                            style={{height:"400px",width:"400px"}}
                        />
                        <p className="text-sm text-gray-500 mt-2">Score: {img.score.toFixed(4)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchComponent;
