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

module.exports = exports;