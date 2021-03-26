
// ELYSIA_ASSET_BLUE_3_EL => AssetBlue3El
const assetTokenNamePrettier = (input: string): string => {
  try {
    const res = input.toLowerCase().replaceAll('elysia_', '').split('_').map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join('')
    return res
  } catch {
    return input
  }
}

export default assetTokenNamePrettier
