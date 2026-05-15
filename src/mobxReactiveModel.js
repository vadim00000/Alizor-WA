import { observable, configure } from "mobx";
import { sessionModel } from "./models/sessionModel";
import { profileModel } from "./models/profileModel";
import { trainModel } from "./models/trainModel";
import { authModel } from "./models/authModel";
import {
  connectToPersistence,
  connectProfilePersistence,
  connectAuthPersistence
} from "./models/firestoreModel";

configure({ enforceActions: "never" });

export const reactiveSessionModel = observable(sessionModel);
export const reactiveProfileModel = observable(profileModel);
export const reactiveTrainModel = observable(trainModel);
export const reactiveAuthModel = observable(authModel);

connectAuthPersistence(reactiveSessionModel);
connectToPersistence(reactiveTrainModel, reactiveSessionModel);
connectProfilePersistence(reactiveProfileModel, reactiveSessionModel);


