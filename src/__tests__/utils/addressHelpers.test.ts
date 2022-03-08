import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    8899: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    3034: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  }

  it(`get address for mainnet (chainId 8899)`, () => {
    process.env.REACT_APP_CHAIN_ID = '8899'
    const expected = address[8899]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for testnet (chainId 3034)`, () => {
    process.env.REACT_APP_CHAIN_ID = '3034'
    const expected = address[3034]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for any other network (chainId 31337)`, () => {
    process.env.REACT_APP_CHAIN_ID = '31337'
    const expected = address[31337]
    expect(getAddress(address)).toEqual(expected)
  })
})
