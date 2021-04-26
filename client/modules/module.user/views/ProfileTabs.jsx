import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Typography, Tabs, Tab } from '@material-ui/core';
import { RecordsList } from '../../module.record/views';
import { FollowGrid } from './';

export const ProfileTabs = (props) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, value) => {
    setTab(value);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Консультативні записи" />
          <Tab label="Відстежує" />
          <Tab label="Відстежують" />
        </Tabs>
      </AppBar>
      {tab === 0 && (
        <TabContainer>
          <RecordsList
            removeUpdate={props.removePostUpdate}
            records={props.records}
          />
        </TabContainer>
      )}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid people={props.user.following} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid people={props.user.followers} />
        </TabContainer>
      )}
    </div>
  );
};

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removePostUpdate: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
};

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
