import { observable, configure, reaction } from "mobx";
configure({ enforceActions: "never", }); 
import {model} from "/src/TrainModel.js";

export const reactiveModel= observable(model)

window.myModel= reactiveModel;


