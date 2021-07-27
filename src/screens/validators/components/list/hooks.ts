import { useState } from 'react';
import * as R from 'ramda';
import numeral from 'numeral';
import {
  useValidatorsQuery,
  ValidatorsQuery,
} from '@graphql/types';
import { formatDenom } from '@utils/format_denom';
import { useChainContext } from '@contexts';
import { getValidatorCondition } from '@utils/get_validator_condition';
import { chainConfig } from '@src/configs';
import {
  ValidatorsState, ValidatorType,
} from './types';

export const useValidators = () => {
  const { findAddress } = useChainContext();
  const [search, setSearch] = useState('');
  const [state, setState] = useState<ValidatorsState>({
    loading: true,
    exists: true,
    items: [],
    votingPowerOverall: 0,
    tab: 0,
    sortKey: 'validator.name',
    sortDirection: 'asc',
  });

  const handleSetState = (stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

  // ==========================
  // Fetch Data
  // ==========================
  useValidatorsQuery({
    onCompleted: (data) => {
      handleSetState({
        loading: false,
        ...formatValidators(data),
      });
    },
  });

  // ==========================
  // Parse data
  // ==========================
  const formatValidators = (data: ValidatorsQuery) => {
    const votingPowerOverall = formatDenom(
      R.pathOr(0, ['stakingPool', 0, 'bondedTokens'], data),
      R.pathOr(chainConfig.primaryTokenUnit, ['stakingParams', 0, 'bondDenom'], data),
    ).value;
    const signedBlockWindow = R.pathOr(0, ['slashingParams', 0, 'signedBlockWindow'], data);

    const formattedItems = data.validator.map((x) => {
      let validator;
      if(x.validatorInfo !== null){ validator = findAddress(x.validatorInfo.operatorAddress); };
      console.log(validator);
      
      const votingPower = R.pathOr(0, ['validatorVotingPowers', 0, 'votingPower'], x);
      const votingPowerPercent = numeral((votingPower / votingPowerOverall) * 100).value();
      const totalDelegations = x.delegations.reduce((a, b) => {
        return a + numeral(R.pathOr(0, ['amount', 'amount'], b)).value();
      }, 0);

      const [selfDelegation] = x.delegations.filter(
        (y) => {
          return y.delegatorAddress === x.validatorInfo.selfDelegateAddress;
        },
      );
      const self = numeral(R.pathOr(0, ['amount', 'amount'], selfDelegation)).value();
      const selfPercent = (self / (totalDelegations || 1)) * 100;

      const missedBlockCounter = R.pathOr(0, ['validatorSigningInfos', 0, 'missedBlocksCounter'], x);
      const condition = getValidatorCondition(signedBlockWindow, missedBlockCounter);

      return ({
        validator: {
          address: x.validatorInfo !== null && x.validatorInfo.operatorAddress,
          // imageUrl: validator !== undefined && validator.imageUrl,
          name: validator !== undefined && validator.moniker,
        },
        votingPower,
        votingPowerPercent,
        commission: R.pathOr(0, ['validatorCommissions', 0, 'commission'], x) * 100,
        self,
        selfPercent,
        condition,
        status: R.pathOr(0, ['validatorStatuses', 0, 'status'], x),
        jailed: R.pathOr(false, ['validatorStatuses', 0, 'jailed'], x),
        delegators: x.delegations.length,
      });
    });

    return {
      votingPowerOverall,
      items: formattedItems,
    };
  };

  const handleTabChange = (_event: any, newValue: number) => {
    setState((prevState) => ({
      ...prevState,
      tab: newValue,
    }));
  };

  const handleSort = (key: string) => {
    if (key === state.sortKey) {
      setState((prevState) => ({
        ...prevState,
        sortDirection: prevState.sortDirection === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        sortKey: key,
        sortDirection: 'asc', // new key so we start the sort by asc
      }));
    }
  };

  const sortItems = (items: ValidatorType[]) => {
    let sorted: ValidatorType[] = R.clone(items);

    if (state.tab === 1) {
      sorted = sorted.filter((x) => x.status === 3);
    }

    if (state.tab === 2) {
      sorted = sorted.filter((x) => x.status !== 3);
    }

    if (search) {
      sorted = sorted.filter((x) => {
        return (
          x.validator.name.toLowerCase().replace(/ /g, '').includes(search.toLowerCase())
          || x.validator.address.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (state.sortKey && state.sortDirection) {
      sorted.sort((a, b) => {
        let compareA = R.pathOr(undefined, [...state.sortKey.split('.')], a);
        let compareB = R.pathOr(undefined, [...state.sortKey.split('.')], b);

        if (typeof compareA === 'string') {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }

        if (compareA < compareB) {
          return state.sortDirection === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
          return state.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return {
    state,
    handleTabChange,
    handleSort,
    handleSearch,
    sortItems,
  };
};
