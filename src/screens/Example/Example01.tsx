import { useEffect, useState } from 'react'
import { Alert, Button, FlatList, PermissionsAndroid, Platform, Text, View } from 'react-native'
import { BleManager } from 'react-native-ble-plx'

// create your own singleton class
class BLEServiceInstance {
	manager: BleManager

	constructor() {
		this.manager = new BleManager()
	}
}

const Example01 = ({ navigation }) => {
	const BLEService = new BLEServiceInstance()
	const manager = new BleManager()
	const [devices, setDevices] = useState([])

	const requestBluetoothPermission = async () => {
		if (Platform.OS === 'ios') {
			return true
		}
		if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
			const apiLevel = parseInt(Platform.Version.toString(), 10)

			if (apiLevel < 31) {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
				return granted === PermissionsAndroid.RESULTS.GRANTED
			}
			if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
				const result = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				])

				return (
					result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
				)
			}
		}

		Alert.alert('Permission have not been granted')

		return false
	}

	const scanAndConnect = () => {
		manager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				// Handle error (scanning will be stopped automatically)
				return
			}

			const alreadyExists = devices.map(d => d?.id).includes(device?.id)

			// if () {
			if (device?.isConnectable) {
				// if (!alreadyExists) 
				setDevices(_prevState => [..._prevState, device])
			}
			// } else {
			// manager.stopDeviceScan()
			// }

			// Check if it is a device you are looking for based on advertisement data
			// or other criteria.


			// if (device?.name === 'TI BLE Sensor Tag' || device?.name === 'SensorTag') {
			// 	// Stop scanning as it's not necessary if you are scanning for one device.
			// 	

			// 	// Proceed with connection.
			// }
		})
	}

	useEffect(() => {
		console.log("DS : ", devices)
	}, [devices])

	const renderDevice = ({ item }) => {
		return <View>
			<Text>
				{item?.name}
			</Text>
		</View>
	}

	useEffect(() => {
		const subscription = manager.onStateChange(state => {
			if (state === 'PoweredOn') {
				scanAndConnect()
				subscription.remove()
			}
		}, true)
		return () => subscription.remove()
	}, [manager])

	return <View style={{ flex: 1, backgroundColor: '#00ff99', padding: 20 }}>
		<Button title='Back' onPress={navigation.goBack}></Button>
		<FlatList style={{ borderWidth: 1, }} contentContainerStyle={[]} data={devices} keyExtractor={(item, index) => `${item.id}-${index}`} renderItem={renderDevice} />
		{/* {devices?.map(device => <Text>{device?.name}</Text>)} */}
	</View>
}


export default Example01