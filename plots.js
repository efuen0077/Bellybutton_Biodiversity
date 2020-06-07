function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
          .text(sample)
          .property("value", sample);
    });
    optionChanged(sampleNames[0]);
  });
};
function optionChanged(newId) {
  buildMetadata(newId);
  buildCharts(newId);
  buildGauge(newId)
};
function buildMetadata(id) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}:${value}`);
    });
  });
};
function buildCharts(id) {
  d3.json("samples.json").then(data => {
    var data_samples = data.samples;
    var filterData = data_samples.filter(sampleObj => sampleObj.id === id);
    var dataObj = filterData[0];

    var trace1 = [{
      x: dataObj.sample_values.slice(0,10),
      y: dataObj.otu_ids.map(id => "OTU " + id.toString()).slice(0,10),
      text: dataObj.otu_labels,
      name: "otu",
      type: "bar",
      orientation: "h"
    }];
    var layout = {
      yaxis:{
          autorange:'reversed'
      }
    }; 
    Plotly.newPlot("bar", trace1, layout);
    var trace2 = {
      x: dataObj.otu_ids,
      y: dataObj.sample_values,
      mode: 'markers',
      marker: {
        color: dataObj.otu_ids,
        size: dataObj.sample_values
      },
    };
    var data = [trace2]
    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot('bubble', data, layout);
  });
};
function buildGauge(id) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
    var result = resultArray[0];
    var trace3 = [{
      domain: { x: [0,9] },
      value: result.wfreq,
      title: { text: "Scrub Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [null,9], visible: false}, 
      steps: [
        { range: [0, 1], color: "#ffffff" , name: "0-1"},
        { range: [1, 2], color: "#e6ffe6" , name: '1-2'},
        { range: [2, 3], color: "#ccffcc" },
        { range: [3, 4], color: "#99ff99" },
        { range: [4, 5], color: "#4dff4d" },
        { range: [5, 6], color: "#1aff1a" },
        { range: [6, 7], color: "#00ff00" },
        { range: [7, 8], color: "#00e600" },
        { range: [8, 9], color: "#00cc00" }
      ],
      }
    }];
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', trace3, layout);
  });
};  
init();
