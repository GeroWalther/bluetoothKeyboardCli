import { CommonActions } from '@react-navigation/native';
import React from 'react'
import { Button, Text, View } from 'react-native'

const Example = ({ navigation }) => {

    const handlePress = (index) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: `Example0${index}`
                // routes: [{ name: `Example0${index}` }],
            }),
        );
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title='Example 01' onPress={() => handlePress(1)}></Button>
            <Button title='Example 02' onPress={() => handlePress(2)}></Button>
        </View>
    )
}

export default Example
