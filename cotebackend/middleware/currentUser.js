const jwt = require('jsonwebtoken');
function currentUser(token) {
  console.log(token)
  const test = token.split(' ')[1];
  const decoded = jwt.decode(test);
  if (!decoded) {
    return null;
  } else {
    const { id } = decoded;
    return id;
  }
// const User = require('../models/user');
// async function currentUser(token) {
    // const decoded = jwt.decode(token);
    // const verif = jwt.verify(token, )
    // const user = User.findById({_id : decoded.id});
    // const decoded = jwt.verify(token,'net ninja secret ' );
    // if(!user){
    //     return null
    // }else{
    //     return decoded.id;
    // }
}

module.exports = { currentUser };
