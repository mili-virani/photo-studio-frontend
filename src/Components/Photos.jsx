import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonGallery, getAllPersons, updatePersonName } from "../utils/api";
import Masonry from "react-masonry-css";
import "../assets/css/photos.css";
import "../assets/css/gallery.css";
import { GrEdit } from "react-icons/gr";

const Photos = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
      document.title = "Photos | Candid Creations"; 
        const fetchData = async () => {
            try {
                const personList = await getAllPersons();
                const personData = personList.find((p) => p.face_id === personId);
                if (personData) {
                    setPerson(personData);
                    setNewName(personData.name); // Initialize name for editing
                    const galleryData = await getPersonGallery(personId);
                    setPhotos(galleryData.photos || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [personId]);

    const handleSave = async () => {
        try {
            const response = await updatePersonName(personId, newName);
            if (!response.error) {
                setPerson({ ...person, name: newName }); // Update UI
                setIsEditing(false);
            } else {
                console.error("Update failed:", response.error);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    // Masonry breakpoint configuration
    const breakpointColumns = {
        default: 4,
        1100: 3,
        768: 2,
        500: 1,
    };

    return (
        <section className="py-5">
            <div className="container">
                <div className="photos-page" style={{ marginTop: "90px" }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
                            <div className="profile-container">
                                <div className="profile-header">
                                    <img src={person?.image} alt={person?.name} className="profile-image" />
                                    <div className="profile-info">
                                        {isEditing ? (
                                            <div className="edit-mode">
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="edit-input"
                                                />
                                                <button onClick={handleSave} className="save-button">Save</button>
                                                <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="view-mode">
                                                <h2>{person?.name}</h2>
                                                <button onClick={() => setIsEditing(true)} className="edit-button"><GrEdit /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Masonry breakpointCols={breakpointColumns} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                                    {photos.length > 0 ? (
                                        photos.map((photo, index) => (
                                            <div className="image-container">
                                                <img key={index} src={photo.photopath} alt="Person" className="masonry-image" />

                                            </div>
                                        ))
                                    ) : (
                                        <p>No photos available.</p>
                                    )}
                                </Masonry>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </section>
    );
};

export default Photos;
