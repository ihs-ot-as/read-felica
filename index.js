import { Command } from 'commander/esm.mjs';
const program = new Command();
program
.option('-d, --domain <domain>', 'define the url (domain and the port, no protocol such as http) you want the http request containing smart card data to be sent to. Defaults to localhost',"localhost:5000")
.option('-s, --secure', 'specify if you want the connection to be made in https instead of http')

program.parse();
let options = program.opts();
const backend = `http${options.secure ? "s" : ""}://${options.domain}`
console.log(backend)

options = null;
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Delete_in_strict_mode
//if you want a variable to be GG'ed, don't use delete operator set it to null and let it leave to the GG


import {} from "./nfc/init.js"; 
//initialize and set all the call back functions 





export {backend}

