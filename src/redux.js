// reducer 是规范 state 创建流程的函数
import React, {useContext, useEffect, useState} from "react";

export const appContext = React.createContext(null);

let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map(fn => fn(state))
}
const store = {
  getState() {
    return state
  },
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  }
}

let dispatch = store.dispatch

const prevDispatch = dispatch

dispatch = (action) => {
  if (action instanceof Function) {
    action(dispatch)
  } else {
    prevDispatch(action)
  }
}


export const createStore = (_reducer, initState) => {
  state = initState
  reducer = _reducer
  return store
}

const changed = (oldState, newState) => {
  let changed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}
export const connect = (selector, dispatchSelector) => (Component) => {
  return (props) => {


    const [, update] = useState({})
    const data = selector ? selector(state) : {state}
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}

    useEffect(() => {
      // 注意这里最好取消订阅，否则在 selector 变化时会出现重复订阅
      return store.subscribe(() => {
        const newData = selector ? selector(state) : {state}
        if (changed(data, newData)) {
          update({})
        }
      })
    }, [selector])
    return <Component {...dispatchers} {...data} {...props}/>
  }
}

export const Provider = (props) => {
  const {children, store} = props
  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>
  )
}
