'use strict';
const http = require ('http');
const pug = require ('pug');
const mysql = require ('promise-mysql');
const querystring = require('querystring');

const DB_NAME = 'phh_blog_system';
const DB_USER = process.env['PHH_DB_USER'] || 'y_sato';
const DB_PASSWD = process.env['PHH_DB_PASSWD'] || '!Qaz2wsx';

const server = http.createServer ((req, res) => {
  res.writeHead (200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
  case 'GET':
    if (req.url === '/') {
      showTopPage (req, res);
    }
    break;
  case 'POST':
    res.end ();
    break;
  default:
    break;
  }
}).on('error', (e) => {
  console.error ('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error ('[' + new Date() + '] Client Error', e);
});

const port = 8000;
server.listen (port, () => {
  console.info ('[' + new Date() + '] Listening on ' + port);
});

function showTopPage (req, res) {
  let connection;
  let entries;
  let tags;

  mysql.createConnection({
    host: 'localhost',
    user: DB_USER,
    password: DB_PASSWD,
    database: DB_NAME
  }).then ((conn) => {
    connection = conn;
    return connection.query ("SELECT * FROM entry");
  }).then ((rows) => {
    entries = rows;
    return connection.query ('SELECT name FROM tag');
  }).then ((rows) => {
    tags = rows;
    res.write(pug.renderFile('./top.pug', {
      entries: entries,
      tags: tags,
    }));
    res.end ();
    connection.end ();
  }).catch ((error) => {
    console.log (error);
  });
}
