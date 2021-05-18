import React, { useState, useEffect } from 'react';
import { isEmpty, some } from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import { create } from '../controllers/record.controller';
import { auth } from '../../module.auth/controllers/auth.controller';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing(3)}px 0px 1px`,
  },
  card: {
    maxWidth: 800,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none',
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '93%',
  },
  patientTextField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '20%',
  },
  submit: {
    margin: theme.spacing(2),
  },
  filename: {
    verticalAlign: 'super',
  },
  inputLabelStyle: {
    fontSize: '14px',
  },
  patientInfoRow2: {
    paddingLeft: 15,
  },
  clinicalDataTextField: {
    width: '20.5%',
    marginRight: theme.spacing(4),
  },
}));

export const NewRecord = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    text: '',
    photo: '',
    error: '',
    user: {},
  });

  const [patientInfo, setPatientInfoValues] = useState({
    nameAge: '',
    departmentWard: '',
    diagnosis: '',
    eCard: '',
    pulse: '',
    bloodPressure: '',
    temperature: '',
    saturation: '',
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);

  const sendRecord = () => {
    let recordData = new FormData();
    const preparedPatientInfo = formPatientsData();

    recordData.append('text', values.text);
    recordData.append('photo', values.photo);
    recordData.append('name', preparedPatientInfo.name);
    recordData.append('age', preparedPatientInfo.age);
    recordData.append('department', preparedPatientInfo.department);
    recordData.append('ward', preparedPatientInfo.ward);
    recordData.append('diagnosis', preparedPatientInfo.diagnosis);
    recordData.append('eCard', preparedPatientInfo.eCard);
    recordData.append('bloodPressure', preparedPatientInfo.bloodPressure);
    recordData.append('pulse', preparedPatientInfo.pulse);
    recordData.append('temperature', preparedPatientInfo.temperature);
    recordData.append('saturation', preparedPatientInfo.saturation);

    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      recordData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, text: '', photo: '' });
        props.addUpdate(data);
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handlePatientInfoChange = (name) => (event) => {
    setPatientInfoValues({ ...patientInfo, [name]: event.target.value });
  };

  const formPatientsData = () => {
    const splitNameAgeValues = patientInfo.nameAge.trim().split(',');
    const splitDepartmentWardValues = patientInfo.departmentWard
      .trim()
      .split('-');
    const { diagnosis, eCard, bloodPressure } = patientInfo;

    return {
      name: splitNameAgeValues[0],
      age: +splitNameAgeValues[1],
      department: splitDepartmentWardValues[0],
      ward: +splitDepartmentWardValues[1],
      diagnosis,
      eCard,
      bloodPressure,
      pulse: +patientInfo.pulse,
      temperature: +patientInfo.temperature,
      saturation: +patientInfo.saturation,
    };
  };

  const photoURL = values.user._id
    ? '/api/users/photo/' + values.user._id
    : '/api/users/defaultphoto';

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <div className="new-record-patient-info-row-01">
            <TextField
              id="nameAge"
              label="Ім'я та вік пацієнта"
              className={classes.patientTextField}
              value={patientInfo.nameAge}
              onChange={handlePatientInfoChange('nameAge')}
              margin="normal"
              InputLabelProps={{
                className: classes.inputLabelStyle,
              }}
            />
            <TextField
              id="departmentWard"
              label="Відділення та палата"
              className={classes.patientTextField}
              value={patientInfo.departmentWard}
              onChange={handlePatientInfoChange('departmentWard')}
              margin="normal"
              InputLabelProps={{
                className: classes.inputLabelStyle,
              }}
            />
            <TextField
              id="diagnosis"
              label="Попередній діагноз"
              className={classes.patientTextField}
              value={patientInfo.diagnosis}
              onChange={handlePatientInfoChange('diagnosis')}
              margin="normal"
              InputLabelProps={{
                className: classes.inputLabelStyle,
              }}
            />
            <TextField
              id="eCard"
              label="Е-Картка пацієнта"
              className={classes.patientTextField}
              value={patientInfo.eCard}
              onChange={handlePatientInfoChange('eCard')}
              margin="normal"
              InputLabelProps={{
                className: classes.inputLabelStyle,
              }}
            />
          </div>
          <div className={classes.patientInfoRow2}>
            <TextField
              label="Пульс (уд/хв)"
              id="pulse"
              value={patientInfo.pulse}
              onChange={handlePatientInfoChange('pulse')}
              className={classes.clinicalDataTextField}
              margin="dense"
              variant="outlined"
            />
            <TextField
              label="АТ (мм.рт.ст)"
              id="bloodPressure"
              value={patientInfo.bloodPressure}
              onChange={handlePatientInfoChange('bloodPressure')}
              className={classes.clinicalDataTextField}
              margin="dense"
              variant="outlined"
            />
            <TextField
              label="Т-ра (С)"
              id="temperature"
              value={patientInfo.temperature}
              onChange={handlePatientInfoChange('temperature')}
              className={classes.clinicalDataTextField}
              margin="dense"
              variant="outlined"
            />
            <TextField
              label="Сатурація (%)"
              id="saturation"
              value={patientInfo.saturation}
              onChange={handlePatientInfoChange('saturation')}
              className={classes.clinicalDataTextField}
              margin="dense"
              variant="outlined"
            />
          </div>
          <TextField
            placeholder="Створіть новий запис для консультації ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange('text')}
            className={classes.textField}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange('photo')}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              className={classes.photoButton}
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>{' '}
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ''}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              {/* <Icon color="error" className={classes.error}>
                error
              </Icon> */}
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === '' || some(patientInfo, isEmpty)}
            onClick={sendRecord}
            className={classes.submit}
          >
            ВІДПРАВИТИ
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

NewRecord.propTypes = {
  addUpdate: PropTypes.func.isRequired,
};
