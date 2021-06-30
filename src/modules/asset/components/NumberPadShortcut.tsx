import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface Props {
  current: string
  values: number[]
  inputValue: string
  setValues: any // 이름에 value가 너무 많이 들어가서 좀 헷갈리긴 한다... 그리고 타입도 좀 엄밀하게
  fromToRatio: number
}

const NumberPadShortcut: React.FC<Props> = ({
  current,
  values,
  inputValue,
  setValues,
  fromToRatio,
}) => {
  const buttons = [];
  for (let i=0; i<values.length; i++) {
    buttons.push(
      <TouchableOpacity
        style={{
          borderRadius: 5,
          borderColor: '#C8C8C8',
          borderWidth: 1,
          width: 56,
          height: 27,
        }}
        onPress={() => addValue(values[i])}
      >
        <Text style={{ textAlign: 'center' }}>
          {`${current === 'to' ? '+' : '$'}${values[i]}`}
          </Text>
      </TouchableOpacity>
    )
  }

  // 아 헐 지분/금액을 왔다갔다하더라도 변환만 하고 값은 유지되어야 하는구나!!!!!!!! 이걸 안 하고 있었던 듯.....
  // 그니까 새로 만든 Input이랑 NumberPad가 제대로 연결이 됐는지 모르겠다...
  // 지금은 금액을 입력해도 지분이 바뀌지 않음 ㅠㅠ
  function addValue(value: number) {
    const newInputValue = parseFloat(inputValue) + value // Number() 하면서 소수점이 엄청 생기지는 않나 검사해야 함..!!!!

    if (current === 'from') {
      setValues({
        from: String(newInputValue),
        to: (newInputValue * fromToRatio).toFixed(2),
      })
    } else {
      setValues({
        from: (newInputValue / fromToRatio).toFixed(2),
        to: String(newInputValue),
      })
    }
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
        }}
      >
        {buttons}
      </View>
    </View>
  );
};

export default NumberPadShortcut;