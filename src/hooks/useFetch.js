//CustomHooks
import React, { useEffect, useState } from 'react'


const useFetch = (url, settings) => {
    const [data, setData] = useState([]);

    const fetchData = async() => {
        const response = await fetch(url, settings);
        const data = await response.json();
        setData(data);

    }

    //se ejecuta al renderizar el componente meals
    useEffect(() => {
        fetchData();
    }, [])

    return { data }
}

export default useFetch;