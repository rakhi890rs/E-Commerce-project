const userModel = require('../model/user.model')


async function registerUser(req,res){
   const { username, email, password, fullname: { firstname, lastname } } = req.body;
}