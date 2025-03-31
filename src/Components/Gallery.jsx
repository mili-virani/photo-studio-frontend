import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import { recognizeFace, getAllPhotos, removeDuplicates, deletePhoto, applyAIFilter, saveUpdatedPhoto } from "../utils/api";
import backgroundImage from "../assets/img/background/page-header-bg-8.jpg";
import "../assets/css/gallery.css";
import { FaTrash } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import { FaUsers } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // New state for submit button
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [removingDuplicates, setRemovingDuplicates] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

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

  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   try {
  //     setUploading(true);
  //     setError(null);

  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const response = await recognizeFace(formData);
  //     if (response && response.faces.length > 0) {
  //       const personId = response.faces[0]?.person_id;
  //       const galleryResponse = await getPersonGallery(personId);

  //       if (galleryResponse && galleryResponse.photos.length > 0) {
  //         setProjects(galleryResponse.photos);
  //       } else {
  //         setError("No photos found for this person.");
  //         setProjects([]); // Ensure "Show All Photos" button appears
  //       }
  //     } else {
  //       setError("No matching faces found.");
  //       setProjects([]); // Ensure "Show All Photos" button appears
  //     }
  //   } catch (error) {
  //     setError("Error processing face recognition.");
  //     setProjects([]); // Ensure gallery resets on error
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      await recognizeFace(formData); // Just call the API, no state updates
    } catch (error) {
      console.error("Error recognizing face:", error);
    }
    fetchGallery();
  };

  const resetGallery = () => {
    setProjects(allProjects);
    setError(null);
    fetchGallery();
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

  const handleApplyAIFilter = async () => {
    setIsGenerating(true);
    if (!aiPrompt || projects.length === 0) return;
    try {
      const imageId = projects[currentImageIndex]?.image_id;
      const response = await applyAIFilter(aiPrompt, imageId);

      if (response?.status === "success") {
        setAiGeneratedImage(response?.path);
        setIsGenerating(false);
        setAiPrompt("");
        // setIsGenerating(false);
      }
      setSaveModalOpen(true);
    } catch (error) {
      alert("Error applying AI filter.");
    }
  };

  const handleSaveUpdatedPhoto = async () => {
    try {
      const imageId = projects[currentImageIndex]?.image_id;
      const response = await saveUpdatedPhoto(imageId);
      console.log("response: ", response);
      if (response?.status === "success") {
        alert("Image saved successfully.");
        setSaveModalOpen(false);
        setModalOpen(false);
        // setAiGeneratedImage(null);
        fetchGallery();
      }

    } catch (error) {
      alert("Error saving image.");
    }
  };

  // const openModal = (index) => {
  //   console.log("Opening modal for index:", index);
  //   setCurrentImageIndex(index);
  //   setModalOpen(true);
  // };

  const openModal = (index) => {
    console.log("Opening modal for index:", index);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };


  const closeModal = () => {
    console.log("Closing modal...");
    setModalOpen(false);
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };


  // const nextImage = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projects.length);
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  // };


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

          {(projects.length !== allProjects.length || projects.length === 0) && (
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
                    {/* <img
                      src={project.photopath}
                      alt="Gallery"
                      className="masonry-image"
                      onClick={() => openModal(index)}
                    /> */}
                    <img
                      src={project.photopath}
                      alt="Gallery"
                      className="masonry-image"
                      onClick={(e) => {
                        // Only open modal if the click is directly on the image, not on buttons
                        if (e.target.tagName === 'IMG') {
                          openModal(index);
                        }
                      }}
                    />


                    {/* Hover Effects */}
                    <div className="hover-overlay">
                      <button className="delete-btn" onClick={() => handleDelete(project.image_id)}>
                        <FaTrash size={20} color="white" />
                      </button>

                      {/* Download Button */}
                      <button
                        className="download-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event from bubbling to parent elements
                          e.preventDefault(); // Prevent any default behavior
                          downloadImage(project.photopath, `image-${Date.now()}.jpg`);
                          
                        }}
                      >
                       <FiDownload color="white" size={30}/>
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

      {modalOpen && projects.length > 0 && (
        <div className="modal-overlay-gallery">
          {/* <div className="modal-white-gallery"> */}
          <div className={`modal-content-gallery`}
            onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-gallery" onClick={closeModal}>
              &times;
            </button>

            <img
              src={projects[currentImageIndex].photopath}
              alt="Preview"
              className={`modal-image-gallery ${isGenerating ? "blurred" : ""}`}
              style={{
                width: "500px",
                height: "700px",
                objectFit: "contain",
                position: "absolute",
              }}
            />
            {isGenerating && (
              <div
                style={{
                  position: "relative",
                  width: "16rem", // 64 * 0.25rem
                  height: "24rem", // 96 * 0.25rem
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.5rem", // Tailwind's rounded-lg
                  top: "50px",
                  left: "50px",
                  // background: "rgba(0, 0, 0, 0)"
                }}
              >
                <div className="loader-class">
                  <div class="loader"></div>
                  <p className="text-white">Generating image...</p>
                </div>
              </div>
            )}
            <div className="ai-filter-section">
              <input type="text" placeholder="Enter prompt..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              <button type="submit" onClick={handleApplyAIFilter} disabled={isGenerating}
              >{isGenerating ? "Generating..." : "Submit"}</button>
            </div>
          </div>
        </div>
        // </div>
      )}

      {/* {saveModalOpen && (
        <div className="modal2-overlay-gallery" onClick={() => setSaveModalOpen(false)}>
          <div className="modal2-content-gallery" onClick={(e) => e.stopPropagation()} style={{backgroundColor:"white"}}>
            {aiGeneratedImage && (
              <div className="ai-preview">
                <img src={aiGeneratedImage} style={{ width: "400px", height: "600px" }} alt="AI Modified" className="ai-generated-image" />
                <p>Do you want to save the modified image?</p>
                <button onClick={handleSaveUpdatedPhoto}>Yes</button>
                <button onClick={() => setSaveModalOpen(false)}>No</button>
              </div>
            )}
          </div>
        </div>
      )} */}

      {saveModalOpen && (
        <div className="modal2-overlay-gallery" onClick={() => setSaveModalOpen(false)}>
          <div className="modal2-content-gallery" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              {aiGeneratedImage && (
                <div className="ai-preview">
                  <img
                    src={aiGeneratedImage}
                    alt="AI Modified"
                    className="ai-generated-image"
                  />
                  <p className="modal-text">Do you want to save the modified image?</p>
                  <div className="modal-buttons-photo">
                    <button className="yes-button" onClick={handleSaveUpdatedPhoto}>Yes</button>
                    <button className="no-button" onClick={() => setSaveModalOpen(false)}>No</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </main>
  );
};

export default Gallery;
