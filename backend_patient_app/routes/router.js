const router = require("express").Router();
const verifyToken = require("../middlewares/VerifyToken");
const { 
    PatientController, 
    UserController, 
    MedicalRecordController
} = require("../controller");
const validatePatient = require("../middlewares/ValidatePatient");

router.post('/login', UserController.login);
router.get("/fetch", verifyToken, UserController.fetch);
router.get("/key-code", verifyToken, UserController.getKey);


//Header
router.get("/header", verifyToken, PatientController.headerAmount);

router.post('/patient', validatePatient ,verifyToken, PatientController.createPatient);
router.get('/patient', verifyToken, PatientController.getPatient);
router.get('/patient/:id', verifyToken, PatientController.detailPatient);
router.put('/patient/:id', validatePatient, verifyToken, PatientController.updatePatient);
router.delete('/patient/:id', verifyToken, PatientController.deletePatient);


router.post('/rekam-medis',verifyToken, MedicalRecordController.creteMedicalRecord);
router.get("/rekam-medis", verifyToken, MedicalRecordController.getRM);
router.get("/rekam-medis/patient/:id", verifyToken, MedicalRecordController.getDetailbyPatient);
router.get("/rekam-medis/:id", verifyToken, MedicalRecordController.getDetailRM);
router.delete( "/rekam-medis/:id", verifyToken, MedicalRecordController.deleteRekamMedis);

router.get('/users', verifyToken, UserController.getUser);

module.exports = router;
