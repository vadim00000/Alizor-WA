
export function resolvePromise(prms, promiseState) { 
    function setDataACB(data){
        if(promiseState.promise == prms){
            promiseState.data = data;
        }
    }
    function setErrorACB(error){
        if(promiseState.promise == prms){
            promiseState.error = error;
        }
    }

promiseState.promise= prms;
promiseState.data= null;
promiseState.error= null;

if(prms){
  prms.then(setDataACB).catch(setErrorACB)
}

}