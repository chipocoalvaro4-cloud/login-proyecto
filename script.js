/* =========================================================
   script.js
   Lógica del formulario de inicio de sesión.

   ⚠️ AVISO IMPORTANTE (SOLO DIDÁCTICO):
   La autenticación de este archivo es una SIMULACIÓN con
   fines educativos. Comparar credenciales en el navegador
   NO es seguro: cualquier persona puede ver este código.
   En un sistema real, la verificación se hace en un
   SERVIDOR, con contraseñas cifradas (hash) y conexión HTTPS.
   ========================================================= */

/* ---------- 1. Constantes y credenciales de demostración ---------- */
const CREDENCIALES_DEMO = {
  email: "demo@ejemplo.com",
  password: "Demo1234!"
};

// Clave bajo la que se guarda el correo (NUNCA la contraseña)
const CLAVE_CORREO_GUARDADO = "correoRecordado";

// Expresión regular sencilla para validar el formato de un correo
// Estructura: texto + @ + dominio + . + extensión (sin espacios)
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- 2. Referencias a elementos del DOM ---------- */
const form = document.getElementById("login-form");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const checkRemember = document.getElementById("remember");
const btnToggle = document.getElementById("toggle-password");
const errorEmail = document.getElementById("email-error");
const errorPassword = document.getElementById("password-error");
const mensajeForm = document.getElementById("form-message");
const enlaceOlvido = document.getElementById("forgot-link");

/* ---------- 3. Funciones auxiliares de interfaz ---------- */

/**
 * Muestra un error debajo de un campo y marca el input como inválido.
 * @param {HTMLInputElement} input   Campo afectado
 * @param {HTMLElement} contenedor   Elemento <p> donde se escribe el error
 * @param {string} texto             Mensaje de error
 */
function mostrarError(input, contenedor, texto) {
  contenedor.textContent = texto;
  input.classList.add("invalid");
  input.classList.remove("valid");
  input.setAttribute("aria-invalid", "true"); // Informa a lectores de pantalla
}

/**
 * Limpia el error de un campo y lo marca como válido.
 */
function limpiarError(input, contenedor) {
  contenedor.textContent = "";
  input.classList.remove("invalid");
  input.classList.add("valid");
  input.setAttribute("aria-invalid", "false");
}

/**
 * Muestra un mensaje general (éxito o error) debajo del botón.
 * @param {string} texto
 * @param {"success"|"error"} tipo
 */
function mostrarMensajeGeneral(texto, tipo) {
  mensajeForm.textContent = texto;
  mensajeForm.className = "form-message " + tipo;
}

function ocultarMensajeGeneral() {
  mensajeForm.textContent = "";
  mensajeForm.className = "form-message";
}

/* ---------- 4. Funciones de validación ---------- */

/**
 * Valida el campo de correo.
 * @returns {boolean} true si es válido
 */
function validarEmail() {
  const valor = inputEmail.value.trim(); // trim() elimina espacios al inicio y final

  if (valor === "") {
    mostrarError(inputEmail, errorEmail, "El correo electrónico es obligatorio.");
    return false;
  }
  if (!REGEX_EMAIL.test(valor)) {
    mostrarError(inputEmail, errorEmail, "Ingresa un correo válido (ejemplo: nombre@dominio.com).");
    return false;
  }
  limpiarError(inputEmail, errorEmail);
  return true;
}

/**
 * Valida el campo de contraseña.
 * @returns {boolean} true si es válida
 */
function validarPassword() {
  const valor = inputPassword.value; // En contraseñas NO se aplica trim()

  if (valor === "") {
    mostrarError(inputPassword, errorPassword, "La contraseña es obligatoria.");
    return false;
  }
  if (valor.length < 8) {
    mostrarError(inputPassword, errorPassword, "La contraseña debe tener al menos 8 caracteres.");
    return false;
  }
  limpiarError(inputPassword, errorPassword);
  return true;
}

/* ---------- 5. Autenticación simulada (SOLO DIDÁCTICA) ---------- */

/**
 * Compara los datos ingresados con las credenciales de demostración.
 * ⚠️ No es un mecanismo seguro: se usa únicamente para practicar.
 */
function autenticarDemo(email, password) {
  return (
    email.toLowerCase() === CREDENCIALES_DEMO.email &&
    password === CREDENCIALES_DEMO.password
  );
}

/* ---------- 6. Recordar correo ---------- */
// Se usa localStorage SOLO para el correo. La contraseña jamás se almacena.

function guardarCorreo(email) {
  try {
    localStorage.setItem(CLAVE_CORREO_GUARDADO, email);
  } catch (e) {
    // Si el navegador bloquea el almacenamiento, simplemente se ignora
    console.warn("No se pudo guardar el correo:", e);
  }
}

function borrarCorreoGuardado() {
  try {
    localStorage.removeItem(CLAVE_CORREO_GUARDADO);
  } catch (e) {
    console.warn("No se pudo borrar el correo:", e);
  }
}

function cargarCorreoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CORREO_GUARDADO);
    if (guardado) {
      inputEmail.value = guardado;
      checkRemember.checked = true;
    }
  } catch (e) {
    console.warn("No se pudo leer el correo guardado:", e);
  }
}

/* ---------- 7. Eventos ---------- */

// 7.1 Mostrar / ocultar contraseña
btnToggle.addEventListener("click", function () {
  const estaOculta = inputPassword.type === "password";

  // Cambia el tipo del input entre "password" y "text"
  inputPassword.type = estaOculta ? "text" : "password";

  // Actualiza el estado accesible del botón
  btnToggle.setAttribute("aria-pressed", String(estaOculta));
  btnToggle.setAttribute(
    "aria-label",
    estaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});

// 7.2 Validación en tiempo real al salir de cada campo (evento "blur")
inputEmail.addEventListener("blur", validarEmail);
inputPassword.addEventListener("blur", validarPassword);

// 7.3 Si el campo ya tenía error, se revalida mientras el usuario escribe
inputEmail.addEventListener("input", function () {
  ocultarMensajeGeneral();
  if (inputEmail.classList.contains("invalid")) validarEmail();
});
inputPassword.addEventListener("input", function () {
  ocultarMensajeGeneral();
  if (inputPassword.classList.contains("invalid")) validarPassword();
});

// 7.4 Enlace "¿Olvidaste tu contraseña?" (demostrativo)
enlaceOlvido.addEventListener("click", function (evento) {
  evento.preventDefault(); // Evita que el enlace "#" recargue o salte la página
  mostrarMensajeGeneral(
    "Función demostrativa: aquí se enviaría un enlace de recuperación a tu correo.",
    "success"
  );
});

// 7.5 Envío del formulario
form.addEventListener("submit", function (evento) {
  // IMPORTANTE: evita el envío y la recarga de la página
  evento.preventDefault();
  ocultarMensajeGeneral();

  // Se ejecutan AMBAS validaciones (no se detiene en la primera) para
  // mostrar todos los errores a la vez.
  const emailOk = validarEmail();
  const passwordOk = validarPassword();

  // Si hay errores, se detiene el proceso y se enfoca el primer campo con error
  if (!emailOk || !passwordOk) {
    if (!emailOk) {
      inputEmail.focus();
    } else {
      inputPassword.focus();
    }
    return;
  }

  // Aquí los datos tienen formato válido
  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  // Gestiona la casilla "Recordar mi correo"
  if (checkRemember.checked) {
    guardarCorreo(email);
  } else {
    borrarCorreoGuardado();
  }

  // Autenticación simulada
  if (autenticarDemo(email, password)) {
    mostrarMensajeGeneral("✅ ¡Bienvenido! Has iniciado sesión correctamente.", "success");
    inputPassword.value = ""; // Se limpia la contraseña por buena práctica
    inputPassword.classList.remove("valid");
  } else {
    mostrarMensajeGeneral("❌ Credenciales incorrectas. Verifica tu correo y contraseña.", "error");
    inputPassword.select(); // Selecciona el texto para facilitar corregirlo
  }
});

/* ---------- 8. Inicialización ---------- */
// Al cargar la página se rellena el correo si el usuario lo había guardado
cargarCorreoGuardado();
