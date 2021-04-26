import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { unfollow, follow } from '../controllers/user.controller.js';

export const FollowProfileButton = (props) => {
  const followClick = () => {
    props.onButtonClick(follow);
  };

  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };

  return (
    <div>
      {props.following ? (
        <Button variant="contained" color="secondary" onClick={unfollowClick}>
          НЕ ВІДСТЕЖУВАТИ
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={followClick}>
          ВІДСТЕЖИТИ
        </Button>
      )}
    </div>
  );
};

FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
