import "../css/NetworkMap.css";
import React from "react";
import networkIcon from "../assets/connection.png";

class NetworkMap extends React.Component {
  renderAnnots() {
    console.log("annotprops", this.props.searchedAnnots.data);

    if (this.props.searchedAnnots.data == "") {
      return (
        <div className="img-container">
          <img className="temp-image" src={networkIcon} alt="network icon" />
          <p className="temp-text">
            <span className="text-color-red">Choose</span> or{" "}
            <span className="text-color-blue">Search</span> the Tag <br /> to
            Create Your Personal Learning Network
          </p>
        </div>
      );
    }

    return this.props.searchedAnnots.data.map(annot => {
      return (
        <div key={annot.id}>
          <p>{annot.user}</p>
          <p>{annot.text}</p>
          <p className="tags">{annot.tags.join(", ")}</p>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="map-container">
        <div>{this.renderAnnots()}</div>
      </div>
    );
  }
}

export default NetworkMap;
