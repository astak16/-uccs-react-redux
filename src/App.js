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
const B = () => <section>二儿子<Wrapper/></section>
const C = () => <section>幺儿子</section>

const User = () => {
  const contextValue = useContext(appContext)
  return <div>User: {contextValue.appState.user.name}</div>
}

// reducer 是规范 state 创建流程的函数
const reducer = (state, {type, payload}) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}


const Wrapper = () => {
  const {appState, setAppState} = useContext(appContext)
  const dispatch = (action) => {
    setAppState(reducer(appState, action))
  }
  return <UserModifier dispatch={dispatch} state={appState}/>
}

// react-redux
const UserModifier = (props) => {
  const {dispatch,state} = props
  const onChange = (e) => {
    dispatch({type: "updateUser", payload: {name: e.target.value}})
  }
  return <div>
    <input type="text" value={state.user.name} onChange={onChange}/>
  </div>
}

export default App;
