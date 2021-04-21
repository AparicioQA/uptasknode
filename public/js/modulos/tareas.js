import axios from "axios";
import Swal from 'sweetalert2';
import avance, { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icon = e.target;
            const idTarea = icon.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function (res) {
                    if (res.status === 200) {
                        icon.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }
        if (e.target.classList.contains('fa-trash')) {

            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Deseas borrar esta tarea',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar',
                cancelButtonText: "No, Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    //enviar peticion a axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, { params: { idTarea } })
                        .then(function (respuesta) {

                            Swal.fire(
                                'Tarea Eliminado!',
                                'Tu tarea a sido eliminada',
                                'success'
                            ).then((result) => {
                                const listaProyectos = tareaHTML.parentElement;
                                listaProyectos.removeChild(tareaHTML);


                                if (listaProyectos.firstChild.nodeType == Node.TEXT_NODE) {
                                    const parrafo = document.createElement('p');
                                    parrafo.textContent = 'No hay tareas en este proyecto';
                                    listaProyectos.appendChild(parrafo);
                                    console.log(listaProyectos);
                                }
                                actualizarAvance();
                                // setTimeout(() => {
                                //     window.location.href = `/`;
                                // }, 3000);
                            });

                        }).catch((e) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Hubo un error',
                                text: 'No se pudo eliminar la tarea'
                            })
                        })

                }
            }).catch(e => console.log(e))
        }

    });
}

export default tareas;