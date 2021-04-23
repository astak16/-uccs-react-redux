// reducer 是规范 state 创建流程的函数
import React, {useContext, useEffect, useState} from "react";

export const appContext = React.createContext(null);

export const store = {
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

export const reducer = (state, {type, payload}) => {
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
export const connect = (Component) => {
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
