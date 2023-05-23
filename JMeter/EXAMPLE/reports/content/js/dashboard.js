/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.85, "KoPercent": 0.15};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0726, 500, 1500, "02. Projects"], "isController": true}, {"data": [0.1524, 500, 1500, "04. CV"], "isController": true}, {"data": [0.164, 500, 1500, "01.01 \/home"], "isController": false}, {"data": [0.154, 500, 1500, "03. About"], "isController": true}, {"data": [0.1524, 500, 1500, "04.01 \/cv"], "isController": false}, {"data": [0.0726, 500, 1500, "02.01 \/projects"], "isController": false}, {"data": [0.164, 500, 1500, "01. Home"], "isController": true}, {"data": [0.154, 500, 1500, "03.01 \/about"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 15, 0.15, 6102.199399999998, 0, 30104, 6564.5, 10224.499999999998, 11417.899999999998, 17789.739999999994, 12.894457575300407, 118.25805478484307, 1.6330188314687948], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["02. Projects", 2500, 10, 0.4, 8973.447999999993, 155, 30104, 9354.5, 14477.000000000004, 17070.29999999999, 25714.659999999993, 3.230429091435357, 20.73083703405906, 0.4227319318870487], "isController": true}, {"data": ["04. CV", 2500, 0, 0.0, 5349.074800000004, 90, 10669, 5993.0, 9218.6, 9506.8, 10186.809999999996, 3.228922882989001, 15.271159242646451, 0.40361536037362516], "isController": true}, {"data": ["01.01 \/home", 2500, 0, 0.0, 4950.223600000005, 94, 10888, 5844.0, 8533.800000000001, 9396.9, 10121.899999999998, 3.2393909944930352, 58.7266156462585, 0.3985969387755102], "isController": false}, {"data": ["03. About", 2500, 5, 0.2, 5136.051599999996, 0, 11228, 5781.5, 9110.300000000001, 9483.349999999999, 10872.96, 3.229986679534934, 23.93150753693167, 0.41238476416898256], "isController": true}, {"data": ["04.01 \/cv", 2500, 0, 0.0, 5349.074800000004, 90, 10669, 5993.0, 9218.6, 9506.8, 10186.809999999996, 3.228922882989001, 15.271159242646451, 0.40361536037362516], "isController": false}, {"data": ["02.01 \/projects", 2500, 10, 0.4, 8973.44799999999, 155, 30104, 9354.5, 14477.000000000004, 17070.29999999999, 25714.659999999993, 3.230429091435357, 20.73083703405906, 0.4227319318870487], "isController": false}, {"data": ["01. Home", 2500, 0, 0.0, 4950.223600000005, 94, 10888, 5844.0, 8533.800000000001, 9396.9, 10121.899999999998, 3.238962909987925, 58.71885494239829, 0.3985442643149205], "isController": true}, {"data": ["03.01 \/about", 2500, 5, 0.2, 5136.051200000003, 0, 11228, 5781.5, 9110.300000000001, 9483.349999999999, 10872.96, 3.2299825064147454, 23.931476617591386, 0.41238423137075286], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 10, 66.66666666666667, 0.1], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: makeyka.herokuapp.com:443 failed to respond", 5, 33.333333333333336, 0.05], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 15, "503\/Service Unavailable", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: makeyka.herokuapp.com:443 failed to respond", 5, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["02.01 \/projects", 2500, 10, "503\/Service Unavailable", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["03.01 \/about", 2500, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: makeyka.herokuapp.com:443 failed to respond", 5, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
