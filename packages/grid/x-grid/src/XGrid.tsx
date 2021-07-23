import * as React from 'react';
import PropTypes from 'prop-types';
import { LicenseInfo } from '@material-ui/x-license';
import { ponyfillGlobal } from '@material-ui/utils';
import {
  DEFAULT_GRID_OPTIONS,
  GridComponentProps,
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useXGridComponent } from './useXGridComponent';

// This is the package release date. Each package version should update this const
// automatically when a new version is published on npm.
let RELEASE_INFO = '__RELEASE_INFO__';

// eslint-disable-next-line no-useless-concat
if (process.env.NODE_ENV !== 'production' && RELEASE_INFO === '__RELEASE' + '_INFO__') {
  // eslint-disable-next-line no-underscore-dangle
  RELEASE_INFO = ponyfillGlobal.__MUI_RELEASE_INFO__;
}

LicenseInfo.setReleaseInfo(RELEASE_INFO);

export type XGridProps = GridComponentProps;

const XGridRaw = React.forwardRef<HTMLDivElement, XGridProps>(function XGrid(inProps, ref) {
  const apiRef = useGridApiRef(inProps.apiRef);

  useXGridComponent(apiRef, inProps);

  return (
    <GridContextProvider apiRef={apiRef} props={inProps}>
      <GridRoot ref={ref}>
        <GridErrorHandler>
          <GridHeaderPlaceholder />
          <GridBody />
          <GridFooterPlaceholder />
        </GridErrorHandler>
      </GridRoot>
    </GridContextProvider>
  );
});
XGridRaw.defaultProps = DEFAULT_GRID_OPTIONS;

export const XGrid = React.memo(XGridRaw);

// @ts-ignore
XGridRaw.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
} as any;
