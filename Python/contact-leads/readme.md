# How to Install Dependencies
First, create a virtual environment:

python -m venv venv

## Activate the environment:

### Windows:
venv\Scripts\activate

### Mac/Linux:
source venv/bin/activate

### Install dependencies:
pip install -r requirements.txt

## How to adust
1. Create a .env file, adjust, sender port, server, email, app password and an email to bcc (optional).

```
SMTP_PORT = SMTP_PORT
SMTP_SERVER = "SMTP_SERVER"
SENDER_EMAIL = "SENDER_EMAIL"
SENDER_APP_PASSWORD = "SENDER_PASSWORD"
BCC_EMAIL = "BCC_EMAIL"
```

2. Adjust your file names, and edit EMAIL_SUBJECT, EMAIL_TEMPLATE for your usage.

```
EXCEL_FILE = "Data/leads.xlsx"
LOGO_IMAGE = "Images/logo.png"
TEAM_IMAGE = "Images/team.png"
```
# How to run

### Windows:
venv\Scripts\activate

### Mac/Linux:
source venv/bin/activate

```
python contact_leads.py
```
