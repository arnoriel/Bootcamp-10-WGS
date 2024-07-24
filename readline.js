const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });

rl.question('Siapa Namamu? ', (answer) => {
    fs.writeFileSync('test.txt', answer);
  console.log(`Oh namamu ${answer} ya,`, `Selamat datang ${answer}`);
  
  rl.close();
});