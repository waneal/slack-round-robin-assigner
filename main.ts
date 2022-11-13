// Ref: https://zenn.dev/scnsh/articles/6791519a806463
function postToSlack(message, channel, thread_ts) {
  const url = "https://slack.com/api/chat.postMessage";
  const payload = {
    token: PropertiesService.getScriptProperties().getProperty("BOT_TOKEN"),
    channel: channel,
    text: message,
    thread_ts: thread_ts,
  };
  const params = {
    method: "post",
    payload: payload,
  };
  const response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response.getContentText("utf-8"));
}

function getMessageLink(channel, ts): string {
  const url = "https://slack.com/api/chat.getPermalink";
  const payload = {
    token: PropertiesService.getScriptProperties().getProperty("BOT_TOKEN"),
    channel: channel,
    message_ts: ts,
  };
  const params = {
    method: "post",
    payload: payload,
  };
  const response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response.getContentText("utf-8")).permalink;
}

function insertHistory(user, channel, ts) {
  const url =
    PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_URL");
  const ss = SpreadsheetApp.openByUrl(url);
  const sheet = ss.getSheetByName("history");

  const permalink = getMessageLink(channel, ts);

  sheet?.appendRow([user, permalink]);
}

function assignMember(): string {
  const url =
    PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_URL");
  const ss = SpreadsheetApp.openByUrl(url);
  const sheet = ss.getSheetByName("count");

  // get current count
  const range = sheet.getRange("A1");
  const value = range.getValue();
  const count = Number(value);

  // increment count
  range.setValue(count + 1);

  // assign member
  const users_str =
    PropertiesService.getScriptProperties().getProperty("USER_LIST");
  const users = users_str?.split(",");
  Logger.log(users[count % users.length]);
  return users[count % users.length];
}

// https://developers.google.com/apps-script/guides/web
function doPost(e) {
  Logger.log(e);
  const json = JSON.parse(e.postData.getDataAsString());
  Logger.log(json);
  // https://api.slack.com/events/url_verification
  if (json.type == "url_verification") {
    return ContentService.createTextOutput(json.challenge);
  }

  const channel = json.event.channel;
  const ts = json.event.ts;
  const user = assignMember();
  insertHistory(user, channel, ts);
  postToSlack(`Assigned to <@${user}> :writing_hand:`, channel, ts);

  return ContentService.createTextOutput('OK');
}
