// Copyright (c) 2023 SobaZino | Mehran Nosrati

var link;
var node;

var div = d3.select("#VIEW"),
  width = div.node().getBoundingClientRect().width,
  height = div.node().getBoundingClientRect().height;

var svg = div
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMidYMid meet");

var force = d3.layout.force().charge(-220).linkDistance(250).size([width, height]);

function Graph(nodes, links) {
  var graph = {
    nodes: nodes.map(function (name) {
      return { name: name.toString() };
    }),
    links: links.map(function (link) {
      return { source: link[0][0], target: link[0][1], title: link[1] };
    }),
  };

  force.nodes(graph.nodes).links(graph.links).start();

  svg.selectAll(".link").remove();
  svg.selectAll(".node").remove();

  link = svg.selectAll(".link").data(graph.links).enter().append("line").attr("class", "link");
  node = svg.selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").call(force.drag);
  node.append("circle").attr("r", 20);
  node
    .append("text")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .attr("class", "text")
    .text(function (d) {
      return d.name;
    });

  svg.append("defs").selectAll("marker").data(["end"]).enter().append("marker").attr("id", String).attr("viewBox", "0 1 15 15").attr("refX", 18).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--r)");
  force.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
}

function Marker(node) {
  link.style("stroke", function (d) {
    if (d.source.name == node[0].toString() && d.target.name == node[1].toString()) {
      return d3.select(this).attr("marker-end", "url(#end)");
    } else {
      return d3.select(this).style("stroke");
    }
  });
}

function Color(node, color) {
  link.style("stroke", function (d) {
    if ((d.source.name == node[0].toString() && d.target.name == node[1].toString()) || (d.source.name == node[1].toString() && d.target.name == node[0].toString())) {
      return color;
    } else {
      return d3.select(this).style("stroke");
    }
  });
}

function Reset() {
  link.attr("marker-end", null);
  link.style("stroke", "var(--c)");
}
