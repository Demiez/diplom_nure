import React from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { Record } from './';

export const RecordsList = (props) => {
  return (
    <div style={{ marginTop: '24px' }}>
      {props.records.map((recordData) => {
        return (
          <Record
            record={recordData}
            key={`record-data-${v4()}`}
            onRemove={props.removeUpdate}
          />
        );
      })}
    </div>
  );
};

RecordsList.propTypes = {
  records: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};
