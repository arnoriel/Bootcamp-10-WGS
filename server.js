const express = require('express'); // Mengimpor modul Express
const path = require('path'); // Mengimpor modul path untuk bekerja dengan jalur file
const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menetapkan nomor port tempat server akan berjalan

app.set('view engine', 'ejs')

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname)));

// Rute untuk halaman utama (home.html)
app.get('/', (req, res) =>{
    res.render('home', {nama: 'Arno'})
})

// Rute untuk halaman about (about.html)
app.get('/about', (req, res) =>{
    res.render('about')
})

// Rute untuk halaman contact dengan data dinamis
app.get('/contact', (req, res) => {
    const contacts = [
        { name: 'Azril', email: 'azril@gmail.com' },
        { name: 'Luhtfi', email: 'luthfi@gmail.com' },
        { name: 'Mulyadi', email: 'mulyadi@gmail.com' }
    ];
    res.render('contact', { contacts });
});

// // Rute untuk halaman about (about.html)
// app.get('/about', (req, res) => {
//     res.sendFile('about.html', {root:dirname})
// }); // Mengirimkan file about.html sebagai respons

// Rute untuk halaman contact (contact.html)
// app.get('/contact', (req, res) => {
//     res.sendFile(path.join(__dirname, 'contact.html')); // Mengirimkan file contact.html sebagai respons
// });

// Rute untuk halaman home (home.html)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); // Mengirimkan file contact.html sebagai respons
});

// Rute untuk halaman produk dengan id dan kategori sebagai query parameter
app.get('/product/:id', (req, res) => {
    const categoryId = req.query.category; // Mengambil kategori dari query parameter
    const productId = req.params.id; // Mengambil id produk dari parameter rute
    res.send(`Product id: ${productId} <br> Product category: ${categoryId}`);
});

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res) => {
    res.status(404).send('Page not found: 404'); // Mengirimkan respons 404 jika halaman tidak ditemukan
});

// Memulai server dan mendengarkan pada port yang ditentukan
app.listen(port, () => {
    console.log(`Listening on port ${port}`); // Menampilkan pesan di konsol bahwa server berjalan di port yang ditentukan
});
