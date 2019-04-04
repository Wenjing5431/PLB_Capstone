import "../css/NetworkMap.css";
import React from "react";
import networkIcon from "../assets/connection.png";
import zc from "@dvsl/zoomcharts";

let Chart = zc.NetChart;

// Zoomcharts license and license key
window.ZoomChartsLicense =
  "ZCS-101rm718m: ZoomCharts SDK 30 day Free Trial License for che..@..l.com (valid for testing only); upgrades until: 2020-03-21";
window.ZoomChartsLicenseKey =
  "39d8cd3eba17f98d5c4b5862a4db1effed5b48b4f96a0d9450" +
  "229bb8b24b0f012c2e95c31e6fdd092901628a73aa3511b6aca50b26575c1dc9c5033b42243a0" +
  "842344a7ea2b32b34cbfc406ea3ea1e1950de24892ebcf773a8157a460fa346039dbd27458a43" +
  "1b5a855d2da8c211526c28caba6402542aac71a8af5b2e3982387394dbf9f4b450da9b8017aad" +
  "08d6e9057b6f40cfa3f52c7cec3b38a40e93e5b6074da373c42810f8f7171396566c2ffacbb12" +
  "5fcf57332ec7afb9264fc6d35a2bb9e20830093d469d92fef823020004ec2dd7f908ee9a7bfb6" +
  "c5fd0134969d7dca1050eeffed66884866f97ae26895c32dd13c8e5cf6c9c37e4a1169ccdaa01";

class NetworkMap extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     annotId: ""
  //   };
  // }
  state = {
    annotId: ""
  };

  componentDidUpdate() {
    // console.log("pass tag here:", this.props.passTag);
    // console.log("show me", this.props.searchedAnnots.data);
    const selectedTag = this.props.passTag;
    const array = this.props.searchedAnnots.data.filter(arr => {
      return arr.references === undefined;
    });

    const annotArray = array.map(arr => {
      return {
        annotId: arr.id,
        created: arr.created,
        document: arr.document,
        links: arr.links,
        tags: arr.tags,
        target: arr.target,
        text: arr.text,
        uri: arr.uri,
        user: arr.user.substring(
          arr.user.indexOf(":") + 1,
          arr.user.indexOf("@")
        )
      };
    });
    console.log("no references:", annotArray);

    const arrayModify = annotArray.reduce((o, cur) => {
      var occurs = o.reduce((n, item, i) => {
        return item.user === cur.user ? i : n;
      }, -1);
      if (occurs >= 0) {
        o[occurs].text = o[occurs].text.concat(cur.text);
        o[occurs].annotId = o[occurs].annotId.concat(cur.annotId);
      } else {
        var obj = {
          user: cur.user,
          text: [cur.text],
          annotId: [cur.annotId]
        };
        o = o.concat([obj]);
      }
      return o;
    }, []);

    // console.log("same user array:", arrayModify);

    const newNodesM = [];
    const newNodesT = [];
    const newLinksM = [];
    const newLinksT = [];

    // nodes data
    for (var i = 0; i < arrayModify.length; i++) {
      newNodesM.push({
        id: "A" + i,
        style: {
          label: arrayModify[i].user,
          fillColor: "#65BCF8",
          // lineColor: "#59A8DF",
          lineColor: "rgba(89, 168, 223, 0.5)"
        },
        loaded: true
      });
    }

    var newNodesMM = [
      {
        id: "T",
        style: {
          label: selectedTag,
          fillColor: "#912F40",
          // lineColor: "#AB1927",
          lineColor: "rgba(171, 25, 39, 0.5)"
        },
        loaded: true
      },
      ...newNodesM
    ];

    for (var j = 0; j < arrayModify.length; j++) {
      if (arrayModify[j].text.length > 1) {
        for (var k = 0; k < arrayModify[j].text.length; k++) {
          newNodesT.push({
            id: "A" + j + "N" + k,
            style: {
              label: arrayModify[j].text[k],
              fillColor: "#68CF9D",
              // lineColor: "#62BC90",
              lineColor: "rgba(98, 188, 144, 0.5)"
            },
            annotId: arrayModify[j].annotId[k],
            loaded: true,
            multiple: "yes"
          });
        }
      } else {
        newNodesT.push({
          id: "A" + j + "N" + j,
          style: {
            label: arrayModify[j].text[0],
            fillColor: "#68CF9D",
            // lineColor: "#62BC90",
            lineColor: "rgba(98, 188, 144, 0.5)"
          },
          annotId: arrayModify[j].annotId[0],
          loaded: true
        });
      }
    }

    const newNodes = newNodesMM.concat(newNodesT);
    console.log("newNodes", newNodes);

    // links data
    for (var i = 0; i < newNodesM.length; i++) {
      newLinksM.push({
        id: "L" + i,
        from: newNodesM[i].id,
        to: "T",
        type: "creators"
      });
    }

    for (var i = 0; i < newNodesT.length; i++) {
      newLinksT.push({
        id: "LN" + i,
        from: newNodesT[i].id,
        to: newNodesT[i].id.substring(
          newNodesT[i].id.indexOf("A"),
          newNodesT[i].id.indexOf("N")
        ),
        type: "annots"
      });
    }

    var newLinks = newLinksM.concat(newLinksT);
    // console.log("newLinks", newLinks);

    var self = this;
    if (selectedTag !== "") {
      var t = new Chart({
        container: document.getElementById("chartNetChart"),
        area: {
          style: { fillColor: "#f9fbfd" }
        },
        navigation: {
          focusNodeExpansionRadius: 1,
          initialNodes: ["T"],
          mode: "focusnodes"
        },
        layout: {
          mode: "radial",
          nodeSpacing: 30
        },
        style: {
          node: {
            display: "roundtext",
            lineWidth: 5
            // lineDash: [10, 2, 5, 2]
          },
          nodeStyleFunction: nodeStyle,
          linkStyleFunction: linkStyle,
          link: {
            fillColor: "#D8D8D8"
            // lineDash: [10, 5, 5, 5]
          },
          nodeHovered: {
            shadowBlur: 1
          },
          linkHovered: {
            shadowBlur: 1
          },
          nodeLabel: {
            textStyle: { fillColor: "white" }
          }
          // nodeStyleFunction: function(node) {
          //   node.image =
          //     "https://zoomcharts.com/dvsl/data/net-chart/friend-net/" +
          //     node.id +
          //     ".png";
          //   node.label = node.data.name;
          // }
        },
        data: {
          preloaded: {
            nodes: newNodes,
            links: newLinks
          }
        },
        events: {
          onDoubleClick: graphDoubleClick
        },
        toolbar: {
          fullscreen: true,
          enabled: true
        },
        interaction: {
          resizing: {
            enabled: false
          }
        }
      });

      function nodeStyle(node) {
        if (node.hovered) {
          node.radius = 38;
        } else {
          node.radius = 30;
        }
      }

      function linkStyle(link) {
        if (link.hovered) {
          link.radius = 2;
          link.fillColor = "#979797";
          link.shadowColor = "#979797";
        } else {
          link.radius = 1;
          link.fillColor = "#D8D8D8";
        }
      }
      function graphDoubleClick(event) {
        event.preventDefault();
        self.setState({
          annotId: event.clickNode.data.annotId
        });
      }
    }
  }

  renderAnnots() {
    // console.log("annotprops", this.props.searchedAnnots.data);
    // console.log(
    //   "annotprops jason",
    //   JSON.stringify(this.props.searchedAnnots.data)
    // );

    if (this.props.passTag == "") {
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

    // return this.props.searchedAnnots.data.map(annot => {
    //   return (
    //     <div key={annot.id}>
    //       <p>{annot.user}</p>
    //       <p>{annot.text}</p>
    //       <p className="tags">{annot.tags.join(", ")}</p>
    //     </div>
    //   );
    // });
  }

  render() {
    return (
      <div className="map-container">
        <div id="chartNetChart" className="chart" />
        <p className="cover" />
        <div>{this.renderAnnots()}</div>
        <p>passId: {this.state.annotId}</p>
      </div>
    );
  }
}

export default NetworkMap;
