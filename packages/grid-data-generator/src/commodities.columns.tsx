import './style/real-data-stories.css';
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
  randomTraderId,
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
} from './services/';
import {
  CountryRenderer,
  DoneRenderer,
  EmailRenderer,
  IncotermRenderer,
  ProgressRenderer,
  StatusRenderer,
} from './renderer';

const totalPriceFormatter = ({ value }) => `$ ${Number(value).toLocaleString()}`;
const pnlFormatter = params =>
  Number(params.value!) < 0
    ? `(${Math.abs(Number(params.value!)).toLocaleString()})`
    : Number(params.value).toLocaleString();

export const commodityColumns: any[] = [
  {
    field: 'id',
    generateData: randomId,
    hide: true,
  },
  {
    field: 'desk',
    headerName: 'Desk',
    generateData: randomDesk,
  },
  {
    field: 'commodity',
    headerName: 'Commodity',
    generateData: randomCommodity,
    sortDirection: 'asc',
    sortIndex: 1,
    width: 120,
  },
  {
    field: 'traderId',
    headerName: 'Trader Id',
    generateData: randomTraderId,
  },
  {
    field: 'traderName',
    headerName: 'Trader Name',
    generateData: randomTraderName,
    width: 150,
  },
  {
    field: 'traderEmail',
    headerName: 'Trader Email',
    generateData: randomEmail,
    cellRenderer: EmailRenderer,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    generateData: randomUnitPrice,
    // valueFormatter: params=> `${Number(params.value).toLocaleString()} ${params.data['unitPriceCurrency']}`,
    type: 'number',
    width: 100,
  },
  {
    field: 'unitPriceCurrency',
    headerName: 'Unit Price Currency',
    generateData: randomUnitPriceCurrency,
    width: 70,
    // hide: true
  },
  {
    field: 'quantity',
    type: 'number',
    generateData: randomQuantity,
  },
  {
    field: 'filledQuantity',
    headerName: 'Filled Quantity',
    generateData: generateFilledQuantity,
    cellRenderer: ProgressRenderer,
    sortDirection: 'desc',
    sortIndex: 2,
    type: 'number',
    width: 120,
  },
  {
    field: 'isFilled',
    headerName: 'Is Filled',
    cellRenderer: DoneRenderer,
    align: 'center',
    generateData: generateIsFilled,
    width: 50,
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
    cellRenderer: IncotermRenderer,
    width: 100,
  },
  {
    field: 'totalPrice',
    headerName: 'Total in USD',
    generateData: generateTotalPrice,
    valueFormatter: totalPriceFormatter,
    cellClassRules: {
      good: ({ value }) => Number(value) > 1000000,
      bad: ({ value }) => Number(value) < 1000000,
    },
    type: 'number',
    width: 120,
  },
  {
    field: 'status',
    generateData: randomStatusOptions,
    cellRenderer: StatusRenderer,
    width: 150,
  },
  {
    field: 'pnl',
    headerName: 'PnL',
    generateData: randomPnL,
    valueFormatter: pnlFormatter,
    cellClassRules: {
      positive: ({ value }) => Number(value) > 0,
      negative: ({ value }) => Number(value) < 0,
    },
    type: 'number',
    width: 120,
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
    cellRenderer: CountryRenderer,
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
