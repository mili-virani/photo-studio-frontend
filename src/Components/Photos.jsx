import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonGallery, getAllPersons } from "../utils/api";
import "../assets/css/photos.css";

const Photos = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const personList = await getAllPersons();
                const personData = personList.find((p) => p.face_id === personId);
                console.log("personlist",personList);
                if (personData) {
                    setPerson(personData);
                    const galleryData = await getPersonGallery(personId);
                    console.log("galleryData",galleryData);
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

    return (
        <div className="photos-page" style={{marginTop:"90px"}}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
                    <div className="profile-container">
                    <div className="profile-header">
                        <img src={person?.image} alt={person?.name} className="profile-image" />
                        <h2>{person?.name}</h2>
                    </div>
                    <div className="photo-grid">
                        {photos.length > 0 ? (
                            photos.map((photo, index) => (
                                console.log("Image URL:", photo.photopath), // Debugging line
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
