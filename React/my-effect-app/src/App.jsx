import React from "react";
import {useState, useEffect} from "react";
import './App.css'
function App(){
    const [users, setUsers] =useState([])
    //https://jsonplaceholder.typicode.com/users
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data=> setUsers(data))
        .catch(error=> console.log("Erroe Fetching", error))
    },[])
    return (
        
        <>
        <div className="app">
        <h2 className="title">Employee Dashboard</h2>
        {/*API data is storing in my user array-Extract the data from user array and put it in Html Tag*/}
        {/*map evry elemnt in an array and return a brand new array containing the modified resukts of tasks*/}
        {users.map(abc=>(
            /* <p key={abc.id}> {abc.name} and {abc.email} </p>*/
            <div style={{border:'1px solid black' ,margin:'10px', borderRadius:'12px'}} key={abc.id}>
                <h3>{abc.name}</h3>
                <p>{abc.email}</p>
            </div>
        )) }
        </div>
        </>
    )
}export default App