//Data for IVIS20 Project 1.csv
d3.csv('Data for IVIS20 Project 1.csv', function(dataset) {
    //Load data and map it
    var data = d3.entries(dataset).map(function(d) {
        var val = d.value;
        val.key = d.key;
        return val;
    })

    console.log(data);
    var allGroups = [],
    cols = 12;

    //init the grid matrix
    for ( var i = 0; i < cols; i++ ) {
        allGroups[i] = []; 
    }
    console.log(allGroups);
    var groupData = [];
    
    var groupAvg = [{}];

    //Create and style parcoords
    var colorScheme = d3.scale.linear()
        .domain([0,8])
        .range(['steelblue', 'brown'])
        .interpolate(d3.interpolateLab);

    var color_coord = function(d) { return colorScheme(d['IVIS']); };

    var parcoords = d3.parcoords()('#vis')
        .data(data)
        .hideAxis(['Alias', 'Major','Introduction', 'key'])
        .color(color_coord)
        .alpha(0.4)
        .composite('darken')
        .margin({ top: 20, left: 20, bottom: 10, right: 25 })
        .mode('queue')
        .render()
        .reorderable()
        .brushMode('1D-axes')


    //Create table for the group members (the selected students)
    var groupTable = d3.select('#groupTable').append('table')
        .attr('class', 'table table-hover')
    var groupThead = groupTable.append('thead')
    var groupTbody = groupTable.append('tbody')

    var groupColumns = d3.keys(data[0]).splice(0,1)
        groupColumns.push('Introduction')

        groupThead.append('tr')
        .selectAll('th')
            .data(groupColumns)
            .enter()
        .append('th')
            .text(function(d) { return d; })

    var groupRows = groupTbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .attr('style', 'display:none')
        .on({
            'mouseover': function(d,i) { parcoords.highlight([data[i]]) },
            'mouseout': parcoords.unhighlight,
            'click': function(d,i) { 
                var selected = data.map(function(d) { return data[i].key })
                groupTbody.selectAll('tr')
                    .filter(function(d) { return selected.indexOf(d.key) > -1})
                    .attr('style', 'display:none')

                for(var i = 0; i < groupData.length; i++) {
                    if (groupData[i].key == d.key) {
                        groupData.splice(i,1)
                        break;
                    }
                }
                
                groupAvg[0].IVIS = d3.mean(groupData, function(d) { return d.IVIS; });
                groupAvg[0].Statistic = d3.mean(groupData, function(d) { return d.Statistic; });
                groupAvg[0].Math = d3.mean(groupData, function(d) { return d.Math; });
                groupAvg[0].Art = d3.mean(groupData, function(d) { return d.Art; });
                groupAvg[0].Computer = d3.mean(groupData, function(d) { return d.Computer; });
                groupAvg[0].Prog = d3.mean(groupData, function(d) { return d.Prog; });
                groupAvg[0].Graphic = d3.mean(groupData, function(d) { return d.Graphic; });
                groupAvg[0].HCI = d3.mean(groupData, function(d) { return d.HCI; });
                groupAvg[0].UX = d3.mean(groupData, function(d) { return d.UX; });

                if (groupAvg[0].IVIS == null) { 
                    var data_eval = [
                        [
                             {axis:"IVIS",value:0},
                             {axis:"Stat",value:0},
                             {axis:"Math",value:0},
                             {axis:"Art",value:0 },
                             {axis:"Computers",value:0},
                             {axis:"Prog",value:0},
                             {axis:"Graphic",value:0},
                             {axis:"HCI",value:0},
                             {axis:"UX",value:0},
                        ]
                     ]; 
                }else{
                    data_eval = [
                        [
                             {axis:"IVIS",value:groupAvg[0].IVIS},
                             {axis:"Stat",value:groupAvg[0].Statistic},
                             {axis:"Math",value:groupAvg[0].Math},
                             {axis:"Art",value:groupAvg[0].Art },
                             {axis:"Computers",value:groupAvg[0].Computer},
                             {axis:"Prog",value:groupAvg[0].Prog},
                             {axis:"Graphic",value:groupAvg[0].Graphic},
                             {axis:"HCI",value:groupAvg[0].HCI},
                             {axis:"UX",value:groupAvg[0].UX},
                        ]
                     ];
                     console.log(data_eval);
                }
            //  console.log(d);     

        ////////////////////////////////////////////////////////////// 
        //////////////////// Draw the Chart ////////////////////////// 
        ////////////////////////////////////////////////////////////// 
    
            
        radarChartOptions = {
        w: width_eval,
        h: height_eval,
        margin_eval: {top: 100, right: 100, bottom: 100, left: 100}
        };
        //Call function to draw the Radar chart
        RadarChart(".radarChart", data_eval, radarChartOptions);

            }
        })
            
    var groupCells = groupRows.selectAll('td')
        .data(function(row) {
            return groupColumns.map(function (column) {
                return { 
                    column: column, 
                    value: row[column] }
            })
        })
        .enter()
        .append('td')
            .text(function(d) { 
                if  (d.column == 'Introduction') {
                    return null
                }
                return d.value 
            })

    var groupInterests = groupCells.selectAll('span')
        .data(function(row) {
            return groupColumns.map(function (column) {
                return { 
                    column: column, 
                    value: row.value }
            })
        })
        .enter()
        .append('span')
        .each(function(d) {
            var badges = d3.select(this)
            if (d.column == 'Introduction') {
                if (d.value == '') { badges.append('span').attr('class', 'badge badge-pill badge-dark').text('None') }
                if (d.value.toUpperCase().includes('GYM') || d.value.toUpperCase().includes('TRAINING') || d.value.toUpperCase().includes('EXERSICE') || d.value.toUpperCase().includes('SKIING') || d.value.toUpperCase().includes('WORKING OUT') || d.value.toUpperCase().includes('SWIMMING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgPhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSociety').text('Society') }
            }
        })
        
    // Create evaluation chart
    var margin_eval = {top: 100, right: 100, bottom: 100, left: 100},
    width_eval = 300,//Math.min(700, window.innerWidth - 10) - margin_eval.left - margin_eval.right,
    height_eval = 300;//Math.min(width_eval, window.innerHeight - margin_eval.top - margin_eval.bottom - 20);

    var data_eval = [
        [
             {axis:"IVIS",value:0},
             {axis:"Stat",value:0},
             {axis:"Math",value:0},
             {axis:"Art",value:0 },
             {axis:"Computers",value:0},
             {axis:"Prog",value:0},
             {axis:"Graphic",value:0},
             {axis:"HCI",value:0},
             {axis:"UX",value:0},
        ]
     ];
     console.log(data_eval);
////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

 
var radarChartOptions = {
w: width_eval,
h: height_eval,
margin_eval: {top: 100, right: 100, bottom: 100, left: 100}
};
//Call function to draw the Radar chart
RadarChart(".radarChart", data_eval, radarChartOptions);

    //Create the table for the entire class (all students)
    var classTable = d3.select('#classTable').append('table')
        .attr('class', 'table table-hover')
    var classThead = classTable.append('thead')
    var classTbody = classTable.append('tbody')
    
    var classColumns = d3.keys(data[0]).splice(0,1)
        classColumns.push('Introduction')

        classThead.append('tr')
        .selectAll('th')
            .data(classColumns)
            .enter()
        .append('th')
            .text(function(d) { return d; })

    var classRows = classTbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .on({
            'mouseover': function(d,i) { parcoords.highlight([data[i]]) },
            'mouseout': parcoords.unhighlight,
            'click': function(d,i) { 
                var selected = data.map(function(d) { return data[i].key })
                groupTbody.selectAll('tr')
                    .filter(function(d) { return selected.indexOf(d.key) > -1})
                    .attr('style', 'null')

                var alreadyAdded = false;
                for(var i = 0; i < groupData.length; i++) {
                    if (groupData[i].key == d.key) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (!alreadyAdded) {
                    groupData.push(d)
                }

                groupAvg[0].IVIS = d3.mean(groupData, function(d) { return d.IVIS; });
                groupAvg[0].Statistic = d3.mean(groupData, function(d) { return d.Statistic; });
                groupAvg[0].Math = d3.mean(groupData, function(d) { return d.Math; });
                groupAvg[0].Art = d3.mean(groupData, function(d) { return d.Art; });
                groupAvg[0].Computer = d3.mean(groupData, function(d) { return d.Computer; });
                groupAvg[0].Prog = d3.mean(groupData, function(d) { return d.Prog; });
                groupAvg[0].Graphic = d3.mean(groupData, function(d) { return d.Graphic; });
                groupAvg[0].HCI = d3.mean(groupData, function(d) { return d.HCI; });
                groupAvg[0].UX = d3.mean(groupData, function(d) { return d.UX; });

            //  console.log(d);     
                data_eval = [
                   [
                        {axis:"IVIS",value:groupAvg[0].IVIS},
                        {axis:"Stat",value:groupAvg[0].Statistic},
                        {axis:"Math",value:groupAvg[0].Math},
                        {axis:"Art",value:groupAvg[0].Art },
                        {axis:"Computers",value:groupAvg[0].Computer},
                        {axis:"Prog",value:groupAvg[0].Prog},
                        {axis:"Graphic",value:groupAvg[0].Graphic},
                        {axis:"HCI",value:groupAvg[0].HCI},
                        {axis:"UX",value:groupAvg[0].UX},
                   ]
                ];
                console.log(data_eval);
                if (groupAvg[0].IVIS == null) { 
                    progressMissing.style('width', function(d) { return 0; }) 
                    progressExtra.style('width', function(d) { return 0; }) 
                }
        ////////////////////////////////////////////////////////////// 
        //////////////////// Draw the Chart ////////////////////////// 
        ////////////////////////////////////////////////////////////// 
    
            
        radarChartOptions = {
        w: width_eval,
        h: height_eval,
        margin_eval: {top: 100, right: 100, bottom: 100, left: 100}
        };
        //Call function to draw the Radar chart
        RadarChart(".radarChart", data_eval, radarChartOptions);

                // progress.style('width', function(d) { 
                //     if (dataAvg[0][d] >= groupAvg[0][d]) {
                //         return (groupAvg[0][d]*10).toFixed(0) + '%'; }
                //     else { return (dataAvg[0][d]*10).toFixed(0) + '%'; }})
                // progressMissing.style('width', function(d) { 
                //     if ((dataAvg[0][d] - groupAvg[0][d])*10 > 0) {
                //         return ((dataAvg[0][d] - groupAvg[0][d])*10) + '%' }
                //     else { return 0; }})
                // progressExtra.style('width', function(d) { 
                //     if ((groupAvg[0][d] - dataAvg[0][d])*10 > 0) {
                //         return ((groupAvg[0][d] - dataAvg[0][d])*10) + '%' }
                //     else { return 0; }})
            }
        })
        
    var classCells = classRows.selectAll('td')
        .data(function(row) {
            return classColumns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
            .text(function(d) { 
                if  (d.column == 'Introduction') {
                    return null
                }
                return d.value 
            })

    var classInterests = classCells.selectAll('span')
        .data(function(row) {
            return classColumns.map(function (column) {
                return { 
                    column: column, 
                    value: row.value }
            })
        })
        .enter()
        .append('span')
        .each(function(d) {
            var badges = d3.select(this)
            if (d.column == 'Introduction') {
                if (d.value == '') { badges.append('span').attr('class', 'badge badge-pill badge-dark').text('None') }
                if (d.value.toUpperCase().includes('GYM') || d.value.toUpperCase().includes('TRAINING') || d.value.toUpperCase().includes('EXERSICE') || d.value.toUpperCase().includes('SKIING') || d.value.toUpperCase().includes('WORKING OUT') || d.value.toUpperCase().includes('SWIMMING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGym').text('Excercise') }
                if (d.value.toUpperCase().includes('SPORT') || d.value.toUpperCase().includes('FOOTBALL') || d.value.toUpperCase().includes('SOCCER') || d.value.toUpperCase().includes('HOCKEY') || d.value.toUpperCase().includes('BADMINTON')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSport').text('Sports') }
                if (d.value.toUpperCase().includes('MUSIC') || d.value.toUpperCase().includes('GUITAR')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgMusic').text('Music') }
                if (d.value.toUpperCase().includes('PHOTO') || d.value.toUpperCase().includes('CAMERAS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgPhoto').text('Photography') }
                if (d.value.toUpperCase().includes('ART') || d.value.toUpperCase().includes('DRAWING')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgArt').text('Art') }
                if (d.value.toUpperCase().includes('PROGRAMMING') || d.value.toUpperCase().includes('CODING') || d.value.toUpperCase().includes('DEVELOPMENT') || d.value.toUpperCase().includes('WEB DEV') || d.value.toUpperCase().includes('JAVASCRIPT') || d.value.toUpperCase().includes('MACHINE LEARNING') || d.value.toUpperCase().includes('CREATING COOL SHIT')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgProg').text('Programming') }
                if (d.value.toUpperCase().includes('GAMES') || d.value.toUpperCase().includes('GAMING') || d.value.toUpperCase().includes('ROCKET LEAGUE')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgGaming').text('Gaming') }
                if (d.value.toUpperCase().includes('VISUALIZATION') || d.value.toUpperCase().includes('D3') || d.value.toUpperCase().includes('DESIGN PRETTY THINGS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgIVIS').text('InfoVis') }
                if (d.value.toUpperCase().includes('TRAVEL')) { 
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgTravel').text('Travel') }
                if (d.value.toUpperCase().includes('SOCIAL') || d.value.toUpperCase().includes('FRIENDS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSocial').text('Social') }
                if (d.value.toUpperCase().includes('COOK') || d.value.toUpperCase().includes('FOOD')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgFood').text('Food') }
                if (d.value.toUpperCase().includes('NEWS') || d.value.toUpperCase().includes('POLITICS')) {
                    badges.append('span').attr('class', 'badge badge-pill badge-dark bgSociety').text('Society') }
            }
        })

    //Filter function for groupTable AND classTable when parcoords is brushed
    parcoords.on('brush', function(items) {
        var selected = items.map(function(d) { return d.key; })
        classTbody.selectAll('tr')
            .attr('style', 'display: none')
            .filter(function(d) { return selected.indexOf(d.key) > -1 })
            .attr('style', 'null')

        groupTbody.selectAll('tr')
            .style('opacity', 0.35)
            .filter(function(d) { return selected.indexOf(d.key) > -1 })
            .style('opacity', 1)
    })

        // Create all groups summary
        // var ctx = document.getElementById("myChart").getContext('2d');
//         var original = Chart.defaults.global.legend.onClick;

//         // Chart.defaults.global.legend.onClick = function(e, legendItem) {
//         //     console.log("click!!");
//         //   update_caption(legendItem);
//         //   original.call(this, e, legendItem);
//         // };
        

// var options = {
//     title: {
//       display: true,
//       text: "Summary of all groups",
//       position: "top"
//     },
//     onClick: (evt, item) => {
//       console.log("click!!!!");
//       myChart.update();
//      // item[0]._model.outerRadius += 10;
//     }
//   };
//         var myChart = new Chart(ctx, {
//           type: 'bar',
//           data: {
//             labels: ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6", "Group 7", "Group 8", "Group 9", "Group 10", "Group 11", "Group 12"],
//             datasets: [{
//               label: 'number of members',
//               backgroundColor: "rgba(92,209,123,0.8)",
//               data: [
//                   allGroups[0].length, 
//                   allGroups[1].length, 
//                   allGroups[2].length, 
//                   allGroups[3].length, 
//                   allGroups[4].length, 
//                   allGroups[5].length,
//                   allGroups[6].length,
//                   allGroups[7].length,
//                   allGroups[8].length,
//                   allGroups[9].length,
//                   allGroups[10].length,
//                   allGroups[11].length]}]//,
//           },
//           options: options
//         });
        
//         var labels = {
//           "number of members": true,
//          // "oranges": true
//         };
  ///////////////////////////////
  var ctx = document.getElementById("myChart").getContext("2d");
  var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
  var barChartData = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,0.8)",
            highlightFill : "rgba(151,187,205,0.75)",
            highlightStroke : "rgba(151,187,205,1)",
            data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        }
    ]

}
  window.myBar = new Chart(ctx).Bar(barChartData, {
    responsive : true
});
//}

var myEle=document.getElementById("myChart");
myEle.addEventListener('click', function(evt) {
           var ctx = document.getElementById("myChart").getContext("2d");
           // from the endPoint we get the end of the bars area
           var base = window.myBar.scale.endPoint;
           var height_bar = window.myBar.chart.height;
           var width_bar = window.myBar.chart.width;
           // only call if event is under the xAxis
           if(evt.pageY > base){
               // how many xLabels we have
               var count = window.myBar.scale.valuesCount;
               var padding_left = window.myBar.scale.xScalePaddingLeft;
               var padding_right = window.myBar.scale.xScalePaddingRight;
               // calculate width for each label
               var xwidth = (width_bar-padding_left-padding_right)/count;
               // determine what label were clicked on AND PUT IT INTO bar_index 
               var bar_index = (evt.offsetX - padding_left) / xwidth;
               // don't call for padding areas
               if(bar_index > 0 & bar_index < count){
                   bar_index = parseInt(bar_index);
                // either get label from barChartData
                console.log("barChartData:" + barChartData.labels[bar_index]);
                // or from current data
                var ret = [];
                for (var i = 0; i < window.myBar.datasets[0].bars.length; i++) {
                    ret.push(window.myBar.datasets[0].bars[i].label)
                };
                console.log("current data:" + ret[bar_index]);
                // based on the label you can call any function
                var myText=document.getElementById('hello');
    myText.innerHTML= ret[bar_index] + ": " + window.myBar.datasets[0].bars[bar_index].value;
               }
           }
   }
);         
})




