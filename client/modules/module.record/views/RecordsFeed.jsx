import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography, Divider } from '@material-ui/core';
import { auth } from '../../module.auth/controllers/auth.controller';
import { listNewsFeed } from '../controllers/record.controller';
import { NewRecord, RecordsList } from './';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    fontSize: '1em',
  },
  media: {
    minHeight: 330,
  },
}));

export const RecordsFeed = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRecords(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const addRecord = (record) => {
    const updatedRecords = [...records];

    updatedRecords.unshift(record);

    setRecords(updatedRecords);
  };

  const removeRecord = (record) => {
    const updatedRecords = [...records];

    const index = updatedRecords.indexOf(record);

    updatedRecords.splice(index, 1);

    setRecords(updatedRecords);
  };

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Медичні записи на консультції
      </Typography>
      <Divider />
      <NewRecord addUpdate={addRecord} />
      <Divider />
      <RecordsList removeUpdate={removeRecord} records={records} />
    </Card>
  );
};
