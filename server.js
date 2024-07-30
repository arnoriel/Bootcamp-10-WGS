const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const port = 3000;
const expressLayouts = require('express-ejs-layouts');

app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

app.set('view engine', 'ejs');

// Use express-ejs-layouts
app.use(expressLayouts);
app.use(morgan('dev'));
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.render('home', {nama: 'Arno', title: 'Home', layout: 'layouts/main'});
});

// Rute untuk halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About', 
        layout: 'layouts/main', 
        nama: 'Azril Lutfhi Mulyadi', 
        panggilan: 'Arno', 
        tempat: 'Pasirkoja, Bandung.'
    });
});

// Rute untuk halaman contact dengan data dari contacts.json
app.get('/contact', (req, res) => {
    const contactsPath = path.join(__dirname, 'data', 'contacts.json'); // Pastikan nama file "contacts.json" benar

    console.log('Contacts path:', contactsPath); // Menampilkan path file di konsol
    
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err); // Menampilkan pesan error di konsol
            return res.status(500).send('Error reading contacts file');
        }

        try {
            const contacts = JSON.parse(data);
            res.render('contact', { contacts, title: 'Contact', layout: 'layouts/main' });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr); // Menampilkan pesan error parsing JSON
            return res.status(500).send('Error parsing contacts data');
        }
    });
});

// Rute untuk halaman home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Rute untuk halaman produk dengan id dan kategori sebagai query parameter
app.get('/product/:id', (req, res) => {
    const categoryId = req.query.category; // Mengambil kategori dari query parameter
    const productId = req.params.id; // Mengambil id produk dari parameter rute
    res.send(`Product id: ${productId} <br> Product category: ${categoryId}`);
});

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res) => {
    res.status(404).send('Page not found: 404');
});

// Memulai server dan mendengarkan pada port yang ditentukan
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
