import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ImageSearch.css';

const ImageSearch = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [similarImages, setSimilarImages] = useState([]);
    const [imageHistory, setImageHistory] = useState([]);
    const [queryCache, setQueryCache] = useState({});

    const queryRef = useRef(null);
    const modalContentRef = useRef(null);  // Reference for modal content

    useEffect(() => {
        // Scroll to the top of the modal when a new image is selected
        if (modalContentRef.current) {
            modalContentRef.current.scrollTop = 0;
        }
    }, [selectedImage]);

    const handleSearch = async (event) => {
        event.preventDefault();
        const query = queryRef.current.value;

        if (queryCache[query]) {
            setImages(queryCache[query]);
            return;
        }

        setLoading(true);
        console.log("Starting image search...");

        try {
            const results = [];
            for (let i = 1; i <= 2; i++) { // Batasi hanya 2 halaman
                const response = await axios.get('https://api.unsplash.com/search/photos', {
                    params: {
                        query,
                        per_page: 20,
                        page: i
                    },
                    headers: {
                        Authorization: `Client-ID lOhVJpJWNOjR1tBiQ6waLVjJfLAZ2tkSDzQrxZf8ObA`
                    }
                });

                console.log(`Response for page ${i}:`, response.data);
                results.push(...response.data.results);

                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 detik jeda
            }

            console.log("Final results:", results);
            setImages(results);
            setQueryCache(prev => ({ ...prev, [query]: results })); // Simpan hasil pencarian di cache

        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
        }

        setLoading(false);
        console.log("Image search completed.");
    };

    const handleImageClick = async (image) => {
        console.log("Selected image:", image);
        setImageHistory(prevHistory => [...prevHistory, selectedImage]); // Simpan gambar sebelumnya ke dalam riwayat
        setSelectedImage(image);

        try {
            const response = await axios.get(`https://api.unsplash.com/photos/${image.id}/related`, {
                headers: {
                    Authorization: `Client-ID lOhVJpJWNOjR1tBiQ6waLVjJfLAZ2tkSDzQrxZf8ObA`
                }
            });

            console.log("Similar images:", response.data.results);
            setSimilarImages(response.data.results);
        } catch (error) {
            console.error('Error fetching similar images from Unsplash:', error);
        }
    };

    const closeModal = () => {
        console.log("Closing modal...");
        setSelectedImage(null);
        setSimilarImages([]);
        setImageHistory([]); // Bersihkan riwayat saat modal ditutup
    };

    const goBack = () => {
        if (imageHistory.length > 0) {
            const previousImage = imageHistory[imageHistory.length - 1];
            setSelectedImage(previousImage);
            setImageHistory(prevHistory => prevHistory.slice(0, -1)); // Hapus gambar terakhir dari riwayat
        }
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    return (
        <div className="image-search">
            <center><h2>Search Images Here</h2></center>
            <form onSubmit={handleSearch}>
                <input
                    ref={queryRef}
                    type="text"
                    placeholder="Search for images..."
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}

            <div className="image-grid">
                {images.map((image) => (
                    <div key={image.id} className="image-item" onClick={() => handleImageClick(image)}>
                        <img src={image.urls.small} alt={image.alt_description} />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content" ref={modalContentRef}> {/* Apply the ref here */}
                        <span className="close" onClick={closeModal}>&times;</span>
                        {imageHistory.length > 0 && (
                            <button className="back-button" onClick={goBack}>Back</button>
                        )}
                        <img src={selectedImage.urls.regular} alt={selectedImage.alt_description} className="modal-image" />
                        <h2>{selectedImage.alt_description || "Untitled"}</h2>
                        <p>By: {selectedImage.user.name}</p>

                        <h3>More images like this:</h3>
                        <div className="similar-images-grid">
                            {similarImages.map((simImage) => (
                                <div key={simImage.id} className="image-item" onClick={() => handleImageClick(simImage)}>
                                    <img src={simImage.urls.small} alt={simImage.alt_description} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageSearch;
