import tokens from './tokens'

//NOTE ALL ADRESSES NEED TO BE CHECKSUMMED
const farms = [
  {
    pid: 0,
    plsxPid: 1,
    lpSymbol: 'eDAI-WPLS',
    lpAddress:'0xE56043671df55dE5CDf8459710433C10324DE0aE',
    token: tokens.dai,
    quoteToken: tokens.wpls,
    version: '1',
    farmActive: true
  },
  {
    pid: 1,
    plsxPid: null,
    lpSymbol: 'PCAP-WPLS',
    lpAddress:'0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee',
    token: tokens.wpls,
    quoteToken: tokens.pcap,
    version: '1',
    farmActive: true
  },
  {
    pid: 2,
    plsxPid: 0,
    lpSymbol: 'PLSX-WPLS',
    lpAddress:'0x1b45b9148791d3a104184Cd5DFE5CE57193a3ee9',
    token: tokens.plsx,
    quoteToken: tokens.wpls,
    version: '1',
    farmActive: true
  }
]

export default farms
