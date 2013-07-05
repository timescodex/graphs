var graphs = function() {

  /* 这里声明私有变量和方法 */

  /* 公有变量和方法（可以访问私有变量和方法） */
  return {

    //zhu Graph
    getZhu: function(graphId, dataJson) {
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      var formatPercent = d3.format(".0%");

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

      var svg = d3.select("#" + graphId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //d3.json
      var data = dataJson.data;
      data.forEach(function(d) {
        d.frequency = +d.frequency;
      });

      x.domain(data.map(function(d) {
        return d.letter;
      }));
      y.domain([0, d3.max(data, function(d) {
          return d.frequency;
        })]);
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("频率");

      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
        return x(d.letter);
      })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
        return y(d.frequency);
      })
        .attr("height", function(d) {
        return height - y(d.frequency);
      });
    },

    //Pie Graph
    getPie: function(graphId, dataJson) {
      var width = 460,
        height = 200,
        radius = Math.min(width, height) / 2;

      var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
        return d.population;
      });

      var svg = d3.select("#" + graphId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var data = dataJson.data;

      data.forEach(function(d) {
        d.population = +d.population;
      });

      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
        return color(d.data.age);
      });

      g.append("text")
        .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
        return d.data.age;
      });
    },

    getLineChart: function(graphId, dataJson) {
      //alert(dataJson.data[0].date);
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%b-%y").parse;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .x(function(d) {
        return x(d.date);
      })
        .y(function(d) {
        return y(d.close);
      });

      var svg = d3.select("#" + graphId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      data = dataJson.data;
      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      y.domain(d3.extent(data, function(d) {
        return d.close;
      }));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
    },

    getAreaChart: function(graphId, dataJson) {
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%b-%y").parse;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var area = d3.svg.area()
        .x(function(d) {
        return x(d.date);
      })
        .y0(height)
        .y1(function(d) {
        return y(d.close);
      });

      var svg = d3.select("#" + graphId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data = dataJson.data;
      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      y.domain([0, d3.max(data, function(d) {
          return d.close;
        })]);

      svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
    },

    getMultiSerieLineChart: function(graphId, dataJson) {
      var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%Y%m%d").parse;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
        return x(d.date);
      })
        .y(function(d) {
        return y(d.temperature);
      });

      var svg = d3.select("#"+graphId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = dataJson.data;
        color.domain(d3.keys(data[0]).filter(function(key) {
          return key !== "date";
        }));

        data.forEach(function(d) {
          d.date = parseDate(d.date);
        });

        var cities = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {
                date: d.date,
                temperature: +d[name]
              };
            })
          };
        });

        x.domain(d3.extent(data, function(d) {
          return d.date;
        }));

        y.domain([
          d3.min(cities, function(c) {
            return d3.min(c.values, function(v) {
              return v.temperature;
            });
          }),
          d3.max(cities, function(c) {
            return d3.max(c.values, function(v) {
              return v.temperature;
            });
          })
        ]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Temperature (ºF)");

        var city = svg.selectAll(".city")
          .data(cities)
          .enter().append("g")
          .attr("class", "city");

        city.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
          return line(d.values);
        })
          .style("stroke", function(d) {
          return color(d.name);
        });

        city.append("text")
          .datum(function(d) {
          return {
            name: d.name,
            value: d.values[d.values.length - 1]
          };
        })
          .attr("transform", function(d) {
          return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
        })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) {
          return d.name;
        });
    },

    publicVar: 'the public can see this!'
  };
};