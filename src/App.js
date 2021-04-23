import React from "react";
import './App.css';
import {connect, createStore, Provider} from "./redux";

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
const initState = {
  user: {name: "frank", age: 18},
  group: {name: "前端组"}
}
const store = createStore(reducer, initState)

const App = () => {
  return (
    <Provider store={store}>
      <A/>
      <B/>
      <C/>
    </Provider>
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

const userSelector = state => {
  return {user: state.user}
}

const userDispatcher = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({type: "updateUser", payload: attrs})
  }
}

const connectToUser = connect(userSelector, userDispatcher)

const User = connectToUser(({user}) => {
  console.log("User执行了")
  return <div>User: {user.name}</div>
})

const ajax = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {name: "3s后的frank", age: 18}})
    }, 3000)
  })
}

const featureUser = (dispatch) => {
  ajax("/user").then(res => {
    dispatch({type: "updateUser", payload: res.data})
  })
}

const UserModifier = connect(userSelector, null)((props) => {
  console.log("UserModifier执行了")
  const {updateUser, user, dispatch} = props
  const onChange = (e) => {
    updateUser({name: e.target.value})
  }

  const onClick = (e) => {
    // dispatch(featureUser)
    dispatch({type: "updateUser", payload: ajax("/user").then(res => res.data)})
  }
  return <div>
    <input type="text" value={user.name} onChange={onChange}/>
    <button onClick={onClick}>异步获取 user</button>
  </div>
});


export default App;
