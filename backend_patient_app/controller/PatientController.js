const {
  responseGet,
  responseError,
  responseCreate,
  responseUpdate,
  responseDelete,
} = require("../helper/Response");
const { Patient, MedicalRecord, User } = require("../models");
const { SGKMS } = require("../utils");
const client = require("../config/redis");
const sessionToken = await client.get("session_token");

class PatientController {
  static async headerAmount(req, res) {
    try {
      const [amountPatient, amountMedicalRecord] = await Promise.all([
        Patient.countDocuments(),
        MedicalRecord.countDocuments(),
      ]);

      return responseGet(res, { amountPatient, amountMedicalRecord });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async createPatient(req, res) {
    try {
      const {
        fullname,
        maritalStatus,
        citizenship,
        gender,
        religion,
        mother,
        placeBirth,
        dateBirth,
        address,
        work,
        phone,
        numberRegristation = Date.now(),
      } = req.body;
      //use encrypt aes, so need aad or more data to encrypt data to encrypt
      const processEncrypt = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/encrypt`,
        {
          sessionToken,
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.ENCRYPT_AES,
          plaintext: [
            {
              text: fullname,
              numberRegristation,
            },
            {
              text: maritalStatus,
              numberRegristation,
            },
            {
              text: citizenship,
              numberRegristation,
            },
            {
              text: gender,
              numberRegristation,
            },
            {
              text: religion,
              numberRegristation,
            },
            {
              text: mother,
              numberRegristation,
            },
          ],
        }
      );
      const user = new Patient({
        keyVersion: processEncrypt.result.keyVersion,
        fullname: processEncrypt.result.ciphertext[0],
        maritalStatus: processEncrypt.result.ciphertext[1],
        citizenship: processEncrypt.result.ciphertext[2],
        gender: processEncrypt.result.ciphertext[3],
        religion: processEncrypt.result.ciphertext[4],
        mother: processEncrypt.result.ciphertext[5],
        dateBirth,
        address,
        phone,
        placeBirth,
        work,
        numberRegristation,
      });
      await user.save();
      responseCreate(res);
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  }
  static async getPatient(req, res) {
    try {
      const {search} = req.query
      const data = await Patient.find();
      const processDecrypt = await Promise.all(
        data.map(async (data, x) => {
          const decrypt = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/decrypt`,
            {
              sessionToken,
              slotId: parseInt(process.env.SLOT_ID),
              keyId: process.env.ENCRYPT_AES,
              keyVersion: data.keyVersion,
              ciphertext: [
                data.fullname,
                data.maritalStatus,
                data.citizenship,
                data.gender,
                data.religion,
                data.mother,
              ],
            }
          );

          const {
            placeBirth,
            dateBirth,
            address,
            work,
            phone,
            numberRegristation,
            id = data._id,
          } = data;

          return {
            id,
            fullname: decrypt.result.plaintext[0],
            maritalStatus: decrypt.result.plaintext[1],
            citizenship: decrypt.result.plaintext[2],
            gender: decrypt.result.plaintext[3],
            religion: decrypt.result.plaintext[4],
            mother: decrypt.result.plaintext[5],
            placeBirth,
            dateBirth,
            address,
            work,
            phone,
            numberRegristation,
          };
        })
      );
      if(search){
         const data = processDecrypt.filter((item) =>
           item.fullname.toLowerCase().includes(search.toLowerCase())
         );
         return responseGet(res, data);
      }
      responseGet(res, processDecrypt);
    } catch (error) {
      // console.log(error);
      responseError(res, error);
    }
  }
  static async getPatientEncrypt(req, res) {
    try {
      await Patient.find().then((result) => {
        const data = result.map((a) => {
          return {
            ...a._doc,
            id: a._id,
            fullname: a.fullname.text,
            maritalStatus: a.maritalStatus.text,
            citizenship: a.citizenship.text,
            gender: a.gender.text,
            religion: a.religion.text,
            mother: a.mother.text,
          };
        });
        responseGet(res, data);
      });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async detailPatient(req, res) {
    try {
      const data = await Patient.findOne({ _id: req.params.id });
      if (!data) return responseError(res, { message: "patient not found" });
      const processDecrypt = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/decrypt`,
        {
          sessionToken,
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.ENCRYPT_AES,
          keyVersion: data.keyVersion,
          ciphertext: [
            data.fullname,
            data.maritalStatus,
            data.citizenship,
            data.gender,
            data.religion,
            data.mother,
          ],
        }
      );
      const {
        _id,
        fullname,
        maritalStatus,
        citizenship,
        religion,
        gender,
        mother,
        mac,
        iv,
        text,
        keyVersion,
        ...newData
      } = data._doc;
      responseGet(res, {
        id: _id,
        fullname: processDecrypt.result.plaintext[0],
        maritalStatus: processDecrypt.result.plaintext[1],
        citizenship: processDecrypt.result.plaintext[2],
        gender: processDecrypt.result.plaintext[3],
        religion: processDecrypt.result.plaintext[4],
        mother: processDecrypt.result.plaintext[5],
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
      const {
        fullname,
        maritalStatus,
        citizenship,
        gender,
        religion,
        mother,
        placeBirth,
        dateBirth,
        address,
        work,
        phone,
      } = req.body;
      const data = await Patient.findOne({ _id: req.params.id });
      if (!data) return responseError(res, { message: "patient not found" });
      const numberRegristation = data.numberRegristation;
      const processEncrypt = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/encrypt`,
        {
          sessionToken,
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.ENCRYPT_AES,
          plaintext: [
            {
              text: fullname,
              numberRegristation,
            },
            {
              text: maritalStatus,
              numberRegristation,
            },
            {
              text: citizenship,
              numberRegristation,
            },
            {
              text: gender,
              numberRegristation,
            },
            {
              text: religion,
              numberRegristation,
            },
            {
              text: mother,
              numberRegristation,
            },
          ],
        }
      );
      const update = await Patient.findByIdAndUpdate(
        req.params.id,
        {
          fullname: processEncrypt.result.ciphertext[0],
          maritalStatus: processEncrypt.result.ciphertext[1],
          citizenship: processEncrypt.result.ciphertext[2],
          gender: processEncrypt.result.ciphertext[3],
          religion: processEncrypt.result.ciphertext[4],
          mother: processEncrypt.result.ciphertext[5],
          placeBirth,
          dateBirth,
          address,
          work,
          phone,
          keyVersion: processEncrypt.result.keyVersion,
        },
        { new: true }
      );
      responseUpdate(res, update ? 1 : 0);
    } catch (error) {
      console.log(error);
      responseError(res, error);
    }
  }
  static async deletePatient(req, res) {
    try {
      const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
      responseDelete(res, deletedPatient ? 1 : 0);
    } catch (error) {
      responseError(res, error);
    }
  }
}

module.exports = PatientController;
