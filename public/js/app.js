import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");
  let alertas = document.querySelector(".alertas");
  if (alertas) {
    limpiarAlertas();
  }
  if (skills) {
    skills.addEventListener("click", agregarSkills);

    //una vex que estamos en editar llamar la funcion
    skillsSeleccionadas();
  }

  const vacantesListados = document.querySelector(".panel-administracion");
  if (vacantesListados) {
    vacantesListados.addEventListener("click", accionesListados);
  }
});

const skills = new Set();

const agregarSkills = (e) => {
  e.preventDefault();

  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      //quitar del set y quitar de la clase
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      //agregar al set y agregar la clase
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSeleccionadas = () => {
  const seleccionadas = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  seleccionadas.forEach((seleccionada) => {
    skills.add(seleccionada.textContent);
  });
  //inyectando en el hidden
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const limpiarAlertas = () => {
  const alertas = document.querySelector(".alertas");
  setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    }
  }, 2000);
};

const accionesListados = (e) => {
  e.preventDefault();

  if (e.target.dataset.eliminar) {
    //elimiar por axios
    Swal.fire({
      title: "Comfirmar Eliminacion?",
      text: "Una vez eliminado no se ouede recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
        //axios para eliminar registro
        axios.delete(url, { params: url }).then((respuesta) => {
          if (respuesta.status === 200) {
            Swal.fire("Eliminado!", respuesta.data, "success");
            e.target.parentElement.parentElement.parentElement.removeChild(
              e.target.parentElement.parentElement
            );
          }
        })
        .catch(()=>{
          Swal.fire({
            type:'error',
            title:'Hubo un error',
            text:'No se pudo eliminar'
          })
        })
      }
    });
  } else if (e.target.tagName === "A") {
    window.location.href = e.target.href;
  }
};
