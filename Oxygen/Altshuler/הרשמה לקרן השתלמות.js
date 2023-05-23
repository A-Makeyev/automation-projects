web.transaction('01. Initialize')
web.init();

web.transaction('02. Open Main Page')
web.open('https://www.as-invest.co.il/');

web.transaction('03. Open Join Page')
web.click('(//a//p[contains(text(), "הצטרפויות דיגיטליות")])[2]');
web.selectWindow('title=הצטרפו אלינו בדיגיטל - קל, פשוט ומהיר');

web.click('//span/span[2]');
web.selectWindow('title=EasySend');

web.transaction('04. Type Customer Details')
web.click('//div[3]/div[1]/div/md-input-container/input');

web.type('//div[3]/div[1]/div/md-input-container/input', 'בודק');
web.click('//div[3]/div[2]/div/md-input-container/input');
web.type('//div[3]/div[2]/div/md-input-container/input', 'בדיקה');
web.click('//div[4]/div[1]/div/md-input-container/input');

 

//               id: id=input-ember555

// xpath:attributes: //input[@id=\'input-ember555\']

// xpath:idRelative: //md-input-container[@id=\'ember555\']/input

//   xpath:position: //div[4]/div[1]/div/md-input-container/input

//              css: css=#input-ember555

web.type('//div[4]/div[1]/div/md-input-container/input', '0520000000');

 

//               id: id=input-ember558

// xpath:attributes: //input[@id=\'input-ember558\']

// xpath:idRelative: //md-input-container[@id=\'ember558\']/input

//   xpath:position: //div[4]/div[2]/div/md-input-container/input

//              css: css=#input-ember558

web.click('//div[4]/div[2]/div/md-input-container/input');

 

//               id: id=input-ember558

// xpath:attributes: //input[@id=\'input-ember558\']

// xpath:idRelative: //md-input-container[@id=\'ember558\']/input

//   xpath:position: //div[4]/div[2]/div/md-input-container/input

//              css: css=#input-ember558

web.type('//div[4]/div[2]/div/md-input-container/input', 'eran@gmail.con');

 

// xpath:idRelative: //div[@id=\'ember575\']/div

//   xpath:position: //table/tr/td/div/div

//              css: css=#ember575 > div

web.click('//table/tr/td/div/div');

 

//               id: id=input-ember603

// xpath:attributes: //input[@id=\'input-ember603\']

// xpath:idRelative: //md-input-container[@id=\'ember603\']/input

//   xpath:position: //div[3]/md-input-container/input

//              css: css=#input-ember603

web.click('//div[3]/md-input-container/input');

 

//               id: id=input-ember603

// xpath:attributes: //input[@id=\'input-ember603\']

// xpath:idRelative: //md-input-container[@id=\'ember603\']/input

//   xpath:position: //div[3]/md-input-container/input

//              css: css=#input-ember603

web.type('//div[3]/md-input-container/input', '0000018');




// xpath:idRelative: //md-select-value[@id=\'ember1005\']/span[1]

//   xpath:position: //md-input-container[1]/md-select/md-select-value/span[1]

//              css: css=#ember1005 > span:nth-child(1)

web.click('//md-input-container[1]/md-select/md-select-value/span[1]');

 

// xpath:idRelative: //md-option[@id=\'ember1163\']/div[1]

//   xpath:position: //md-option[16]/div[1]

//              css: css=#ember1163 > div.md-text

web.click('//md-option[16]/div[1]');

 

//               id: id=ember1008

// xpath:attributes: //md-select-value[@id=\'ember1008\']

// xpath:idRelative: //md-select[@id=\'ember1007\']/md-select-value

//   xpath:position: //md-input-container[2]/md-select/md-select-value

//              css: css=#ember1008

web.click('//md-input-container[2]/md-select/md-select-value');

 

//               id: id=ember1236

// xpath:attributes: //md-option[@id=\'ember1236\']

// xpath:idRelative: //md-content[@id=\'ember1235\']/md-option[1]

//   xpath:position: //md-option[1]

//              css: css=#ember1236

web.click('//md-option[1]');

 

//               id: id=ember1011

// xpath:attributes: //md-select-value[@id=\'ember1011\']

// xpath:idRelative: //md-select[@id=\'ember1010\']/md-select-value

//   xpath:position: //md-input-container[3]/md-select/md-select-value

//              css: css=#ember1011

web.click('//md-input-container[3]/md-select/md-select-value');

 

// bug with date

web.pause(1000)

web.clickHidden('//md-option[contains(@id, "ember")]//div[text()="1"]');

web.sendKeys('\uE007')

 

// xpath:idRelative: //div[@id=\'ember1014\']/div/table/tbody/tr/td[2]/div[2]/img

//   xpath:position: //div[2]/img

//              css: css=#ember1014 > div > table > tbody > tr > td.boxes > div.picker-option.selected > img

web.click('//div[2]/img');

 

// yeshuv

 

//               id: id=input-ember1022

// xpath:attributes: //input[@id=\'input-ember1022\']

// xpath:idRelative: //md-input-container[@id=\'ember1022\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input

//              css: css=#input-ember1022

web.click('//div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input');

 

//               id: id=input-ember1022

// xpath:attributes: //input[@id=\'input-ember1022\']

// xpath:idRelative: //md-input-container[@id=\'ember1022\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input

//              css: css=#input-ember1022

web.type('//div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input', 'ירושלים');

 

// xpath:idRelative: //div[@id=\'eac-container-input-ember1022\']/ul/li/div/b

//   xpath:position: //b

//              css: css=#eac-container-input-ember1022 > ul > li > div > b

web.click('//b');

 

//               id: id=input-ember1026

// xpath:attributes: //input[@id=\'input-ember1026\']

// xpath:idRelative: //md-input-container[@id=\'ember1026\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input

//              css: css=#input-ember1026

web.click('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input');

 

//               id: id=input-ember1026

// xpath:attributes: //input[@id=\'input-ember1026\']

// xpath:idRelative: //md-input-container[@id=\'ember1026\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input

//              css: css=#input-ember1026

web.type('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input', 'הרצל');

 

//               id: id=input-ember1029

// xpath:attributes: //input[@id=\'input-ember1029\']

// xpath:idRelative: //md-input-container[@id=\'ember1029\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input

//              css: css=#input-ember1029

web.click('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input');

 

//               id: id=input-ember1029

// xpath:attributes: //input[@id=\'input-ember1029\']

// xpath:idRelative: //md-input-container[@id=\'ember1029\']/input

//   xpath:position: //div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input

//              css: css=#input-ember1029

web.type('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input', '30');

 

// xpath:idRelative: //div[@id=\'ember1051\']/div

//   xpath:position: //div[2]/div/div[3]/div

//              css: css=#ember1051 > div

web.click('//div[2]/div/div[3]/div');

 

// xpath:idRelative: //div[@id=\'ember704\']/div

//   xpath:position: //td[1]/div/div

//              css: css=#ember704 > div

web.click('//td[1]/div/div');

 

// מצב תעסוקתי

 

// xpath:idRelative: //div[@id=\'ember1457\']/div

//   xpath:position: //div[3]/div/div[1]/div/div[2]/div

//              css: css=#ember1457 > div

web.click('//div[3]/div/div[1]/div/div[2]/div');

 

// xpath:idRelative: //div[@id=\'ember704\']/div

//   xpath:position: //td[1]/div/div

//              css: css=#ember704 > div

web.click('//td[1]/div/div');




// xpath:idRelative: //md-checkbox[@id=\'ember1479\']/div[1]

//   xpath:position: //div[5]/div/div/div[1]/span/md-checkbox/div[1]

//              css: css=#ember1479 > div.md-container

web.click('//div[5]/div/div/div[1]/span/md-checkbox/div[1]');

 

//               id: id=input-ember1528

// xpath:attributes: //input[@id=\'input-ember1528\']

// xpath:idRelative: //md-input-container[@id=\'ember1528\']/input

//   xpath:position: //input

//              css: css=#input-ember1528

web.click('//input');

 

//               id: id=input-ember1528

// xpath:attributes: //input[@id=\'input-ember1528\']

// xpath:idRelative: //md-input-container[@id=\'ember1528\']/input

//   xpath:position: //input

//              css: css=#input-ember1528

web.type('//input', '50');

 

// xpath:idRelative: //md-checkbox[@id=\'ember1489\']/div[1]

//   xpath:position: //div[6]/div/div/div[1]/span/md-checkbox/div[1]

//              css: css=#ember1489 > div.md-container

web.click('//div[6]/div/div/div[1]/span/md-checkbox/div[1]');

 

//               id: id=input-ember1532

// xpath:attributes: //input[@id=\'input-ember1532\']

// xpath:idRelative: //md-input-container[@id=\'ember1532\']/input

//   xpath:position: //div[6]/div[2]/div/md-input-container/input

//              css: css=#input-ember1532

web.click('//div[6]/div[2]/div/md-input-container/input');

 

//               id: id=input-ember1532

// xpath:attributes: //input[@id=\'input-ember1532\']

// xpath:idRelative: //md-input-container[@id=\'ember1532\']/input

//   xpath:position: //div[6]/div[2]/div/md-input-container/input

//              css: css=#input-ember1532

web.type('//div[6]/div[2]/div/md-input-container/input', '30');

 

// xpath:idRelative: //md-checkbox[@id=\'ember1499\']/div[1]

//   xpath:position: //div[7]/div/div/div[1]/span/md-checkbox/div[1]

//              css: css=#ember1499 > div.md-container

web.click('//div[7]/div/div/div[1]/span/md-checkbox/div[1]');

 

//               id: id=input-ember1536

// xpath:attributes: //input[@id=\'input-ember1536\']

// xpath:idRelative: //md-input-container[@id=\'ember1536\']/input

//   xpath:position: //div[7]/div[2]/div/md-input-container/input

//              css: css=#input-ember1536

web.click('//div[7]/div[2]/div/md-input-container/input');

 

//               id: id=input-ember1536

// xpath:attributes: //input[@id=\'input-ember1536\']

// xpath:idRelative: //md-input-container[@id=\'ember1536\']/input

//   xpath:position: //div[7]/div[2]/div/md-input-container/input

//              css: css=#input-ember1536

web.type('//div[7]/div[2]/div/md-input-container/input', '10');

 

// xpath:idRelative: //md-checkbox[@id=\'ember1517\']/div[1]

//   xpath:position: //div[10]/div/div/div[1]/span/md-checkbox/div[1]

//              css: css=#ember1517 > div.md-container

web.click('//div[10]/div/div/div[1]/span/md-checkbox/div[1]');

 
//               id: id=input-ember1540

// xpath:attributes: //input[@id=\'input-ember1540\']

// xpath:idRelative: //md-input-container[@id=\'ember1540\']/input

//   xpath:position: //div[10]/div[2]/div/md-input-container/input

//              css: css=#input-ember1540

web.click('//div[10]/div[2]/div/md-input-container/input');

web.type('//div[10]/div[2]/div/md-input-container/input', '10');

web.click('//td[1]/div/div');
web.type('//input', '5500')

web.click('//span[text()="שנה"]')
web.pause(1000)
web.click('//md-option[contains(@id, "ember")]//div[text()="2023"]')

web.click('//span[text()="חודש"]')
web.pause(1000)
web.click('//md-option[contains(@id, "ember")]//div[text()="1"]')

web.click('//span[text()="יום"]')
web.pause(1000)
web.click('//md-option[contains(@id, "ember")]//div[text()="1"]')

web.click('//td[1]/div/div')

web.click('//div[text()="לא"]')
web.click('//td[1]/div/div')

web.click('//div[text()="לא"]')
web.click('//td[1]/div/div')

web.click('(//div[@class="md-icon"])[1]')
web.click('(//div[@class="md-icon"])[2]')
web.click('(//div[@class="md-icon"])[3]')
web.click('//td[1]/div/div')


// חתימה

web.execute(() => {
    document.querySelector('canvas').click()
    var cx = document.querySelector('canvas').getContext('2d')
    cx.createPattern
    cx.beginPath()
    cx.moveTo(50, 20)
    cx.lineTo(60, 70)
    cx.lineTo(100, 30)
    cx.lineTo(30, 130)
    cx.lineTo(130, 50)
    cx.lineTo(50, 170)
    cx.stroke()  
})

web.pause(1000)
web.click('//td[1]/div/div')

web.transaction('Upload File')
web.open('https://easysend.as-invest.co.il/new-join2/8')

web.fileBrowse(
    '//input[@class="file-input"]',
    'C:\\Users\\Makeyev\\Desktop\\test-automation\\OXYGEN\\Altshuler\\data\\brand.jpg'
)

web.refresh()

web.assertTextPresent('צורף בהצלחה')
web.pause(1000)

web.transaction('Finish Form')
web.click('//td[1]/div/div')

web.pause(1000)
assert.equal(web.isExist('//div[@class="form-frame"]'), true)

web.scrollToElement('(//div[@class="pub-button"])[1]')
web.click('(//div[@class="pub-button"])[1]')


web.transaction('Assert Form Sent')
web.waitForVisible('//span[contains(text(), "הטופס נשלח בהצלחה! תודה רבה!")]')

web.waitForVisible('//div[contains(text(), "תודה")]')
web.assertTextPresent('נשמח לעמוד לרשותך לכל שאלה ולכל בקשה')

web.pause(5000)