web.init();
web.open('http://qcrm:5555/ALTSHULER/main.aspx');

web.pointJS('id=navTabLogoTextId')

web.clickHidden('//span[@class="navActionButtonLabel" and text()="תפעול"]')
web.click('//img[@alt=\'חדש\']');

web.pointJS('id=navTabModuleButtonTextId')
web.pause(1000)

web.click('//a[@id=\'rightNavLink\']/span/img')
web.pause(1000)

web.click('(//*[text()="מיני הצטרפויות ממוכנות"])[1]')
web.pause(2500)

web.click('//span[contains(text(), "חדש")]')
web.selectFrame('id=contentIFrame0')

web.waitForVisible('id=gen_documenttype')
web.pause(2500)
 
web.click('id=gen_documenttype')
web.pause(1000)

web.waitForVisible('//option[@title="בקשת הצטרפות לקופת גמל"]')
web.click('//option[@title="בקשת הצטרפות לקופת גמל"]')

web.click('//div[@id=\'gen_receivingdate\']/div[1]');
web.click('id=gen_receivingdate_iimg');
web.click('(//td[@onclick=\'ReturnDate(this);\'])[21]');

web.type('(//input[@id=\'DateInput\'])[2]', '17/03/2021');
web.click('//div[@id=\'gen_memberdeclaration\']/div[1]');
web.click('(//option[@value=\'1\'])[6]');

web.click('//div[@id=\'gen_estatetype\']/div[1]');
web.click('(//option[@value=\'1\'])[8]');
web.clickHidden('id=gen_estatetype')
web.pause(1000)

web.waitForVisible('//option[@title="שכיר"]')
web.click('//option[@title="שכיר"]')
web.click('id=gen_employername');
web.type('id=gen_employername_ledit', 'תת מודע');

web.sendKeys('\uE007')

web.click('(//ul[@id="gen_employername_i_IMenu"]//a)[2]')
web.click('id=gen_applicantidentitynumber')
web.waitForVisible('id=gen_applicantidentitynumber_i')

web.type('id=gen_applicantidentitynumber_i', '314488651')
web.sendKeys('\uE007')

if (web.isAlertPresent()) {
    web.alertAccept()
} else {
    web.pause(2500)
    web.alertAccept()
}

web.click('id=gen_gemeldefaultcourse')
web.type('id=gen_gemeldefaultcourse_i', '100')
web.sendKeys('\uE007')


web.click('id=gen_gemeldefaultcoursepension')
web.type('id=gen_gemeldefaultcoursepension_i', '100')
web.sendKeys('\uE007')

web.click('id=gen_accumulationmfrate')
web.type('id=gen_accumulationmfrate_i', '0.8')
web.sendKeys('\uE007')


web.click('id=gen_mfauthorizedapproval')
web.click('//select[@id="header_gen_senttoautomization_i"]//option[@title="כן"]')

web.click('id=gen_legalsuccessor')
web.click('//select[@id="gen_legalsuccessor_i"]//option[@title="כן"]')

web.click('id=gen_associatestatus')
web.click('//select[@id="gen_associatestatus_i"]//option[@title="פעיל"]')


web.click('id=gen_fundtype')
web.click('//img[@id="gen_fundtype_i"]')
web.click('(//ul[@id="gen_fundtype_i_IMenu"]//a)[2]')

 
web.click('id=gen_fundnumbersource')
web.type('id=gen_fundnumbersource_i', '7777')
web.sendKeys('\uE007')



web.click('id=gen_agentcontract')
web.type('id=gen_agentcontract_ledit', 'עמיאל דלית')
web.sendKeys('\uE007')

 

web.click('(//ul[@id="gen_agentcontract_i_IMenu"]//a)[2]')
web.click('id=gen_agentpoa')
web.type('id=gen_agentpoa_ledit', '059713545')
web.sendKeys('\uE007')

 

web.click('(//ul[@id="gen_agentpoa_i_IMenu"]//a)[2]')

 

web.click('id=gen_signaturedateofpowerofattorney')
web.type('//span[contains(text(), "תאריך חתימה על ייפוי כוח")]//..//..//..//input[@id="DateInput"]', '17/03/2021')
web.sendKeys('\uE007')

web.click('id=gen_signaturedate')
web.type('//span[contains(text(), "תאריך חתימת העמית")]//..//..//..//input[@id="DateInput"]', '17/03/2021')
web.sendKeys('\uE007')


web.click('id=gen_joiningsource')
web.click('//select[@id="gen_joiningsource_i"]/option[@title="סוכן"]')
web.click('id=gen_isstandingorderexists')
web.click('//select[@id="gen_isstandingorderexists_i"]/option[@title="לא"]')

web.selectWindow()
web.pause(5000)

web.click('(//span[contains(text(), "שמור")])[1]')
web.selectFrame('id=contentIFrame0')
web.waitForExist('//div[@id="footer_statecode" and @title="לא פעיל"]')
assert.equal(web.isVisible('//div[@id="footer_statecode" and @title="לא פעיל"]'), true)

web.pause(5000)
web.dispose('passed')


web.transaction('Delete')
web.init()
web.open('http://qcrm:5555/ALTSHULER/main.aspx#221845273');

web.pointJS('id=navTabLogoTextId')
web.clickHidden('//span[@class="navActionButtonLabel" and text()="תפעול"]')
web.click('//img[@alt=\'חדש\']')

web.pointJS('id=navTabModuleButtonTextId')

web.pause(1000)
web.click('//a[@id=\'rightNavLink\']/span/img')

web.pause(1000)
web.click('(//*[text()="מיני הצטרפויות ממוכנות"])[1]')

web.selectFrame('id=contentIFrame1')
web.click('//nobr[text()="314488651"]')
web.selectWindow()

web.click('//span[contains(text(), "מחק")]')
web.selectFrame('id=InlineDialog_Iframe')

web.click('id=butBegin')
web.pause(5000)