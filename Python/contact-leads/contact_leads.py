import os
import smtplib
import mimetypes
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from dotenv import load_dotenv

load_dotenv()

EXCEL_FILE = "Data/leads.xlsx"
TEAM_IMAGE = "Images/team.png"
LOGO_IMAGE = "Images/logo.png"

SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SENDER_PHONE = os.getenv("SENDER_PHONE")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_APP_PASSWORD = os.getenv("SENDER_APP_PASSWORD")
BCC_EMAIL = os.getenv("BCC_EMAIL")

EMAIL_SUBJECT = "Great to Meet You at Selenium + Appium Conf 2025!"
EMAIL_TEMPLATE = """\
<html>
    <body>
        <p>Dear {Name},</p>
        
        <p>I hope you had a fantastic time at Selenium + Appium Conf 2025 last week!</p>
        <p>It was a pleasure meeting you at our booth and chatting about the exciting developments in the test automation field. </p>
        
        <div>
            <img src="cid:team" width="500" />
        </div>
        
        <p>I wanted to follow up and share more about CloudBeat, our Continuous Integration and Analytics platform designed to enhance efficiency and stability in automated testing.</p>
        <p>If you're interested, I'd be happy to arrange a quick demo to show how CloudBeat could support your testing processes.</p>
        <p>Feel free to let me know if next week or the week after works for you, or suggest a time that’s convenient?</p>
        <p>By the way, I hope your Selenium Hero t-shirt fits perfectly!</p>
        <p>Looking forward to staying in touch.</p>
        
        <p>
            Best regards,
            <br>
            Anatoly Makeyev
            <br>
            Automation Engineer 
            <br>
            <div>
                <img src="cid:logo" width="150" />
            </div>
            <span>
                <a href="https://cloudbeat.io">cloudbeat.io</a>
            </span>
            <br>
            <span>
                <a href="https://api.whatsapp.com/send?phone=972527729974">+972-52-7729974</a>
            </span>
        </p>
    </body>
</html>
"""

# Load leads from excel
try:
    df = pd.read_excel(EXCEL_FILE)
except Exception as e:
    print(f"❌  Error loading Excel file: {e}")
    exit(1)

# Connect to SMTP server
try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
except smtplib.SMTPAuthenticationError:
    print("❌  Authentication failed. Check your email/password or enable 'Less secure apps' in Gmail settings")
    exit(1)
except Exception as e:
    print(f"❌  Error connecting to SMTP server: {e}")
    exit(1)

# Send emails
if BCC_EMAIL:
    print(f"🛈  Include bcc to -> {BCC_EMAIL}")
            
for _, row in df.iterrows():
    try:
        recipient_name = row["Name"]
        recipient_email = row["Email"]
        email_body = EMAIL_TEMPLATE.format(Name=recipient_name)

        msg = MIMEMultipart("related")
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient_email
        msg["Subject"] = EMAIL_SUBJECT

        if BCC_EMAIL:
            msg["Bcc"] = BCC_EMAIL 

        msg.attach(MIMEText(email_body, "html"))

        for img_path, cid in [(LOGO_IMAGE, "logo"), (TEAM_IMAGE, "team")]:
            try:
                mime_type, _ = mimetypes.guess_type(img_path)
                if mime_type is None:
                    raise ValueError(f"Could not determine MIME type for {img_path}")
                
                with open(img_path, "rb") as img_file:
                    img = MIMEImage(img_file.read(), _subtype=mime_type.split("/")[1]) 
                    img.add_header("Content-ID", f"<{cid}>")
                    img.add_header("Content-Disposition", "inline", filename=os.path.basename(img_path))
                    msg.attach(img)
            except (FileNotFoundError, ValueError) as e:
                print(f"⚠️  Image file '{img_path}' not found or error determining MIME type: {e}. Email sent without this image")

        recipients = [recipient_email]
        if BCC_EMAIL:
            recipients.append(BCC_EMAIL)

        server.sendmail(SENDER_EMAIL, recipients, msg.as_string())
        print(f"✔️  Email sent to -> {recipient_email}")

    except Exception as e:
        print(f"❌  Error sending email to -> {recipient_email}: {e}")

server.quit()
