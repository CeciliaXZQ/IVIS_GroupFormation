function RadarChart(id, data, options) {
    var cfg = {
// configurable constants
        w: 850,
        h: 550,
        maxAttrPoints : 20,
        innerCircleRadius : 15,
        outerCircleMaxRadius: 240,
        textLabelOffset: 7.5,
        dragDelta : 10};

// non-configurable constants
var centerX = cfg.w / 2;
var centerY = cfg.h / 2;

// variables used to track values when dragging
var textDragStartY = 0;
var textDragStartValue = 0;

var data = [
    { attr: 'Bulk Apperception', val: 14 },
    { attr: 'Candor', val: 19 },
    { attr: 'Vivacity', val: 17 },
    { attr: 'Coordination', val: 10 },
    { attr: 'Meekness', val: 2 },
    { attr: 'Humility', val: 3 },
    { attr: 'Cruelty', val: 1 },
    { attr: 'Self-Preservation', val: 10 },
    { attr: 'Patience', val: 3 },
    { attr: 'Decisiveness', val: 14 },
    { attr: 'Imagination', val: 13 },
    { attr: 'Curiosity', val: 8 },
    { attr: 'Aggression', val: 10 },
    { attr: 'Loyalty', val: 16 },
    { attr: 'Empathy', val: 9 },
    { attr: 'Tenacity', val: 17 },
    { attr: 'Courage', val: 15 },
    { attr: 'Sensuality', val: 18 },
    { attr: 'Charm', val: 18 },
    { attr: 'Humor', val: 9 }
];

// scale for plotting points along lines of radar plot
// calculates length of 'r' based on host attribute value
var lineScale = d3.scale.linear()
        .domain([0, cfg.maxAttrPoints + 1])
        .range([cfg.innerCircleRadius, cfg.outerCircleMaxRadius]);

// append svg element for drawing
var svg  = d3.select('body')
        .append('svg')
        .attr('width', cfg.w)
        .attr('height', cfg.h);

// create drag behaviour for changing data values via the text labels
// var textDragBehaviour = d3.drag()
//         .on('start', function(d, i) {
//             d3.select('body').classed('dragging', true);
//             textDragStartY = d3.event.y;
//             textDragStartValue = data[i].val;
//         })
//         .on('drag', function(d, i) {
//             var dy = textDragStartY - d3.event.y;
//             var newValue = textDragStartValue + Math.floor(dy / cfg.dragDelta);
//             data[i].val = clampInt(newValue, 1, cfg.maxAttrPoints);
//             updatePlot();
//         })
//         .on('end', function() {
//             d3.select('body').classed('dragging', false);
//         });

// append circular grid lines
d3.range(0, cfg.maxAttrPoints + 1).forEach(function(d) {
    svg.append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('r', function() {
                return lineScale(d);
            })
            .classed('axis', true);
});

// append lines grid lines
svg.selectAll('line.value')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', function(d, i) {
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(cfg.innerCircleRadius, theta);
            return xy[0] + centerX;
        })
        .attr('y1', function(d, i) {
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(cfg.innerCircleRadius, theta);
            return xy[1] + centerY;
        })
        .attr('x2', function(d, i) {
            var r = lineScale(cfg.maxAttrPoints);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[0] + centerX;
        })
        .attr('y2', function(d, i) {
            var r = lineScale(cfg.maxAttrPoints);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[1] + centerY;
        })
        .classed('value', true);

// append 'max value' points
d3.range(0, data.length).forEach(function(i) {
    var r = lineScale(20);
    var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
    var xy = polarToCartesian(r, theta);

    svg.append('circle')
            .attr('cx', xy[0] + centerX)
            .attr('cy', xy[1] + centerY)
            .attr('r', 5)
            .classed('max', true);
});

// append the polygon defined by the values, we bind the data again for
// the same reasons above
svg.selectAll('polygon')
        .data([data]) // put data array in own array so data binder iterates once
        .enter()
        .append('polygon')
        .classed('value', true);

// call a separate function to update the polygon points so we can update
// the points when the data changes
updatePolygonPoints();

// append circle values, bind data here so the values can be updated on the fly
svg.selectAll('circle.value')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .classed('value', true);

// update the cx and cy attributes of the circles in a separate function so
// we can update these separately
updatePoints();

// append the text labels to the plot border
// this is a little complicated as the text-anchor depends upon
// the radial position in the plot
svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function(d, i) {
            var r = (cfg.outerCircleMaxRadius + cfg.textLabelOffset);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[0] + centerX;
        })
        .attr('y', function(d, i) {
            var r = (cfg.outerCircleMaxRadius + cfg.textLabelOffset);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[1] + centerY;
        })
        .attr('class', function(d, i) {
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            return getTextAnchorClass(theta);
        })
//        .call(textDragBehaviour);

// updating the text itself is handled in a separate function so it can be
// updated later. call this function now so the label text appears when the plot
// is first rendered
updateTextLabels();

// append center circle element
// append this last so it appears on the top
svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', cfg.innerCircleRadius)
        .classed('center-circle', true);

function updatePlot() {
    updatePoints();
    updateTextLabels();
    updatePolygonPoints();
}

function updatePoints() {
    svg.selectAll('circle.value')
        .attr('cx', function(d, i) {
            var r = lineScale(d.val);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[0] + centerX;
        })
        .attr('cy', function(d, i) {
            var r = lineScale(d.val);
            var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
            var xy = polarToCartesian(r, theta);
            return xy[1] + centerY;
        });
}

function updatePolygonPoints() {
    svg.select('polygon')
        .attr('points', function(d) {
            return d.map(function(d, i) {
                var r = lineScale(d.val);
                var theta = i * (2 * Math.PI / data.length) - Math.PI / 2;
                var xy = polarToCartesian(r, theta);
                xy[0] += centerX;
                xy[1] += centerY;
                return xy.join(",")
            }).join(" ");
        });
}

function updateTextLabels() {
    svg.selectAll('text')
            .data(data).text(function(d) {
        var out = [];
        out.push(d.attr.toUpperCase());
        out.push(' [');
        out.push(d.val);
        out.push(']');
        return out.join('');
    });
}

// return correct text anchoring class based on the angle given
function getTextAnchorClass(theta) {
    theta = theta % (2 * Math.PI);

    if((almostEquals(theta, -Math.PI / 2))) {
        return 'north';
    }
    else if(almostEquals(theta, 0)) {
        return 'east';
    }
    else if(almostEquals(theta, Math.PI / 2)) {
        return 'south';
    }
    else if(almostEquals(theta, Math.PI)) {
        return 'west';
    }
    else if(theta > (-Math.PI / 2) && theta < 0) {
        return 'first-quadrant';
    }
    else if(theta > 0 && theta < (Math.PI / 2)) {
        return 'second-quadrant';
    }
    else if(theta > (Math.PI / 2) && theta < Math.PI) {
        return 'third-quadrant';
    }
    else {
        return 'fourth-quadrant';
    }
}

// almost equals function for comparing floating point numbers
function almostEquals(a, b, eps) {
    if(!eps) {
        eps = 0.0001;
    }

    return Math.abs(a - b) < eps;
}

// function for clamping and rounding a value to nearest integer
function clampInt(x, min, max) {
    return Math.round(Math.max(min, Math.min(x, max)));
}

// return cartesian x, y co-ordinates give an r and theta polar coords
// value
function polarToCartesian(r, theta) {
    return [r * Math.cos(theta), r * Math.sin(theta)];
}
}