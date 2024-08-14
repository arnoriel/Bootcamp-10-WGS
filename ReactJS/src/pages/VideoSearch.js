import React, { useState, useEffect, useRef } from 'react';
import './VideoSearch.css';

const VideoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const popupRef = useRef(null);

  const API_KEY = 'AIzaSyAqOMY68_Uq5hScNeWcLYk1wSxjwr7JhuM';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setHistory([searchTerm, ...history]); // Menambahkan elemen baru di awal array
    setHistoryVisible(false);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${searchTerm}&key=${API_KEY}`
    );
    const data = await response.json();
    setVideos(data.items);
    setSelectedVideo(data.items[0]); 
  };

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);

    // Refresh daftar video saat video di-click
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${searchTerm}&key=${API_KEY}`
    );
    const data = await response.json();
    setVideos(data.items);
  };

  // const handleCloseHistory = () => setHistoryVisible(false);

  const handleRemoveHistoryItem = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setHistoryVisible(false);
      }
    };

    if (historyVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [historyVisible]);

  return (
    <div className="video-search">
        <center><h2>Video Search</h2></center>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for videos..."
          onFocus={() => setHistoryVisible(true)}
        />
        <button type="submit">Search</button>

        {historyVisible && history.length > 0 && (
          <div className="search-history-popup" ref={popupRef}>
            <h4>Search History</h4>
            <ul>
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <span onClick={() => setSearchTerm(item)}>{item}</span>
                  <button className="remove-history-btn" onClick={() => handleRemoveHistoryItem(index)}>x</button>
                </li>              
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className="video-content">
        {selectedVideo && (
          <div className="video-display">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
              frameBorder="0"
              allowFullScreen
              title={selectedVideo.snippet.title}
            ></iframe>
            <h3>{selectedVideo.snippet.title}</h3>
            <p>{selectedVideo.snippet.description}</p>
          </div>
        )}

        <div className="video-list">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="video-item"
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
              />
              <div className="video-info">
                <p className="video-title">{video.snippet.title}</p>
                <p className="video-channel">{video.snippet.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSearch;
