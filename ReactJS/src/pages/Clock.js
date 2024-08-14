import React, { useState, useEffect } from "react";
import './clock.css';  // Mengimpor file CSS untuk styling komponen

function Clock() {
    // Menggunakan useState untuk mengelola state 'time'
    // State 'time' diinisialisasi dengan nilai waktu saat ini (tanpa format 12 jam)
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

    // Menggunakan useEffect untuk menjalankan efek samping (side-effect) setelah komponen dirender
    useEffect(() => {
        // Mengatur interval yang memperbarui waktu setiap 1 detik
        const timerID = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);

        // Mengembalikan fungsi cleanup yang akan dijalankan saat komponen dilepas
        return () => {
            clearInterval(timerID);  // Membersihkan interval saat komponen di-unmount
        };
    }, []); // Array kosong berarti useEffect hanya dijalankan sekali setelah render pertama (seperti componentDidMount)

    // Mengembalikan elemen JSX yang akan dirender ke halaman
    return (
        <div className="clock-page">
            {/* Menampilkan waktu dalam elemen <p> */}
            <p>{time}</p>
        </div>
    );
}

export default Clock;  // Mengekspor komponen Clock agar bisa digunakan di file lain
