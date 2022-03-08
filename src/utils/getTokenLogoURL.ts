const getTokenLogoURL = (address: string) => `${process.env.PUBLIC_URL}/images/tokens/${address}.svg` // FIXME: update URL for token logo

export default getTokenLogoURL
