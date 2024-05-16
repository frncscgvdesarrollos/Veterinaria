'use client'
import React, { useState } from 'react';

export default function Mostrar() {
    const [formulario, setFormulario] = useState({
        nombre: 'pepe'
    });

    let palabra= "";

    const handleForm = (e) => {
        setFormulario({ ...formulario, nombre: palabra });
    };

    return (
        <form>
            <h1>Formulario</h1>
            <label htmlFor='nombre'>Nombre</label>
            <input
                type="text"
                id="nombre"
                value={palabra}
                placeholder='Nombre'
            />
            <button onClick={e => handleForm(e)}>Enviar</button>
            <p>{formulario.nombre}</p>
        </form>
    );
}
