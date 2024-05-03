import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
import json

url = "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/cfemail.html" # The URL to retrieve emails from
emails = []

# Send an HTTP GET request to the URL
response = requests.get(url, verify=False)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Retrieveing the first column of the table with emails
    column = soup.select('td:first-child')

    # Matching only dates
    pattern = r"\d+/\d+/\d+"

    for cell in column:
        valid_date_found = re.search(pattern, cell.text)
        
        if valid_date_found:
            date = valid_date_found.group()
            email_cell = cell.find_next_sibling()
            email = email_cell.text
            
            emails.append({"date": date, "body": email})
else:
    print("Failed to retrieve the webpage. Status code:", response.status_code)


# May 6 is my start date
# Jan 29 is the original class start date
my_start_date = "05/06/24"
class_start_date = "01/29/24"
my_start_date_object = datetime.strptime(my_start_date, "%m/%d/%y")
class_start_date_object = datetime.strptime(class_start_date, "%m/%d/%y")

# Updating the date for each email
for i in range(len(emails)):
    # Original email ate
    email_date = emails[i]["date"]
    original_date = datetime.strptime(email_date, "%m/%d/%y")

    # Update amount
    course_start_difference = original_date - class_start_date_object

    # New email date
    new_date = my_start_date_object + course_start_difference
    date_string = new_date.strftime("%m/%d/%y")

    emails[i]["date"] = date_string

print(json.dumps(emails))
