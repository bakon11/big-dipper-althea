import {
  useState, useEffect,
} from 'react';
import axios from 'axios';
import { DesmosProfileQuery } from '@graphql/desmos_profile';
import {
  DesmosProfileDocument, DesmosProfileLinkDocument,
} from '@graphql/desmos_profile_graphql';

type Options = {
  addressOrDtag?: string;
  onComplete: (data: DesmosProfileQuery) => void;
}

const PROFILE_API = 'https://gql.morpheus.desmos.network/v1/graphql';

export const useDesmosProfile = (options: Options) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (options.addressOrDtag) {
      fetchDesmosProfile(options.addressOrDtag);
    }
  }, [options.addressOrDtag]);

  const fetchDesmos = async (addressOrDtag: string) => {
    try {
      const { data } = await axios.post(PROFILE_API, {
        variables: {
          addressOrDtag,
        },
        query: DesmosProfileDocument,
      });
      return data.data;
    } catch (error) {
      return null;
    }
  };

  const fetchLink = async (address: string) => {
    try {
      const { data } = await axios.post(PROFILE_API, {
        variables: {
          address,
        },
        query: DesmosProfileLinkDocument,
      });
      return data.data;
    } catch (error) {
      return null;
    }
  };

  const fetchDesmosProfile = async (addressOrDtag: string) => {
    let data:DesmosProfileQuery = {
      profile: [],
    };
    try {
      setLoading(true);
      if (addressOrDtag.includes('desmos') || addressOrDtag[0] === '@') {
        // if we are looking by dtags
        if (addressOrDtag[0] === '@') {
          addressOrDtag = addressOrDtag.replace('@', '');
        }
        data = await fetchDesmos(addressOrDtag);
      }

      // if the address is a link instead
      if (!data.profile.length) {
        data = await fetchLink(addressOrDtag);
      }
      setLoading(false);
      return options.onComplete(data);
    } catch (error) {
      setLoading(false);
      return options.onComplete(data);
    }
  };

  const formatDesmosProfile = (data:DesmosProfileQuery): DesmosProfile => {
    if (!data.profile.length) {
      return null;
    }

    const profile = data.profile[0];

    const self = {
      network: 'desmos',
      identifier: profile.address,
      creationTime: profile.creationTime,
    };

    const applications = profile.applicationLinks.map((x) => {
      return ({
        network: x.application,
        identifier: x.username,
        creationTime: x.creationTime,
      });
    });

    const chains = profile.chainLinks.map((x) => {
      return ({
        network: x.chainConfigId,
        identifier: x.externalAddress,
        creationTime: x.creationTime,
      });
    });

    return ({
      createdBy: profile.address,
      dtag: profile.dtag,
      nickname: profile.nickname,
      imageUrl: profile.profilePic,
      bio: profile.bio,
      connections: [self, ...applications, ...chains].sort((a, b) => (
        (a.network.toLowerCase() > b.network.toLowerCase()) ? 1 : -1
      )),
    });
  };

  return {
    loading,
    fetchDesmosProfile,
    formatDesmosProfile,
  };
};
