const Joi = require('joi');

// Definisikan skema validasi
const patientSchema = Joi.object({
    fullname: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Fullname is required',
        'string.min': 'Fullname must be at least 3 characters long',
        'string.max': 'Fullname must be less than 255 characters'
    }),
    placeBirth: Joi.string().required().messages({
        'string.empty': 'Place of birth is required'
    }),
    dateBirth: Joi.date().required().messages({
        'date.base': 'Date of birth must be a valid date',
    }),
    gender: Joi.string().valid('male', 'female').required().messages({
        'string.empty': 'Gender is required',
        'any.only': 'Gender must be either "male" or "female"'
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required'
    }),
    work: Joi.string().required().messages({
        'string.empty': 'Work is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,13}$/).required().messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be between 10 and 13 digits'
    }),
    numberRegristation: Joi.string().optional().messages({
      'string.base': 'Number registration must be a string',
    }),
});

// Middleware validasi pasien
const validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body, { abortEarly: false }); // `abortEarly: false` memastikan semua error dikumpulkan
    if (error) {
        // Mengubah error menjadi array objek dengan field dan pesan
        const errorMessages = error.details.map(detail => ({
            field: detail.context.key,  // nama field yang error
            message: detail.message      // pesan error
        }));
        return res.status(400).json({ errors: errorMessages });
    }
    next(); // Lanjutkan ke route handler jika validasi berhasil
};

module.exports = validatePatient;
