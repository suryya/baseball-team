
//localStorage wrapped in promise to make it behave 
// like an async API so that same pattern can be followed 
// when local storeage is replaced by API calls or any other 
// async storage
export const asyncLocalStorage = {
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
  
  // Read from local storage in an async operation
  export async function readFromStore(initState){
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
  
  // write to local storage in an async operation
  export async function saveStateToLocalStorate(state){
    await asyncLocalStorage.setItem('baseball-team',JSON.stringify(state))
  }
  
  //HOC for writing to localstorage    
  export function writeMiddleware(fn){
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

  //HOC for reading from localstorage    
  export function readMiddleware(fn){
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