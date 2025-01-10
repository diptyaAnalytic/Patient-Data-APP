const mongoose = require('mongoose');
const PatientModel = require('./PatientModel');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    date: {
        type: Date,
        required: [true, "Date Can't be Empty!"]
    },
    diagnosis: {
        type: String,
        required: [true, "Diagnosis Can't be Empty!"]
    },
    therapy: {
        type: String,
        require: [true, "Therapy Can't be Empty!"]
    },
    description: {
        type: String,
        require: [true, "Description Can't be Empty!" ]
    }, 
    service: {
        type: String,
        require: [true, "Service Can't be Empty!"]
    },
},{
    timestamps: true,
    collection: 'medical_records'
});

// //camelCase to snakeCase
// medicalRecordSchema.set('toJSON', {
//   transform: function(doc, ret) {
//     const snakeCaseRet = {};
//     for (const key in ret) {
//       const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // Ubah camelCase ke snake_case
//       snakeCaseRet[snakeCaseKey] = ret[key];
//     }
//     return snakeCaseRet;
//     // ret.patient_id = ret.patientId
//     // delete ret.patientId
//     // return ret;
//   }
// });

medicalRecordSchema.post('save', async function (doc, next) {
  try {
    await PatientModel.findByIdAndUpdate(
      doc.patientId,
      { $push: { medicalRecords: doc._id } },
      { new: true }
    );
    console.log('Medical record berhasil ditambahkan ke pasien.');
  } catch (error) {
    console.error('Error menambahkan medical record ke pasien:', error);
  }
  next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
