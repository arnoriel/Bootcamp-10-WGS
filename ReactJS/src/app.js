// src/App.js
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Azriel from "./pages/Azriel";
import Comment from "./pages/Comment";
import CountingPage from "./pages/CountingPage";
import Clock from "./pages/Clock";
import Form from "./pages/Form";
import ImageSearch from './pages/ImageSearch';
import VideoSearch from './pages/VideoSearch';
import VideoClass from './pages/VideoClass';
import Hooks from './Hooks';
import ReduxPage from './pages/Redux';

class App extends Component {
    render() {
        return (
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/azriel" element={<Azriel />} />
                    <Route path="/comment" element={<Comment />} />
                    <Route path="/countingpage" element={<CountingPage />} />
                    <Route path="/clock" element={<Clock />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/imagesearch" element={<ImageSearch />} />
                    <Route path="/videosearch" element={<VideoSearch />} />
                    <Route path="/videoclass" element={<VideoClass />} />
                    <Route path="/hooks" element={<Hooks />} />
                    <Route path="/redux" element={<ReduxPage />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
