const { responseGet, responseError, responseCreate, responseUpdate, responseDelete } = require('../helper/Response');
const { Patient, MedicalRecord, User }= require('../models')
const { SGKMS } = require('../utils')

class PatientController {
  static async headerAmount(req, res) {
    try {
        const [amountPatient, amountMedicalRecord] = await Promise.all([
            Patient.countDocuments(),
            MedicalRecord.countDocuments(),
        ]);

        return responseGet(res, {amountPatient, amountMedicalRecord})
    } catch (error) {
      responseError(res, error)
    }
  }
  static async createPatient(req, res) {
    try {
      const { fullname, placeBirth, dateBirth, gender, address, work, phone, numberRegristation = Date.now() } = req.body; 
      //use encrypt aes, so need aad or more data to encrypt data to encrypt
      const processEncrypt = await SGKMS.engineApiSGKMS(`/${process.env.VERSION}/encrypt`,{
        sessionToken: process.env.SESSION_TOKEN,
        slotId: parseInt(process.env.SLOT_ID),
        keyId: process.env.ENCRYPT_AES,
        plaintext: [{
          text: fullname,
          numberRegristation,
        }]
      })
      const user = new Patient({
        keyVersion: processEncrypt.result.keyVersion,
        fullname: processEncrypt.result.ciphertext[0].text, 
        mac: processEncrypt.result.ciphertext[0].mac,
        iv: processEncrypt.result.ciphertext[0].iv,
        dateBirth, 
        address, 
        phone, 
        placeBirth, 
        gender, 
        work, 
        numberRegristation 
      })
      await user.save()
      responseCreate(res);
    } catch (error) {
        responseError(res, error)
    }
  }
  static async getPatient(req, res) {
    try {
      const data = await Patient.aggregate([{
        $project: {
          id: "$_id",
          numberRegristation: 1,
          text: "$fullname",
          mac: 1,
          iv: 1,
          keyVersion: 1,
          placeBirth: 1,
          dateBirth: 1,
          gender: 1,
          address: 1,
          work: 1,
          phone: 1,
          _id: 0
        }
      }]);
      const processDecrypt = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/decrypt`,{
          sessionToken: process.env.SESSION_TOKEN,
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.ENCRYPT_AES,
          keyVersion: data[0].keyVersion,
          ciphertext: data,
        }
      );    
      const dataDecrypt = data.map((dataEncrypt, x) => {
        const { mac, iv, text, keyVersion, ...newData } = dataEncrypt;
        return {
          fullname: processDecrypt.result.plaintext[x],
          ...newData,
        };
      });
      responseGet(res, dataDecrypt)
    } catch (error) {
      console.log(error)
      responseError(res, error)
      // console.log(error, "error decrypt")
      // if (error.response) {
      //   return res.status(500).json(error.response.data);
      // }
      // handlerError(res, error);
    }
  }
  static async detailPatient(req, res) {
    try {
      const data = await Patient.findOne({_id: req.params.id});
      if(!data) return responseError(res, {message: "patient not found"})
      const processDecrypt = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/decrypt`,{
          sessionToken: process.env.SESSION_TOKEN,
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.ENCRYPT_AES,
          keyVersion: data.keyVersion,
          ciphertext: [{
            text: data.fullname,
            mac: data.mac,
            iv: data.iv
          }],
        }
      )
      const { _id, fullname, mac, iv, text, keyVersion, ...newData } = data._doc;
      responseGet(res, {
        id: _id,
        fullname: processDecrypt.result.plaintext[0],
        ...newData,
      });
    } catch (error) {
      if (error.response) {
        return res.status(500).json(error.response.data);
      }
      responseError(res, error);
    }
  }
  static async updatePatient(req, res) {
    try {
      const { fullname, placeBirth, dateBirth, gender, address, work, phone, numberRegristation } = req.body;
      const processEncrypt = await SGKMS.engineApiSGKMS(`/${process.env.VERSION}/encrypt`,{
        sessionToken: process.env.SESSION_TOKEN,
        slotId: parseInt(process.env.SLOT_ID),
        keyId: process.env.ENCRYPT_AES,
        plaintext: [{
          text: fullname,
          numberRegristation,
        }]
      })
      const update = await Patient.findByIdAndUpdate(req.params.id,{
          fullname: processEncrypt.result.ciphertext[0].text,
          placeBirth,
          dateBirth,
          gender,
          address,
          work,
          phone,
          keyVersion: processEncrypt.result.keyVersion,
          mac: processEncrypt.result.ciphertext[0].mac,
          iv: processEncrypt.result.ciphertext[0].iv,
      },{ new: true })
      responseUpdate(res, update ? 1 : 0);
    } catch (error) {
      console.log(error)
      responseError(res, error);
    }
  }
  static async deletePatient(req, res) {
    try {
      const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
      responseDelete(res, deletedPatient ? 1 : 0 );
    } catch (error) {
      responseError(res, error);
    }
  }
}

module.exports = PatientController;