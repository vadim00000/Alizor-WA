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
import { connectStatsPersistence } from "./firestoreModel";
import { statsModel } from "./statsModel";

configure({ enforceActions: "never" });

export const reactiveSessionModel = observable(sessionModel);
export const reactiveProfileModel = observable(profileModel);
export const reactiveTrainModel = observable(trainModel);
export const reactiveAuthModel = observable(authModel);

export const reactiveStatsModel = observable(statsModel);

connectAuthPersistence(reactiveSessionModel);
connectToPersistence(reactiveTrainModel, reactiveSessionModel);
connectProfilePersistence(reactiveProfileModel, reactiveSessionModel);
connectStatsPersistence(reactiveStatsModel, reactiveSessionModel);


