const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const validator = require('validator');

const rl = readline.createInterface({ input, output });

let userData = {};

const askEmail = () => {
    rl.question('Apa Emailmu? ', (email) => {
        if (!validator.isEmail(email)) {
            console.log('Email tidak valid! Silakan coba lagi.');
            askEmail();
        } else {
            userData.email = email;
            askPhone();
        }
    });
};

const askPhone = () => {
    rl.question('Berapa Nomor Teleponmu? ', (phone) => {
        if (!validator.isMobilePhone(phone, 'id-ID', { strictMode: false })) {
            console.log('Nomor telepon tidak valid! Silakan coba lagi.');
            askPhone();
        } else {
            userData.phone = phone;
            askAddress();
        }
    });
};

const askAddress = () => {
    rl.question('Dimana Alamatmu? ', (alamat) => {
        userData.alamat = alamat;
        const result = `Namamu adalah ${userData.nama}, Emailmu adalah ${userData.email}, nomor teleponmu adalah ${userData.phone}, alamatmu di ${userData.alamat}`;
        console.log(result);
        fs.writeFileSync('test.txt', result);
        rl.close();
    });
};

rl.question('Siapa Namamu? ', (nama) => {
    userData.nama = nama;
    askEmail();
});
