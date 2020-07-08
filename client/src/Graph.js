import React from 'react';
import Plot from 'react-plotly.js';

const Graph = (props) => {
  return (
    <Plot
      data={[{
        values: [1022, 193, 11, 200],
        labels: ['P&I', 'Taxes', 'Insurance', 'Utilities'],
        type: 'pie',
        texttemplate: '$%{value}',
        insidetextorientation: "radial"
      }]}
      layout={{
        height: 400,
        width: 500
      }}
    />
  )
}

export default Graph;