import { ChainId, Currency, currencyEquals, JSBI, Price } from '@acentswap/ade-sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import tokens, { mainnetTokens } from 'config/constants/tokens'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const USDC_MAINNET = mainnetTokens.usdc
const { wace: WACE } = tokens

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUsdcPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(WACE, wrapped) ? undefined : currency, chainId ? WACE : undefined],
      [wrapped?.equals(USDC_MAINNET) ? undefined : wrapped, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
      [chainId ? WACE : undefined, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WACE)) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WACE)
        return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle usdc
    if (wrapped.equals(USDC_MAINNET)) {
      return new Price(USDC_MAINNET, USDC_MAINNET, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WACE)
    const ethPairETHUsdcValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WACE).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(USDC_MAINNET).greaterThan(ethPairETHUsdcValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(USDC_MAINNET).greaterThan('0') && ethPair.reserveOf(WACE).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(USDC_MAINNET)
        const currencyEthPrice = ethPair.priceOf(WACE)
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, USDC_MAINNET, usdcPrice.denominator, usdcPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}

export const useAdeUsdcPrice = (): Price | undefined => {
  const adeUsdcPrice = useUsdcPrice(tokens.ade)
  return adeUsdcPrice
}

export const useAceUsdcPrice = (): Price | undefined => {
  const aceUsdcPrice = useUsdcPrice(tokens.wace)
  return aceUsdcPrice
}
