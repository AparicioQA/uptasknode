import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.getElementById('eliminar-proyecto');
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        Swal.fire({
            title: 'Deseas eliminar este proyecto',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: "No, Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`
                axios.delete(url, { params: { urlProyecto } })
                    .then(function (respuesta) {

                        Swal.fire(
                            'Proyecto Eliminado!',
                            'Tu proyecto a sido eliminado',
                            'success'
                        );
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    }).catch((e) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })

            }
        }).catch(e => console.log(e))
    })
}

export default btnEliminar;