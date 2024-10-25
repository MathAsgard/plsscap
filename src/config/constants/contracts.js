import masterchefABI from '../abi/masterchef.json';
import masterchefRhABI from '../abi/masterchefRh.json';
import IERC20ABI from '../abi/erc20.json';
import StockTokenABI from '../abi/stockToken.json';
import StockPoolABI from '../abi/stockPool.json';
import ZapperABI from '../abi/zapper.json';
import LpABI from '../abi/lpToken.json';
import masterchefPLSXABI from '../abi/regularMasterchef.json';
import presaleABI from '../abi/presale.json';
export default {
  pcapToken: {
    address: '0xfcFF3f0e5B7CF42Cf7513efa93f308D97343A184',
    abi: IERC20ABI
  },
  masterChef: {
    address: '0x8f9036A2dfBA8C05157CC23F8d06F3f1d0B2c5A7',
    abi: masterchefABI
  },
  masterChefRh: {
    address: '0x8EADe42d90526B4bA88e6526e7E172bda8daAC8B',
    abi: masterchefRhABI
  },
  stockToken: {
    address: '0x54b5E0ab28Fa09118ccb7897e45A087e868bb65f',
    abi: StockTokenABI
  },
  stockPool: {
    address: '0xb1ad829C99771e0e4ea3d74F2BEB7C3349545Fac',
    abi: StockPoolABI
  },
  zapper: {
    address: '0x442F4087F04db757dA3B6c072031E1f8880afd6B',
    abi: ZapperABI
  },
  pair: {
    address: '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee',
    abi: LpABI
  },
  masterchefPLSX: {
    address: '0xB2Ca4A66d3e57a5a9A12043B6bAD28249fE302d4',
    abi: masterchefPLSXABI
  },
  presale: {
    address: '0x32C293c14Cb4130B138C3DA6Ee0E298Df6b72276',
    abi: presaleABI
  }
  
}