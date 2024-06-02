const registroCalificadoApp = require("../config/firebaseAppRC");
const storage = registroCalificadoApp.storage().bucket();
const path = require("path");
class UserModel {
  constructor() {
    this.db = registroCalificadoApp.firestore();
    this.auth = registroCalificadoApp.auth();
  }
  async getUserById(uid) {
    try {
      const userRef = this.db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async getAllUsers() {
    try {
      const usersRef = this.db.collection("users");
      const usersSnapshot = await usersRef.get();
      const users = [];
      usersSnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
  async createUserWithEmailAndPassword(email, password) {
    try {
      const userRecord = await this.auth.createUser({ email, password });
      return { uid: userRecord.uid };
    } catch (error) {
      return { error: error.message };
    }
  }
  async createUserDocument(uid, userData) {
    try {
      const userRef = this.db.collection("users").doc(uid);
      const currentDate = new Date();
      const defaultUserData = {
        uid: uid,
        createdAt: currentDate,
        updatedAt: currentDate,
        updatePassword: true,
        verifyEmail: true,
        ...userData,
      };
      await userRef.set(defaultUserData);
      return { id: uid, ...defaultUserData };
    } catch (error) {
      throw error;
    }
  }
  async uploadProfileImage(uid, imagePath) {
    try {
      const bucket = storage;
      const destination = `profile_images/${uid}/${path.basename(imagePath)}`;
      await bucket.upload(imagePath, {
        destination: destination,
        metadata: {
          contentType: "image/jpeg",
        },
      });
      const file = bucket.file(destination);
      const signedUrls = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      return signedUrls[0];
    } catch (error) {
      throw new Error(`Error al subir la imagen de perfil: ${error.message}`);
    }
  }
  async uploadFile(uid, filePath, fileName) {
    try {
      const bucket = storage;
      const destination = `user_files/${uid}/${fileName}`;
      await bucket.upload(filePath, {
        destination: destination,
        metadata: {
          contentType: "application/octet-stream", // Ajusta el tipo de contenido según el tipo de archivo
        },
      });
      const file = bucket.file(destination);
      const signedUrls = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      return signedUrls[0];
    } catch (error) {
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }
  }
  async deleteUser(uid) {
    try {
      const userRef = this.db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const deletedUser = { id: userDoc.id, ...userDoc.data() };
        await userRef.delete();
        return deletedUser;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserByUid(uid) {
    try {
      const userRef = this.db.collection("users").where("uid", "==", uid);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.empty) {
        return userSnapshot.docs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async setUpdateCode(uid, updateCode) {
    try {
      const userRef = this.db.collection("users").doc(uid);
      await userRef.update({ update_code: updateCode });
    } catch (error) {
      throw error;
    }
  }
  async validateUpdateCode(uid, code) {
    try {
      const userRef = this.db.collection("users").where("uid", "==", uid);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        return userData.update_code === code;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(uid, newPassword) {
    console.log("update password", newPassword);
    try {
      // Actualizar la contraseña del usuario utilizando firebase-admin
      await this.auth.updateUser(uid, { password: newPassword });

      // Actualizar el documento del usuario en Firestore
      const userRef = this.db.collection("users").doc(uid);
      await userRef.update({ updatePassword: false, update_code: "" });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
  async updateEmailVerificationStatus(uid, verifyEmail) {
    try {
      const userRef = this.db.collection("users").doc(uid);
      await userRef.update({ verifyEmail:false });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
