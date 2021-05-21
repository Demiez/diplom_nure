export const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Розширюємо таймаут тільки для запитів за маршрутом api
  if (!req.url.includes('/api')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Виконуємо пошук чогось окрім пробілів, щоб показати, що реальні дані
    // відправляються на клієнтську частину
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // Якщо відповідть ще не закінчилася та дані не були відправлені...
      if (!isFinished && !isDataSent) {
        // Виконуємо перевірку/запис хедерів, якщо вони ще не були записані
        if (!res.headersSent) {
          // res.writeHead(202);

          res.write(space);

          // Очикуємо ще 15 секунд
          waitAndSend();
        }
      }
    }, 15000);
  };

  waitAndSend();
  next();
};
