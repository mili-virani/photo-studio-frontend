import axios from "axios";

const loginid = "67bd6985e187bcfe861c3036";

// Upload image & recognize face
export const recognizeFace = async (formData) => {
    try {
        const response = await axios.post(`/recognize`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                loginid: loginid,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error recognizing face:", error.response?.data || error.message);
        return { error: error.response?.data || "Face recognition failed" };
    }
};

// Get all photos
export const getAllPhotos = async () => {
    try {
        const response = await axios.get(`/get_photos`, {
            headers: { 
                "loginid": loginid 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching photos:", error.response?.data || error.message);
        return { error: "Failed to fetch photos" };
    }
};

// Get all recognized persons
export const getAllPersons = async () => {
    try {
        const response = await axios.get(`/get_persons`,{
            headers: { 
                "loginid": loginid 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching persons:", error.response?.data || error.message);
        return { error: "Failed to fetch persons" };
    }
};

// Get specific person's gallery
export const getPersonGallery = async (personId) => {
    try {
        const response = await axios.get(`/get_person_gallery`, {
            params: { person_id: personId },
            headers: { 
                "loginid": loginid 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching person gallery:", error.response?.data || error.message);
        return { error: "Failed to fetch person's gallery" };
    }
};

// Remove duplicate images 
export const removeDuplicates = async () => {
    try {
        const response = await axios.post(`/remove_duplicates`,{
            headers: { 
                "loginid": loginid 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error removing duplicates:", error.response?.data || error.message);
        return { error: "Failed to remove duplicates" };
    }
};
