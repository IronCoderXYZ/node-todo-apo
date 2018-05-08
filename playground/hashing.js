const jwt = require('jsonwebtoken');
const { SHA256 } = require('crypto-js');

// JWT
const data = { id: 10 };
const token = jwt.sign(data, '123abc');
const decoded = jwt.verify(token, '123abc');
console.log(decoded);

// SHA256
// const message = 'This is an unhashed message';
// const hashedMessage = SHA256(message).toString();

// console.log(hashedMessage);

// const data = {
//   id: 4
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };

// // Manipulating
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not manipulated');
// } else {
//   console.log('Warning: data was manipulated');
// }
