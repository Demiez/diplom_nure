import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';
import DeleteIcon from '@material-ui/icons/Delete';
import { auth } from '../../module.auth/controllers/auth.controller';
import { removeRecord, like, unlike } from '../controllers/record.controller';
import { Comments } from './';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`,
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  text: {
    margin: theme.spacing(2),
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing(1),
  },
  media: {
    height: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  patientBrief: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.palette.primary.dark,
    margin: theme.spacing(2),
  },
}));

export const Record = (props) => {
  const classes = useStyles();

  const jwt = auth.isAuthenticated();

  const checkLike = (likes) => {
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };

  const [values, setValues] = useState({
    like: checkLike(props.record.likes),
    likes: props.record.likes.length,
    comments: props.record.comments,
  });

  // useEffect(() => {
  //   setValues({...values, like:checkLike(props.record.likes), likes: props.record.likes.length, comments: props.record.comments})
  // }, [])

  const clickLike = () => {
    let callApi = values.like ? unlike : like;
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.record._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, like: !values.like, likes: data.likes.length });
      }
    });
  };

  const updateComments = (comments) => {
    setValues({ ...values, comments: comments });
  };

  const deleteRecord = () => {
    removeRecord(
      {
        recordId: props.record._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.onRemove(props.record);
      }
    });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar src={'/api/users/photo/' + props.record.postedBy._id} />
        }
        action={
          props.record.postedBy._id === auth.isAuthenticated().user._id && (
            <IconButton onClick={deleteRecord}>
              <DeleteIcon />
            </IconButton>
          )
        }
        title={
          <Link to={'/user/' + props.record.postedBy._id}>
            {props.record.postedBy.name}
          </Link>
        }
        subheader={new Date(props.record.created).toDateString()}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.patientBrief}>
          {props.record.patientBrief}
        </Typography>
        <Typography component="p" className={classes.text}>
          {props.record.text}
        </Typography>
        {props.record.photo && (
          <div className={classes.photo}>
            <img
              className={classes.media}
              src={'/api/records/photo/' + props.record._id}
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        {values.like ? (
          <IconButton
            onClick={clickLike}
            className={classes.button}
            aria-label="Like"
            color="secondary"
          >
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={clickLike}
            className={classes.button}
            aria-label="Unlike"
            color="secondary"
          >
            <FavoriteBorderIcon />
          </IconButton>
        )}{' '}
        <span>{values.likes}</span>
        <IconButton
          className={classes.button}
          aria-label="Comment"
          color="secondary"
        >
          <CommentIcon />
        </IconButton>{' '}
        <span>{values.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments
        recordId={props.record._id}
        comments={values.comments}
        updateComments={updateComments}
      />
    </Card>
  );
};

Record.propTypes = {
  record: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
