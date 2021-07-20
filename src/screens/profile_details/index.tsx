import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import {
  Layout,
  LoadAndExist,
  DesmosProfile,
} from '@components';
import { useStyles } from './styles';
import { useProfileDetails } from './hooks';

const ProfileDetails = () => {
  const classes = useStyles();
  const { state } = useProfileDetails();
  const { t } = useTranslation('accounts');

  return (
    <Layout navTitle={t('profileDetails')} title={t('profileDetails')}>
      <LoadAndExist
        loading={state.loading}
        exists={state.exists}
      >
        <span className={classes.root}>
          {state.desmosProfile && (
            <DesmosProfile
              createdBy={state.desmosProfile.createdBy}
              dtag={state.desmosProfile.dtag}
              nickname={state.desmosProfile.nickname}
              imageUrl={state.desmosProfile.imageUrl}
              bio={state.desmosProfile.bio}
              connections={state.desmosProfile.connections}
            />
          )}
        </span>
      </LoadAndExist>
    </Layout>
  );
};

export default ProfileDetails;
