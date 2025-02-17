document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validación básica
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    // Crear FormData para enviar los datos, incluyendo la imagen
    const formData = new FormData(form)

    // Enviar los datos al servidor
    fetch("/usuarios", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          alert("Registro exitoso")
          form.reset()
        } else {
          alert("Error en el registro: " + (data.error || "Intente más tarde"))
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Ocurrió un error al enviar el formulario")
      })
  })
})