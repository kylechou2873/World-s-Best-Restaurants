function zoomToRest(rest){
  d3.json("https://raw.githubusercontent.com/ZhengshengWang/Project-3---World-s-Best-Restaurants/refs/heads/main/Resource/csvjson.json").then((data)=>{
    let restObj = data.filter((item)=>item.restaurant === rest);
    map_06c7c6fd049b8c568e0b30a5a6e021b2.setView([restObj[0].lat,restObj[0].lng],15);
  });
};
function buildCountryChart(restList){
  d3.json("https://raw.githubusercontent.com/ZhengshengWang/Project-3---World-s-Best-Restaurants/refs/heads/main/Resource/restRepeatRank.json").then((data)=>{
    let restCount = [];
    for (let i = 0; i<restList.length; i++){
      let restObj = data.filter((item)=>item.restaurant === restList[i]);
      restCount.push(restObj[0].count);
    }
    let b2Data = [
      {
        type: 'bar',
        x: restList,
        y: restCount,
        hovertemplate: `<i>%{x}</i>` +
                       `<br><b>Number of Top 50s: </b> %{y}<extra></extra>`
      }
    ];
    let b2Layout = {
      title: "Number of times in top 50s",
      hovermode: 'closest',
      xaxis: {
        type: 'category'
      }
    };
    //console.log(restCount);
    //console.log(typeof(restCount[1]));
    //console.log("min " + Math.min(...restCount));
    //console.log("max " + Math.max(...restCount));
    //console.log(b2Data);

    // Render the Bar Chart #2
    Plotly.newPlot("bar2",b2Data,b2Layout);
    let bar2 = document.getElementById('bar2');
    bar2.on('plotly_click',function(data){
      zoomToRest(data.points[0].x);
    });
  })
}
// function to build charts
function buildCharts(country) {
  d3.json("https://raw.githubusercontent.com/ZhengshengWang/Project-3---World-s-Best-Restaurants/refs/heads/main/Resource/csvjson.json").then((data) => {

    // Get the data
    let list = data;

    // Filter the list for the object with the desired Region
    let selection = list.filter((item)=>item.country === country);
    let ii = 0;
    let restLat = 0;
    let restLng = 0;
    let restList = [];
    for (let i = 0; i<selection.length; i++){
      ii++;
      restLat = restLat + selection[i].lat;
      restLng = restLng + selection[i].lng;
      if (!restList.includes(selection[i].restaurant)){
        restList.push(selection[i].restaurant);
      }
    };
    map_06c7c6fd049b8c568e0b30a5a6e021b2.setView([restLat/ii,restLng/ii],5);
    //console.log(country);
    //console.log(restList);
    buildCountryChart(restList);
    // Render the Bar Chart #3
    //Plotly.newPlot("bar3",b3Data,b3Layout);
  });
}
function buildRegionChart(counList){
  d3.json("https://raw.githubusercontent.com/ZhengshengWang/Project-3---World-s-Best-Restaurants/refs/heads/main/Resource/countryTopRest.json").then((data)=>{
    let counCount = [];
    for (let i = 0; i <counList.length; i++){
      let counObj = data.filter((item)=>item.country === counList[i]);
      counCount.push(counObj[0].count);
    }
  
    let b1Data = [
      {
        type: 'bar',
        y: counList,
        x: counCount,
        orientation: 'h',
        hovertemplate: `<i>%{y}</i>` +
                `<br><b>Number of Top 50s: </b> %{x}<extra></extra>`
      }
    ];
    let b1Layout = {
      title: "Counts of Top 50s for Restaurants in Region",
      hovermode: 'closest',
      xaxis:{
        title:{text:'Number of Awards'}
      }
    };
    // Render the Bar Chart #1 
    Plotly.newPlot("bar1",b1Data,b1Layout);
    // On click even for chart.
    let bar1 = document.getElementById('bar1');
    bar1.on('plotly_click', function(data){
      // build chart for country
      buildCharts(data.points[0].y);
      // change option
      let dataSelect2 = document.getElementById('selDataset2');
      dataSelect2.value = data.points[0].y;
    });
  });
}

function buildSubFilt(region){
  d3.json("https://raw.githubusercontent.com/ZhengshengWang/Project-3---World-s-Best-Restaurants/refs/heads/main/Resource/csvjson.json").then((data)=>{
    let list = data;
    //filter data to the region
    let selection = list.filter((item)=>item.Region === region);
    //store list of country
    let counList = [];
    for (let i = 0; i<selection.length;i++){
      if (!counList.includes(selection[i].country)){
        counList.push(selection[i].country);
      }
    }
    //build dropdown for country selection
    let dataSelect = d3.select('#selDataset2');
    //remove anything outdated by re-selection
    dataSelect.selectAll("option").remove();
    //append a new list of option
    for (let i = 0; i<counList.length; i++){
      dataSelect.append("option").text(counList[i]);
    }
    //init subfilt selection
    buildRegionChart(counList);
    let sel = counList[0]
    buildCharts(sel);
  });
  
}
// Function to run on page load
function init() {
    let dataSelect = d3.select("#selDataset");
    //init regional option
    let region = ['North America','Africa','Asia','Australia','Europe','South America']
    for (let i = 0; i<region.length; i++){
      dataSelect.append("option").text(region[i]);
    }
    //init start selection
    let firstSel = region[0];
    //build init sub filter
    buildSubFilt(firstSel);
}

// Function for event listener
function optionChanged(newRegion) {
  buildSubFilt(newRegion);
}
function optionChanged2(newCountry){
  buildCharts(newCountry);
}

// Initialize the dashboard
init();




