const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { currentUser } = require('../middleware/currentUser');

module.exports.deleteuser= async(req, res) => {
    try{
        const user = await User.findOneAndDelete()
        res.status(200).send(user)
        }
    catch(err){
        res.status(400).send(err)
    }
   }
module.exports.deleteuserbyid= async(req, res) => {
    try{
        const id =req.params.id;
        user = await User.findOneAndDelete({_id:id})
        res.status(200).send(user)
        }
    catch(err){
        res.status(400).send(err)
    }
}
module.exports.userbyid = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id)
      .populate('followers')
      .populate('following');
      console.log("hello", user)
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.getallusers= async(req, res) => {
    try{
        const users=await User.find()
        res.status(200).send(users)
    }catch(err){
        res.status(400).send(err)
    }
}
module.exports.blockuserbyid= async(req, res) => {
    try {
        id = req.params.id;
       updated = await User.findByIdAndUpdate({ _id : id }, {blocked : true});
       const transport = nodemailer.createTransport({
         service: "gmail",
         host: "smtp.gmail.com",
         auth: {
           user:"nourentrepreneur466@gmail.com",
           pass: "kfzagrujhgaultwn"
         },
       })
       console.log("user is blockeddd sending");
       const mailOptions = {
         from: process.env.EMAIL,
         to: updated.email,
         subject: `Account Blocked Due to Security Vulnerabilities `,
         text: `
         <!doctype html>
         <html lang="en-US">
         <head>
             <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
             <meta name="description" content="Account Blocked Due to Security Vulnerabilities ">
             <style type="text/css">
                 a:hover {text-decoration: underline !important;}
             </style>
         </head>
         <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <p> Dear  User , <br/>
   
            We regret to inform you that your account has been temporarily blocked from our platform due to security vulnerabilities that were detected. Our team takes security very seriously and we have taken this measure to protect our platform and its users from any potential harm.
            
            We recommend that you review your account security and take appropriate measures to ensure that your account is not compromised. Once you have resolved the security vulnerabilities, please contact us so that we can review and unblock your account.
            
            If you have any questions or concerns regarding this matter, please feel free to contact our administrator at ${process.env.EMAIL}. They will be able to provide you with more information on the security vulnerabilities that were detected and steps that you can take to prevent them in the future.
            
            Thank you for your cooperation in helping us maintain a secure platform for all our users.
            
            Best regards, </p>
         </body>
         </html>`, html: ` <!doctype html>
         <html lang="en-US">
         <head>
             <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
             <meta name="description" content="Account Blocked Due to Security Vulnerabilities ">
             <style type="text/css">
                 a:hover {text-decoration: underline !important;}
             </style>
         </head>
         <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <p> Dear  User ,<br/>
   
            We regret to inform you that your account has been temporarily blocked from our platform due to security vulnerabilities that were detected. Our team takes security very seriously and we have taken this measure to protect our platform and its users from any potential harm.
            
            We recommend that you review your account security and take appropriate measures to ensure that your account is not compromised. Once you have resolved the security vulnerabilities, please contact us so that we can review and unblock your account.
            
            If you have any questions or concerns regarding this matter, please feel free to contact our administrator at ${process.env.EMAIL}. They will be able to provide you with more information on the security vulnerabilities that were detected and steps that you can take to prevent them in the future.
            
            Thank you for your cooperation in helping us maintain a secure platform for all our users.
            <br/>
            Best regards <br/> </p>
         </body>
         </html>`
       };
       transport.sendMail(mailOptions, (error, info) => {
         if (error) {
           return res.status(400).json({ message: "Error" });
         }
         return res.status(200).json({ message: "Email Sent" });
       });
       res.status(200).send(updated);
     } catch (err) {
       res.status(400).send(err);
     }
}
module.exports.deblockuserbyid= async(req, res) => {
  try {
      id = req.params.id;
     updated = await User.findByIdAndUpdate({ _id : id }, {blocked : false});
     res.status(200).send(updated);
   } catch (err) {
     res.status(400).send(err);
   }
}
module.exports.edituserbyid= async(req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        if(newData.password){
            const salt = await bcrypt.genSalt();
            newData.password = await bcrypt.hash(newData.password, salt);
        }
        const updated = await User.findByIdAndUpdate(id, newData, {new: true});
        res.status(200).send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
}



module.exports.follow = async (req, res) => {

    if (!User.findById(req.params.id))
      return res.status(400).send("ID unknown");
    try {
      // Add to the follower list
      const user = currentUser(req.headers.authorization);
      console.log("User ID: ", user);
      console.log("User to follow ID: ", req.params.id);

      await User.findByIdAndUpdate(
        user,
        { $addToSet : { following: req.params.id} },
        { new: true }
      ).exec();
      // Add to the following list
      await User.findByIdAndUpdate(
        req.params.id,
        { $addToSet : { followers: user } },
        { new: true }
      ).exec();
      res.status(200).send("User followed successfully");
    } catch (err) {
      res.status(400).send(err);
    }
  };
module.exports.unfollow= async(req, res) => {
  const user = currentUser(req.headers.authorization);
    if (!User.findById(req.params.id) )
    return res.status(400).send("ID unknown");
    try {
          // Add to the follower list
      console.log("User ID: ", user);
      console.log("User to unfollow ID: ", req.params.id);
            await User.findByIdAndUpdate(
              user,
              { $pull : { following: req.params.id} },
              { new: true }
            ).exec();
            // Add to the following list
            await User.findByIdAndUpdate(
              req.params.id,
              { $pull : { followers: user } },
              { new: true }
            ).exec();
            res.status(200).send("User unfollowed successfully");
     } catch (err) {
       res.status(400).send(err);
     }
}

module.exports.followers = async (req, res) => {
  try {
    const user = await User.findById( req.params.id )
    .populate('followers');
    // const aa = await user.populate('followers').exec();
    // console.log(aa)
    const followers = user.followers;
    const count = followers.length;
    const result = { followers, count };
    res.json(result);
  } catch (err) {
    res.status(400).send(err);
  }
}
//populate refers to documents in other collection 
module.exports.following = async (req, res) => {
  try {
    // console.log("hello world")
    const user = await User.findById( req.params.id )
    .populate('following');
  //  const aa = user.populate({path: 'following'}).execPopulate();
    // console.log(user)
    const following = user.following;
    const count = following.length;
    const result = { following, count };
    res.json(result);
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports.tournaments_participated = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    // const tournaments = user.tournamentsparticipations;
    const count = tournaments.length;
    const result = { tournaments, count };
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
}

