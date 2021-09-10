import React, { useState } from 'react';
import CryptoType from '../enums/CryptoType';

function useBoolean(
  assetType?: CryptoType | '',
): [boolean, (isBoolean: boolean) => void] {
  const notErc20 = [CryptoType.BNB, CryptoType.ETH];

  const [isBoolean, setIsboolean] = useState(
    assetType ? notErc20.includes(assetType) : false,
  );

  const changeBoolean = (isBoolean: boolean) => {
    setIsboolean(isBoolean);
  };

  return [isBoolean, changeBoolean];
}

export default useBoolean;
