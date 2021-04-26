import express from 'express';
import authController from '../../module.auth/controllers/auth.controller';
import userController from '../../module.user/controllers/user.controller';
import recordContoller from '../controllers/record.controller';

const router = express.Router();

router
  .route('/api/records/new/:userId')
  .post(authController.requireSignin, recordContoller.createRecord);

router.route('/api/records/photo/:recordId').get(recordContoller.photo);

router
  .route('/api/records/by/:userId')
  .get(authController.requireSignin, recordContoller.listRecordsByUser);

router
  .route('/api/records/feed/:userId')
  .get(authController.requireSignin, recordContoller.listNewsFeed);

router
  .route('/api/records/like')
  .put(authController.requireSignin, recordContoller.like);

router
  .route('/api/records/unlike')
  .put(authController.requireSignin, recordContoller.unlike);

router
  .route('/api/records/comment')
  .put(authController.requireSignin, recordContoller.comment);

router
  .route('/api/records/uncomment')
  .put(authController.requireSignin, recordContoller.uncomment);

router
  .route('/api/records/:recordId')
  .delete(
    authController.requireSignin,
    recordContoller.checkRecorder,
    recordContoller.deleteRecord
  );

router.param('userId', userController.userByID);
router.param('recordId', recordContoller.getRecordByID);

export default router;
