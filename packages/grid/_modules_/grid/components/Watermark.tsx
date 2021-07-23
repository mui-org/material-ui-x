import * as React from 'react';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { useGridApiContext } from '../hooks/root/useGridApiContext';

// we duplicate licenseStatus to avoid adding a dependency on x-license.
enum LicenseStatus {
  NotFound = 'NotFound',
  Invalid = 'Invalid',
  Expired = 'Expired',
  Valid = 'Valid',
}

function getLicenseErrorMessage(licenseStatus: string) {
  switch (licenseStatus) {
    case LicenseStatus.Expired.toString():
      return 'Material-UI X License Expired';
    case LicenseStatus.Invalid.toString():
      return 'Material-UI X Invalid License';
    case LicenseStatus.NotFound.toString():
      return 'Material-UI X Unlicensed product';
    default:
      throw new Error('Material-UI: Unhandled license status.');
  }
}
const licenseStatusSelector = (state: GridState) =>
  state.verifyLicense ? state.licenseStatus : LicenseStatus.Valid;

export const Watermark = () => {
  const apiRef = useGridApiContext();

  const licenseStatus = useGridSelector(apiRef, licenseStatusSelector);
  if (licenseStatus === LicenseStatus.Valid.toString()) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        color: '#8282829e',
        zIndex: 100000,
        width: '100%',
        textAlign: 'center',
        bottom: '50%',
        right: 0,
        letterSpacing: 5,
        fontSize: 24,
      }}
    >
      {' '}
      {getLicenseErrorMessage(licenseStatus)}{' '}
    </div>
  );
};
