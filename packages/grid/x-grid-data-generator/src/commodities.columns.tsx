import {
  generateTotalPrice,
  randomCommodity,
  randomDesk,
  randomEmail,
  generateFeeAmount,
  randomFeeRate,
  generateFilledQuantity,
  randomId,
  randomIncoterm,
  generateIsFilled,
  randomQuantity,
  generateSubTotal,
  randomTraderName,
  randomUnitPrice,
  randomUnitPriceCurrency,
  randomStatusOptions,
  randomPnL,
  randomTradeDate,
  randomMaturityDate,
  randomBrokerId,
  randomCompanyName,
  randomCountry,
  randomCurrency,
  randomAddress,
  randomCity,
  randomUpdatedDate,
  randomCreatedDate,
  randomRateType,
  randomContractType,
  randomTaxCode,
} from './services';
import {
  renderCountry,
  renderDone,
  renderEmail,
  renderIncoterm,
  renderPnl,
  renderProgress,
  renderStatus,
  renderTotalPrice,
} from './renderer';

export const getCommodityColumns: () => any[] = () => [
  {
    field: 'id',
    generateData: randomId,
    hide: true,
  },
  {
    field: 'desk',
    headerName: 'Desk',
    generateData: randomDesk,
    width: 110,
  },
  {
    field: 'commodity',
    headerName: 'Commodity',
    generateData: randomCommodity,
    width: 180,
  },
  {
    field: 'traderName',
    headerName: 'Trader Name',
    generateData: randomTraderName,
    width: 120,
  },
  {
    field: 'traderEmail',
    headerName: 'Trader Email',
    generateData: randomEmail,
    renderCell: renderEmail,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 140,
    generateData: randomQuantity,
  },
  {
    field: 'filledQuantity',
    headerName: 'Filled Quantity',
    generateData: generateFilledQuantity,
    renderCell: renderProgress,
    type: 'number',
    width: 120,
  },
  {
    field: 'isFilled',
    headerName: 'Is Filled',
    renderCell: renderDone,
    align: 'center',
    generateData: generateIsFilled,
    width: 80,
  },
  {
    field: 'status',
    headerName: 'Status',
    generateData: randomStatusOptions,
    renderCell: renderStatus,
    width: 150,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    generateData: randomUnitPrice,
    type: 'number',
  },
  {
    field: 'unitPriceCurrency',
    headerName: 'Unit Price Currency',
    generateData: randomUnitPriceCurrency,
    width: 70,
  },
  {
    field: 'subTotal',
    headerName: 'Sub Total',
    generateData: generateSubTotal,
    type: 'number',
    width: 120,
  },
  {
    field: 'feeRate',
    headerName: 'Fee Rate',
    generateData: randomFeeRate,
    type: 'number',
    width: 80,
  },
  {
    field: 'feeAmount',
    headerName: 'Fee Amount',
    generateData: generateFeeAmount,
    type: 'number',
    width: 120,
  },
  {
    field: 'incoTerm',
    generateData: randomIncoterm,
    renderCell: renderIncoterm,
  },
  {
    field: 'totalPrice',
    headerName: 'Total in USD',
    generateData: generateTotalPrice,
    renderCell: renderTotalPrice,
    type: 'number',
    width: 160,
  },
  {
    field: 'pnl',
    headerName: 'PnL',
    generateData: randomPnL,
    renderCell: renderPnl,
    type: 'number',
    width: 140,
  },
  {
    field: 'maturityDate',
    headerName: 'Maturity Date',
    generateData: randomMaturityDate,
    type: 'date',
  },
  {
    field: 'tradeDate',
    headerName: 'Trade Date',
    generateData: randomTradeDate,
    type: 'date',
  },
  {
    field: 'brokerId',
    headerName: 'Broker Id',
    generateData: randomBrokerId,
    hide: true,
  },
  {
    field: 'brokerName',
    headerName: 'Broker Name',
    generateData: randomCompanyName,
    width: 140,
  },
  {
    field: 'counterPartyName',
    headerName: 'Counterparty',
    generateData: randomCompanyName,
    width: 180,
  },
  {
    field: 'counterPartyCountry',
    headerName: 'Counterparty Country',
    generateData: randomCountry,
    valueGetter: ({ value }) => value.label,
    renderCell: renderCountry,
    width: 120,
  },
  {
    field: 'counterPartyCurrency',
    headerName: 'Counterparty Currency',
    generateData: randomCurrency,
  },
  {
    field: 'counterPartyAddress',
    headerName: 'Counterparty Address',
    generateData: randomAddress,
    width: 200,
  },
  {
    field: 'counterPartyCity',
    headerName: 'Counterparty City',
    generateData: randomCity,
    width: 120,
  },
  {
    field: 'taxCode',
    headerName: 'Tax Code',
    generateData: randomTaxCode,
  },
  {
    field: 'contractType',
    headerName: 'Contract Type',
    generateData: randomContractType,
  },
  {
    field: 'rateType',
    headerName: 'Rate Type',
    generateData: randomRateType,
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: randomUpdatedDate,
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: randomCreatedDate,
    type: 'date',
    width: 150,
  },
];