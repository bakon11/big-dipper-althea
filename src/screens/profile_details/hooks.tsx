import {
  useState, useEffect,
} from 'react';
import * as R from 'ramda';
import { useRouter } from 'next/router';
import { useDesmosProfile } from '@hooks';
import { chainConfig } from '@src/configs';
import { ProfileDetailState } from './types';

export const useProfileDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<ProfileDetailState>({
    loading: true,
    exists: true,
    desmosProfile: null,
  });

  const handleSetState = (stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };
  // ==========================
  // Desmos Profile
  // ==========================
  const {
    fetchDesmosProfile, formatDesmosProfile,
  } = useDesmosProfile({
    onComplete: (data) => {
      // console.log(data, 'data');
      handleSetState({
        desmosProfile: formatDesmosProfile(data),
      });
    },
  });

  useEffect(() => {
    if (chainConfig.extra.desmosProfile) {
      fetchDesmosProfile(R.pathOr('', ['query', 'address'], router));
    }
  },
  [R.pathOr('', ['query', 'dtag'], router)]);
};
