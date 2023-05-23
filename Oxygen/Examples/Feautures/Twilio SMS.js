// account sid, auth token
twilio.init('ACc8436076f3c672d581bd0a58b819340c', 'b67eef518536e1d9702a19e78aa0fee2');

// registered number
var twilioNumber = '+972526259586'

// remove sms on read, wait for sms to arrive, not older than
var sms = twilio.getLastSms(false, 30 * 1000, 30 * 1000);
log.info(sms)