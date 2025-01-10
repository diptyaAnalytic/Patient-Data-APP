const {User} = require('../models')

class AdminSeeders {
  static async createAdmin(req, res) {
    try {
        const user = new User({
            username: "Admin",
            password: "Admin1234!",
            role: "admin",
            fullname: "admin",
            phone: "085123456789",
            code: 123455,
            email: "admin@gmail.com"
        })
        await user.save().then((data) => {
            console.log(`Succsess Insert Data Admin! username : ${data.username}`);
          });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = AdminSeeders;
