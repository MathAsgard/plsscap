import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";
import React, { useRef, useEffect } from "react";
import useInterval from "../hooks/useInterval";
import { Link, useLocation } from "react-router-dom";
import CapitalFarmsCard from "../pages/capital-farms/components/CapitalFarmsCard";
import Zapper from "../components/Zapper";
import CustomModal from "./CustomModal";
import BigNumber from 'bignumber.js/bignumber'
import {
  Check,
  ClearIcon,
  CloseIcon,
  CopyIcon,
  DisconnectIcon,
  Hamburger,
  Redirect,
  TrxIcon,
  UserIcon,
  WalletIcon,
} from "./Icon";
import dai from "..//assets/img/token/dai.svg";
import inc from "../assets/img/token/inc.svg";
import pcap from "../assets/img/token/pcap.svg";
import pls from "../assets/img/token/pls.svg";
import plsx from "../assets/img/token/plsx.svg";
import usdc from "../assets/img/token/usdc.svg";
import usdt from "../assets/img/token/usdt.svg";
import weth from "../assets/img/token/weth.svg";
import Metamask from "../assets/img/wallet/Metamask";
import Rabby from "../assets/img/wallet/RabbyIcon";
import WallecIcon from "../assets/img/wallet/WalletIcon";
import SafeIcon from "../assets/img/wallet/SafeIcon";
import Coinbase from "../assets/img/wallet/Coinbase.js";
import { TeamModal } from "./TeamModal";
import lpABI from "../config/abi/lpToken.json"
import { multicall, writeContract, fetchBalance, waitForTransaction } from '@wagmi/core';
import {
    useAccount,
    useBalance,
    useConnect,
    useDisconnect,
    useChainId,
    useSwitchNetwork,
  } from 'wagmi'

  function toLocaleString(num, min, max) {
    const _number = isNaN(Number(num)) ? 0 : Number(num)
    return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: max});
  }
  
const Header = () => {
  const [scroll, setScroll] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [open, setOpen] = React.useState(null);
  const [loginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [openWallet, setOpenWallet] = React.useState(null);
  const [teamModal, setTeamModal] = React.useState(false);
  const [zappedModalOpenFromHeader, setZappedModalOpenFromHeader] = React.useState(false);
  const [pcapPrice, setPcapPrice] = React.useState("0.00");
  const [recentTransactions, setRecentTransactions] = React.useState([]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const location = useLocation();
  const ref = useRef(null);
  const handleCopy = () => {
    ref.current.select();
    document.execCommand("copy");
  };

  const CHAIN = 369;
  const { address, connector, isConnected } = useAccount()
  const userBalance = useBalance({address: address})
  
  const [connectModal, setConnectModal] = React.useState(false);

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const userAccount = useAccount({
		onConnect() {
			//setConnected(true)
		},
		onDisconnect() {
			//setConnected(false)
		},
	})
  const handleCopyWalletAddress = () => {
		navigator.clipboard.writeText(address);
		window.alert("Copied to clipboard");
	}

  const chain  = useChainId()
  const { chains, _error, _isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

  if (isConnected) {
    if(chain.id !== CHAIN && !pendingChainId && switchNetwork) switchNetwork(CHAIN)
    if(!localStorage[address]) {
      localStorage["warren-"+address] = ""
    }
  }

  async function getStats() {
		const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee`);
		const rsps = await response.json();
		
		const pinePrice = rsps.pairs?.filter((pair)=>pair.pairAddress === '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee')[0].priceUsd;
    setPcapPrice(toLocaleString(pinePrice*1000, 3, 3) + '/K');
    getTokenBalances();
    const txs = localStorage["warren-"+userAccount.address].replace("...", "").split("...").reverse()
    if(txs.length <= 5) setRecentTransactions(txs)
    else setRecentTransactions(txs.slice(txs.length-6, txs.length-1))
  }
  async function getTokenBalances() {
		const plsBalance = await fetchBalance({
		  address: userAccount.address,
		});
		const tokens = [
		  '0xefD766cCb38EaF1dfd701853BFCe31359239F305', //dai
		  '0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d', //inc
		//'0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', //hex
		  '0x95B303987A60C71504D99Aa1b13B4DA07b0790ab', //plsx
		//'0xb17D901469B9208B17d916112988A3FeD19b5cA1', //wbtc
		  '0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C', //eth
		  '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07', //usdc
		  '0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f', //usdt
		];
		const pairs = [
		  '0xe56043671df55de5cdf8459710433c10324de0ae', //wpls
		  '0xf808bb6265e9ca27002c0a04562bf50d4fe37eaa', //inc
		  '0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65', //hex
		  '0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9', //plsx
		  '0xdb82b0919584124a0eb176ab136a0cc9f148b2d1', //wbtc
		  '0x42abdfdb63f3282033c766e72cc4810738571609',//eth
		];
		const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pairs.join(',')}`);
		const rsps = await response.json();
			const _prices = tokens.map((token)=>{
		  if(token === '0xefD766cCb38EaF1dfd701853BFCe31359239F305' ||
			 token === '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07' || 
			 token === '0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f') return '1';
		  return rsps.pairs.filter(e=>e.baseToken.address==token)[0].priceUsd;
		})
		const prices = [rsps.pairs.filter(e=>e.baseToken.address=="0xA1077a294dDE1B09bB078844df40758a5D0f9a27")[0].priceUsd].concat(_prices)
	
		const _defaultTokenReserves = rsps.pairs[0].liquidity.usd
		const _tokens = await multicall({
			contracts: tokens.map((token)=>{
				return {
					address: token,
					abi: lpABI,
					functionName: 'balanceOf',
					args: [userAccount.address]
				}
			})
		});
		const balances = [new BigNumber(plsBalance?.value)].concat(_tokens.map(token=>new BigNumber(token.result)));
		tokens.forEach((token, index)=>{
			const filtered = selectOptions.filter(i=>i.address === token)[0]
			filtered.value = balances[index+1].div(1e18);
			filtered.price = prices[index+1];	
		})
		
		selectOptions[0].value = new BigNumber(plsBalance.value).div(1e18);
		selectOptions[0].price = prices[0];
	}
  useEffect(() => {
		getStats();
	},[]);

	useInterval(async () => {
		await getStats();
	}, 5000);

  return (
    <>
      <div className="relative z-10">
        <img
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-[1111px]"
          src="/img/header-shape.png"
          alt=""
        />
      </div>
      <header
        className={`header-section ${
          location.pathname === "/" ? "fixed" : "sticky"
        } w-full left-0 duration-300 transition-all z-[9999] ${
          scroll > 0 ? "top-0 bg-[#11031f] py-4" : "top-0 md:top-[26px] py-6"
        }`}
      >
        <div className="container xl:max-w-[1400px]">
          <div className="flex justify-between items-center">
            <Link to="/" className="block max-w-[200px] sm:max-w-[275px]">
              <img src="/img/footer-logo.svg" className="w-full" alt="" />
            </Link>
            <nav className="hidden lg:flex gap-5 xl:gap-10">
              {menu.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    to={item.url}
                    className="text-md font-semibold group-hover:bg-menuHover background-clip-text py-2 block"
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="menu-item">
                      <div className="rounded-lg bg-menuItemHover">
                        <div className="rounded-lg bg-gradient-to-tl from-[#2f0f4f]">
                          {item.submenu.map((subitem, index) => (
                            <Link
                              key={index}
                              to={subitem.url}
                              className="submenu-item first:rounded-t-[8px] last:rounded-b-[8px] group/item"
                              onClick={() =>
                                subitem.name === "The Team"
                                  ? setTeamModal(true)
                                  : subitem.name === "Zapper"
                                  ? setZappedModalOpenFromHeader(true)
                                  : ""
                              }
                            >
                              <div className="mb-1 bg-white group-hover/item:bg-menuHover background-clip-text font-semibold inline-block">
                                {subitem.name}
                              </div>
                              <p className="text-sm text-gray-400">
                                {subitem.subname}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="hidden md:block">
              <ButtonGroup
                setLogin={setLogin}
                login={login}
                loginPopupOpen={loginPopupOpen}
                setLoginPopupOpen={setLoginPopupOpen}
                openWallet={openWallet}
                setOpenWallet={setOpenWallet}
                isConnected={isConnected}
                disconnect={disconnect}
                address={address}
                pcapPrice={pcapPrice}
              />
            </div>
            <div className="lg:hidden">
              <button type="button" onClick={() => setMenuOpen(true)}>
                <Hamburger />
              </button>
            </div>
          </div>
        </div>
      </header>
      <>
        {menuOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-[1000] lg:hidden`}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          className={`mobile-menu-drawer ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            <Link to="#" className="block max-w-[200px] sm:max-w-[275px]">
              <img src="/img/footer-logo.svg" className="w-full" alt="" />
            </Link>
            <button type="button" onClick={() => setMenuOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div>
            <nav className="flex flex-wrap items-center justify-center h-full py-10 px-6">
              {menu.map((item, index) => (
                <>
                  <Accordion
                    open={open === index}
                    className={`w-full ${open === index ? "active" : ""}`}
                    key={index}
                  >
                    <AccordionHeader
                      onClick={() => {
                        open === index ? setOpen(null) : setOpen(index);
                      }}
                      className="py-0 border-0 text-white"
                    >
                      <Link
                        to={item.url}
                        className="text-md font-semibold group-hover:bg-menuHover background-clip-text py-2 block"
                      >
                        {item.name}
                      </Link>
                    </AccordionHeader>
                    <AccordionBody>
                      {item.submenu && (
                        <>
                          <div className={`mobile-menu-item`}>
                            <div className="bg-footerBg rounded-lg">
                              {item.submenu.map((subitem, index) => (
                                <Link
                                  key={index}
                                  to={subitem?.url}
                                  className="submenu-item first:rounded-t-[8px] last:rounded-b-[8px] group/item"
                                  onClick={() =>
                                    subitem.name === "The Team"
                                      ? setTeamModal(true)
                                      : subitem.name === "Zapper"
                                      ? setZappedModalOpenFromHeader(true)
                                      : ""
                                  }
                                >
                                  <div className="mb-1 bg-white group-hover/item:bg-menuHover background-clip-text">
                                    {subitem.name}
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    {subitem.subname}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </AccordionBody>
                  </Accordion>
                </>
              ))}
            </nav>
          </div>
          <div className="p-6">
            <ButtonGroup
              setLogin={setLogin}
              login={login}
              loginPopupOpen={loginPopupOpen}
              setLoginPopupOpen={setLoginPopupOpen}
              openWallet={openWallet}
              setOpenWallet={setOpenWallet}
              pcapPrice={pcapPrice}
            />
          </div>
        </div>
      </>
      <CustomModal
        open={loginPopupOpen}
        setOpen={setLoginPopupOpen}
        onlyChildren
      >
        <div className="w-full max-w-[360px] m-auto fadeInUp">
          <div className="asset-card h-full">
            <div className="inner" style={{ background: "#070115" }}>
              <img
                src="/img/capital/roi-bg.png"
                className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                alt=""
              />
              <div className="h-full relative z-[11]">
                <h5 className="text-md flex-wrap justify-center sm:text-lg font-semibold flex items-center gap-3 flex-grow px-4 xl:px-[30px] pt-[14px] pb-[12px]">
                  <div>Connect to a Wallet</div>
                </h5>
                <span className="w-full bg-gradient8 h-[1px] block" />
                <div className="py-9 px-8 flex flex-col gap-[11px]">
                  {connectors.slice().reverse().map((connector, index) => (
                  <>
                    {connector.name === "Injected" && 
                    <div >
                      <button
                        type="button"
                        className="rounded-[10px] bg-gradient8 w-full text-md font-semibold text-white text-opacity-80 p-[1px] group"
                        onClick={() => {
                          connect({ connector })
                          setLoginPopupOpen(false);
                        }}
                      >
                        <div className="d-center justify-between rounded-[10px] bg-[#161616] h-[48px] px-4">
                          <span>Rabby</span>
                          <Rabby/>
                        </div>  
                      </button>
                    </div>
                    }
                    <button
                      className="rounded-[10px] bg-gradient8 w-full text-md font-semibold text-white text-opacity-80 p-[1px] group"
                      key={connector.uid}
                      onClick={() => {
                          connect({ connector })
                          setLoginPopupOpen(false)
                      }}
                    >
                      <div className="d-center justify-between rounded-[10px] bg-[#161616] h-[48px] px-4">
                        <spam>
                            { connector.name }
                            {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
                        </spam>

                          {connector.name === 'MetaMask' && <Metamask/>}
                          {connector.name === 'Safe' && <SafeIcon/>}
                          {connector.name === 'Coinbase Wallet' && <Coinbase/>}
                          {connector.name === 'WalletConnect' && <WallecIcon/>}
                          {connector.name === 'Injected' && <img src="/img/wallet/injected.svg" height="40px" style={{marginRight: "-2px"}}/>}

                      </div>
                    </button>
                  </>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      {/* Wallet Modal */}
      <CustomModal
        open={openWallet}
        setOpen={setOpenWallet}
        onlyChildren={true}
      >
        <div className="w-full max-w-[530px] m-auto fadeInUp z-[999]">
          <div className="asset-card h-full">
            <div className="inner" style={{ background: "#070115" }}>
              <img
                src="/img/capital/roi-bg.png"
                className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                alt=""
              />
              <div className="py-6 md:py-7 h-full relative z-[11]">
                <h5 className="text-md flex-wrap justify-between sm:text-lg font-semibold flex items-center gap-3 flex-grow mb-5 px-4 xl:px-[26px]">
                  <div>Your Wallet</div>
                  <button
                    type="button"
                    onClick={() => setOpenWallet(null)}
                    className="w-6"
                  >
                    <ClearIcon />
                  </button>
                </h5>
                <div className="py-5 px-4 bg-[#070115] d-center">
                  <div className="d-center bg-[#150238] rounded-[5px]">
                    <button
                      className={`btn-3 h-[30px] px-4 w-full min-w-[120px] ${
                        openWallet === "wallet"
                          ? "bg-menuHover"
                          : "bg-none text-white"
                      }`}
                      onClick={() => setOpenWallet("wallet")}
                    >
                      Wallet
                    </button>
                    <button
                      className={`btn-3 h-[30px] px-4 w-full min-w-[120px] ${
                        openWallet === "transaction"
                          ? "bg-menuHover"
                          : "bg-none text-white"
                      }`}
                      onClick={() => setOpenWallet("transaction")}
                    >
                      Transaction
                    </button>
                  </div>
                </div>
                <div className="p-4 xl:px-[26px]">
                  {openWallet !== "wallet" ? (
                    <>
                      <div className="text-sm flex justify-between font-semibold mb-4">
                        <span>Recent Transactions</span>
                        <button
                          type="button"
                          onClick={()=>{
                            localStorage["warren-"+userAccount.address] = []
                            setRecentTransactions([])
                            getStats()
                          }}
                        >
                          Clear ALL
                        </button>
                      </div>
                      <span className="text-[13px] font-bold block mb-3">
                        PulseChain
                      </span>
                      {recentTransactions.map((transaction, index) => (
                      <div className="flex gap-3 items-center text-[13px]">
                        <span>
                          <Check />
                        </span>
                        <div className="w-0 flex-grow text-gradient-4">
                          {transaction}
                        </div>
                        <Link to="#">
                          <Redirect />
                        </Link>
                      </div>
                      ))}
                    </>
                  ) : (
                    <div className="max-w-[272px] mx-auto">
                      <span className="text-[13px] font-bold block mb-2">
                        Your Address
                      </span>
                      {/* Copy Address */}
                      <div className="bg-[#150238] rounded-[5px] flex items-center">
                        <input
                          type="text"
                          className="w-full py-2 px-3 h-[33px] bg-transparent text-gradient-3 text-center outline-none"
                          value={address.slice(0, 6) + '...' + address.slice(address.length - 6, address.length)}
                          ref={ref}
                        />
                        <button
                          type="button"
                          className="px-2"
                          onClick={handleCopyWalletAddress}
                        >
                          <CopyIcon />
                        </button>
                      </div>
                      <div className="mt-4 text-sm font-medium">
                          {selectOptions.map((token, index) => (
                            <div className="flex justify-between mb-[6px]">
                              <span>
                                <span className="text-gradient-2">{token.title}</span> Balance
                              </span>
                              <span>{toLocaleString(Number(token.value), 2, 2)}</span>
                            </div>
                          ))}
                        <div className="mt-12 text-center">
                          <div className="text-gradient-5 flex items-center justify-center gap-[6px] mb-[6px]">
                            <span>View on PulseScan</span>
                            <Link to="#">
                              <Redirect />
                            </Link>
                          </div>
                          <button
                            type="button"
                            className="btn-3 w-full rounded-full h-[45px] text-normal font-semibold"
                            onClick={() => {
                              setOpenWallet(null);
                              setLogin(false);
                              disconnect()
                            }}
                          >
                            Disconnect Wallet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      <TeamModal open={teamModal} setOpen={setTeamModal} />
      {/* Only For Modal Show */}
      <CapitalFarmsCard

        modalsOnly={true}
      />
      <Zapper
        zappedModalOpenFromHeader={zappedModalOpenFromHeader}
        setZappedModalOpenFromHeader={setZappedModalOpenFromHeader}
      />
    </>
  );
};

const ButtonGroup = ({
  setLogin,
  login,
  loginPopupOpen,
  setLoginPopupOpen,
  openWallet,
  setOpenWallet,
  isConnected,
  disconnect,
  address,
  pcapPrice
}) => {
  const [selectOpen, setSelectOpen] = React.useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center gap-6 xl:gap-[50px] justify-center">
        <div
          className="rounded-[5px] font-black w-[131px] h-[40px] flex items-center justify-center line-clamp-1 gap-1"
          style={{
            background:
              "url(/img/gradient-border-shape.png) no-repeat center center / 100% 100%",
          }}
        >
          <span className="text-gradient-2 font-bold">PCAP</span> ${pcapPrice}
        </div>
        { window.location.pathname === '/' ? 
          <Link
            className="btn-primary py-2 md:min-w-[150px]"
            
            to="capital-farms"
          >
            <span style={{textAlign: "center", width: "100%"}}>Launch Dapp</span>
          </Link> : isConnected ? (
          <>
            <div className="relative">
              <button
                className="flex relative rounded-r-[10px] overflow-hidden"
                onClick={() => setSelectOpen(!selectOpen)}
                onBlur={() => setSelectOpen(false)}
                type="button"
              >
                <span className="btn-primary py-2 md:min-w-[150px] after:rounded-r-[10px] before:rounded-r-[0] after:inset-0 before:bg-[#070115] before:inset-[1px] before:bg-none before:right-10 hover:after:opacity-100 pr-14 before:z-[3]">
                  <span className="text-white">{address.slice(0, 4) + '...' + address.slice(address.length - 5, address.length)}</span>
                </span>
                <span className="absolute right-2 top-0 h-full flex items-center z-10">
                  <UserIcon />
                </span>
              </button>
              <div
                className={`absolute top-[calc(100%+12px)] w-full p-[1px] bg-gradient8 left-0 rounded-[10px] ${
                  selectOpen
                    ? "visible opacity-1 translate-y-0"
                    : "invisible opacity-0 translate-y-2"
                } duration-300 transition-all`}
              >
                <div className="bg-[#070115] rounded-[10px]">
                  <button
                    type="button"
                    className="flex items-center pl-7 leading-[19px] py-2 gap-[10px] hover:bg-gradient1 hover:text-[#070115] w-full first:rounded-t-[10px] last:rounded-b-[10px]"
                    onClick={() => setOpenWallet("wallet")}
                  >
                    <span>
                      <WalletIcon />
                    </span>
                    <span className="font-bold">Wallet</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center pl-7 leading-[19px] py-2 gap-[10px] hover:bg-gradient1 hover:text-[#070115] w-full first:rounded-t-[10px] last:rounded-b-[10px]"
                    onClick={() => setOpenWallet("transaction")}
                  >
                    <span>
                      <TrxIcon />
                    </span>
                    <span className="font-bold">Transactions</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center pl-7 leading-[19px] py-2 gap-[10px] hover:bg-gradient1 hover:text-[#070115] w-full first:rounded-t-[10px] last:rounded-b-[10px]"
                    onClick={() => disconnect()}
                  >
                    <span>
                      <DisconnectIcon />
                    </span>
                    <span className="font-bold">Disconnect</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <button
            className="btn-primary py-2 md:min-w-[150px]"
            onClick={() => setLoginPopupOpen(true)}
            type="button"
          >
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

    </>
  );
};

const menu = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Dashboard",
    url: "/dashboard",
    // submenu: [
    // 	{
    // 		name: "Capital Farms",
    // 		subname: "Swap with low trading fees",
    // 		url: "/dashboard",
    // 	},
    // 	{
    // 		name: "Heart Fund",
    // 		subname: "Start Earn from fees",
    // 		url: "/heart-fund",
    // 	},
    // 	{
    // 		name: "STOCK Vault",
    // 		subname: "Move your assets with ease.",
    // 		url: "/stock-vault",
    // 	},
    // ],
  },
  {
    name: "Earn",
    url: "#",
    submenu: [
      {
        name: "Capital Farms",
        subname: "Stake & Earn a 25% Yield Boost",
        url: "/capital-farms",
      },
     {
        name: "Heart Fund",
        subname: "Stake & Earn a 50% Yield Boost",
        url: "/heart-fund",
      },
      {
        name: "STOCK Vault",
        subname: "Vault & Earn Protocol Fees",
        url: "/stock-vault",
      },
    ],
  },
  {
    name: "Resources",
    url: "#",
    submenu: [
      {
        name: "WhitePaper",
        subname: "Innovating DeFi Solutions",
        url: "#",
      },
      {
        name: "Brand Kit",
        subname: "Our Style Guide",
        url: "#",
      },
      {
        name: "The Team",
        subname: "Meet the Brains",
      },
    ],
  },
  {
    name: "Stock",
    url: "#",
    submenu: [
      {
        name: "Zapper",
        subname: "Automatically Zap Tokens into LP",
        url: "#",
      },
      {
        name: "Convert",
        subname: "Swap between Assets & STOCK",
        url: "/convert",
      },
      {
        name: "Bridge",
        subname: "Move your assets with ease.",
        url: "https://bridge.pulsechain.com/#/bridge",
      },
    ],
  },
];
const wallet = [
  {
    name: "Rabby",
    img: "/img/wallet/rabby.svg",
  },
  {
    name: "Metamask",
    img: "/img/wallet/metamask.svg",
  },
  {
    name: "Injected",
    img: "/img/wallet/injected.svg",
  },
  {
    name: "WalletConnect",
    img: "/img/wallet/WalletConnect.svg",
  },
  {
    name: "Ledger",
    img: "/img/wallet/Ledger.svg",
  },
  {
    name: "SafePal",
    img: "/img/wallet/SafePal.svg",
  },
];
export default Header;

export const selectOptions = [
	// {
	// 	img: pcap,
	// 	title: "PCAP",
	// 	subtitle: "Pulse Capital",
	// 	value: "1,283,299.88",
	// },
	{
		address: "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
		img: pls,
		title: "PLS",
		subtitle: "Pulse",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
		img: dai,
		title: "DAI",
		subtitle: "DAI From Ethereum",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C",
		img: weth,
		title: "WETH",
		subtitle: "WETH From Ethereum",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab",
		img: plsx,
		title: "PLSX",
		subtitle: "PulseX",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d",
		img: inc,
		title: "INC",
		subtitle: "Incentive",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f",
		img: usdt,
		title: "USDT",
		subtitle: "USDT From Ethereum",
		value: "0.00",
		price: "0.00",
	},
	{
		address: "0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07",
		img: usdc,
		title: "USDC",
		subtitle: "USDC From Ethereum",
		value: "0.00",
		price: "0.00",
	},
];