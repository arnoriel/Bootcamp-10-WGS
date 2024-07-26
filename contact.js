const contacts = require('./contact');

const main = async () => {
    const name = await contacts.questions('What is your name?');
    const email = await contacts.questions('What is your email?');
    const phone = await contacts.questions('What is your phone?');
    const alamat = await contacts.questions('What is your alamat?');

    contacts.saveContacts(name,email,phone,alamat);
};

main();