mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

const el1 = mob.findElement("xpath://android.widget.TextView[@text=\"staging\"]");
mob.click(el1);
const el2 = mob.findElement("xpath://android.widget.TextView[@text=\"GO!\"]");
mob.click(el2);
const el3 = mob.findElement("accessibility id:מספר נייד ");
mob.type(el3, "0501111111");
const el4 = mob.findElement("accessibility id:שדה קלט ראשון");
mob.type(el4, "1123");
const el5 = mob.findElement("xpath://android.widget.TextView[@text=\"הבא\"]");
mob.click(el5);
const el6 = mob.findElement("xpath://android.widget.TextView[@text=\"לדף הבית\"]");
mob.click(el6);
const el7 = mob.findElement("xpath://android.widget.Button[@content-desc=\"תדלוק בקליק\"]/android.widget.ImageView");
mob.click(el7);
mob.type('//android.widget.EditText[@text="שם תחנה או ישוב"]', '')