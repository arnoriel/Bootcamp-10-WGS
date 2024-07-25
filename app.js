const fs = require('fs').promises;
const readline = require('readline');
const validator = require('validator');
const path = './data';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

// Ensure data folder and files exist
const ensureDataFolderAndFiles = async () => {
  try {
    await fs.mkdir(path, { recursive: true });
    
    const contactsPath = `${path}/contacts.json`;
    const testFilePath = `${path}/test.txt`;
    
    try {
      await fs.access(contactsPath);
    } catch (error) {
      await fs.writeFile(contactsPath, JSON.stringify([], null, 2), 'utf8');
    }
    
    try {
      await fs.access(testFilePath);
    } catch (error) {
      await fs.writeFile(testFilePath, 'This is a test file.', 'utf8');
    }
  } catch (error) {
    console.error('Error ensuring data folder and files:', error);
  }
};

// Load contact data
const loadContacts = async () => {
  try {
    const data = await fs.readFile(`${path}/contacts.json`, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};

// Save contact data
const saveContacts = async (contacts) => {
  try {
    await fs.writeFile(`${path}/contacts.json`, JSON.stringify(contacts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
};

// Read test.txt file asynchronously
const readTestFile = async () => {
  try {
    const data = await fs.readFile(`${path}/test.txt`, 'utf8');
    console.log('Content of test.txt:', data);
  } catch (error) {
    console.error('Error reading test.txt:', error);
  }
};

// Write to test.txt file asynchronously
const writeTestFile = async (content) => {
  try {
    await fs.writeFile(`${path}/test.txt`, content, 'utf8');
    console.log('Content written to test.txt');
  } catch (error) {
    console.error('Error writing to test.txt:', error);
  }
};

// Function to add a new contact
const addContact = async () => {
  const nama = await askQuestion('Masukkan nama: ');

  let email = await askQuestion('Masukkan email: ');
  while (!validator.isEmail(email)) {
    console.log('Email tidak valid. Coba lagi.');
    email = await askQuestion('Masukkan email: ');
  }

  let phone = await askQuestion('Masukkan nomor telepon: ');
  while (!validator.isMobilePhone(phone, 'id-ID')) {
    console.log('Nomor telepon tidak valid. Coba lagi.');
    phone = await askQuestion('Masukkan nomor telepon: ');
  }

  const alamat = await askQuestion('Masukkan alamat: ');

  const newContact = {
    nama,
    email,
    phone,
    alamat
  };

  let contacts = await loadContacts();
  contacts.push(newContact);
  await saveContacts(contacts);

  console.log('Kontak berhasil ditambahkan!');
  rl.close();
};

// Main function to ensure data folder, read/write test.txt, and add contact
const main = async () => {
  await ensureDataFolderAndFiles();
  await readTestFile();
  await writeTestFile('This is the new content of the test file.');
  await addContact();
};

main();