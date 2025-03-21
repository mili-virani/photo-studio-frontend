import React, { useEffect, useState } from "react";
import { recognizeFace, getAllPhotos, removeDuplicates } from "../utils/api";
import backgroundImage from "../assets/img/background/page-header-bg-8.jpg";
import "../assets/css/gallery.css";

const Gallery = () => {
  const [projects, setProjects] = useState([]); // Stores displayed images
  const [allProjects, setAllProjects] = useState([]); // Stores all images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all images on component mount
  useEffect(() => {
    fetchGallery();
  }, []);

  // const fetchGallery = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getAllPhotos();
  //     setProjects(data); // Show all photos initially
  //     setAllProjects(data);
  //   } catch (error) {
  //     setError("Failed to load gallery.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getAllPhotos();
      
      console.log("API Response:", data); // Debugging
  
      if (data && data.length > 0) {
        setProjects(data.photos);
        setAllProjects(data.photos);
      } else {
        setError("No photos available from API.");
      }
    } catch (error) {
      setError("Failed to load gallery.");
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await recognizeFace(formData);
      if (response && response.matchedPhotos) {
        setProjects(response.matchedPhotos); // Show only matching photos
      } else {
        setError("No matching faces found.");
      }
    } catch (error) {
      setError("Error recognizing face.");
    } finally {
      setUploading(false);
    }
  };

  const resetGallery = () => {
    setProjects(allProjects); // Reset to all photos
    setError(null);
  };

  const handleRemoveDuplicates = async () => {
    try {
      const response = await removeDuplicates();
      if (response && response.success) {
        fetchGallery(); // Refresh gallery after removing duplicates
      } else {
        setError("Error removing duplicates.");
      }
    } catch (error) {
      setError("Error removing duplicates.");
    }
  };

  return (
    <main className="wrapper">
      {/* Page Header */}
      <div className="wptb-page-heading">
        <div
          className="wptb-item--inner"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <h2 className="wptb-item--title">Our Photos</h2>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center my-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
          id="upload-input"
        />
        <label htmlFor="upload-input" className="btn btn-primary mx-2">
          {uploading ? "Searching..." : "Upload Image for Face Search"}
        </label>

        {projects.length !== allProjects.length && (
          <button className="btn btn-secondary mx-2" onClick={resetGallery}>
            Show All Photos
          </button>
        )}

        <button className="btn btn-danger mx-2" onClick={handleRemoveDuplicates}>
          Remove Duplicates
        </button>
      </div>

      {/* Gallery */}
      <section className="py-5">
        <div className="container">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            <div className="row">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project._id} className="col-md-4 mb-4">
                    <div className="card bg-transparent border-none shadow-lg">
                      <img
                        src={project.image || "logo.svg"}
                        alt="Gallery Image"
                        className="card-img-top img-fluid object-fit-cover"
                        style={{ height: "500px", width: "100%" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No photos available.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Gallery;
