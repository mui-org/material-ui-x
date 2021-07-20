import { darken, lighten, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { getThemePaletteMode, muiStyleAlpha, createTheme } from '../../utils/utils';

const defaultTheme = createTheme();
export const useStyles = makeStyles(
  (theme: Theme) => {
    const borderColor =
      getThemePaletteMode(theme.palette) === 'light'
        ? lighten(muiStyleAlpha(theme.palette.divider, 1), 0.88)
        : darken(muiStyleAlpha(theme.palette.divider, 1), 0.68);

    const gridStyle: { root: any } = {
      root: {
        flex: 1,
        boxSizing: 'border-box',
        position: 'relative',
        border: `1px solid ${borderColor}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        ...theme.typography.body2,
        outline: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& *, & *::before, & *::after': {
          boxSizing: 'inherit',
        },
        '&.MuiDataGrid-autoHeight': {
          height: 'auto',
        },
        '& .MuiDataGrid-main': {
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .MuiDataGrid-overlay': {
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: muiStyleAlpha(
            theme.palette.background.default,
            theme.palette.action.disabledOpacity,
          ),
        },
        '& .MuiDataGrid-toolbarContainer': {
          display: 'flex',
          alignItems: 'center',
          padding: '4px 4px 0',
        },
        '& .MuiDataGrid-columnsContainer': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${borderColor}`,
        },
        '& .MuiDataGrid-scrollArea': {
          position: 'absolute',
          top: 0,
          zIndex: 101,
          width: 20,
          bottom: 0,
        },
        '& .MuiDataGrid-scrollArea--left': {
          left: 0,
        },
        '& .MuiDataGrid-scrollArea--right': {
          right: 0,
        },
        '& .MuiDataGrid-columnHeaderWrapper': {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          overflow: 'hidden',
        },
        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
          WebkitTapHighlightColor: 'transparent',
          lineHeight: null,
          padding: '0 10px',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
          outline: `solid ${muiStyleAlpha(theme.palette.primary.main, 0.5)} 1px`,
          outlineWidth: 1,
          outlineOffset: -2,
        },
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          outline: `solid ${theme.palette.primary.main} 1px`,
        },
        '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox': {
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& .MuiDataGrid-columnHeader': {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon':
          {
            opacity: 0,
            transition: theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
            }),
          },
        '& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted):hover .MuiDataGrid-sortIcon':
          {
            opacity: 0.5,
          },
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
        '& .MuiDataGrid-sortIcon, & .MuiDataGrid-filterIcon': {
          fontSize: 'inherit',
        },
        '& .MuiDataGrid-columnHeader--sortable': {
          cursor: 'pointer',
        },
        '& .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer': {
          justifyContent: 'center',
        },
        '& .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderDraggableContainer, & .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-columnHeaderTitleContainer':
          {
            flexDirection: 'row-reverse',
          },
        '& .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-menuIcon, & .MuiDataGrid-columnHeader--alignRight .MuiDataGrid-menuIcon':
          {
            marginRight: 'auto',
            marginLeft: -6,
          },
        '& .MuiDataGrid-columnHeaderTitle': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '& .MuiDataGrid-columnHeader--moving': {
          backgroundColor: theme.palette.action.hover,
        },
        '& .MuiDataGrid-columnSeparator': {
          position: 'absolute',
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: borderColor,
        },
        '& .MuiDataGrid-columnSeparator--resizable': {
          cursor: 'col-resize',
          touchAction: 'none',
          '&:hover': {
            color: theme.palette.text.primary,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              color: borderColor,
            },
          },
          '&.Mui-resizing': {
            color: theme.palette.text.primary,
          },
        },
        '& .MuiDataGrid-iconSeparator': {
          color: 'inherit',
        },
        '& .MuiDataGrid-menuIcon': {
          visibility: 'hidden',
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
        },
        '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon, .MuiDataGrid-menuOpen': {
          visibility: 'visible',
        },
        '& .MuiDataGrid-columnHeaderWrapper.scroll .MuiDataGrid-columnHeader:last-child': {
          borderRight: 'none',
        },
        '& .MuiDataGrid-dataContainer': {
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .MuiDataGrid-window': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflowX: 'auto',
        },
        '& .MuiDataGrid-viewport': {
          position: 'sticky',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
        '& .MuiDataGrid-row': {
          display: 'flex',
          width: 'fit-content',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: 'transparent',
            },
          },
          '&.Mui-selected': {
            backgroundColor: muiStyleAlpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity,
            ),
            '&:hover': {
              backgroundColor: muiStyleAlpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: muiStyleAlpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity,
                ),
              },
            },
          },
        },
        '& .MuiDataGrid-cell': {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderBottom: `1px solid ${borderColor}`,
        },
        '& .MuiDataGrid-cell.MuiDataGrid-cell--editing': {
          padding: 1,
          display: 'flex',
          boxShadow: theme.shadows[2],
          backgroundColor: theme.palette.background.paper,
          '&:focus-within': {
            outline: `solid ${theme.palette.primary.main} 1px`,
            outlineOffset: '-1px',
          },
        },
        '& .MuiDataGrid-editInputCell': {
          ...theme.typography.body2,
          padding: '1px 0',
          '& input': {
            padding: '0 16px',
            height: '100%',
          },
        },
        '& .MuiDataGrid-editBooleanCell': {
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-booleanCell[data-value="true"]': {
          color: theme.palette.text.secondary,
        },
        '& .MuiDataGrid-booleanCell[data-value="false"]': {
          color: theme.palette.text.disabled,
        },
        // The very last cell
        '& .MuiDataGrid-columnHeaderWrapper .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
        '& .MuiDataGrid-cell--withRenderer': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiDataGrid-withBorder': {
          borderRight: `1px solid ${borderColor}`,
        },
        '& .MuiDataGrid-cell--textLeft': {
          textAlign: 'left',
        },
        '& .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--withRenderer, & .MuiDataGrid-cell--textLeft.MuiDataGrid-cell--editing':
          {
            justifyContent: 'flex-start',
          },
        '& .MuiDataGrid-cell--textRight': {
          textAlign: 'right',
        },
        '& .MuiDataGrid-cell--textRight.MuiDataGrid-cell--withRenderer, & .MuiDataGrid-cell--textRight.MuiDataGrid-cell--editing':
          {
            justifyContent: 'flex-end',
          },
        '& .MuiDataGrid-cell--textCenter': {
          textAlign: 'center',
        },
        '& .MuiDataGrid-cell--textCenter.MuiDataGrid-cell--withRenderer, & .MuiDataGrid-cell--textCenter.MuiDataGrid-cell--editing':
          {
            justifyContent: 'center',
          },
        '& .MuiDataGrid-rowCount, & .MuiDataGrid-selectedRowCount': {
          alignItems: 'center',
          display: 'flex',
          margin: theme.spacing(0, 2),
        },
        '& .MuiDataGrid-footerContainer': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 52, // Match TablePagination min height
          '& .MuiDataGrid-selectedRowCount': {
            visibility: 'hidden',
            width: 0,
            height: 0,
            [theme.breakpoints.up('sm')]: {
              visibility: 'visible',
              width: 'auto',
              height: 'auto',
            },
          },
        },
        '& .MuiDataGrid-columnHeaderDropZone .MuiDataGrid-columnHeaderDraggableContainer': {
          cursor: 'move',
        },
        '& .MuiDataGrid-columnHeaderDraggableContainer': {
          display: 'flex',
          width: '100%',
        },
        '& .MuiDataGrid-columnHeader--dragging': {
          background: theme.palette.background.paper,
          padding: '0 12px',
          borderRadius: theme.shape.borderRadius,
          opacity: theme.palette.action.disabledOpacity,
        },
      },
    };

    if (getThemePaletteMode(theme.palette) === 'dark') {
      // Values coming from mac OS.
      const track = '#202022';
      const thumb = '#585859';
      const active = '#838384';

      // We style the scroll bar for dark mode.
      gridStyle.root = {
        ...gridStyle.root,
        scrollbarColor: `${thumb} ${track}`,
        '& *::-webkit-scrollbar': {
          backgroundColor: track,
        },
        '& *::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: thumb,
          minHeight: 24,
          border: `3px solid ${track}`,
        },
        '& *::-webkit-scrollbar-thumb:focus': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-thumb:active': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-thumb:hover': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-corner': {
          backgroundColor: track,
        },
      };
    }
    return gridStyle;
  },
  { name: 'MuiDataGrid', defaultTheme },
);
