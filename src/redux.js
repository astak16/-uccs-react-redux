// reducer 是规范 state 创建流程的函数
import React, {useContext, useEffect, useState} from "react";

export const appContext = React.createContext(null);

export const store = {
  state: {
    user: {name: "frank", age: 18},
    group: {name: "前端组"}
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
    const {state, setState} = useContext(appContext)
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    const [, update] = useState({})
    const data = selector ? selector(state) : {state}
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}
    useEffect(() => {
      // 注意这里最好取消订阅，否则在 selector 变化时会出现重复订阅
      return store.subscribe(() => {
        const newData = selector ? selector(store.state) : {state: store.state}
        if (changed(data, newData)) {
          update({})
        }
      })
    }, [selector])


    return <Component {...dispatchers} {...data} {...props}/>
  }
}
