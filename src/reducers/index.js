import { combineReducers } from "redux";
import annotReducer from "./annotReducer";
import searchReducer from "./searchReducer";

export default combineReducers({
  annots: annotReducer,
  searchedAnnots: searchReducer
});
