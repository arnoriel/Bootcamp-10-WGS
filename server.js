const express = require('express'); // Mengimpor modul Express
const path = require('path'); // Mengimpor modul Path untuk menangani jalur file
const fs = require('fs'); // Mengimpor modul File System untuk operasi file
const morgan = require('morgan'); // Mengimpor modul Morgan untuk logging permintaan HTTP
const expressLayouts = require('express-ejs-layouts'); // Mengimpor modul Express EJS Layouts untuk dukungan layout
const bodyParser = require('body-parser'); // Mengimpor modul Body Parser untuk parsing body permintaan
const { body, validationResult } = require('express-validator'); // Mengimpor fungsi validasi dari express-validator

const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Mendefinisikan nomor port untuk server

app.use(bodyParser.urlencoded({ extended: false })); // Middleware untuk parsing body yang dikodekan URL

// Middleware untuk mencetak waktu permintaan
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next(); // Memanggil middleware berikutnya
});

app.set('view engine', 'ejs'); // Menetapkan EJS sebagai engine tampilan
app.use(expressLayouts); // Menggunakan express-ejs-layouts untuk dukungan layout
app.use(morgan('dev')); // Menggunakan Morgan untuk logging permintaan HTTP dalam mode pengembangan
app.set('views', path.join(__dirname, 'views')); // Menetapkan direktori untuk tampilan
app.use(express.static('public')); // Menyajikan file statis dari direktori 'public'

// Middleware untuk validasi format nomor telepon
const validateMobile = [
    body('mobile').matches(/^(0|\+62)\d{9,12}$/).withMessage('Format nomor telepon tidak valid. Hanya format 0 atau +62 yang diperbolehkan.')
];

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.render('home', { nama: 'Arno', title: 'Home', layout: 'layouts/main' });
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

// Rute untuk halaman kontak dengan data dari contacts.json
app.get('/contact', (req, res) => {
    const searchQuery = req.query.search || ''; // Mengambil query pencarian dari URL
    const page = parseInt(req.query.page) || 1; // Mengambil nomor halaman dari URL, default ke 1
    const limit = 5; // Jumlah kontak per halaman
    const contactsPath = path.join(__dirname, 'data', 'contacts.json'); // Jalur file kontak

    console.log('Contacts path:', contactsPath);

    fs.readFile(contactsPath, 'utf8', (err, data) => { // Membaca file kontak
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            let contacts = JSON.parse(data); // Mengurai data JSON
            if (searchQuery) {
                contacts = contacts.filter(contact =>
                    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.mobile.includes(searchQuery)
                ); // Menyaring kontak berdasarkan query pencarian
            }

            const totalContacts = contacts.length; // Total jumlah kontak
            const totalPages = Math.ceil(totalContacts / limit); // Menghitung total halaman
            const paginatedContacts = contacts.slice((page - 1) * limit, page * limit); // Mengambil kontak untuk halaman saat ini

            res.render('contact', {
                contacts: paginatedContacts,
                title: 'Contact',
                layout: 'layouts/main',
                searchQuery,
                currentPage: page,
                totalPages,
                totalContacts
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});

// Rute untuk halaman tambah kontak
app.get('/contact/add', (req, res) => {
    res.render('add', { title: 'Add Contact', layout: 'layouts/main', errorMessage: null, name: '', email: '', mobile: '' });
});

// Rute untuk menambahkan kontak
app.post('/contact/add', validateMobile, (req, res) => {
    const errors = validationResult(req); // Mendapatkan hasil validasi
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg).join(', ');
        return res.render('add', {
            title: 'Add Contact',
            layout: 'layouts/main',
            errorMessage,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        });
    }

    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            const contacts = JSON.parse(data);
            // Memeriksa apakah nama, email, atau nomor telepon sudah ada
            const existingContact = contacts.find(contact => 
                contact.name === req.body.name || 
                contact.email === req.body.email || 
                contact.mobile === req.body.mobile
            );
            if (existingContact) {
                let errorMessage = 'Nama, email, atau nomor telepon sudah ada, silahkan masukkan data lain';
                return res.render('add', {
                    title: 'Add Contact',
                    layout: 'layouts/main',
                    errorMessage,
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile
                });
            }

            const newContact = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile
            };
            contacts.unshift(newContact); // Menambahkan kontak baru di awal array
            fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
                if (err) {
                    console.error('Error writing contacts file:', err);
                    return res.status(500).send('Error writing contacts file');
                }
                res.redirect('/contact?page=1'); // Redirect ke halaman kontak
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});


// Rute untuk halaman edit kontak
app.get('/contact/edit/:name', (req, res) => {
    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            const contacts = JSON.parse(data);
            const contact = contacts.find(c => c.name === req.params.name);
            if (!contact) {
                return res.status(404).send('Contact not found');
            }
            res.render('edit', { 
                title: 'Edit Contact', 
                layout: 'layouts/main', 
                contact,
                oldName: contact.name // Pass oldName for use in the form
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});

// Rute untuk memperbarui kontak
// Rute untuk memperbarui kontak
app.post('/contact/edit', validateMobile, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg).join(', ');
        return res.render('edit', {
            title: 'Edit Contact',
            layout: 'layouts/main',
            errorMessage,
            contact: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile
            },
            oldName: req.body.oldName // Keep oldName for the form
        });
    }

    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            const contacts = JSON.parse(data);
            const index = contacts.findIndex(c => c.name === req.body.oldName);
            if (index === -1) {
                return res.status(404).send('Contact not found');
            }

            // Memeriksa apakah email atau nomor telepon sudah ada pada kontak lain
            const duplicateContact = contacts.find(contact => 
                (contact.email === req.body.email || contact.mobile === req.body.mobile) &&
                contact.name !== req.body.oldName
            );
            if (duplicateContact) {
                let errorMessage = 'Email atau nomor telepon sudah ada, silahkan masukkan data lain';
                return res.render('edit', {
                    title: 'Edit Contact',
                    layout: 'layouts/main',
                    errorMessage,
                    contact: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile
                    },
                    oldName: req.body.oldName
                });
            }

            contacts[index] = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile
            };
            fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
                if (err) {
                    console.error('Error writing contacts file:', err);
                    return res.status(500).send('Error writing contacts file');
                }
                res.redirect('/contact'); // Redirect to contact list
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});



// Rute untuk menghapus kontak
app.post('/contact/delete', (req, res) => {
    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            let contacts = JSON.parse(data); // Mengurai data JSON
            contacts = contacts.filter(c => c.name !== req.body.name); // Menghapus kontak berdasarkan nama
            fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
                if (err) {
                    console.error('Error writing contacts file:', err);
                    return res.status(500).send('Error writing contacts file');
                }
                res.redirect('/contact'); // Redirect ke halaman kontak
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});

// Rute untuk halaman detail kontak
app.get('/contact/detail/:name', (req, res) => {
    const contactsPath = path.join(__dirname, 'data', 'contacts.json');
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading contacts file:', err);
            return res.status(500).send('Error reading contacts file');
        }

        try {
            const contacts = JSON.parse(data); // Mengurai data JSON
            const contact = contacts.find(c => c.name === req.params.name); // Mencari kontak berdasarkan nama
            if (!contact) {
                return res.status(404).send('Contact not found'); // Kontak tidak ditemukan
            }
            res.render('detail', { title: 'Contact Detail', layout: 'layouts/main', contact });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Error parsing contacts data');
        }
    });
});

// Middleware untuk menangani halaman 404
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404', layout: 'layouts/main' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`); // Menampilkan pesan saat server mulai mendengarkan
});
