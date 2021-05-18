import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import Template from './../template';
import userRoutes from './modules/module.user/routes/user.routes';
import authRoutes from './modules/module.auth/routes/auth.routes';
import recordRoutes from './modules/module.record/routes/record.routes';
import winston from 'winston';
import expressWinston from 'express-winston';

// Модулі для рендеренгу на стороні серверу
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { MainRouter } from './../client/core';

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from './../client/assets/styles/theme';
//кінець

//!!! закоментити перед білдом в продакшен
// import devBundle from './devBundle';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

//!!! закоментити перед білдом в продакшен
// devBundle.compile(app);

// парсинг body params та додавання їх до req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// безпека через встановлення різних HTTP headers
app.use(helmet());
// CORS - Cross Origin Resource Sharing
app.use(cors());

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}', // опціонально: кастомізувати повідомлення логування.
    expressFormat: true, // Використати формат запитів Express/morgan за замовчуванням.
    colorize: false, // Додавання кольорів до тексту повідомлення та статус кодів, використовуючи кольорову палітру Express/morgan
    ignoreRoute: function (req, res) {
      return false;
    }, // опціонально: дозволяє пропустити деякі повідомлення для логування
  })
);

// маршрути
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', recordRoutes);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.get('*', (req, res) => {
  const sheets = new ServerStyleSheets();

  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheets.toString();
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  );
});

// Ловимо unauthorised помилки
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;
