import { API_URL, API_OPTIONS } from "./apiConfig";

function gotResponseACB(response){ 
    if(response.ok){
         return response.json();
    } 
    else{
        return response.text().then(text => {
            console.error("API error:", text);
            throw new Error(text);
        });
    }
}

export function searchExercises(){
    return fetch(
        API_URL + "/exercises/bodyPartList",
        API_OPTIONS
    ).then(gotResponseACB);
}

export function getExercisesByBodyPart(bodyPart){
    return fetch(
        API_URL + "/exercises/bodyPart/" + bodyPart,
        API_OPTIONS
    ).then(gotResponseACB);
}