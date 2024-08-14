// src/pages/Azriel.js
import React from "react";
import './app.css';

export default function Azriel() {
    return (
        <div>
            <h2>Azriel Page</h2>
            <p>This is Azriel Page, hi</p>
            <div className="ui input">
                <input type="number" min={5} placeholder="Enter a number" />
            </div>
            <div class="card-container">
    <div class="card">
        <img src="/logo512.png" alt="Avatar" class="card-image"></img>
        <div class="card-content">
            <h3 class="card-title">React JS</h3>
            <p class="card-text">This is a simple card component with an image, title, and text.</p>
            <button class="card-button">Learn More</button>
        </div>
    </div>
</div>

        </div>
        
    );
}
