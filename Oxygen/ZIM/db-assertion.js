web.transaction('Connecting to database');
db.setConnectionString('Driver={SQL Server};Server=DESKTOP-KDQHUS7\\SQLEXPRESS;Database=Vessels;Trusted_Connection=Yes');
log.info('>>> Connected to Database');

db.executeNonQuery("UPDATE Vessel SET VesselName = 'Msc Jeongmin (JM2)', IMOCode = 9720471, Voyage = 4, Direction = 'N', EUPort = 'Test', CurrentETA = '2020-05-27T12:00:00' WHERE ID = 10");
var vesselName = db.getScalar('SELECT VesselName FROM Vessel WHERE Voyage=15');
log.info(vesselName);

var vesselTable = db.executeQuery('SELECT * FROM Vessel');
log.info(vesselTable);

// fixes the date from DB
function fixDate(date) {
    let day, month, year;
    day = date.substr(8, date.length - 1); 
    month = date.substring(5, 7);
    year = date.substr(0, 4);
    return `${day}/${month}/${year} 12:00`
}

web.transaction('Initializing');
const mainPage = 'https://www.zim.com';

web.init();
web.setTimeout(5000);
web.open(`${mainPage}/schedules`);

web.transaction('Accepting cookies');
const cookieButton = '//button[@title="I Agree"]';
if (web.isVisible(cookieButton)) {
    web.waitForExist(cookieButton);
    web.click(cookieButton);
}

web.transaction('Opening vessel data table');
const EU24Vessels = '//figcaption[contains(text(), "ETA for EU24 Vessels")]';
web.waitForExist(EU24Vessels);
web.click(EU24Vessels);

web.waitForExist('//div[@class="container for-footer-bottom"]');
web.pause(1000);

web.transaction('Receiving data from the page and asserting if it matches the database');
var passedValues = 0;
function assertRows(pageRow, dbRow) {
                                    /* * * VESSEL NAME * * */
    let vesselName = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="VesselName"]`);
    let DB_vesselName = db.getScalar(`SELECT VesselName FROM Vessel WHERE ID = ${dbRow}`);
    if (vesselName != DB_vesselName) {
        assert.fail(`${vesselName} from page doesn't equal ${DB_vesselName} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
                                    /* * * IMO CODE * * */
    let imoCode = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="VesselLoids"]`);
    let DB_imoCode = db.getScalar(`SELECT IMOCode FROM Vessel WHERE ID = ${dbRow}`);
    if (imoCode != DB_imoCode) {
        assert.fail(`${imoCode} from page doesn't equal ${DB_imoCode} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
                                    /* * * VOYAGE * * */
    let voyage = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="VoyageNo"]`);
    let DB_voyage = db.getScalar(`SELECT Voyage FROM Vessel WHERE ID = ${dbRow}`);
    if (voyage != DB_voyage) {
        assert.fail(`${voyage} from page doesn't equal ${DB_voyage} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
                                    /* * * DIRECTION * * */
    let direction = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="Direction"]`);
    let DB_direction = db.getScalar(`SELECT Direction FROM Vessel WHERE ID = ${dbRow}`);
    if (direction != DB_direction) {
        assert.fail(`${direction} from page doesn't equal ${DB_direction} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
                                    /* * * EU PORT * * */
    let euPort = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="PortOfCall"]`);
    let DB_euPort = db.getScalar(`SELECT EUPort FROM Vessel WHERE ID = ${dbRow}`);
    if (euPort != DB_euPort) {
        assert.fail(`${euPort} from page doesn't equal ${DB_euPort} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
                                    /* * * CURRENT ETA * * */
    let currentETA = web.getText(`(//tr[@class="grid-row "])[${pageRow}]//td[@data-name="CurrentDate"]`);
    let DB_currentETA = db.getScalar(`SELECT CurrentETA FROM Vessel WHERE ID = ${dbRow}`);
    if (currentETA != fixDate(DB_currentETA)) {
        assert.fail(`${currentETA} from page doesn't equal ${fixDate(DB_currentETA)} from database at row: ${dbRow}`);
    } else {
        passedValues++;
    }
}

for (let pageRow = 1, dbRow = 1; pageRow <= 10; pageRow++, dbRow++) {
    assertRows(pageRow, dbRow);
    log.info(`>>> Row ${pageRow} passed`);
}

passedValues == 60 ? log.info('All rows are equal') : assert.fail(`Only ${passedValues} from 10 rows are equal`);
web.dispose();

// web.transaction('Receiving data from the page');
// var table = [];
// for (let row = 1; row <= 10; row++) {
//     let id = row;
//     let vesselName = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="VesselName"]`);
//     let imoCode = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="VesselLoids"]`);
//     let voyage = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="VoyageNo"]`);
//     let direction = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="Direction"]`);
//     let euPort = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="PortOfCall"]`);
//     let currentETA = web.getText(`(//tr[@class="grid-row "])[${row}]//td[@data-name="CurrentDate"]`);

//     let vessel = [id, vesselName, imoCode, voyage, direction, euPort, currentETA];
//     table.push(vessel);
// }

// const firstRowID = table[0][0];
// const firstRow = table[0];
// log.info('First row:');
// log.info(firstRow);


// web.execute(() => {
//     alert('Asserting data...');
// });


// web.transaction('Connecting to database');
// db.setConnectionString('Driver={SQL Server};Server=DESKTOP-KDQHUS7\\SQLEXPRESS;Database=Vessels;Trusted_Connection=Yes');
// log.info('>>> Connected to Database');

// // var vesselTable = db.executeQuery('SELECT * FROM Vessel');
// // log.info(vesselTable);

// function assertRow(rowID) {
//     let vesselName = db.getScalar(`SELECT VesselName FROM Vessel WHERE ID = ${rowID}`);
//     if (vesselName === table[rowID][1]) {
//         log.info(`${vesselName} from the database equals ${table[rowID][1]} from the page`);
//     } else {
//         assert.fail(`${vesselName} from the database doesn't equal ${table[rowID][1]} from the page`);
//     }

//     let imoCode = db.getScalar(`SELECT IMOCode FROM Vessel WHERE ID = ${rowID}`);
//     log.info(imoCode);

//     let voyage = db.getScalar(`SELECT Voyage FROM Vessel WHERE ID = ${rowID}`);
//     log.info(voyage);

//     let direction = db.getScalar(`SELECT Direction FROM Vessel WHERE ID = ${rowID}`);
//     log.info(direction);

//     let euPort = db.getScalar(`SELECT EUPort FROM Vessel WHERE ID = ${rowID}`);
//     log.info(euPort);

//     let currentETA = db.getScalar(`SELECT CurrentETA FROM Vessel WHERE ID = ${rowID}`);
//     log.info(fixDate(currentETA));
// }

// log.info(assertRow(firstRowID));

// function fixDate(date) {
//     let day, month, year;
//     day = date.substr(8, date.length - 1); 
//     month = date.substring(5, 7);
//     year = date.substr(0, 4);
//     return `${day}/${month}/${year} 12:00`
// }