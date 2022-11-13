// Ref: https://zenn.dev/scnsh/articles/6791519a806463
function postToSlack(message, channel, thread_ts) {
  var url = "https://slack.com/api/chat.postMessage";
  var payload = {
    "token" : PropertiesService.getScriptProperties().getProperty('BOT_TOKEN'),
    "channel" : channel,
    "text" : message,
    "thread_ts" : thread_ts
  };
  var params = {
    "method" : 'post',
    "payload" : payload
  };
  const response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response.getContentText('utf-8'));
}


function doGet() {
  const resData = JSON.stringify({ message: 'Hello World!' });
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(resData);
  return output;
}

function doPost(e) {
  try {
    const json = JSON.parse(e.postData.getDataAsString());
    if (json.type == "url_verification") {
      return ContentService.createTextOutput(json.challenge);
    }
  }
  catch (ex) {
    Logger.log(ex);
  }

  try {
    const json = JSON.parse(e.postData.getDataAsString());
    Logger.log(json)
    const channel = json.event.channel;
    const ts = json.event.ts;
    Logger.log(postToSlack("hello world", channel, ts))
  }
  catch (ex) {
    Logger.log(ex);
  }
}
