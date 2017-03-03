const express = require('express');
const app = express();
const historyAPIFallback = require('connect-history-api-fallback');
const SnapHandler = require('luis').handler;

app.use('/snapshot', SnapHandler);
app.use(historyAPIFallback());

app.use(express.static('public'));

app.listen(9001, function () {
    console.log('Example app listening to you on port 9001!');
});
