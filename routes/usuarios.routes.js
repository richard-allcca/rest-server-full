const { Router } = require("express");
const { check } = require("express-validator");

// validaciones helpers
const {
  helperValidatorRol,
  helperValidatorEmail,
  helperValidatorId,
  helperValidatorPaginacion,
} = require("../helpers/helper-validations");

// validaciones middlewares
const {validarCampos,validarJwt,isAdminRol,tieneRol} = require("../middlewares")
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJwt } = require("../middlewares/validar-jwt");
// const { isAdminRol, tieneRol } = require("../middlewares/validar-roles");

// controladores de peticiones
const {
  UsuariosGet,
  UsuariosPut,
  UsuariosPost,
  UsuariosDelete,
  UsuariosPatch,
} = require("../controllers/usuarios.controller");

const router = Router();

router.get("/", UsuariosGet);

router.post(
  "/",
  [
    check("nombre", "El Nombre es Obligatorio").not().isEmpty(),
    check("password", "El Password debe tener más de 6 caracteres").isLength({
      min: 6,
    }),
    check("correo").custom(helperValidatorEmail),
    check("rol").custom(helperValidatorRol),
    validarCampos,
    // check("correo", "El Correo no es válido").isEmail(),
    // check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
  ],
  UsuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(helperValidatorId),
    validarCampos,
  ],
  UsuariosPut
);

router.patch("/", UsuariosPatch);

router.delete(
  "/:id",
  [
    validarJwt,
    // isAdminRol,
    tieneRol("ADMIN_ROLE","USER_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(helperValidatorId),
    validarCampos,
  ],
  UsuariosDelete
);

module.exports = router;

// Notas:
// - la logica de todas las rutas  esta en "usuarios.controllers" ejemplo: UsuariosGet
// midlewares: mas de 1 se declaran en [] antes de la funcion de peticion "UsuariosPost"
// check: midleware de express-validator, valida parametros url o el contenido en req.body 
// not().isEmpty(): juntos validan que no este vacio, isEmpty() valida que este vacio
// custom: ejecutarlo sin parametros toma por defecto el primero que tenga el metodo anterior
// validarCampos: luego del "check" lo utilizamos para validar los campos del modelo
// isAdminRol: valida que el rol dea ADMIN_ROLE exclusivamente
// tieneRol: valida que tenga algunos de los roles pasados como parametro