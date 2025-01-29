const mongoose = require("mongoose");

// const EncryptedFieldSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   mac: { type: String, required: true },
//   iv: { type: String, required: true },
// });

const patientSchema = new mongoose.Schema(
  {
    numberRegristation: {
      type: String,
      required: [true, "Number Regristation Can't be Empty!"],
      unique: [true, "Number Regristation Already Registered!"],
    },
    fullname: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    maritalStatus: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    citizenship: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    gender: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    religion: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    mother: {
      text: { type: String, required: true },
      mac: { type: String, required: true },
      iv: { type: String, required: true },
    },
    keyVersion: {
      type: Number,
      required: [true, "Key Version Can't be Empty!"],
    },
    placeBirth: {
      type: String,
      requires: [true, "Place Birth Can't be Empty!"],
    },
    dateBirth: {
      type: Date,
      require: [true, "Date Birth Can't be Empty!"],
    },
    address: {
      type: String,
      required: [true, "Address Can't be Empty!"],
    },
    work: {
      type: String,
      required: [true, "Work Can't be Empty!"],
    },
    phone: {
      type: String,
      required: [true, "Phone Can't be Empty"],
      unique: [true, "Phone Already Registered!"],
      match: [/^\d{10,13}$/, "Phone must be a 10-13 digit number"],
    },
    medicalRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);
