import React from 'react';
import { Layout } from '@components';
import { useStyles } from './styles';

const ProfileDetails = () => {
  const classes = useStyles();

  return (
    <Layout className={classes.root}>
      Profile details page
    </Layout>
  );
};

export default ProfileDetails;
