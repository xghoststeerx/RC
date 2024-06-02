const registroCalificadoApp = require("../firebaseAppRC");



const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const idToken = authHeader.split(' ')[1];
    
    try {
      const decodedToken = await registroCalificadoApp.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyToken;