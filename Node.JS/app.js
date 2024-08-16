const fs = require('fs').promises; // Mengimpor modul fs dengan API promises untuk operasi file asinkron
const yargs = require('yargs'); // Mengimpor modul yargs untuk menangani argumen baris perintah
const validator = require('validator'); // Mengimpor modul validator untuk validasi email dan nomor telepon
const path = './data/contacts.json'; // Mendefinisikan path ke file contacts.json
const cors = require('cors');
const bodyParser = require('body-parser')

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Fungsi untuk memastikan file kontak ada dan membuatnya jika belum ada
const ensureContactsFile = async () => {
  try {
    await fs.mkdir('./data', { recursive: true }); // Membuat direktori 'data' jika belum ada
    try {
      await fs.access(path); // Memeriksa apakah file contacts.json ada
    } catch (error) {
      await fs.writeFile(path, JSON.stringify([], null, 2), 'utf8'); // Membuat file contacts.json dengan array kosong jika belum ada
    }
  } catch (error) {
    console.error('Error ensuring contacts file:', error); // Mencetak pesan kesalahan jika terjadi
  }
};

// Fungsi untuk memuat data kontak dari contacts.json
const loadContacts = async () => {
  try {
    const data = await fs.readFile(path, 'utf8'); // Membaca file contacts.json
    return JSON.parse(data); // Menguraikan dan mengembalikan data JSON sebagai array
  } catch (error) {
    console.error('Error loading contacts:', error); // Mencetak pesan kesalahan jika terjadi
    return []; // Mengembalikan array kosong jika terjadi kesalahan
  }
};

// Fungsi untuk menyimpan data kontak ke contacts.json
const saveContacts = async (contacts) => {
  try {
    await fs.writeFile(path, JSON.stringify(contacts, null, 2), 'utf8'); // Menulis array kontak ke file contacts.json
  } catch (error) {
    console.error('Error saving contacts:', error); // Mencetak pesan kesalahan jika terjadi
  }
};

// Fungsi untuk menambahkan kontak baru
const addContact = async (name, email, mobile) => {
  await ensureContactsFile(); // Memastikan file kontak ada
  let contacts = await loadContacts(); // Memuat kontak yang ada

  // Cek apakah kontak dengan nama yang sama sudah ada
  if (contacts.some(contact => contact.name === name)) {
    console.log('Kontak dengan nama ini sudah ada. Silakan gunakan nama lain.'); // Mencetak pesan jika nama sudah ada
    return; // Menghentikan eksekusi jika nama sudah ada
  }

  const contact = { name, email, mobile }; // Membuat objek kontak baru

  // Validasi email jika diberikan
  if (email && !validator.isEmail(email)) {
    console.log('Email tidak valid. Kontak tidak akan disimpan.'); // Mencetak pesan kesalahan jika email tidak valid
    return; // Menghentikan eksekusi jika email tidak valid
  }

  // Validasi nomor telepon
  if (!validator.isMobilePhone(mobile, 'id-ID')) {
    console.log('Nomor telepon tidak valid. Kontak tidak akan disimpan.'); // Mencetak pesan kesalahan jika nomor telepon tidak valid
    return; // Menghentikan eksekusi jika nomor telepon tidak valid
  }

  contacts.push(contact); // Menambahkan kontak baru ke array kontak
  await saveContacts(contacts); // Menyimpan array kontak yang diperbarui
  console.log('Kontak berhasil ditambahkan!'); // Mencetak pesan sukses
};

// Fungsi untuk membaca dan menampilkan semua kontak
const listContacts = async () => {
  await ensureContactsFile(); // Memastikan file kontak ada
  let contacts = await loadContacts(); // Memuat kontak yang ada
  console.log('Daftar Kontak:'); // Mencetak header daftar kontak
  contacts.forEach(contact => {
    // Mencetak hanya nama dan nomor telepon dari setiap kontak
    console.log(`Nama: ${contact.name}, Telepon: ${contact.mobile}`);
  });
};

// Fungsi untuk memperbarui kontak yang ada
const updateContact = async (name, newEmail, newMobile) => {
  await ensureContactsFile(); // Memastikan file kontak ada
  let contacts = await loadContacts(); // Memuat kontak yang ada
  let index = contacts.findIndex(contact => contact.name === name); // Mencari indeks kontak berdasarkan nama

  if (index === -1) {
    console.log('Kontak tidak ditemukan.'); // Mencetak pesan kesalahan jika kontak tidak ditemukan
    return; // Menghentikan eksekusi jika kontak tidak ditemukan
  }

  // Validasi email baru jika diberikan
  if (newEmail && !validator.isEmail(newEmail)) {
    console.log('Email tidak valid. Kontak tidak akan diperbarui.'); // Mencetak pesan kesalahan jika email tidak valid
    return; // Menghentikan eksekusi jika email tidak valid
  }

  // Validasi nomor telepon baru jika diberikan
  if (newMobile && !validator.isMobilePhone(newMobile, 'id-ID')) {
    console.log('Nomor telepon tidak valid. Kontak tidak akan diperbarui.'); // Mencetak pesan kesalahan jika nomor telepon tidak valid
    return; // Menghentikan eksekusi jika nomor telepon tidak valid
  }

  if (newEmail) contacts[index].email = newEmail; // Memperbarui email kontak
  if (newMobile) contacts[index].mobile = newMobile; // Memperbarui nomor telepon kontak

  await saveContacts(contacts); // Menyimpan array kontak yang diperbarui
  console.log('Kontak berhasil diperbarui!'); // Mencetak pesan sukses
};

// Fungsi untuk menghapus kontak berdasarkan nama
const deleteContact = async (name) => {
  await ensureContactsFile(); // Memastikan file kontak ada
  let contacts = await loadContacts(); // Memuat kontak yang ada
  contacts = contacts.filter(contact => contact.name !== name); // Menghapus kontak berdasarkan nama

  await saveContacts(contacts); // Menyimpan array kontak yang diperbarui
  console.log('Kontak berhasil dihapus!'); // Mencetak pesan sukses
};

// Menambahkan perintah CRUD menggunakan yargs
yargs.command({
  command: 'add',
  describe: 'Add new contact', // Deskripsi perintah
  builder: {
    name: {
      describe: 'Contact Name', // Deskripsi argumen nama
      demandOption: true, // Menandakan bahwa argumen ini wajib
      type: 'string', // Tipe data argumen adalah string
    },
    email: {
      describe: 'Contact Email', // Deskripsi argumen email
      demandOption: false, // Menandakan bahwa argumen ini opsional
      type: 'string', // Tipe data argumen adalah string
    },
    mobile: {
      describe: 'Contact Mobile Phone Number', // Deskripsi argumen nomor telepon
      demandOption: true, // Menandakan bahwa argumen ini wajib
      type: 'string', // Tipe data argumen adalah string
    },
  },
  handler(argv) { // Fungsi yang dijalankan saat perintah dieksekusi
    addContact(argv.name, argv.email, argv.mobile); // Memanggil fungsi addContact dengan argumen yang diberikan
  },
});

yargs.command({
  command: 'list',
  describe: 'List all contacts', // Deskripsi perintah
  handler() { // Fungsi yang dijalankan saat perintah dieksekusi
    listContacts(); // Memanggil fungsi listContacts
  },
});

yargs.command({
  command: 'update',
  describe: 'Update an existing contact', // Deskripsi perintah
  builder: {
    name: {
      describe: 'Contact Name', // Deskripsi argumen nama
      demandOption: true, // Menandakan bahwa argumen ini wajib
      type: 'string', // Tipe data argumen adalah string
    },
    email: {
      describe: 'New Contact Email', // Deskripsi argumen email baru
      demandOption: false, // Menandakan bahwa argumen ini opsional
      type: 'string', // Tipe data argumen adalah string
    },
    mobile: {
      describe: 'New Contact Mobile Phone Number', // Deskripsi argumen nomor telepon baru
      demandOption: false, // Menandakan bahwa argumen ini opsional
      type: 'string', // Tipe data argumen adalah string
    },
  },
  handler(argv) { // Fungsi yang dijalankan saat perintah dieksekusi
    updateContact(argv.name, argv.email, argv.mobile); // Memanggil fungsi updateContact dengan argumen yang diberikan
  },
});

yargs.command({
  command: 'delete',
  describe: 'Delete a contact', // Deskripsi perintah
  builder: {
    name: {
      describe: 'Contact Name', // Deskripsi argumen nama
      demandOption: true, // Menandakan bahwa argumen ini wajib
      type: 'string', // Tipe data argumen adalah string
    },
  },
  handler(argv) { // Fungsi yang dijalankan saat perintah dieksekusi
    deleteContact(argv.name); // Memanggil fungsi deleteContact dengan argumen yang diberikan
  },
});

yargs.parse(); // Mem-parsing input yargs



// ---Day 3--- //

// const fs = require('fs').promises; // Mengimpor modul fs dengan API promises
// const readline = require('readline'); // Mengimpor modul readline untuk membaca input dari command line
// const validator = require('validator'); // Mengimpor modul validator untuk validasi email dan nomor telepon
// const path = './data'; // Mendefinisikan path ke direktori data

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// }); // Membuat antarmuka untuk membaca input dan output dari command line

// // Fungsi untuk menanyakan pertanyaan dan mengembalikan respon sebagai promise
// const askQuestion = (question) => {
//   return new Promise((resolve) => rl.question(question, resolve));
// };

// // Fungsi untuk memastikan folder data dan file yang diperlukan ada
// const ensureDataFolderAndFiles = async () => {
//   try {
//     await fs.mkdir(path, { recursive: true }); // Membuat direktori data jika belum ada
    
//     const contactsPath = `${path}/contacts.json`; // Mendefinisikan path ke file contacts.json
//     const testFilePath = `${path}/test.txt`; // Mendefinisikan path ke file test.txt
    
//     try {
//       await fs.access(contactsPath); // Memeriksa apakah file contacts.json ada
//     } catch (error) {
//       await fs.writeFile(contactsPath, JSON.stringify([], null, 2), 'utf8'); // Membuat contacts.json dengan array kosong jika belum ada
//     }
    
//     try {
//       await fs.access(testFilePath); // Memeriksa apakah file test.txt ada
//     } catch (error) {
//       await fs.writeFile(testFilePath, 'This is a test file.', 'utf8'); // Membuat test.txt dengan konten default jika belum ada
//     }
//   } catch (error) {
//     console.error('Error ensuring data folder and files:', error); // Mencetak pesan kesalahan jika terjadi
//   }
// };

// // Fungsi untuk memuat data kontak dari contacts.json
// const loadContacts = async () => {
//   try {
//     const data = await fs.readFile(`${path}/contacts.json`, 'utf8'); // Membaca file contacts.json
//     return JSON.parse(data); // Menguraikan dan mengembalikan data JSON
//   } catch (error) {
//     console.error('Error loading contacts:', error); // Mencetak pesan kesalahan jika terjadi
//     return []; // Mengembalikan array kosong jika terjadi kesalahan
//   }
// };

// // Fungsi untuk menyimpan data kontak ke contacts.json
// const saveContacts = async (contacts) => {
//   try {
//     await fs.writeFile(`${path}/contacts.json`, JSON.stringify(contacts, null, 2), 'utf8'); // Menulis array kontak ke contacts.json
//   } catch (error) {
//     console.error('Error saving contacts:', error); // Mencetak pesan kesalahan jika terjadi
//   }
// };

// // Fungsi untuk membaca konten test.txt secara asinkron
// const readTestFile = async () => {
//   try {
//     const data = await fs.readFile(`${path}/test.txt`, 'utf8'); // Membaca file test.txt
//     console.log('Content of test.txt:', data); // Mencetak konten file
//   } catch (error) {
//     console.error('Error reading test.txt:', error); // Mencetak pesan kesalahan jika terjadi
//   }
// };

// // Fungsi untuk menulis konten ke test.txt secara asinkron
// const writeTestFile = async (content) => {
//   try {
//     await fs.writeFile(`${path}/test.txt`, content, 'utf8'); // Menulis konten yang diberikan ke test.txt
//     console.log('Content written to test.txt'); // Mencetak pesan sukses
//   } catch (error) {
//     console.error('Error writing to test.txt:', error); // Mencetak pesan kesalahan jika terjadi
//   }
// };

// // Fungsi untuk menambahkan kontak baru
// const addContact = async () => {
//   const nama = await askQuestion('Masukkan nama: '); // Menanyakan nama

//   let email = await askQuestion('Masukkan email: '); // Menanyakan email
//   while (!validator.isEmail(email)) { // Memvalidasi email
//     console.log('Email tidak valid. Coba lagi.'); // Mencetak pesan email tidak valid
//     email = await askQuestion('Masukkan email: '); // Menanyakan email lagi
//   }

//   let phone = await askQuestion('Masukkan nomor telepon: '); // Menanyakan nomor telepon
//   while (!validator.isMobilePhone(phone, 'id-ID')) { // Memvalidasi nomor telepon
//     console.log('Nomor telepon tidak valid. Coba lagi.'); // Mencetak pesan nomor telepon tidak valid
//     phone = await askQuestion('Masukkan nomor telepon: '); // Menanyakan nomor telepon lagi
//   }

//   const alamat = await askQuestion('Masukkan alamat: '); // Menanyakan alamat

//   const newContact = {
//     nama,
//     email,
//     phone,
//     alamat
//   }; // Membuat objek kontak baru

//   let contacts = await loadContacts(); // Memuat kontak yang ada
//   contacts.push(newContact); // Menambahkan kontak baru ke array kontak
//   await saveContacts(contacts); // Menyimpan array kontak yang diperbarui

//   console.log('Kontak berhasil ditambahkan!'); // Mencetak pesan sukses
//   rl.close(); // Menutup antarmuka readline
// };

// // Fungsi utama untuk memastikan folder data, membaca/menulis test.txt, dan menambahkan kontak
// const main = async () => {
//   await ensureDataFolderAndFiles(); // Memastikan folder data dan file ada
//   await readTestFile(); // Membaca konten test.txt
//   await writeTestFile('This is the new content of the test file.'); // Menulis konten baru ke test.txt
//   await addContact(); // Menambahkan kontak baru
// };

// main(); // Memanggil fungsi utama untuk memulai program
