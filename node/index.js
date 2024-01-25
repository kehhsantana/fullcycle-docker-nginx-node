const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'nodedb',
};

app.get('/', async (req, res) => {
  await insertPersonName(res);
});

app.listen(PORT, () => {
  console.log('Port: ' + PORT);
});

async function getRandomName() {
  const randomIndex = Math.floor(Math.random() * 10);
  const response = await axios.get('https://swapi.dev/api/people');
  const names = response.data.results;
  return names[randomIndex].name;
}

async function insertPersonName(res) {
  const name = await getRandomName();
  const connection = mysql.createConnection(dbConfig);
  const insertSql = `INSERT INTO people (name) VALUES ('${name}')`;

  await connection.query(insertSql);
  getPeople(res, connection);
}

function getPeople(res, connection) {
  const selectSql = 'SELECT id, name FROM people';

  connection.query(selectSql, (error, results) => {
    if (error) {
      throw error;
    }

    const table = generateTable(results);
    const html = '<h1>Full Cycle Rocks!</h1>' + table;

    res.send(html);
  });

  connection.end();
}

function generateTable(results) {
  let table = '<table>';
  table += '<tr><th>#</th><th>Names</th></tr>';

  for (const person of results) {
    table += `<tr><td>${person.id}</td><td>${person.name}</td></tr>`;
  }

  table += '</table>';
  return table;
}
