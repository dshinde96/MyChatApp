const jwt=require('jsonwebtoken');
const secretKey="rhtyfh46#$gf%42#";

const generatToken=(user)=>{
    const authToken=jwt.sign(user,secretKey);
    return authToken;
}

const validateToken=(authToken)=>{
    const user=jwt.verify(authToken,secretKey);
    return user;
}

module.exports={generatToken,validateToken};