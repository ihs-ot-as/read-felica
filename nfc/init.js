
import { NFC } from 'nfc-pcsc';
import {sendSmartCardDataToBackend} from "../sendWithHttp.js";



const nfc = new NFC(); // optionally you can pass logger
//https://qiita.com/gebo/items/cb2dd393170767852fb3
const selectServicePayload = Buffer.from("FF:A4:00:01:02:0F:09".replaceAll(":",""), "hex");
const readTransitHistoryByPage = (paramPage) => {
    if( paramPage != 0 && typeof paramPage != "number" && ! paramPage?.isInteger()) throw  `please provide an integer. you gave me ${paramPage}`;
    if(!(0 <= paramPage && paramPage < 256)) throw `argument out of range. you gave me ${paramPage}`
    let page = paramPage; // trusted page number

    let hexedPage = page.toString(8).padStart(2,"0");
    return Buffer.from(`FF:B0:00:${hexedPage}:00`.replaceAll(":",""), "hex")
}

nfc.on('reader', reader => {

	console.log(`${reader.reader.name}  device attached`);

	// enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
	// when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
	// the response is available as card.data in the card event
	// see examples/basic.js line 17 for more info
	// reader.aid = 'F222222222';

	reader.on('card', async card => {

		// card is object containing following data
		// [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
		// [always] String standard: same as type
		// [only TAG_ISO_14443_3] String uid: tag uid
		// [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
        
        //Number.MAX_SAFE_INTEGER
        let serviceSelect = await reader.transmit(selectServicePayload,3000);
        console.log({serviceSelect});
        console.log("service select command sent");
        const histories = [];
		let previousLength = 0;
        for (let i = 0; i < 999; i++) { //12 まで行ける
            let history = await reader.transmit(readTransitHistoryByPage(i), 99999);
			let len = history.length;

			if(len < previousLength) break; 
			//if the byteArray we just read out of the card is smaller than the previous one,
			//we might have fallen out of pagination
			previousLength = len;
            histories.push(history);
        }
		sendSmartCardDataToBackend({histories, cardUid:card.uid})
		.then(response => console.log(response.data))
		.catch(response => console.table({error:response.response.data.name}))

		//console.table({type : typeof histories, singleType : typeof histories[0]});
        console.table(histories);
		console.log(`💳💳💳💳💳 ${reader.reader.name}  card detected 💳💳💳💳💳`, card);

	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});



