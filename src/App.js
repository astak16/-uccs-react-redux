import React, {useContext, useEffect, useState} from "react";
import './App.css';

const appContext = React.createContext(null);

const store = {
  state: {
    user: {name: "frank", age: 18}
  },
  setState(newState) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

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
const C = () => {
  console.log("C执行了")
  return <section>幺儿子</section>
}

// reducer 是规范 state 创建流程的函数
const reducer = (state, {type, payload}) => {
  console.log(payload)
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

const connect = (Component) => {
  return (props) => {
    const {state, setState} = useContext(appContext)
    // 这个 update 只能实现一个组件的 render
    const [, update] = useState({})
    useEffect(() => {
      store.subscribe(() => {
        update()
      })
    }, [])

    const dispatch = (action) => {
      setState(reducer(state, action))
      // update({})
    }
    return <Component dispatch={dispatch} state={state} {...props}/>
  }
}

const User = connect(({state, dispatch}) => {
  console.log("User执行了")
  return <div>User: {state.user.name}</div>
})

const UserModifier = connect((props) => {
  console.log("UserModifier执行了")
  const {dispatch, state, children} = props
  const onChange = (e) => {
    dispatch({type: "updateUser", payload: {name: e.target.value}})
  }
  return <div>
    <input type="text" value={state.user.name} onChange={onChange}/>
  </div>
});


export default App;
