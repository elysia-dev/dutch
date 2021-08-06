import React from 'react';
import { View } from 'react-native';
import Bar from './Bar';

const BarGraph: React.FC = () => {
  return (
    <View
      style={{
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      }}>
      {[1, 2, 3, 4, 5, 6].map((i) => {
        return <Bar key={i} round={i} />;
      })}
    </View>
  );
};

export default BarGraph;
