import React from 'react';
import classnames from 'classnames';
import {
  Drawer,
  AppBar,
  ClickAwayListener,
} from '@material-ui/core';
import { useSettingsContext } from '@contexts';
import BigDipperLogoWhite from '@assets/big-dipper-white.svg';
import BigDipperLogoRed from '@assets/big-dipper-red.svg';
import { useStyles } from './styles';
import { useDesktop } from './hooks';
import {
  MenuItems,
  TitleBar,
} from '..';
import { ActionBar } from './components';

const Desktop: React.FC<{
  className?: string;
  title: string;
}> = ({
  className, title,
}) => {
  const classes = useStyles();
  const { theme } = useSettingsContext();
  const {
    isMenu,
    toggleMenu,
    turnOffAll,
    toggleNetwork,
    isNetwork,
  } = useDesktop();
  return (
    <ClickAwayListener onClickAway={turnOffAll}>
      <div
        className={classnames(className, classes.root)}
      >
        <AppBar
          position="fixed"
          className={classnames(classes.appBar, {
            open: isMenu,
          })}
        >
          <ActionBar
            toggleNetwork={toggleNetwork}
            isNetwork={isNetwork}
          />
          <TitleBar title={title} />
        </AppBar>
        <Drawer
          variant="permanent"
          className={classnames(classes.drawer, {
            open: isMenu,
            closed: !isMenu,
            [classes.drawerOpen]: isMenu,
            [classes.drawerClose]: !isMenu,
          })}
          classes={{
            paper: classnames({
              open: isMenu,
              closed: !isMenu,
              [classes.drawerOpen]: isMenu,
              [classes.drawerClose]: !isMenu,
            }),
          }}
        >
          {theme === 'light' ? (
            <img src="https://raw.githubusercontent.com/althea-net/althea-site/c41b7650431476fb379b089ae0c40ec7ac173900/images/bird_vector.svg?sanitize=true"
              height="100"
              className={classes.logo}
              onClick={toggleMenu}
              role="button"
            />
          ) : (
            <img src="https://raw.githubusercontent.com/althea-net/althea-site/c41b7650431476fb379b089ae0c40ec7ac173900/images/bird_vector.svg?sanitize=true"
              height="100"
              className={classes.logo}
              onClick={toggleMenu}
              role="button"
            />
          )}
          <MenuItems />
        </Drawer>
      </div>
    </ClickAwayListener>
  );
};

export default Desktop;
