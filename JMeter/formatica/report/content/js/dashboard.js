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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 55.61606535057862, "KoPercent": 44.38393464942138};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1834581347855684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5922818791946308, 500, 1500, "new_customer_button"], "isController": false}, {"data": [0.00423728813559322, 500, 1500, "new_customer_link"], "isController": false}, {"data": [0.0, 500, 1500, "NEW_CUSTOMER_MAIN"], "isController": false}, {"data": [0.0213903743315508, 500, 1500, "ws_Dynamic_Invoice"], "isController": false}, {"data": [0.0, 500, 1500, "ws_Digital_paka"], "isController": false}, {"data": [0.28225806451612906, 500, 1500, "ws_memir_Dynamic_Invoice"], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "document_simple_63"], "isController": false}, {"data": [0.0058823529411764705, 500, 1500, "document_simple_pdf_62"], "isController": false}, {"data": [0.0, 500, 1500, "document_simple_62"], "isController": false}, {"data": [0.0, 500, 1500, "document_simple_pdf_63"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1469, 652, 44.38393464942138, 171685.07079646006, 15, 573388, 359894.0, 412570.0, 539905.3, 1.3064629450111613, 45.02273605574256, 1.6647524104308036], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["new_customer_button", 298, 97, 32.5503355704698, 84985.88255033556, 15, 360020, 299857.3, 299907.1, 359966.03, 0.2777658676082122, 0.5160458214063341, 0.21863211844943262], "isController": false}, {"data": ["new_customer_link", 118, 98, 83.05084745762711, 219417.5254237289, 1467, 359983, 299900.7, 299985.1, 359980.53, 0.10618548444427647, 0.920995974850238, 0.10732614882795523], "isController": false}, {"data": ["NEW_CUSTOMER_MAIN", 116, 99, 85.34482758620689, 223900.5431034482, 2436, 359919, 299903.7, 299961.4, 359915.43, 0.1031652155352585, 0.07062036979393638, 0.44973586147401745], "isController": false}, {"data": ["ws_Dynamic_Invoice", 187, 10, 5.347593582887701, 130118.0588235295, 764, 280108, 240276.8, 277538.6, 280060.48, 0.17471589980089863, 8.587216949439368, 0.1407833070870188], "isController": false}, {"data": ["ws_Digital_paka", 120, 101, 84.16666666666667, 217464.2666666666, 1660, 359954, 299914.5, 299987.7, 359954.0, 0.10774430122433441, 11.369388577184875, 0.15088410933173393], "isController": false}, {"data": ["ws_memir_Dynamic_Invoice", 310, 16, 5.161290322580645, 78304.70322580644, 129, 280154, 224194.0, 279665.9, 280094.9, 0.2900204885441907, 0.2888949049949012, 0.3035238366436209], "isController": false}, {"data": ["document_simple_63", 75, 62, 82.66666666666667, 319852.13333333336, 1338, 573353, 539898.2, 539920.0, 573353.0, 0.07586332463433879, 1.1181849051582002, 0.08771696910845421], "isController": false}, {"data": ["document_simple_pdf_62", 85, 56, 65.88235294117646, 304920.67058823525, 1321, 558568, 441477.8, 539847.8, 558568.0, 0.07678014772500422, 13.641492855607254, 0.08840214274197264], "isController": false}, {"data": ["document_simple_62", 74, 61, 82.43243243243244, 326477.4054054053, 2639, 573388, 539894.0, 539930.0, 573388.0, 0.06893031331621875, 0.6833848923150152, 0.07956604525368219], "isController": false}, {"data": ["document_simple_pdf_63", 86, 52, 60.46511627906977, 305198.8720930232, 1938, 557760, 436422.0, 465172.54999999976, 557760.0, 0.07775395934914511, 8.918269831158632, 0.08967522069466832], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4, 0.6134969325153374, 0.27229407760381213], "isController": false}, {"data": ["500\/Internal Server Error", 628, 96.31901840490798, 42.7501701837985], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to informitapptst:7333 [informitapptst\\\/10.23.10.45] failed: Connection timed out: connect", 1, 0.15337423312883436, 0.06807351940095303], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 19, 2.914110429447853, 1.2933968686181077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1469, 652, "500\/Internal Server Error", 628, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 19, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to informitapptst:7333 [informitapptst\\\/10.23.10.45] failed: Connection timed out: connect", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["new_customer_button", 298, 97, "500\/Internal Server Error", 97, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["new_customer_link", 118, 98, "500\/Internal Server Error", 98, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NEW_CUSTOMER_MAIN", 116, 99, "500\/Internal Server Error", 99, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ws_Dynamic_Invoice", 187, 10, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 6, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, "500\/Internal Server Error", 2, null, null, null, null], "isController": false}, {"data": ["ws_Digital_paka", 120, 101, "500\/Internal Server Error", 101, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ws_memir_Dynamic_Invoice", 310, 16, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 13, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to informitapptst:7333 [informitapptst\\\/10.23.10.45] failed: Connection timed out: connect", 1, null, null, null, null], "isController": false}, {"data": ["document_simple_63", 75, 62, "500\/Internal Server Error", 62, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["document_simple_pdf_62", 85, 56, "500\/Internal Server Error", 56, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["document_simple_62", 74, 61, "500\/Internal Server Error", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["document_simple_pdf_63", 86, 52, "500\/Internal Server Error", 52, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
