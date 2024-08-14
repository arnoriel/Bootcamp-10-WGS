const express = require('express'); 
const path = require('path'); 
const fs = require('fs'); 
const morgan = require('morgan'); 
const expressLayouts = require('express-ejs-layouts'); 
const bodyParser = require('body-parser'); 
const { body, validationResult } = require('express-validator'); 
const pool = require('./db'); 

const app = express(); 
const port = 3000; 

app.use(bodyParser.urlencoded({ extended: false })); 

app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

app.set('view engine', 'ejs'); 
app.use(expressLayouts); 
app.use(morgan('dev')); 
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static('public')); 

const validateMobile = [
    body('mobile').matches(/^(0|\+62)\d{9,12}$/).withMessage('Format nomor telepon tidak valid. Hanya format 0 atau +62 yang diperbolehkan.')
];

app.get('/', (req, res) => {
    res.render('home', { nama: 'Arno', title: 'Home', layout: 'layouts/alternate' });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        layout: 'layouts/alternate',
        nama: 'Azril Lutfhi Mulyadi',
        panggilan: 'Arno',
        tempat: 'Pasirkoja, Bandung.'
    });
});

app.get('/contact', (req, res) => {
    const searchQuery = req.query.search || ''; 

    pool.query('SELECT * FROM contacts ORDER BY updated_at DESC', (err, result) => {
        if (err) {
            console.error('Error fetching contacts from database:', err);
            return res.status(500).send('Error fetching contacts from database');
        }

        let contacts = result.rows;
        if (searchQuery) {
            contacts = contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.mobile.includes(searchQuery)
            );
        }

        const totalContacts = contacts.length; 

        res.render('contact', {
            contacts: contacts,
            title: 'Contact',
            layout: 'layouts/alternate',
            searchQuery,
            totalContacts
        });
    });
});

app.get('/search-contacts', (req, res) => {
    const searchQuery = req.query.q || '';

    pool.query('SELECT * FROM contacts WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1', [`%${searchQuery}%`], (err, result) => {
        if (err) {
            console.error('Error fetching contacts from database:', err);
            return res.status(500).json({ error: 'Error fetching contacts from database' });
        }

        res.json(result.rows);
    });
});

app.get('/contact/add', (req, res) => {
    res.render('add', { title: 'Add Contact', layout: 'layouts/alternate', errorMessage: null, name: '', email: '', mobile: '' });
});

app.post('/contact/add', validateMobile, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg).join(', ');
        return res.render('add', {
            title: 'Add Contact',
            layout: 'layouts/alternate',
            errorMessage,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        });
    }

    const { name, email, mobile } = req.body;
    pool.query('SELECT * FROM contacts WHERE name = $1 OR email = $2 OR mobile = $3', [name, email, mobile], (err, result) => {
        if (err) {
            console.error('Error fetching contacts from database:', err);
            return res.status(500).send('Error fetching contacts from database');
        }

        if (result.rows.length > 0) {
            let errorMessage = 'Nama, email, atau nomor telepon sudah ada, silahkan masukkan data lain';
            return res.render('add', {
                title: 'Add Contact',
                layout: 'layouts/alternate',
                errorMessage,
                name,
                email,
                mobile
            });
        }

        pool.query('INSERT INTO contacts (name, email, mobile) VALUES ($1, $2, $3)', [name, email, mobile], (err) => {
            if (err) {
                console.error('Error adding contact to database:', err);
                return res.status(500).send('Error adding contact to database');
            }
            res.redirect('/contact'); 
        });
    });
});

app.get('/contact/edit/:name', (req, res) => {
    const name = req.params.name;
    pool.query('SELECT * FROM contacts WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.error('Error fetching contact from database:', err);
            return res.status(500).send('Error fetching contact from database');
        }

        if (result.rows.length === 0) {
            return res.status(404).send('Contact not found');
        }

        const contact = result.rows[0];
        res.render('edit', { 
            title: 'Edit Contact', 
            layout: 'layouts/alternate', 
            contact,
            oldName: contact.name 
        });
    });
});

app.post('/contact/edit', validateMobile, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg).join(', ');
        return res.render('edit', {
            title: 'Edit Contact',
            layout: 'layouts/alternate',
            errorMessage,
            contact: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile
            },
            oldName: req.body.oldName 
        });
    }

    const { name, email, mobile, oldName } = req.body;
    pool.query('SELECT * FROM contacts WHERE (email = $1 OR mobile = $2) AND name != $3', [email, mobile, oldName], (err, result) => {
        if (err) {
            console.error('Error fetching contacts from database:', err);
            return res.status(500).send('Error fetching contacts from database');
        }

        if (result.rows.length > 0) {
            let errorMessage = 'Email atau nomor telepon sudah ada, silahkan masukkan data lain';
            return res.render('edit', {
                title: 'Edit Contact',
                layout: 'layouts/alternate',
                errorMessage,
                contact: {
                    name,
                    email,
                    mobile
                },
                oldName
            });
        }

        pool.query('UPDATE contacts SET name = $1, email = $2, mobile = $3, updated_at = CURRENT_TIMESTAMP WHERE name = $4', [name, email, mobile, oldName], (err) => {
            if (err) {
                console.error('Error updating contact in database:', err);
                return res.status(500).send('Error updating contact in database');
            }
            res.redirect('/contact'); 
        });
    });
});

app.post('/contact/delete', (req, res) => {
    const { name } = req.body;
    pool.query('DELETE FROM contacts WHERE name = $1', [name], (err) => {
        if (err) {
            console.error('Error deleting contact from database:', err);
            return res.status(500).send('Error deleting contact from database');
        }
        res.redirect('/contact'); 
    });
});

app.get('/contact/detail/:name', (req, res) => {
    const name = req.params.name;
    pool.query('SELECT * FROM contacts WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.error('Error fetching contact from database:', err);
            return res.status(500).send('Error fetching contact from database');
        }

        if (result.rows.length === 0) {
            return res.status(404).send('Contact not found');
        }

        const contact = result.rows[0];
        res.render('detail', { title: 'Contact Detail', layout: 'layouts/alternate', contact });
    });
});

app.use((req, res, next) => {
    res.status(404).render('404', { title: '404', layout: 'layouts/alternate' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
