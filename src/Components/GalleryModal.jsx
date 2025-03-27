import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { getPersonGallery } from "../utils/api";
import "../assets/css/gallery-modal.css";

export default function GalleryModal({ isOpen, setIsOpen, personId }) {
    const [selectedImage, setSelectedImage] = useState();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await getPersonGallery(personId);
            if (response && Array.isArray(response?.photos)) {
                setImages(response?.photos || []);
                setSelectedImage(response?.photos.length ? response?.photos[0] : null);
            } else {
                setImages([]);
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && personId) {
            fetchImages();
        }
    }, [isOpen, personId]);

    const nextImage = () => {
        if (!selectedImage || images.length === 0) return;
        const currentIndex = images.findIndex((img) => img.image_id === selectedImage.image_id);
        setSelectedImage(images[(currentIndex + 1) % images.length]);
    };

    const prevImage = () => {
        if (!selectedImage || images.length === 0) return;
        const currentIndex = images.findIndex((img) => img.image_id === selectedImage.image_id);
        setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="overlay-gallery">
            <div className="modal">
                {/* Close Button */}
                <button onClick={() => setIsOpen(false)} className="close-button">&times;</button>

                {/* Main Image View */}
                <div className="image-view">
                    <button onClick={prevImage} className="nav-button left">&lt;</button>

                    <img 
                        src={`http://68.183.93.60/py/face_recognization/${selectedImage?.photopath}`} 
                        alt={selectedImage?.image_id} 
                        className="main-image" 
                    />

                    <button onClick={nextImage} className="nav-button right">&gt;</button>
                </div>

                {/* Thumbnails */}
                <div className="thumbnail-container">
                    {images.map((img) => (
                        <img
                            key={img?.image_id}
                            src={`http://68.183.93.60/py/face_recognization/${img?.photopath}`}
                            alt={img.image_id}
                            className={`thumbnail ${img.image_id === selectedImage?.image_id ? "selected" : ""}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
            </div>
        </Dialog>
    );
}
