const { paginator } = require("../helper/Paginator");
const { responseError, responseGetPaginator, responseGet, responseDelete } = require("../helper/Response");
const { MedicalRecord, Patient } = require("../models");
const { SGKMS } = require("../utils");

class MedicalRecordController{
    static async creteMedicalRecord(req,res){
        try {
            const { date, diagnosis, therapy, service, description, patientId } = req.body;
            const processSeal = await SGKMS.engineApiSGKMS(`/${process.env.VERSION}/seal`,{
                sessionToken: process.env.SESSION_TOKEN,
                slotId: parseInt(process.env.SLOT_ID),
                keyId: process.env.SEAL_AES,
                plaintext: [ diagnosis, therapy, service, description ]
            })
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
                patientId
            })
            await create.save()
            res.send(create)
        } catch (error) {
            console.log(error)
        }
    }
    static async getRM(req, res) {
        try {
            const { page, search, sorting } = req.query;
            await MedicalRecord.find().populate('patientId')
            .then(data=>{
                const results = data.map(result=>{
                    const { id, date, description, service, diagnosis, therapy,} = result
                    const { id: id_patient, numberRegristation, phone, gender, work, dateBirth, fullname } = result.patientId
                    return {
                        id,
                        id_patient,
                        numberRegristation,
                        description,
                        date,
                        fullname,
                        gender,
                        phone,
                        hasil: service,
                        diagnosis,
                        therapy,
                        work,
                        dateBirth,
                    };
                })
                responseGetPaginator( res, paginator(results, page ? page : 1, 20) )
                // return res.send(result)
            })
        } catch (error) {
        responseError(res, error);
    }
  }
    static async getDetailbyPatient(req, res) {
        try {
            await MedicalRecord.find({patientId: req.params.id}).populate('patientId')
            .then(async data=>{
                const processDecrypt = await SGKMS.engineApiSGKMS(
                    `/${process.env.VERSION}/decrypt`,{
                        sessionToken: process.env.SESSION_TOKEN,
                        slotId: parseInt(process.env.SLOT_ID),
                        keyId: process.env.ENCRYPT_AES,
                        keyVersion: data[0].patientId.keyVersion,
                        ciphertext: [{
                            text: data[0].patientId.fullname,
                            mac: data[0].patientId.mac,
                            iv: data[0].patientId.iv,
                        }],
                    }
                ); 
                const fullname = processDecrypt.result.plaintext[0] 
                const results = data.map(result=>{
                    const { id, date, description, service, diagnosis, therapy,} = result
                    const { id: id_patient, number_regristation, phone, gender, work, date_birth } = result.patientId
                    return {
                        id,
                        id_patient,
                        number_regristation,
                        description,
                        date,
                        fullname,
                        gender,
                        phone,
                        service,
                        diagnosis,
                        therapy,
                        work,
                        date_birth,
                    };
                })
                responseGet(res, results)
            })
        } catch (error) {
        responseError(res, error);
    }
  }
    static async getDetailRM(req, res) {
    try {
        await MedicalRecord.findOne({_id: req.params.id}).populate('patientId')
        .then(async result=>{
            const { id, date, description, service, diagnosis, therapy,} = result
            const { id: id_patient, numberRegristation, phone, gender, work, dateBirth, fullname, mac, iv, keyVersion } = result.patientId
            
            const processDecrypt = await SGKMS.engineApiSGKMS(
                `/${process.env.VERSION}/decrypt`,{
                    sessionToken: process.env.SESSION_TOKEN,
                    slotId: parseInt(process.env.SLOT_ID),
                    keyId: process.env.ENCRYPT_AES,
                    keyVersion,
                    ciphertext: [{
                        text: fullname,
                        mac,
                        iv
                    }],
                }
            );
            const processUnseal = await SGKMS.engineApiSGKMS(
                `/${process.env.VERSION}/unseal`,{
                    sessionToken: process.env.SESSION_TOKEN,
                    slotId: parseInt(process.env.SLOT_ID),
                    ciphertext: [
                        diagnosis,
                        therapy,
                        description,
                        service
                    ],
                }
            ); 
            responseGet(res, {
                id,
                id_patient,
                numberRegristation,
                date,
                fullname: processDecrypt.result.plaintext[0] ,
                gender,
                phone,
                diagnosis: processUnseal.result.plaintext[0],
                therapy: processUnseal.result.plaintext[1],
                description: processUnseal.result.plaintext[2],
                hasil: processUnseal.result.plaintext[3],
                work,
                dateBirth,
            });
        })
    } catch (error) {
      responseError(res, error);
    }
  }
   static async deleteRekamMedis(req, res) {
    try {
      const deleteRM = await MedicalRecord.findByIdAndDelete(req.params.id);
      responseDelete(res, deleteRM ? 1 : 0 );
    } catch (error) {
      responseError(res, error);
    }
  }
}
module.exports = MedicalRecordController