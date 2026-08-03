//Example 1
// import React from "react";

// function App(){
//   let username = "Tanisha"

//   function Greet(){
//     alert('Good Evening ' + username)
//   }

//   return(
//     <>
//     <h2> My name is: {username} </h2>
//     <button onClick={Greet}>Greet</button>
//     </>
//   )
// }
// export default App

//Example 2- variables vs React Variables
//import React from "react";
// function App(){
//   let count = 10
//   function IncreaseCount(){
//     count = count + 1
//     console.log(count)
//   }
//   return(
//     <>
//     <h2>Like/Cart/Quantity : {count}</h2>
//     <button onClick={IncreaseCount}>Increase</button>
//     </>
//   )
// }
// export default App //----this uodates the value but do not update the screen

//React Variable - useState - (React Hooks)
//Special React variable that stores the updated value along with it also updates the screen automatically
//syntax:-  const [mainVariabelName-screen, setVariableName-store update value] = useState(Inital Value)
//const[count, setCount] = useState(10)

//Example 3- useState Variables
// import React, {useState} from "react";
// function App(){
//   const [like, setLike] = useState(12)
//   function IncreaseLike(){
//     setLike(like + 1)
//     console.log(like)
//   }
//   return(
//     <>
//     <h2>Like/Cart/Quantity : {like}</h2>
//     <button onClick={IncreaseLike}>Increase</button>
//     </>
//   )
// }
// export default App

//Example 4- useState Variables
import React, {useState} from "react";
function App(){
  const[show, setShow] = useState(false)
  return(
    <>
    <input type={show ? "text": "password"} placeholder="Enter Your Password"/>
    <button onClick={()=>setShow(!show)}>Show/Hide</button>
    </>
  )
}
export default App