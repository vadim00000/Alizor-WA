import { observable, configure } from "mobx";
import { sessionModel } from "./sessionModel";
import { profileModel } from "./profileModel";
import { trainModel } from "./trainModel";
import { authModel } from "./authModel";
import {
  connectToPersistence,
  connectProfilePersistence,
  connectAuthPersistence
} from "./firestoreModel";

configure({ enforceActions: "never" });

export const reactiveSessionModel = observable(sessionModel);
export const reactiveProfileModel = observable(profileModel);
export const reactiveTrainModel = observable(trainModel);
export const reactiveAuthModel = observable(authModel);

connectAuthPersistence(reactiveSessionModel);
connectToPersistence(reactiveTrainModel, reactiveSessionModel);
connectProfilePersistence(reactiveProfileModel, reactiveSessionModel);


