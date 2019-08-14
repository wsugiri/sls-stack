const AWS = require('aws-sdk');
// AWS.config.region = 'us-east-1';

require('dotenv').config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const lambda = new AWS.Lambda({ accessKeyId, secretAccessKey });


exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
};

exports.func1 = async (data) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: '--- call func1 ---', data }),
  };
};

exports.func2 = async (data, event) => {
  return { data, event };
};

exports.app = async (event) => {
  const { action } = event.headers;

  if (action && exports[action]) {
    const data = {
      query: event.queryStringParameters,
      params: event.pathParameters,
      body: event.body ? JSON.parse(event.body) : ''
    };

    const resp = await exports[action](data);
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: '-- lambda not found --', event }),
  };
};

exports.tambah = async (data) => {
  return { message: 'tambah', data };
};

exports.kali = async (data) => {
  return { message: 'kali', data };
};

exports.perkalian = async (event) => {
  const { value1, value2 } = event.data;
  return parseFloat(value1) * parseFloat(value2);
};

exports.penjumlahan = async (event) => {
  const { value1, value2 } = event.data;
  return parseFloat(value1) + parseFloat(value2);
};

function invoker(params) {
  return new Promise((resolve, reject) => {
    lambda.invoke(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        const { Payload } = data;
        resolve(JSON.parse(Payload));
      }
    });
  })
}

exports.perhitungan = async (data) => {
  const { action, value1, value2 } = data.path;
  const params = {
    FunctionName: `sls-stack-dev-${action}`,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    // Payload: '{ "path": { "value1": 25, "value2": 50 } }'
    Payload: JSON.stringify({ data: { value1, value2 } })
  };

  const resp = await invoker(params);
  // const resp = await lambda.invoke(params, function(err, data) {
  //     if (err) {
  //       console.log('error ---', err)
  //     } else {
  //       console.log('LambdaB invoked: ' +  data.Payload);
  //     }
  //   }).promise();

  return {
    action: action,
    value1,
    value2,
    resp: resp
  };
};

module.exports = exports;