import API from "./API"
// import {useState, useEffect} from 'react' ;

const getData = async() => {
    const response = await fetch(API) ;
    if(!response.ok){
        throw new Error("Error occured while fetching the data") ;
    }
    const data = await response.json() ;
    console.log(data) ;
    return data ;
}

export default getData ;