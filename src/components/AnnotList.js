import "../css/AnnotList.css";
import React from "react";
import SearchedAnnotList from "./SearchAnnots";
import NetworkMap from "./NetworkMap";
import { connect } from "react-redux";
import { fetchAnnots } from "../actions";
import { fetchSearchedAnnots } from "../actions";
import axios from "axios";

class AnnotList extends React.Component {
  componentDidMount() {
    const { username } = this.props.location.state;
    this.props.fetchAnnots(username);

    console.log("try pass from component:", username);
    // const token = "6879-QLwKBhX26Ja-nDyHvT5HslkRkuU41tr3W7GscMy3yVY";
    // const headers = {
    //   Authorization: "Bearer" + token,
    //   "Content-type": "application/json"
    // };
    // axios({
    //   method: "GET",
    //   url: "https://hypothes.is/api/",
    //   headers: headers
    // })
    //   .then(response => {
    //     console.log("response data:", response.data);
    //   })
    //   .catch(error => {
    //     console.log("error:", error);
    //   });
  }

  //   renderList() {
  //     return this.props.annots.map(annot => {
  //       return (
  //         <div className="item" key={annot.id}>
  //           <div className="content">
  //             <div className="description">
  //               <h2>{annot.user}</h2>
  //               <p>{annot.text}</p>
  //               <h5>{annot.tags.join()}</h5>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     });
  //   }

  renderTag() {
    var a = [];
    const b = this.props.annots;
    for (var i = 0; i < b.length; i++) {
      a.push(b[i].tags);
    }
    var flat = [];
    for (var j = 0; j < a.length; j++) {
      flat = flat.concat(a[j]);
    }
    // console.log("bbb", flat);
    var uniqueTags = flat.filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    // console.log("unique", uniqueTags);
    var tagCounts = [];
    for (var k = 0; k < flat.length; k++) {
      var tagElement = flat[k];
      tagCounts[tagElement] = tagCounts[tagElement]
        ? tagCounts[tagElement] + 1
        : 1;
    }
    // console.log("counts:", tagCounts);
    const tagArray = [];
    for (var n = 0; n < uniqueTags.length; n++) {
      tagArray.push({
        text: uniqueTags[n],
        count: tagCounts[uniqueTags[n]]
      });
    }
    // console.log("lalal", tagArray);
    return tagArray.map(tag => {
      return (
        <div className="ui horizontal list" key={tag.text}>
          <p
            className="item tag-item"
            onClick={() => this.onClickTag(tag.text)}
          >
            {tag.text} &nbsp; {tag.count}
          </p>
        </div>
      );
    });
  }

  onSearchSubmit = term => {
    this.props.fetchSearchedAnnots(term);
  };

  onClickTag = tag => {
    console.log("tag by clicked", tag);
    this.props.fetchSearchedAnnots(tag);
  };

  //   renderSearchedAnnots() {
  //     console.log("haha", this.props.searchedAnnots);
  //     return this.props.searchedAnnots.map(annot => {
  //       return (
  //         <div>
  //           <p>{annot.user}</p>
  //           <p>{annot.text}</p>
  //         </div>
  //       );
  //     });
  //   }

  render() {
    const data = this.props.searchedAnnots;
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <SearchedAnnotList onSubmit={this.onSearchSubmit} />
          <div className="tag-list">
            <div>{this.renderTag()}</div>
          </div>
          {/* <div className="ui relaxed divided list">{this.renderList()}</div> */}
        </div>

        <NetworkMap searchedAnnots={{ data }} />

        {/* <div className="fetchedAnnots">
          <div>{this.renderSearchedAnnots()}</div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return { annots: state.annots, searchedAnnots: state.searchedAnnots };
};

// const mapDispatchToPros = dispatch => ({
//   fetchSearchedAnnots: term => dispatch(fetchSearchedAnnots(term)),
//   fetchAnnots: () => dispatch(fetchAnnots())
// });

export default connect(
  mapStateToProps,
  { fetchAnnots, fetchSearchedAnnots }
)(AnnotList);
