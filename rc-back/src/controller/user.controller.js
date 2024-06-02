const UserModel = require("../model/user.model");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const {
  sendWelcomeEmail,
  sendUpdatePasswordEmail,
  sendPasswordUpdatedEmail,
  sendVerificationEmail,
} = require("../utils/resendUtils");
const generateUpdateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.getDataUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    if (!uid) {
      return res.status(400).json({ error: "Uid es un dato requerido" });
    }
    const userModel = new UserModel();
    const userData = await userModel.getUserById(uid);
    if (userData) {
      return res.status(200).json({ data: userData });
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const userModel = new UserModel();
    const users = await userModel.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, nombre, apellido, celular, documento, role } =
      req.body;

    const userModel = new UserModel();
    const { uid, error } = await userModel.createUserWithEmailAndPassword(
      email,
      password
    );

    if (error) {
      throw new Error(error);
    }

    let profileImageUrl = null;
    let filesUrls = [];

    if (req.files && req.files.profileImage) {
      const profileImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        req.files.profileImage[0].filename
      );
      profileImageUrl = await userModel.uploadProfileImage(
        uid,
        profileImagePath
      );
      fs.unlinkSync(profileImagePath);
    }

    if (req.files && req.files.files) {
      for (const file of req.files.files) {
        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        const fileUrl = await userModel.uploadFile(
          uid,
          filePath,
          file.originalname
        );
        filesUrls.push(fileUrl);
        fs.unlinkSync(filePath);
      }
    }

    const userData = {
      nombre,
      apellido,
      celular,
      documento,
      email,
      role,
      profileImageUrl,
      filesUrls,
    };

    const newUser = await userModel.createUserDocument(uid, userData);
    // Enviar correo de bienvenida al nuevo usuario
    const welcomeEmailParams = {
      email,
      nombre,
      password,
    };
    await sendWelcomeEmail(welcomeEmailParams);

    return res.status(200).json({ success: true,
      message: "Usuario creado exitosamente",
      data: newUser,
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({
      error: "Error en el servidor", message: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    if (!uid) {
      return res.status(400).json({ error: "Uid es un dato requerido" });
    }
    const userModel = new UserModel();
    const deletedUser = await userModel.deleteUser(uid);
    if (deletedUser) {
      return res.status(200).json({ data: deletedUser });
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { uid, userData } = req.body;

    const userModel = new UserModel();
    const user = await userModel.getUserByUid(uid);
    if (user) {
      const updateCode = generateUpdateCode();
      await userModel.setUpdateCode(uid, updateCode);
      const updatePassowordParams = {
        userData,
        updateCode,
      };

      await sendUpdatePasswordEmail(updatePassowordParams);

      return res
        .status(200)
        .json({ success: true, data: "Verifica tu correo" });
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(
      "Error al enviar el correo de actualización de contraseña:",
      error
    );
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
exports.validateUpdateCode = async (req, res) => {
  try {
    const { uid, code } = req.body;
    console.log("este es uid: " + uid);
    console.log("este es code: " + code);
    const userModel = new UserModel();
    const user = await userModel.getUserByUid(uid);
    if (user) {
      const isValid = await userModel.validateUpdateCode(uid, code);
      if (isValid) {
        return res
          .status(200)
          .json({ success: true, message: "Código válido" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Código inválido" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al validar el código de actualización:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error en el servidor" });
  }
};
exports.updateNewPassword = async (req, res) => {
  try {
    const { uid, newPassword, confirmPassword, email } = req.body;
    const userModel = new UserModel();
    const user = await userModel.getUserByUid(uid);
    if (user) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }
      const result = await userModel.updatePassword(uid, newPassword);
      if (result.success) {
        const updatePassowordParams = {
          email
        };

  
        await sendPasswordUpdatedEmail(updatePassowordParams);
        return res.status(200).json({ success: true, message: "Contraseña actualizada exitosamente" });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
exports.sendVerificationEmail = async (req, res) => {
  try {
    console.log(req.body);
    const { uid } = req.body;
    console.log("Verification email uid: " + uid);
    const userModel = new UserModel();
    const user = await userModel.getUserByUid(uid);

    if (user) {
      const verificationToken = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${encodeURIComponent(verificationToken)}?uid=${encodeURIComponent(uid)}`;
      const emailParams = {
        email: user.email,
        verificationLink,
      };

      await sendVerificationEmail(emailParams);

      return res.status(200).json({ success: true, message: "Correo de verificación enviado" });
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { uid, verificationToken } = req.body;
    const userModel = new UserModel();
    const user = await userModel.getUserByUid(uid);

    if (user) {
      jwt.verify(verificationToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(400).json({ error: "Token de verificación inválido o expirado" });
        }

        if (decoded.uid === uid) {
          const result = await userModel.updateEmailVerificationStatus(uid, false);

          if (result.success) {
            return res.status(200).json({ success: true, message: "Correo electrónico verificado exitosamente" });
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          return res.status(400).json({ error: "Token de verificación inválido" });
        }
      });
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al verificar el correo electrónico:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
