import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export function GridHeaderPlaceholder() {
  const apiRef = useGridApiContext();
  const props = React.useContext(GridRootPropsContext)!;
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return (
    <div ref={headerRef}>
      <apiRef.current.components.Header {...props.componentsProps?.header} />
    </div>
  );
}
