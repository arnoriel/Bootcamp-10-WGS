import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="header">
            <h1 className="header-title">Experiment React</h1>
            <nav className="header-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="nav-link dropdown-toggle">
                      Learning
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/imagesearch" className="dropdown-item">Image Search</Link>
                            <Link to="/videosearch" className="dropdown-item">Video Search</Link>
                            <Link to="/comment" className="dropdown-item">Comment</Link>
                            <Link to="/countingpage" className="dropdown-item">Counting</Link>
                            <Link to="/clock" className="dropdown-item">Clock</Link>
                            <Link to="/form" className="dropdown-item">Form</Link>
                            <Link to="/videoclass" className="dropdown-item">VideoClass</Link>
                            <Link to="/redux" className="dropdown-item">Redux Counter</Link>
                        </div>
                    )}
                </div>
                <Link to="/azriel" className="nav-link">Azriel</Link>
            </nav>
        </header>
    );
}
