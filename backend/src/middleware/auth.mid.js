import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    console.log('No Authorization header found');
    return res.status(UNAUTHORIZED).send();
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    console.log('Invalid Authorization header format');
    return res.status(UNAUTHORIZED).send();
  }

  const token = authorizationHeader.slice(7); // Remove 'Bearer ' prefix
  console.log('Raw Token:', token);

  try {
    console.log('Using JWT_SECRET:', process.env.JWT_SECRET);

    // Attempt to decode the token using jwt.decode for detailed logging
    const decoded = jwt.decode(token, { complete: true });
    console.log('Decoded Header:', decoded.header);
    console.log('Decoded Payload:', decoded.payload);

    // Manually sign a token using the same payload and secret
    const manuallySignedToken = jwt.sign(decoded.payload, 'bkjdsu1223bvd');
    console.log('Manually Signed Token:', manuallySignedToken);

    // Attempt to verify the manually signed token
    const verified = jwt.verify(manuallySignedToken, 'bkjdsu1223bvd');  // Replace with the actual secret key
    console.log('Manually Verified Token Result:', verified);

    // Proceed with the existing verification logic
    req.user = decoded.payload;

    console.log('Token decoded successfully:', decoded.payload);
    console.log('Token expiration:', new Date(decoded.payload.exp * 1000).toLocaleString());

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(UNAUTHORIZED).send();
  }
};
