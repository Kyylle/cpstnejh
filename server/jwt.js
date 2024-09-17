const jwt = require('jsonwebtoken');

// Secret key for signing the token
const secretKey = 'your-secret-key'; // Change this to a strong secret key

// Function to generate a random payload
const generateRandomPayload = () => {
  return {
    id: Math.floor(Math.random() * 1000),
    name: `User${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now()
  };
};

// Generate a random token
const generateToken = () => {
  const payload = generateRandomPayload();
  const token = jwt.sign(payload, secretKey, { expiresIn: '1y' }); // Token expires in 1 hour
  return token;
};

// Output the token
const token = generateToken();
console.log('Generated JWT Token:', token);
