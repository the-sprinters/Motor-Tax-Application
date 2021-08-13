import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaxpayerAccount } from '../actions/taxpayerActions';
import Dialog from '../components/Dialog';
import Profile from '../components/Profile';
import {
  TAXPAYER_LOGIN_RESET,
  TAXPAYER_SIGNUP_RESET,
} from '../constants/taxpayerConstants';

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch();

  const taxpayerRes = useSelector((state) => state.taxpayerLogin);
  const { loginResponse } = taxpayerRes;

  const [logoutStatus, setLogoutStatus] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (loginResponse.taxpayer === undefined) {
      history.push('/login');
    }
    if (logoutStatus) {
      localStorage.removeItem('taxpayerprofileinfo');
      dispatch({ type: TAXPAYER_LOGIN_RESET });
      dispatch({ type: TAXPAYER_SIGNUP_RESET });

      history.push('/');
      window.location.reload();
    }

    if (deleted) {
      if (window.confirm('Are you sure you want to delete?')) {
        dispatch(deleteTaxpayerAccount(loginResponse.taxpayer));
        setShowDialog(true);

        const setTimer = setTimeout(() => {
          setLogoutStatus(true);
        }, 1500);
        return () => clearTimeout(setTimer);
      }
    }
  }, [loginResponse, history, dispatch, logoutStatus, deleted]);

  return (
    <>
      {showDialog && <Dialog type='error' text='Account deleted' />}
      <section className='profile-container' id='profile-container'>
        {loginResponse.taxpayer && (
          <Profile profileData={loginResponse.taxpayer} />
        )}
        <section className='profile-event'>
          <p
            className='btn btn-primary btn--logout'
            onClick={() => setLogoutStatus(true)}
            id='taxpayer-logout'
          >
            logout
          </p>
          <p
            className='btn btn-primary btn--delete'
            onClick={(e) => setDeleted(true)}
            id='taxpayer-delete'
          >
            delete
          </p>
        </section>
      </section>
    </>
  );
};

export default ProfileScreen;