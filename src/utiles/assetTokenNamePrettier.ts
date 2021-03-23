
// ELYSIA_ASSET_BLUE_3_EL => AssetBlue3El
const assetTokenNamePrettier = (input: string): string => {
  return input.toLowerCase().replaceAll('elysia_', '').split('_').map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join('');
}

export default assetTokenNamePrettier
