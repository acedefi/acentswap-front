import { Currency, ETHER, Token } from '@acentswap/ade-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ACE'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
