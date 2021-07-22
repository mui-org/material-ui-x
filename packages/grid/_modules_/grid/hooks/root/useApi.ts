import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridSubscribeEventOptions } from '../../utils/eventEmitter/GridEventEmitter';
import { useLogger } from '../utils/useLogger';
import { GRID_COMPONENT_ERROR, GRID_UNMOUNT } from '../../constants/eventsConstants';
import { useGridApiMethod } from './useGridApiMethod';
import { MuiEvent } from '../../models/gridOptions';

const isSynthenticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function useApi(apiRef: GridApiRef): void {
  const logger = useLogger('useApi');

  const publishEvent = React.useCallback(
    (
      name: string,
      params: any,
      event: MuiEvent<React.SyntheticEvent | DocumentEventMap[keyof DocumentEventMap] | {}> = {},
    ) => {
      event.defaultMuiPrevented = false;
      if (event && isSynthenticEvent(event) && event.isPropagationStopped()) {
        return;
      }
      apiRef.current.emit(name, params, event);
    },
    [apiRef],
  );

  const subscribeEvent = React.useCallback(
    (
      event: string,
      handler: (...args) => void,
      options?: GridSubscribeEventOptions,
    ): (() => void) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current.on(event, handler, options);
      const api = apiRef.current;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.removeListener(event, handler);
      };
    },
    [apiRef, logger],
  );

  const showError = React.useCallback(
    (args) => {
      apiRef.current.publishEvent(GRID_COMPONENT_ERROR, args);
    },
    [apiRef],
  );

  React.useEffect(() => {
    logger.debug('Initializing grid api.');
    const api = apiRef.current;

    return () => {
      logger.info('Unmounting Grid component. Clearing all events listeners.');
      api.emit(GRID_UNMOUNT);
      api.removeAllListeners();
    };
  }, [logger, apiRef]);

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError }, 'GridCoreApi');
}
