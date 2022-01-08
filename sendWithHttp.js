import axios from "axios";
import {backend} from "./index.js"
import {encrypt} from "./cryptos/encrypt.js"


async function sendSmartCardDataToBackend(data){
    let encryptedData = encrypt(data);
    return axios.post(`${backend}/records`,encryptedData);
}
export {sendSmartCardDataToBackend};
