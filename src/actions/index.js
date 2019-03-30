import hypothesis from "../apis/hypothesis";

export const fetchAnnots = username => {
  return async function(dispatch, getState) {
    const response = await hypothesis.get("/search", {
      params: {
        user: "acct:" + username + "@hypothes.is"
      }
    });

    dispatch({ type: "FETCH_ANNOTS", payload: response.data.rows });

    // return {
    //   type: "FETCH_ANNOTS",
    //   payload: response
    // };
  };
};

export const fetchSearchedAnnots = tag => {
  console.log("tagggg", tag);
  return async function(dispatch) {
    const response = await hypothesis.get("/search", {
      params: {
        tag: tag
      }
    });

    dispatch({
      type: "FETCH_SEARCHED_ANNOTS",
      payload: response.data.rows
    });
  };
};
