import React, { useEffect, useState } from "react";
import { getAllPersons, updatePersonName } from "../utils/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import backgroundImage from "../assets/img/background/page-header-bg-8.jpg";
import { FaSave } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import "../assets/css/users.css";
import Common from "./Common";
// import GalleryModal from "../Components/GalleryModal"; // Import GalleryModal

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const navigate = useNavigate(); // Inside your component

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllPersons();
            console.log("data", data);
            setUsers(data || []);
        } catch (error) {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingId(user.face_id);
        setEditedName(user.name);
    };

    const handleSaveClick = async (userId) => {
        try {
            await updatePersonName(userId, editedName);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.face_id === userId ? { ...user, name: editedName } : user
                )
            );
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update name:", error);
        }
    };

    const handleImageClick = (personId) => {
        navigate(`/photos/${personId}`);
    };

    return (
        <main className="wrapper">
            <Common title="Users" pageHeaderBg={backgroundImage} />
            <section className="py-5">
                <div className="container">
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && users.length === 0 && <p>No users available.</p>}
                    <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
                    {!loading && !error && users.length > 0 && (
                        
                        <div className="user-grid">
                            {users.map((user) => (
                                <div key={user.face_id} className="user-card">
                                    {/* Clickable Image */}
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="user-image"
                                        onClick={() => handleImageClick(user.face_id)} // Open modal on click
                                        style={{ cursor: "pointer" }} // Indicate it's clickable
                                    />
                                    {editingId === user.face_id ? (
                                        <div className="edit-container">
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="edit-input"
                                            />
                                            <button
                                                onClick={() => handleSaveClick(user.face_id)}
                                                className="save-btn"
                                            >
                                                <FaSave />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="user-info">
                                            <div className="name-edit-container">
                                                <p className="user-name">{user.name}</p>
                                                <AiFillEdit
                                                    onClick={() => handleEditClick(user)}
                                                    className="edit-icon"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Gallery Modal
            {isGalleryOpen && (
                <GalleryModal
                    isOpen={isGalleryOpen}
                    setIsOpen={setIsGalleryOpen}
                    personId={selectedPersonId}
                />
            )} */}
        </main>
    );
};

export default Users;
