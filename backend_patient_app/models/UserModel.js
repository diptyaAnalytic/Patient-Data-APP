const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username Can't be Empty!"],
        unique: [true, "Username Already Registered!"]
    },
    password: {
        type: String,
        required: [true, "Password Can't be Empty!"],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
        validator: function(v) {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
            return regex.test(v);
        },
        message: props => `Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.`
        }
    },
    fullname: {
        type: String,
        required: [true, "Fullname Can't be Empty!"]
    },
    phone: {
        type: String,
        required: [true, "Phone Can't be Empty"],
        unique: [true, "Phone Already Registered!"],
        match: [/^\d{10,13}$/, 'Phone must be a 10-13 digit number'],
    },
    email: {
        type: String,
        required: [true, "Email Can't Be Empty!"],
        unique: [true, "Email Already Registered!"],
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], 
    },
    role: {
        type: String,
        required: [true, "Role can't be empty!"]
    },
    code: {
        type: Number,
        required: [true, "Code can't be empty!"]
    },
},{
    timestamps: true
});

// Middleware untuk meng-hash password sebelum disimpan
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Middleware: Hash password sebelum memperbarui (opsional)
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Method untuk membandingkan password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
