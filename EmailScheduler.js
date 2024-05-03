// Send scheduled emails
function sendScheduledEmail() {
    // Getting the list of scheduled emails
    const store = PropertiesService.getScriptProperties();
    const propertyName = "emailSchedule";
    const emailsString= store.getProperty(propertyName) || "[]";
    const emailsArray = JSON.parse(emailsString);
  
    if(!emailsArray.length) {
      console.log("Nothing left to send");
      return;
    }
  
    const currentDate = Date.now();
    const recipient = "eric.buys02@gmail.com";
    const subject_base = "CF*101 Class Update";
    let emailCounter = 1
  
    const emailsLeftToSend = emailsArray.filter(email => {
      const { 
        date,
        body
      } = email;
  
      const sendDate = parseDate(date)
  
      if (currentDate > sendDate) {
        console.log("EMAIL SENT")
        let subject = subject_base
        if (emailCounter > 1) {
          subject += " " + emailCounter
        }
        emailCounter++;
  
        GmailApp.sendEmail(recipient, subject, body);
        return false;
      }
      return true;
    });
    
    // Updating the remaining scheduled emails
    store.setProperty(propertyName, JSON.stringify(emailsLeftToSend));
  }
  
  // Initialize a list of scheduled emails and create a trigger to send emails
  function initializeScheduledEmails() {
    try {
      // Initialize the emails to send
      const emailArray = [];
      // Storing the emails to be sent as properties
      const store = PropertiesService.getScriptProperties();
      const propertyName = "emailSchedule";
      store.setProperty(propertyName, JSON.stringify(emailArray));
  
      // Getting exisitng triggers
      const checkTriggerName = "sendScheduledEmail";
      const triggers = ScriptApp.getProjectTriggers();
      const [trigger] = triggers.filter(trig => trig.getHandlerFunction() === checkTriggerName);
  
      // Creating a trigger to run daily between 5-6am
      if(!trigger) {
        ScriptApp.newTrigger(checkTriggerName).timeBased().atHour(5).everyDays(1).create();
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  
    return true;
  }
  
  function parseDate(dateString) {
    // Split the date string into components
    const [month, day, year] = dateString.split('/');
  
    // Adjust the year to be in the correct range (assuming 2-digit years are in the 20th century)
    const adjustedYear = parseInt(year, 10) + 2000;
  
    // Create a new Date object
    const date = new Date(adjustedYear, month - 1, day); // Month is 0-indexed, so subtract 1
  
    return date;
  }
  