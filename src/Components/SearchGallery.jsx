import React, { useState } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";

const SearchGallery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:7979/search?query=${query}`);
      console.log("Response:", response);
      const filteredResults = response.data.results.filter((result) => result.similarity >= 0.2);
      setResults(filteredResults);
    } catch (error) {
      console.error("Error searching images:", error);
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      <style>
        {`
          .search-container {
            padding: 16px;
            margin-top: 100px;
          }

          .search-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
          }

          .search-input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            flex-grow: 1;
          }

          .search-button {
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .search-button:hover {
            background-color: #0056b3;
          }

          .masonry-container {
            display: flex;
            gap: 16px;
          }

          .masonry-column {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .image-container {
            margin-bottom: 16px;
          }

          .result-image {
            width: 100%;
            border-radius: 8px;
            object-fit: cover;
            max-height: 400px;
          }

          .similarity-text {
            text-align: center;
            font-size: 14px;
            color: #6c757d;
            margin-top: 8px;
          }
        `}
      </style>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-container"
          columnClassName="masonry-column"
        >
          {results.map((result, index) => (
            <div key={index} className="image-container">
              <img src={result.path} alt="result" className="result-image" />
              <p className="similarity-text">
                Similarity: {result.similarity.toFixed(2)}
              </p>
            </div>
          ))}
        </Masonry>
      </div>
    </>
  );
};

export default SearchGallery;
