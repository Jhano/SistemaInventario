import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import history from '../history';
import { Form, Button, InputGroup, ListGroup } from 'react-bootstrap';
import '../css/asignatura.css';


function Asignatura() {


    const [lista, setLista] = useState([]);
    const [malla, setMalla] = useState([]);
    const [buscar, setBuscar] = useState('');
    const [selecionar, setSeleccionar] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3001/asignaturas');
            const data = await response.json();
            setLista(data.asignaturas);
        }
        fetchData();
    }, [])


    const onBuscar = (event) => {
        const value = event.target.value;
        setBuscar(value);

        console.log(value);
        if (value.length >= 1) {
            let filterLista = lista;
            filterLista = filterLista.filter((asig) => {
                return asig.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().search(value.toLowerCase()) !== -1;
            })

            setMalla(filterLista);
            //console.log(malla);
        } else {
            setMalla([]);
        }
    }

    const onFilter = () => {
        const value = buscar;
        if (value.length >= 1) {
            let filterLista = lista;
            filterLista = filterLista.filter((asig) => {
                return asig.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().search(value.toLowerCase()) !== -1;
            })

            setMalla(filterLista);
            //console.log(malla);
        } else {
            setMalla([]);
        }
    }

    const select = (event) => {
        const value = event.target.value;
        const updateSelecionar = selecionar;
        const updateMalla = malla;

        let asig = updateMalla.find(asig => {
            return asig.codigo === value;
        })
        console.log('asig:', asig);

        let selectIndex = updateSelecionar.findIndex(index => {
            return index.codigo === asig.codigo
        })

        if (selectIndex === -1) {
            updateSelecionar.push(asig);
            setSeleccionar(updateSelecionar);
            setMalla([]);
            onFilter();

        } else {
            alert("Asignatura ya seleccionada");
        }


    }

    const eliminar = (event) => {

        const value = event.target.value;
        const updateSelecionar = selecionar;


        let selectIndex = updateSelecionar.findIndex(index => {
            return index.codigo === value
        })

        if (selectIndex !== -1) {
            updateSelecionar.splice(selectIndex, 1);
            setSeleccionar(updateSelecionar);
            setMalla([]);
            onFilter();

        }

    }




    return (

            <
            div className = "Asignaturas" >
            <
            Button variant = "dark"
            onClick = {
                () => { history.push('/');
                    window.location.reload() } } >
            Salir <
            /Button> <
            div className = "input" >
            <
            Form.Group >
            <
            InputGroup >
            <
            InputGroup.Prepend >
            <
            InputGroup.Text > Asignatura < /InputGroup.Text> <
            /InputGroup.Prepend> <
            Form.Control onChange = {
                (e) => { onBuscar(e) } }
            id = "asignatura"
            type = "text" / >
            <
            /InputGroup> <
            /Form.Group> <
            /div> <
            div className = "container" >
            <
            div className = "ListLeft" >
            <
            Form.Label className = "Label" > Busqueda < /Form.Label> <
            ListGroup defaultActiveKey = "#link1"
            className = "ListTam" > {
                malla.map((e, index) => {
                        return ( < ListGroup.Item key = { index }
                            value = { e.codigo }
                            action onClick = {
                                (e) => { select(e) } } > { e.nombre } < /ListGroup.Item>)
                        })
                } <
                /ListGroup> <
                /div> <
                div className = "ListRight" >
                <
                Form.Label className = "Label" > Selecionadas < /Form.Label> <
                ListGroup defaultActiveKey = "#link2"
                className = "ListTam" > {
                    selecionar.map((e, index) => {
                            return ( < ListGroup.Item key = { index }
                                value = { e.codigo }
                                action onClick = {
                                    (e) => { eliminar(e) } } > { e.nombre } < /ListGroup.Item>)
                            })
                    } <
                    /ListGroup> <
                    /div> <
                    /div>

                    <
                    /div>


                );
            }

            export default Asignatura;