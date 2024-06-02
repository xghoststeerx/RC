const express = require('express');
const router = express.Router();
const institutionController = require('../controller/institution.controller');

router.post('/add-institution', institutionController.addInstitution);
router.get('/get-all-institutions', institutionController.getAllInstitutions);
router.post('/edit-file', institutionController.editFile);

module.exports = router;