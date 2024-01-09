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
web.type('//div[4]/div[1]/div/md-input-container/input', '0520000000');
web.click('//div[4]/div[2]/div/md-input-container/input');
web.type('//div[4]/div[2]/div/md-input-container/input', 'eran@gmail.com');
web.click('//table/tr/td/div/div');
web.click('//div[3]/md-input-container/input');
web.type('//div[3]/md-input-container/input', '0000018');
web.click('//md-input-container[1]/md-select/md-select-value/span[1]');
web.click('//md-option[16]/div[1]');
web.click('//md-input-container[2]/md-select/md-select-value');
web.click('//md-option[1]');
web.click('//md-input-container[3]/md-select/md-select-value');

 
web.pause(1000)
web.clickHidden('//md-option[contains(@id, "ember")]//div[text()="1"]');
web.sendKeys('\uE007')
web.click('//div[2]/img');

web.click('//div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input');
web.type('//div[5]/table/tbody/tr[1]/td[2]/div[3]/div/div/md-input-container/input', 'ירושלים');
web.click('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input');
web.type('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[1]/div/md-input-container/input', 'הרצל');
web.click('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input');
web.type('//div[5]/table/tbody/tr[1]/td[2]/div[4]/div[2]/div/md-input-container/input', '30');
web.click('//div[2]/div/div[3]/div');
web.click('//td[1]/div/div');
web.click('//div[3]/div/div[1]/div/div[2]/div');
web.click('//td[1]/div/div');
web.click('//div[5]/div/div/div[1]/span/md-checkbox/div[1]');

web.click('//input');
web.type('//input', '50');
web.click('//div[6]/div/div/div[1]/span/md-checkbox/div[1]');
web.click('//div[6]/div[2]/div/md-input-container/input');
web.type('//div[6]/div[2]/div/md-input-container/input', '30');
web.click('//div[7]/div/div/div[1]/span/md-checkbox/div[1]');
web.click('//div[7]/div[2]/div/md-input-container/input');
web.type('//div[7]/div[2]/div/md-input-container/input', '10');
web.click('//div[10]/div/div/div[1]/span/md-checkbox/div[1]');
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