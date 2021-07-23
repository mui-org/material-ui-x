import { useLicenseVerifier } from '@material-ui/x-license';
import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridState } from './core/useGridState';

export function useLicenseState(apiRef: GridApiRef) {
  const licenseStatus = useLicenseVerifier();

  const [, setGridState] = useGridState(apiRef);

  React.useEffect(() => {
    setGridState((state) => ({ ...state, licenseStatus }));
  }, [setGridState, licenseStatus]);

  React.useEffect(() => {
    setGridState((state) => ({ ...state, verifyLicense: true }));
  });

  return licenseStatus;
}
