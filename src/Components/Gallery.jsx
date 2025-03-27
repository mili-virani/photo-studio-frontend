import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import { recognizeFace, getAllPhotos, getPersonGallery, removeDuplicates, deletePhoto } from "../utils/api";
import backgroundImage from "../assets/img/background/page-header-bg-8.jpg";
import "../assets/css/gallery.css";
import { FaTrash } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import { FaUsers } from "react-icons/fa6";

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [removingDuplicates, setRemovingDuplicates] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllPhotos();
      console.log("data", data);
      if (data && data.length > 0) {
        setProjects(data);
        setAllProjects(data);
      } else {
        setError("No photos available.");
      }
    } catch (error) {
      setError("Failed to load gallery.");
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
      formData.append("image", file);

      const response = await recognizeFace(formData);
      if (response && response.faces.length > 0) {
        const personId = response.faces[0]?.person_id;
        const galleryResponse = await getPersonGallery(personId);

        if (galleryResponse && galleryResponse.photos) {
          setProjects(galleryResponse.photos);
        } else {
          setError("No photos found for this person.");
        }
      } else {
        setError("No matching faces found.");
      }
    } catch (error) {
      setError("Error processing face recognition.");
    } finally {
      setUploading(false);
    }
  };

  const resetGallery = () => {
    setProjects(allProjects);
    setError(null);
  };

  const handleRemoveDuplicates = async () => {
    try {
      setRemovingDuplicates(true);
      const response = await removeDuplicates();

      if (response.error) {
        setError(response.error);
      } else {
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      setError("Failed to remove duplicates.");
    } finally {
      setRemovingDuplicates(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await deletePhoto(imageId);
      fetchGallery(); // Refresh gallery after deletion
    } catch (error) {
      alert("Failed to delete image.");
    }
  };

  const openModal = (index) => {
    console.log("Opening modal for index:", index);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal...");
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };



  // **Masonry Grid Breakpoints**
  const breakpointColumns = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1,
  };

  return (
    <main className="wrapper">
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <h2 className="wptb-item--title">Our Photos</h2>
        </div>
      </div>

      <div className="text-container">
        <div className="text-first pe-5 my-4" style={{ paddingLeft: "3rem" }}>
          <button className="styled-button users" onClick={() => navigate("/users")}>
            <FaUsers size={25} style={{ marginRight: "10px" }} />
            All People
          </button>
        </div>

        <div className="text-second pe-5 my-4">
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} id="upload-input" />
          <label htmlFor="upload-input" className="styled-button primary">
            <LuUpload size={20} />
            {uploading ? "  Searching..." : "   Upload"}
          </label>

          {projects.length !== allProjects.length && (
            <button className="styled-button secondary" onClick={resetGallery}>
              Show All Photos
            </button>
          )}

          <button className="styled-button warning" onClick={handleRemoveDuplicates} disabled={removingDuplicates}>
            <GoTrash size={20} />
            {removingDuplicates ? "    Removing Duplicates..." : "   Remove Duplicates"}
          </button>
        </div>
      </div>


      <section className="py-5">
        <div className="container">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            <Masonry breakpointCols={breakpointColumns} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
              {projects.map((project, index) => (
                <div key={project._id} className="masonry-item">
                  <div className="image-container">
                    <img
                      src={project.photopath}
                      alt="Gallery"
                      className="masonry-image"
                      onClick={() => openModal(index)}
                    />

                    {/* Hover Effects */}
                    <div className="hover-overlay">
                      <button className="delete-btn" onClick={() => handleDelete(project.image_id)}>
                        <FaTrash size={20} color="white" />
                      </button>

                      <div className="overlay-container">
                        {project.matched_faces &&
                          project.matched_faces.map((face, faceIndex) =>
                            face.person_photo ? (
                              <img
                                key={faceIndex}
                                src={face.person_photo}
                                alt={`Person ${faceIndex}`}
                                className="overlay-face"
                              />
                            ) : null
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </section>

      {/* {modalOpen && projects.length > 0 && (
        <div className="modal-overlay-gallery" onClick={closeModal}>
          <div className="modal-content-gallery" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-gallery" onClick={closeModal}>
              &times;
            </button>
            <button className="nav-btn left" onClick={prevImage}>
              &#10094;
            </button>
            <img
              src={projects[currentImageIndex].photopath}
              alt="Preview"
              className="modal-image-gallery"
            />
            <button className="nav-btn right" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )} */}
      {modalOpen && projects.length > 0 && (
  <div className="modal-overlay-gallery" onClick={closeModal}>
    <button className="close-btn-gallery" onClick={closeModal}>
      &times;
    </button>
    <button
      className="nav-btn left"
      onClick={(e) => {
        e.stopPropagation();
        prevImage();
      }}
    >
      &#10094;
    </button>
    <div
      className="modal-content-gallery"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={projects[currentImageIndex].photopath}
        alt="Preview"
        className="modal-image-gallery"
      />
    </div>
    <button
      className="nav-btn right"
      onClick={(e) => {
        e.stopPropagation();
        nextImage();
      }}
    >
      &#10095;
    </button>
  </div>
)}

    </main>
  );
};

export default Gallery;
