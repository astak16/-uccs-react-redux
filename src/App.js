import React, {useContext, useState} from "react";
import './App.css';

const appContext = React.createContext(null);

const App = () => {
  const [appState, setAppState] = useState({
    user: {name: "frank", age: 18}
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <A/>
      <B/>
      <C/>
    </appContext.Provider>
  )
}

const A = () => <section>大儿子<User/></section>
const B = () => <section>二儿子<UserModifier/></section>
const C = () => <section>幺儿子</section>

const User = () => {
  const contextValue = useContext(appContext)
  return <div>User: {contextValue.appState.user.name}</div>
}
const UserModifier = () => {
  const {appState, setAppState} = useContext(appContext)
  const onChange = (e) => {
    appState.user.name = e.target.value
    setAppState({...appState})
  }
  return <div>
    <input type="text" value={appState.user.name} onChange={onChange}/>
  </div>
}

export default App;
