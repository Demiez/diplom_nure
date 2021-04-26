import fs from 'fs';
import extend from 'lodash/extend';
import formidable from 'formidable';
import Record from '../models/record.model';
import Patient from '../models/patient.model';
import errorHandler from '../../../utils/dbErrorHandler';

const createRecord = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Не можу завантажити зображення',
      });
    }

    const [incomingPatientData, incomingRecordData] = parseIncommingData(
      fields
    );

    let patient = await Patient.findOne({ eCard: incomingPatientData.eCard });

    if (patient) {
      patient = extend(patient, incomingPatientData);
      patient.updated = Date.now();
    } else {
      patient = new Patient(incomingPatientData);
    }

    const record = new Record(incomingRecordData);

    record.postedBy = req.profile;
    record.patientECard = patient.eCard;

    if (files.photo) {
      record.photo.data = fs.readFileSync(files.photo.path);
      record.photo.contentType = files.photo.type;
    }
    try {
      const [recordResult, patientResult] = await Promise.all([
        record.save(),
        patient.save(),
      ]);

      recordResult.patientBrief = prepareBriefPatientData(patientResult);

      res.json(recordResult);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const getRecordByID = async (req, res, next, id) => {
  try {
    let record = await Record.findById(id)
      .populate('postedBy', '_id name')
      .exec();

    if (!record)
      return res.status('400').json({
        error: 'Запис не знайдений',
      });

    req.record = record;

    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Невдала спроба знаходження запису',
    });
  }
};

const listRecordsByUser = async (req, res) => {
  try {
    const records = await Record.find({ postedBy: req.profile._id })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();

    const recordsWithPatientsBrief = await populatePatientsData(records);

    res.json(recordsWithPatientsBrief);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listNewsFeed = async (req, res) => {
  const following = req.profile.following;
  following.push(req.profile._id);

  try {
    const records = await Record.find({
      postedBy: { $in: req.profile.following },
    })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();

    const recordsWithPatientsBrief = await populatePatientsData(records);

    res.json(recordsWithPatientsBrief);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const deleteRecord = async (req, res) => {
  const { record } = req;

  try {
    let deletedRecord = await record.remove();
    res.json(deletedRecord);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const photo = (req, res, next) => {
  res.set('Content-Type', req.record.photo.contentType);
  return res.send(req.record.photo.data);
};

const like = async (req, res) => {
  try {
    let result = await Record.findByIdAndUpdate(
      req.body.recordId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );

    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const unlike = async (req, res) => {
  try {
    let result = await Record.findByIdAndUpdate(
      req.body.recordId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  try {
    let result = await Record.findByIdAndUpdate(
      req.body.recordId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const uncomment = async (req, res) => {
  let comment = req.body.comment;
  try {
    let result = await Record.findByIdAndUpdate(
      req.body.recordId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const checkRecorder = async (req, res, next) => {
  const record = await Record.findOne({ _id: req.params.recordId });

  const isRecorder = record && req.auth && record.postedBy._id == req.auth._id;

  if (!isRecorder) {
    return res.status('403').json({
      error: 'Користувач не авторизований',
    });
  }

  req.record = record;

  next();
};

const parseIncommingData = (fields) => {
  const {
    text,
    photo,
    name,
    age,
    department,
    ward,
    diagnosis,
    eCard,
    bloodPressure,
    pulse,
    temperature,
    saturation,
  } = fields;

  return [
    {
      name,
      age,
      department,
      ward,
      diagnosis,
      eCard,
      bloodPressure,
      pulse,
      temperature,
      saturation,
    },
    {
      text,
      photo,
    },
  ];
};

const prepareBriefPatientData = (patientResult) => {
  return `ЕК:${patientResult.eCard}; Д:${patientResult.diagnosis}; PS:${patientResult.pulse}-AD:${patientResult.bloodPressure}-T:${patientResult.temperature}-SAT:${patientResult.saturation}`;
};

const populatePatientsData = async (records) => {
  const patients = await Promise.all(
    records.map((record) => Patient.findOne({ eCard: record.patientECard }))
  );

  return records.map((record) => {
    const targetPatient = patients.find(
      (patient) => patient.eCard === record.patientECard
    );
    record.patientBrief = prepareBriefPatientData(targetPatient);

    return record;
  });
};

export default {
  listRecordsByUser,
  listNewsFeed,
  createRecord,
  getRecordByID,
  deleteRecord,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  checkRecorder,
};
