import React, { Component, createRef } from 'react';
import './VideoSearch.css';

class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      videos: [],
      selectedVideo: null,
      history: [],
      historyVisible: false,
    };
    this.popupRef = createRef();
    this.API_KEY = 'AIzaSyAqOMY68_Uq5hScNeWcLYk1wSxjwr7JhuM';
  }

  handleSearch = async (e) => {
    e.preventDefault();
    const { searchTerm, history } = this.state;

    if (!searchTerm) return;

    this.setState({
      history: [searchTerm, ...history],
      historyVisible: false,
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${searchTerm}&key=${this.API_KEY}`
    );
    const data = await response.json();
    this.setState({
      videos: data.items,
      selectedVideo: data.items[0],
    });
  };

  handleVideoClick = async (video) => {
    this.setState({ selectedVideo: video });

    const { searchTerm } = this.state;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${searchTerm}&key=${this.API_KEY}`
    );
    const data = await response.json();
    this.setState({ videos: data.items });
  };

  handleRemoveHistoryItem = (index) => {
    const { history } = this.state;
    this.setState({
      history: history.filter((_, i) => i !== index),
    });
  };

  handleClickOutside = (event) => {
    if (this.popupRef.current && !this.popupRef.current.contains(event.target)) {
      this.setState({ historyVisible: false });
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(_, prevState) {
    if (prevState.historyVisible !== this.state.historyVisible) {
      if (this.state.historyVisible) {
        document.addEventListener('mousedown', this.handleClickOutside);
      } else {
        document.removeEventListener('mousedown', this.handleClickOutside);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { searchTerm, videos, selectedVideo, history, historyVisible } = this.state;

    return (
      <div className="video-search">
        <center><h2>Video Search</h2></center>
        <form onSubmit={this.handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
            placeholder="Search for videos..."
            onFocus={() => this.setState({ historyVisible: true })}
          />
          <button type="submit">Search</button>

          {historyVisible && history.length > 0 && (
            <div className="search-history-popup" ref={this.popupRef}>
              <h4>Search History</h4>
              <ul>
                {history.map((item, index) => (
                  <li key={index} className="history-item">
                    <span onClick={() => this.setState({ searchTerm: item })}>{item}</span>
                    <button className="remove-history-btn" onClick={() => this.handleRemoveHistoryItem(index)}>x</button>
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
                onClick={() => this.handleVideoClick(video)}
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
  }
}

export default VideoSearch;
