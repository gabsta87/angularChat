
// encoding & encryption
const encoding = (message) => {
  const myMessageEncodedAsUint8 = new TextEncoder().encode(message);
  const myMessageEncodedAsUinit8String = myMessageEncodedAsUint8.toString();
  const myMessageEncrypted = btoa(myMessageEncodedAsUinit8String);
  return myMessageEncrypted;
}

// decoding & decryption
const decoding = (value) => {
  const myValueAsUinit8String = atob(value);
  const myValueAsUint8 = new Uint8Array(myValueAsUinit8String.split(','));
  const myValueDecoded = new TextDecoder().decode(myValueAsUint8);
  return myValueDecoded;
}

const myMessage = 'Hello World';
const encrypted = encoding(myMessage);
const decrypted = decoding(encrypted);

console.log('my Message Encrypted: ', encrypted);
console.log('my Value Decoded: ',decrypted);