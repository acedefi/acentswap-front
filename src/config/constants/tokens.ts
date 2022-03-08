import { ChainId, Token } from '@acentswap/ade-sdk-trial'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  workbench: new Token(
    MAINNET,
    process.env.REACT_APP_WORKBENCH_ADDRESS_MAINNET,
    18,
    'WORKBENCH',
    'WORKBENCH',
    'https://acentswap.acent.tech/',
  ),
  ace: new Token(
    MAINNET,
    '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    18,
    'ACE',
    'ACE Token',
    'https://crypto.org/',
  ),
  wace: new Token(
    MAINNET,
    '0x09E91D6E7aD84341e9B61D823d9B01Ac2336C457',
    18,
    'WACE',
    'Wrapped ACE',
    'https://crypto.org/',
  ),
  ade: new Token(
    MAINNET,
    '0x8a5438b3aCE7227090b8495B933561f0a2542243',
    18,
    'ADE',
    'ADE',
    'https://acentswap.acent.tech/'),
  eth: new Token(
    MAINNET,
    '0x66b6cc54b49cceecf495dde1d328c7b2fbb0425c',
    18,
    'ETH',
    'Wrapped Ether',
    'https://ethereum.org/en/',
  ),
  usdc: new Token(
    MAINNET,
    '0x4cc8f272dc7a597f1cd8101f43bcd2f17bc8769e',
    18,
    'USDC',
    'USD Coin',
    'https://www.circle.com/en/usdc',
  ),
  wbtc: new Token(
    MAINNET,
    '0x48242cd1c8c21b59c8ed61085fe6881f5c675a01',
    18,
    'WBTC',
    'Wrapped BTC',
    'https://bitcoin.org/en/',
  ),
}

// FIXME tokens for testnet and mainnet
export const testnetTokens = {
  workbench: new Token(
    TESTNET,
    process.env.REACT_APP_WORKBENCH_ADDRESS_TESTNET,
    18,
    'WORKBENCH',
    'WORKBENCH',
    'https://acentswap.acent.tech/',
  ),
  ace: new Token(
    TESTNET,
    '0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4',
    18,
    'ACE',
    'ACE',
    'https://crypto.org/',
  ),
  wace: new Token(
    TESTNET,
    '0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4',
    18,
    'WACE',
    'Wrapped ACE',
    'https://crypto.org/',
  ),
  ade: new Token(
    TESTNET,
    '0x904Bd5a5AAC0B9d88A0D47864724218986Ad4a3a',
    18,
    'ADE',
    'ADE',
    'https://acentswap.acent.tech/'),
  eth: new Token(
    TESTNET,
    '0x441d72d584b16105FF1C68DC8bc4517F4DC13E55',
    18,
    'ETH',
    'Wrapped Ether',
    'https://ethereum.org/en/'),
  usdc: new Token(
    TESTNET,
    '0x321106E51b78E0E9CEBcFeC63C5250F0F3CcB82b',
    6,
    'USDC',
    'USD Coin',
    'https://www.circle.com/en/usdc',
  ),
  wbtc: new Token(
    TESTNET,
    '0xFFc8ce84a196420d7bCCDEe980c65364eD1f389F',
    8,
    'WBTC',
    'Wrapped BTC',
    'https://bitcoin.org/en/'),
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    // return Object.keys(mainnetTokens).reduce((accum, key) => {
    //   return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    // }, {})
    return testnetTokens; // FIXME avoid this mainnet override testnet hack
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
