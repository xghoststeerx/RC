const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const verifyToken = require('../config/middleware/verifyToken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Verificar si la carpeta uploads existe, sino crearla
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/data-user/:uid', verifyToken, userController.getDataUser);
router.get('/get-users', verifyToken, userController.getUsers);
router.post('/create-user', verifyToken, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'files', maxCount: 10 }
]), userController.createUser);
router.delete('/delete-user/:uid', verifyToken, userController.deleteUser);
router.post('/update-password-with-id', verifyToken, userController.updatePassword);
router.post('/validate-update-code', verifyToken, userController.validateUpdateCode);
router.post('/update-password', verifyToken, userController.updateNewPassword);
router.post('/send-verification-email', verifyToken, userController.sendVerificationEmail);
router.post('/verify-email', userController.verifyEmail);

module.exports = router;