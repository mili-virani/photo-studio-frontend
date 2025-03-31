import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonGallery, getAllPersons, updatePersonName } from "../utils/api";
import "../assets/css/photos.css";
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

    return (
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
                        <div className="photo-grid">
                            {photos.length > 0 ? (
                                photos.map((photo, index) => (
                                    <img key={index} src={photo.photopath} alt="Person" className="photo-item" />
                                ))
                            ) : (
                                <p>No photos available.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Photos;
