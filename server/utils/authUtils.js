const { jwtVerify, SignJWT } = require("jose");

const bcrypt = require("bcrypt");

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieName = 'auth-token';

const signAuthToken = async (payload) => {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({alg:'HS256'})
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(secret);

    return token;
  } catch (error) {
    console.log(`Failed to sign auth token error: ${error}`)

    throw new Error('Failded to create new auth token');
  
  }
}

const verifyAuthToken = async (token) => {
  try {
    const {payload} = await jwtVerify(token, secret);

    return payload;
  } catch (error) {
    throw new Error('Failded to verify auth token');
  }
}


const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 1000
  });
};

const getAuthCookie = (req) => {
  return req.cookies[cookieName]; 
};

const removeAuthCookie = (res) => {
  res.clearCookie(cookieName);
};

module.exports = {
  signAuthToken,
  getAuthCookie,
  removeAuthCookie,
  verifyAuthToken,
  setAuthCookie
};
