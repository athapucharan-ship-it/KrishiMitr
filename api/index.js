'use strict';

const { app } = require('../server/server');

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');
  const apiPath = requestUrl.searchParams.get('_vercelPath');
  if (!apiPath || !/^[A-Za-z0-9/_-]+$/.test(apiPath)) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'API route not found.' });
  }
  requestUrl.searchParams.delete('_vercelPath');
  req.url = `/api/${apiPath}${requestUrl.search}`;
  return app(req, res);
};
