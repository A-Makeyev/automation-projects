// account sid, auth token
twilio.init('xxxxxxxx', 'xxxxxxxx');

// registered number
var twilioNumber = '+9725555555'

// remove sms on read, wait for sms to arrive, not older than
var sms = twilio.getLastSms(false, 30 * 1000, 30 * 1000);
log.info(sms)