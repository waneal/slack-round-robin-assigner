// ref: https://minase-program.hatenablog.com/entry/2019/01/09/221604
function doGet() {
    const resData = JSON.stringify({ message: 'Hello World!' });
    ContentService.createTextOutput();
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(resData);
    return output;
}
