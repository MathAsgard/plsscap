import masterchefABI from '../abi/masterchef.json';
import masterchefRhABI from '../abi/masterchefRh.json';
import IERC20ABI from '../abi/erc20.json';
import StockTokenABI from '../abi/stockToken.json';
import StockPoolABI from '../abi/stockPool.json';
import ZapperABI from '../abi/zapper.json';
import LpABI from '../abi/lpToken.json';


export default {
  pineToken: {
    address: '0x5DFBEA3EE15eB2D346394b1d9DdC5daF0769c8F3',
    abi: IERC20ABI
  },
  masterChef: {
    address: '0xf2753e97a14851555B41082221661B84ffa5975A',
    abi: masterchefABI
  },
  masterChefRh: {
    address: '0xb52897FE7C207BACF261B1cFEC70Ca66b2Aa30CD',
    abi: masterchefRhABI
  },
  stockToken: {
    address: '0x21d4b9d77d3DF8E7f52879138fA3530DDeb31201',
    abi: StockTokenABI
  },
  stockPool: {
    address: '0x18505574FC137FEc98DF366C4B345344e8Ec5eaa',
    abi: StockPoolABI
  },
  zapper: {
    address: '0x04404789Cc6C279Aa87639A498C94D57Fa27953B',
    abi: ZapperABI
  },
  pair: {
    address: '0xe56043671df55de5cdf8459710433c10324de0ae',
    abi: LpABI
  }
}
