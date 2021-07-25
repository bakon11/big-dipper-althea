import React from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import BigDipperLogoWhite from '@assets/big-dipper-white.svg';
import BigDipperLogoRed from '@assets/big-dipper-red.svg';
import { useSettingsContext } from '@contexts';
import { LinearProgress } from '@material-ui/core';
import { chainConfig } from '@configs';
import { useStyles } from './styles';

const InitialLoad = () => {
  const { theme } = useSettingsContext();
  const classes = useStyles();
  const { t } = useTranslation();

  // ============================
  // Meta Tags
  // ============================
  let baseUrl = '';
  let currentPath = '';

  if (typeof window === 'object') {
    baseUrl = window?.location?.origin || '';
    currentPath = window?.location?.href || '';
  }

  const title = `${t('common:althea')} | ${chainConfig.title}`;
  return (
    <>
      <NextSeo
        title={title}
        description={t('common:description')}
        openGraph={{
          type: 'website',
          title,
          site_name: 'Althea Exploder',
          url: currentPath,
          description: t('common:description'),
          images: [
            {
              url: 'https://staging.bigdipper.live/images/big-dipper-social-media.png',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'msapplication-TileColor',
            content: '#da532c',
          },
          {
            name: 'msapplication-config',
            content: `${baseUrl}/icons/browserconfig.xml`,
          },
          {
            name: 'theme-color',
            content: '#ffffff',
          },
        ]}
      />
      <div className={classes.root}>
        <div>
          <img src={chainConfig.logo} className={classes.logo} alt="logo" />
          <LinearProgress className={classes.divider} />
          {theme === 'light' ? (
            <img src="https://raw.githubusercontent.com/althea-net/althea-site/c41b7650431476fb379b089ae0c40ec7ac173900/images/bird_vector.svg?sanitize=true" />
          ) : (
            <img src="https://raw.githubusercontent.com/althea-net/althea-site/c41b7650431476fb379b089ae0c40ec7ac173900/images/bird_vector.svg?sanitize=true" />
          )}
        </div>
      </div>
    </>
  );
};

export default InitialLoad;
