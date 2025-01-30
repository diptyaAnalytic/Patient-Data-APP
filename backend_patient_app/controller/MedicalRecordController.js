const { paginator } = require("../helper/Paginator");
const {
  responseError,
  responseGetPaginator,
  responseGet,
  responseDelete,
} = require("../helper/Response");
const { MedicalRecord, Patient } = require("../models");
const { SGKMS } = require("../utils");
const { sessionToken } = require("../config/redis");


class MedicalRecordController {
  static async creteMedicalRecord(req, res) {
    try {
      const { date, diagnosis, therapy, service, description, patientId } =
        req.body;
      const data = await Patient.findOne({ _id: patientId });
      if (!data) return responseError(res, { message: "patient not found" });
      const processSeal = await SGKMS.engineApiSGKMS(
        `/${process.env.VERSION}/seal`,
        {
          sessionToken: await sessionToken(),
          slotId: parseInt(process.env.SLOT_ID),
          keyId: process.env.SEAL_AES,
          plaintext: [diagnosis, therapy, service, description],
        }
      );
      const {
        [0]: diagnosisSeal,
        [1]: therapySeal,
        [2]: serviceSeal,
        [3]: descriptionSeal,
      } = processSeal.result.ciphertext;

      const create = new MedicalRecord({
        date,
        diagnosis: diagnosisSeal,
        therapy: therapySeal,
        service: serviceSeal,
        description: descriptionSeal,
        patientId,
      });
      await create.save();
      res.send(create);
    } catch (error) {
      console.log(error);
    }
  }
  static async getRM(req, res) {
    try {
      const { page, search, sorting } = req.query;
      await MedicalRecord.find()
        .populate("patientId")
        .sort({ createdAt: -1 })
        .then((data) => {
          const results = data.map((result) => {
            const {
              _id: id,
              date,
              description,
              service,
              diagnosis,
              therapy,
              createdAt,
            } = result;
            const {
              _id: id_patient,
              numberRegristation,
              phone,
              gender,
              work,
              dateBirth,
              fullname,
              maritalStatus,
              citizenship,
              religion,
              mother,
            } = result.patientId;
            return {
              id,
              id_patient,
              createdAt,
              numberRegristation,
              description,
              date,
              fullname: fullname.text,
              gender: gender.text,
              phone,
              maritalStatus: maritalStatus.text,
              citizenship: citizenship.text,
              religion: religion.text,
              mother: mother.text,
              service,
              diagnosis,
              therapy,
              work,
              dateBirth,
            };
          });
          responseGetPaginator(res, paginator(results, page ? page : 1, 20));
          // return res.send(result)
        });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async getRMDecrypt(req, res) {
    try {
      const { page, search, sorting } = req.query;
      const data = await MedicalRecord.find()
        .populate("patientId")
        .sort({ createdAt: -1 });

      const results = await Promise.all(
        data.map(async (result) => {
          const { _id: id, date, createdAt } = result;
          const processUnseal = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/unseal`,
            {
              sessionToken: await sessionToken(),
              slotId: parseInt(process.env.SLOT_ID),
              ciphertext: [
                result.diagnosis,
                result.therapy,
                result.description,
                result.service,
              ],
            }
          );

          const {
            _id: id_patient,
            numberRegristation,
            phone,
            work,
            dateBirth,
          } = result.patientId;
          const decrypt = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/decrypt`,
            {
              sessionToken: await sessionToken(),
              slotId: parseInt(process.env.SLOT_ID),
              keyId: process.env.ENCRYPT_AES,
              keyVersion: result.patientId.keyVersion,
              ciphertext: [
                result.patientId.fullname,
                result.patientId.maritalStatus,
                result.patientId.citizenship,
                result.patientId.gender,
                result.patientId.religion,
                result.patientId.mother,
              ],
            }
          );
          // console.log("processDecrypt", decrypt);
          return {
            id,
            id_patient,
            fullname: decrypt.result.plaintext[0],
            maritalStatus: decrypt.result.plaintext[1],
            citizenship: decrypt.result.plaintext[2],
            gender: decrypt.result.plaintext[3],
            religion: decrypt.result.plaintext[4],
            mother: decrypt.result.plaintext[5],
            diagnosis: processUnseal.result.plaintext[0],
            therapy: processUnseal.result.plaintext[1],
            description: processUnseal.result.plaintext[2],
            service: processUnseal.result.plaintext[3],
            createdAt,
            numberRegristation,
            date,
            phone,
            work,
            dateBirth,
          };
        })
      );
      if (search) {
        const data = results.filter((item) =>
          item.fullname.toLowerCase().includes(search.toLowerCase())
        );
        return responseGetPaginator(res, paginator(data, page ? page : 1, 20));
      }
      responseGetPaginator(res, paginator(results, page ? page : 1, 20));
      // return res.send(result)
    } catch (error) {
      responseError(res, error);
    }
  }
  static async getDetailbyPatient(req, res) {
    try {
      const data = await Patient.findOne({ _id: req.params.id });
      if (!data) return responseError(res, { message: "patient not found" });
      await MedicalRecord.find({ patientId: req.params.id })
        .populate("patientId")
        .sort({ createdAt: -1 })
        .then(async (data) => {
          const results = data.map((result) => {
            const { patientId, _id: id, ...rest } = result._doc;
            const {
              _id: id_patient,
              createdAt,
              ...restPatient
            } = patientId._doc;
            return {
              ...rest,
              ...restPatient,
              id,
              id_patient,
              fullname: result.patientId.fullname.text,
              maritalStatus: result.patientId.maritalStatus.text,
              citizenship: result.patientId.citizenship.text,
              gender: result.patientId.gender.text,
              religion: result.patientId.religion.text,
              mother: result.patientId.mother.text,
            };
          });
          responseGet(res, results);
        });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async getDetailbyPatientDecrypt(req, res) {
    try {
      const data = await Patient.findOne({ _id: req.params.id });
      if (!data) return responseError(res, { message: "patient not found" });
      await MedicalRecord.find({ patientId: req.params.id })
        .populate("patientId")
        .sort({ createdAt: -1 })
        .then(async (data) => {
          // return res.send(data)
          const processDecrypt = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/decrypt`,
            {
              sessionToken: await sessionToken(),
              slotId: parseInt(process.env.SLOT_ID),
              keyId: process.env.ENCRYPT_AES,
              keyVersion: data[0].patientId.keyVersion,
              ciphertext: [
                data[0].patientId.fullname,
                data[0].patientId.maritalStatus,
                data[0].patientId.citizenship,
                data[0].patientId.gender,
                data[0].patientId.religion,
                data[0].patientId.mother,
              ],
            }
          );

          const results = await Promise.all(
            data.map(async (result) => {
              const processUnseal = await SGKMS.engineApiSGKMS(
                `/${process.env.VERSION}/unseal`,
                {
                  sessionToken: await sessionToken(),
                  slotId: parseInt(process.env.SLOT_ID),
                  ciphertext: [
                    result.diagnosis,
                    result.therapy,
                    result.description,
                    result.service,
                  ],
                }
              );
              const { patientId, _id: id, ...rest } = result._doc;
              const {
                _id: id_patient,
                createdAt,
                ...restPatient
              } = patientId._doc;
              return {
                ...rest,
                ...restPatient,
                id,
                id_patient,
                fullname: processDecrypt.result.plaintext[0],
                maritalStatus: processDecrypt.result.plaintext[1],
                citizenship: processDecrypt.result.plaintext[2],
                gender: processDecrypt.result.plaintext[3],
                religion: processDecrypt.result.plaintext[4],
                mother: processDecrypt.result.plaintext[5],
                diagnosis: processUnseal.result.plaintext[0],
                therapy: processUnseal.result.plaintext[1],
                description: processUnseal.result.plaintext[2],
                service: processUnseal.result.plaintext[3],
              };
            })
          );
          responseGet(res, results);
        });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async getDetailRM(req, res) {
    try {
      await MedicalRecord.findOne({ _id: req.params.id })
        .populate("patientId")
        .then(async (result) => {
          if (!result)
            return responseError(res, { message: "patient not found" });
          const {
            id,
            date,
            description,
            createdAt,
            service,
            diagnosis,
            therapy,
          } = result;
          const {
            id: id_patient,
            numberRegristation,
            phone,
            gender,
            work,
            dateBirth,
            fullname,
            keyVersion,
            maritalStatus,
            citizenship,
            religion,
            mother,
          } = result.patientId;

          const processDecrypt = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/decrypt`,
            {
              sessionToken: await sessionToken(),
              slotId: parseInt(process.env.SLOT_ID),
              keyId: process.env.ENCRYPT_AES,
              keyVersion,
              ciphertext: [
                fullname,
                maritalStatus,
                citizenship,
                gender,
                religion,
                mother,
              ],
            }
          );
          const processUnseal = await SGKMS.engineApiSGKMS(
            `/${process.env.VERSION}/unseal`,
            {
              sessionToken: await sessionToken(),
              slotId: parseInt(process.env.SLOT_ID),
              ciphertext: [diagnosis, therapy, description, service],
            }
          );
          console.log(processUnseal);
          responseGet(res, {
            id,
            id_patient,
            numberRegristation,
            date,
            createdAt,
            fullname: processDecrypt.result.plaintext[0],
            maritalStatus: processDecrypt.result.plaintext[1],
            citizenship: processDecrypt.result.plaintext[2],
            gender: processDecrypt.result.plaintext[3],
            religion: processDecrypt.result.plaintext[4],
            mother: processDecrypt.result.plaintext[5],
            phone,
            diagnosis: processUnseal.result.plaintext[0],
            therapy: processUnseal.result.plaintext[1],
            description: processUnseal.result.plaintext[2],
            service: processUnseal.result.plaintext[3],
            work,
            dateBirth,
          });
        });
    } catch (error) {
      responseError(res, error);
    }
  }
  static async deleteRekamMedis(req, res) {
    try {
      const deleteRM = await MedicalRecord.findByIdAndDelete(req.params.id);
      responseDelete(res, deleteRM ? 1 : 0);
    } catch (error) {
      responseError(res, error);
    }
  }
}
module.exports = MedicalRecordController;
