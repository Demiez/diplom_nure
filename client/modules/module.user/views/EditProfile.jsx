import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { v4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import { auth } from '../../module.auth/controllers/auth.controller';
import { read, update } from '../controllers/user.controller.js';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  dropdownFormControl: {
    marginTop: theme.spacing(2),
  },
  dropdownLabel: {
    marginLeft: theme.spacing(1),
    display: 'block',
    textAlign: 'left',
  },
  dropdownSelect: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // marginTop: theme.spacing(2),
    // marginBottom: theme.spacing(2),
    width: 300,
  },
  dropdownItem: {
    textAlign: 'left',
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: '10px',
  },
}));

export const EditProfile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    about: '',
    photo: '',
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
    id: '',
    department: '',
    specialty: '',
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data & data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          department: data.department || '',
          specialty: data.specialty || '',
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append('name', values.name);
    values.email && userData.append('email', values.email);
    values.passoword && userData.append('passoword', values.passoword);
    values.about && userData.append('about', values.about);
    values.photo && userData.append('photo', values.photo);
    values.department && userData.append('department', values.department);
    values.specialty && userData.append('specialty', values.specialty);
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirectToProfile: true });
      }
    });
  };
  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    //userData.set(name, value)
    setValues({ ...values, [name]: value });
  };
  const photoUrl = values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : '/api/users/defaultphoto';
  if (values.redirectToProfile) {
    return <Redirect to={'/user/' + values.id} />;
  }

  const deaprtmentValues = [
    '',
    'Поліклінічне Відділення',
    'Педіатричне Відділення',
    'Терапевтичне Відділення',
    'Хірургічне Відділення',
  ];
  const specialtyValues = [
    '',
    'Абдомінальна Хірургія',
    'Загальна Хірургія',
    'Загальна Терапія',
    'Кардіологія',
    'Неврологія',
    'Педіатрія',
    'Cімейна Медицина',
    'Травматологія',
    'Оториноларингологія',
  ];

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Профіль користувача
        </Typography>
        <Avatar src={photoUrl} className={classes.bigAvatar} />
        <br />
        <input
          accept="image/*"
          onChange={handleChange('photo')}
          className={classes.input}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" color="default" component="span">
            Завантажити
            <FileUpload />
          </Button>
        </label>{' '}
        <span className={classes.filename}>
          {values.photo ? values.photo.name : ''}
        </span>
        <br />
        <TextField
          id="name"
          label="Ім'я та Прізвище"
          className={classes.textField}
          value={values.name}
          onChange={handleChange('name')}
          margin="normal"
        />
        <br />
        <FormControl className={classes.dropdownFormControl}>
          <InputLabel className={classes.dropdownLabel} id="department-label">
            Відділення
          </InputLabel>
          <Select
            labelId="department-label"
            id="department"
            value={values.department}
            onChange={handleChange('department')}
            className={classes.dropdownSelect}
          >
            {deaprtmentValues.map((departmentValue) => (
              <MenuItem
                value={departmentValue}
                key={`department-option-${v4()}`}
              >
                <div className={classes.dropdownItem}>{departmentValue}</div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl className={classes.dropdownFormControl}>
          <InputLabel className={classes.dropdownLabel} id="specialty-label">
            Спеціалізація
          </InputLabel>
          <Select
            labelId="specialty-label"
            id="specialty"
            value={values.specialty}
            onChange={handleChange('specialty')}
            className={classes.dropdownSelect}
          >
            {specialtyValues.map((specialtyValue) => (
              <MenuItem value={specialtyValue} key={`specilaty-option-${v4()}`}>
                <div className={classes.dropdownItem}>{specialtyValue}</div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <TextField
          id="multiline-flexible"
          label="Про себе"
          multiline
          rows="2"
          value={values.about}
          onChange={handleChange('about')}
          className={classes.textField}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange('email')}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Пароль"
          className={classes.textField}
          value={values.password}
          onChange={handleChange('password')}
          margin="normal"
        />
        <br />{' '}
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              помилка
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          ЗБЕРЕГТИ
        </Button>
      </CardActions>
    </Card>
  );
};
