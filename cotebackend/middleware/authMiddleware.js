const jwt = require('jsonwebtoken');
const User = require('../models/user');
// request => verify => route
// const requireAuth = async(req , res , next )=>{
//     try{
//         next();
//     }catch(e){
//         res.status(401).('Please login');
//     }
// }
// export const auth = async (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;
//       // const authHeader = localStorage.getItem('authHeader');
//       console.log("authHeader", authHeader);
//       if (!authHeader || authHeader === "undefined") throw new Error("No token");
//       const token = authHeader.split(" ")[1];
//       if (!token) throw new Error("No token");
//       const payload = verify(token,'secret net ninja ')
//         // process.env.TOKEN_KEY as string) as
//         // {
//         //   id: number;
//         //   iat: number;
//         //   exp: number;
//         // };
//       if (!payload) {
//         res.status(403).send({ message: MSG.UNAUTHORIZED });
//       }
//       const currentUser = await user.findById( { id: payload.id  });
//       res.locals.currentUser = currentUser;
//       next();
//     } catch (error) {
//       res.status(403).send({ message: "token expired" });
//     }
//   };
const requireAuth = (req , res , next )=>{
const token = req.cookies.jwt;
//check json web token exisits & is verified
   if (token) {
    jwt.verify(token,'net ninja secret ',(err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.redirect('/login');
        }else{
            console.log(decodedToken);
            next();
        }
    });
   }
   else {
    res.redirect ('/login');
   }
}
//check current user
const checkUser = async(req , res , next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'net ninja secret ',async(err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.locals.user = null;
            return res.status(400).send(null);
            // next();
        }else{
            console.log(decodedToken);
            // le payload contient l'id de l'utilisateur on va le chercher dans notre bd
            let user = await User.findById(decodedToken.id);
            //on va passer cet utilisateur pour view pour avoir toutes les infos de cet utilisateur (email...)
            res.locals.user = user;
            return res.status(200).send(decodedToken.id);
        }})
    }else{
        res.locals.user = null ;
        return res.status(400).send(null);
        // next();
    }
}
module.exports = { requireAuth , checkUser };