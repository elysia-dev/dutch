import React, { useRef, useState } from 'react';
import { Dimensions, View, } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CachedImage from './CachedImage';
import AppColors from '../../enums/AppColors';

const ProductImageCarousel: React.FC<{ images: string[] }> = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 293,
        }}
      >
        <Carousel
          ref={carouselRef}
          data={images}
          layoutCardOffset={0}
          onSnapToItem={(index) => setCurrent(index)}
          renderItem={({ item, index }) => {
            return (
              <CachedImage
                key={index}
                source={{ uri: item }}
                cacheKey={item.replace(/\//g, '_')}
                style={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  resizeMode: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            );
          }}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
        />
      </View>
      <View
        style={{
          position: 'relative',
          top: 230,
          width: '100%'
        }}
      >
        <Pagination
          carouselRef={carouselRef}
          tappableDots={true}
          dotsLength={images.length || 0}
          activeDotIndex={current}
          containerStyle={{
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginLeft: 2,
            marginRight: 2,
            backgroundColor: AppColors.MAIN,
          }}
          inactiveDotStyle={{
            backgroundColor: '#BDD3E6',
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
    </>
  )
}

export default ProductImageCarousel;
