'use strict';

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

module.exports = exports;