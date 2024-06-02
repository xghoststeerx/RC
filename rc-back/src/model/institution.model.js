const registroCalificadoApp = require("../config/firebaseAppRC");

class InstitutionModel {
  constructor() {
    this.db = registroCalificadoApp.firestore();
  }

  async createInstitution(institutionData, uid) {
    try {
      const institutionRef = this.db.collection("institutions").doc();
      const currentDate = new Date();
      const newInstitution = {
        id: institutionRef.id,
        uid: uid,
        createdAt: currentDate,
        updatedAt: currentDate,
        ...institutionData,
      };
      await institutionRef.set(newInstitution);
      return newInstitution;
    } catch (error) {
      throw error;
    }
  }
  async getAllInstitutions(uid) {
    try {
      const institutionsSnapshot = await this.db
        .collection("institutions")
        .where("uid", "==", uid)
        .get();
  
      const institutions = institutionsSnapshot.docs.map((doc) => doc.data());
      return institutions;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InstitutionModel;