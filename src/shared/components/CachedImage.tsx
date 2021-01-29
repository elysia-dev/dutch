import React, { useEffect, useState, useRef, MutableRefObject } from 'react';

import { Image, ImageStyle, StyleProp } from 'react-native';

import * as FileSystem from 'expo-file-system';

type URI = string | undefined;

type Ref =
  | ((instance: Image | null) => void)
  | MutableRefObject<Image | null>
  | null;

type Props = {
  source: { uri: string };
  cacheKey: string;
  style?: StyleProp<ImageStyle>;
};

const CachedImage = React.forwardRef((props: Props, ref: Ref) => {
  const filesystemURI = `${FileSystem.cacheDirectory}${props.cacheKey}`;

  const [imgURI, setImgURI] = useState<URI>(filesystemURI);

  const componentIsMounted = useRef(true);

  type imageProps = {
    fileURI: string;
  };

  useEffect(() => {
    const loadImage = async (imageProps: imageProps) => {
      try {
        const metadata = await FileSystem.getInfoAsync(imageProps.fileURI);
        if (!metadata.exists) {
          if (componentIsMounted.current) {
            setImgURI(props.source.uri);
            await FileSystem.downloadAsync(
              props.source.uri,
              imageProps.fileURI,
            );
          }
        } else if (componentIsMounted.current) {
          setImgURI(imageProps.fileURI);
        }
      } catch (err) {
        setImgURI(props.source.uri);
      }
    };

    loadImage({ fileURI: filesystemURI });

    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Image
      {...props}
      ref={ref}
      source={{
        uri: imgURI,
      }}
    />
  );
});

export default CachedImage;
