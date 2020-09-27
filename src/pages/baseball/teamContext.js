import React , {useEffect, useCallback, useRef} from 'react'
import ACTIONS from './actionTypes';
const {CREATE_TEAM, ADD_MEMBER, DATA_READY} = ACTIONS;

const CountStateContext = React.createContext()
const CountDispatchContext = React.createContext()


const positionOptions = [
  'point guard (PG)',
  'shooting guard (SG)',
  'power forward (PF)',
  'small forward (SF)',
  'the center (C)'
];

const asyncLocalStorage = {
  setItem: function (key, value) {
      return Promise.resolve().then(function () {
          localStorage.setItem(key, value);
      });
  },
  getItem: function (key) {
      return Promise.resolve().then(function () {
          return localStorage.getItem(key);
      });
  }
};


async function readFromStore(initState){
  let savedState = await asyncLocalStorage.getItem('baseball-team')
  if(savedState){
    savedState = JSON.parse(savedState)
  }
  if(savedState?.members && savedState?.team  && 
     savedState?.positionOptions ){
    return savedState
  }else{
    return initState
  }
}


async function saveStateToLocalStorate(state){
  await asyncLocalStorage.setItem('baseball-team',JSON.stringify(state))
}

function writeMiddleware(fn){
  return async (arg) => {
    if(typeof fn === 'function'){
      try{
        await fn(arg)
      }catch(e){
        console.log(e)
      }
    }
    return arg
  }
}

 function readMiddleware(fn){
  return async (arg) => {
    if(typeof fn === 'function'){
      try{
        arg = await fn(arg)
      }catch(e){
        console.log(e)
      }
    }
    
    return arg
  }
}


function baseballReducer(state, {type,payload}) {
  switch (type) {
    default: {
      return {...state,...payload}
    }
  }
}

function BaseballProvider({children}) {
  const initData =  useRef({members: [],team:[],positionOptions})
  const [state, dispatch] = React.useReducer(baseballReducer,initData.current)

  useEffect( () => {
    const fetchedStoredData = async function(init){
      let fetchedData = await readMiddleware(readFromStore)(init)
      dispatch({
        type: DATA_READY,
        payload: fetchedData
      });
    }
    fetchedStoredData(initData.current)
  }, [initData]);


  const dispatchMiddleware = useCallback((dispatch) => {
    return  (action) => {
      let newState;
      switch (action.type) {
        case ADD_MEMBER:
          let matched = state.members.filter((mem) => `${mem.fname}${mem.lname}` === `${action.payload.fname}${action.payload.lname}`)
          if(matched && matched.length){
            newState =  {...state}
          }
          newState = {...state,...{members: [...state.members,...[action.payload]]}}
           writeMiddleware(saveStateToLocalStorate)(newState).then(()=>{
            dispatch({type:action.type,payload:newState})
           })
          break;
        case CREATE_TEAM:
           newState = {...state,...{team:action.payload}}
           writeMiddleware(saveStateToLocalStorate)(newState).then(()=>{
              dispatch({type:action.type,payload:newState})
           })
          break;
        default:
          throw new Error(`Unhandled action type: ${action.type}`)
      }
    };      
  },[state])
  

  return (
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  )
}


function useTeamState() {
    const context = React.useContext(CountStateContext)
    if (context === undefined) {
      throw new Error('useCountState must be used within a CountProvider')
    }
    return context
  }
  function useTeamDispatch() {
    const context = React.useContext(CountDispatchContext)
    if (context === undefined) {
      throw new Error('useCountDispatch must be used within a CountProvider')
    }
    return context
  }

export {BaseballProvider, useTeamState, useTeamDispatch }
