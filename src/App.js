import React from "react";
import './App.css';
import {appContext, connect, store} from "./redux";


const App = () => {
  return (
    <appContext.Provider value={store}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => {
  console.log("A执行了")
  return <section>大儿子<User/></section>
}
const B = () => {
  console.log("B执行了")
  return <section>二儿子<UserModifier/></section>
}
const C = connect(state => {
  return {group: state.group}
})(({group}) => {
  console.log("C执行了")
  return <section>幺儿子 <div>Group: {group.name}</div></section>
})


const User = connect(state => {
  return {user: state.user}
})(({user}) => {
  console.log("User执行了")
  return <div>User: {user.name}</div>
})

const UserModifier = connect()((props) => {
  console.log("UserModifier执行了")
  const {dispatch, state} = props
  const onChange = (e) => {
    dispatch({type: "updateUser", payload: {name: e.target.value}})
  }
  return <div>
    <input type="text" value={state.user.name} onChange={onChange}/>
  </div>
});


export default App;
