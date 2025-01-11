const braini = po.braini

web.transaction('01. אתחול סלניום')
web.init()

web.transaction('02. כניסה לעמוד הראשי')
web.open(braini.url)

web.transaction('03. פתיחת חלון יחידות - ארצי מחוזי')
braini.mainPage.loadWindow('יחידות - ארצי ומחוזי')

web.transaction('04. פתיחת חלון - רישום ורישוי מוצרים')
braini.mainPage.loadWindow('רישום ורישוי מוצרים')

web.transaction('05. פתיחת חלון - הסמכה תעודות ובחינות')
braini.mainPage.loadWindow('הסמכה תעודות ובחינות')

web.transaction('06. פתיחת חלון - מרב"ד')
braini.mainPage.loadWindow('מרב"ד')

web.transaction('07. פתיחת חלון - הנחיות, רכש, רקמות, קנאביס')
braini.mainPage.loadWindow('הנחיות, רכש, רקמות, קנאביס')

web.transaction('08. פתיחת חלון - חיסונים')
braini.mainPage.loadWindow('חיסונים')

web.dispose('Passed')