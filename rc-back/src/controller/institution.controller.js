const InstitutionModel = require("../model/institution.model");
const { google } = require('googleapis');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const keyFilePath = path.join(__dirname, '..', 'credentials', 'google-credentials.json');

const oauth2Client = new google.auth.OAuth2(
  null,
  null,
  null,
  {
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }
);

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});
const storage = new Storage();

exports.addInstitution = async (req, res) => {
  try {
    const { institutionData, uid } = req.body;
    const institutionModel = new InstitutionModel();
    const newInstitution = await institutionModel.createInstitution(institutionData, uid);
    res.status(201).json({
      success: true,
      message: 'Se ha almacenado correctamente la institución',
      data: newInstitution,
    });
  } catch (error) {
    console.error('Error adding institution:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding institution',
      data: null,
    });
  }
};
exports.getAllInstitutions = async (req, res) => {
  try {
    const { uid } = req.query;
    const institutionModel = new InstitutionModel();
    const institutions = await institutionModel.getAllInstitutions(uid);
    res.status(200).json({
      success: true,
      message: 'Se han obtenido correctamente las instituciones',
      data: institutions,
    });
  } catch (error) {
    console.error('Error getting institutions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting institutions',
      data: null,
    });
  }
};

exports.editFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    // Obtener el archivo de Firebase Storage
    const file = storage.bucket('your-bucket-name').file(fileId);

    // Generar una URL de edición para el archivo utilizando la API de Google Drive
    const editUrl = await generateEditUrl(file);

    res.json({ editUrl });
  } catch (error) {
    console.error('Error editing file:', error);
    res.status(500).json({ message: 'Error editing file' });
  }
};

async function generateEditUrl(file) {
  try {
    // Obtener la URL de descarga del archivo desde Firebase Storage
    const [metadata] = await file.getMetadata();
    const [downloadUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 5 * 60 * 1000, // URL válida por 5 minutos
    });

    // Crear un archivo temporal en Google Drive con el contenido del archivo
    const driveFile = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: metadata.contentType,
      },
      media: {
        mimeType: metadata.contentType,
        body: await file.createReadStream(),
      },
    });

    // Generar la URL de edición para el archivo en Google Drive
    const editUrl = `https://docs.google.com/document/d/${driveFile.data.id}/edit`;

    return editUrl;
  } catch (error) {
    console.error('Error generating edit URL:', error);
    throw new Error('Error generating edit URL');
  }
}