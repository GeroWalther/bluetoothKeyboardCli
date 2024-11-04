//
//  BLEHIDManager.swift
//  keyboard
//
//
import UIKit
import Foundation
import CoreBluetooth

@objc(BLEHIDManager)
class BLEHIDManager: NSObject, CBPeripheralManagerDelegate, ObservableObject {
  private var peripheralManager: CBPeripheralManager?
  
  private var reportMapCharacteristic: CBMutableCharacteristic?
  
  private var BReport: CBMutableCharacteristic?
  private var AReport: CBMutableCharacteristic?
  private var CReport: CBMutableCharacteristic?
  
  private var protocolModeCharacteristic: CBMutableCharacteristic?
  private var controlPointCharacteristic: CBMutableCharacteristic?
  private var bootKeyboardInputReportCharacteristic: CBMutableCharacteristic?
  private var bootKeyboardOutputReportCharacteristic: CBMutableCharacteristic?
  
  private var batteryLevelCharacteristic: CBMutableCharacteristic?
  
  @Published var isBluetoothReady = false
  private var canSendData = false
  private var shouldReconnect = true
  
  private var currentProtocolMode: UInt8 = 0x01
  private let gattServiceUUID = CBUUID(string: "00001801-0000-1000-8000-00805F9B34FB")
  private let serviceChangedCharacteristicUUID = CBUUID(string: "00002A05-0000-1000-8000-00805F9B34FB")
  private let gapServiceUUID = CBUUID(string: "00001800-0000-1000-8000-00805F9B34FB")
  private let deviceNameCharacteristicUUID = CBUUID(string: "00002A00-0000-1000-8000-00805F9B34FB")
  private let appearanceCharacteristicUUID = CBUUID(string: "00002A01-0000-1000-8000-00805F9B34FB")
  private let deviceInfoServiceUUID: CBUUID = CBUUID(string: "0000180A-0000-1000-8000-00805F9B34FB")
  private let pnpIDCharacteristicUUID = CBUUID(string: "00002A50-0000-1000-8000-00805F9B34FB")
  private let manufacturerNameCharacteristicUUID: CBUUID = CBUUID(string: "00002A29-0000-1000-8000-00805F9B34FB")
  private let batteryServiceUUID: CBUUID = CBUUID(string: "0000180F-0000-1000-8000-00805F9B34FB")
  private let batteryLevelCharacteristicUUID = CBUUID(string: "00002A19-0000-1000-8000-00805F9B34FB")
  private let hidServiceUUID: CBUUID = CBUUID(string: "00001812-0000-1000-8000-00805F9B34FB")
  private let hidInformationCharacteristicUUID: CBUUID = CBUUID(string: "00002A4A-0000-1000-8000-00805F9B34FB")
  private let reportMapCharacteristicUUID: CBUUID = CBUUID(string: "00002A4B-0000-1000-8000-00805F9B34FB")
  private let reportReferenceDiscriptorUUID: CBUUID = CBUUID(string: "00002908-0000-1000-8000-00805F9B34FB")
  private let reportCharacteristicUUID: CBUUID = CBUUID(string: "00002A4D-0000-1000-8000-00805F9B34FB")
  private let protocolModeCharacteristicUUID: CBUUID = CBUUID(string: "00002A4E-0000-1000-8000-00805F9B34FB")
  private let controlPointCharacteristicUUID: CBUUID = CBUUID(string: "00002A4C-0000-1000-8000-00805F9B34FB")
  private let bootKeyboardInputReportCharacteristicUUID: CBUUID = CBUUID(string: "00002A22-0000-1000-8000-00805F9B34FB")
  private let bootKeyboardOutputReportCharacteristicUUID: CBUUID = CBUUID(string: "00002A32-0000-1000-8000-00805F9B34FB")
  
  private let advertiseLocalName: String = "Hassan Keyboard"
  
  private var connectedCentral: CBCentral?
  
  private let HID_REPORT_DESCRIPTOR: [UInt8] = [
    0x05, 0x01, 0x09, 0x02, 0xA1, 0x01, 0x85, 0x01, 0x09, 0x01, 0xA1, 0x00, 0x05, 0x09, 0x19, 0x01,
    0x29, 0x03, 0x75, 0x01, 0x95, 0x03, 0x15, 0x00, 0x25, 0x01, 0x81, 0x02, 0x95, 0x05, 0x81, 0x03,
    0x05, 0x01, 0x09, 0x30, 0x09, 0x31, 0x09, 0x38, 0x75, 0x08, 0x95, 0x03, 0x15, 0x81, 0x25, 0x7F,
    0x81, 0x06, 0xC0, 0xC0, 0x05, 0x01, 0x09, 0x06, 0xA1, 0x01, 0x85, 0x02, 0x05, 0x07, 0x19, 0xE0,
    0x29, 0xE7, 0x75, 0x01, 0x95, 0x08, 0x15, 0x00, 0x25, 0x01, 0x81, 0x02, 0x95, 0x01, 0x75, 0x08,
    0x81, 0x01, 0x19, 0x00, 0x29, 0xDD, 0x95, 0x06, 0x25, 0xDD, 0x81, 0x00, 0x85, 0x03, 0x05, 0x08,
    0x19, 0x01, 0x29, 0x05, 0x95, 0x05, 0x75, 0x01, 0x25, 0x01, 0x91, 0x02, 0x95, 0x03, 0x91, 0x03,
    0xC0
  ]
  
  override init() {
    super.init()
    self.peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
  }
  
  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    if peripheral.state == .poweredOn {
      print("BLE HID Manager is powered on")
      isBluetoothReady = true
      setupServices()
      updateBatteryLevel()
      startAdvertising()
      
    }
    else {
      print("BLE HID Manager is powered on")
      isBluetoothReady = false
    }
  }
  
  func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest) {
    if request.characteristic.uuid == protocolModeCharacteristicUUID {
      protocolModeCharacteristic!.value = Data([currentProtocolMode])
      request.value = Data([currentProtocolMode]) // Respond with the current mode
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else if request.characteristic.uuid == reportMapCharacteristicUUID {
      request.value = reportMapCharacteristic!.value
      peripheralManager?.respond(to: request, withResult: .success)
      
    }
    else if request.characteristic.uuid == batteryLevelCharacteristicUUID {
      let batteryLevel = getSystemBatteryLevel()
      request.value = Data([batteryLevel])
      peripheralManager?.respond(to: request, withResult: .success)
    }
    
    else if request.characteristic == BReport {
      request.value = BReport!.value
      peripheralManager?.respond(to: request, withResult: .success)
      
    }
    else if request.characteristic == AReport {
      request.value = AReport!.value
      peripheralManager?.respond(to: request, withResult: .success)
      
    }
    else if request.characteristic == CReport {
      request.value = CReport!.value
      peripheralManager?.respond(to: request, withResult: .success)
      
    }
    
    else if request.characteristic.uuid == bootKeyboardInputReportCharacteristicUUID {
      request.value = bootKeyboardInputReportCharacteristic!.value
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else if request.characteristic.uuid == bootKeyboardOutputReportCharacteristicUUID {
      request.value = bootKeyboardOutputReportCharacteristic!.value
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else if request.characteristic.uuid == controlPointCharacteristicUUID {
      controlPointCharacteristic!.value = Data([0x01])
      request.value = controlPointCharacteristic!.value
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else {
      peripheralManager?.respond(to: request, withResult: .requestNotSupported)
    }
  }
  
  func getSystemBatteryLevel() -> UInt8 {
    UIDevice.current.isBatteryMonitoringEnabled = true
    let batteryLevel = UIDevice.current.batteryLevel
    let batteryPercentage = UInt8(batteryLevel * 100)
    return batteryPercentage
  }
  
  func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
    for request in requests {
      if request.characteristic.uuid == protocolModeCharacteristicUUID {
        handleProtocolModeChange(request)
      } else if request.characteristic.uuid == reportCharacteristicUUID {
        handleReportWrite(request)
      }
      else if request.characteristic.uuid == batteryLevelCharacteristicUUID {
        request.value = batteryLevelCharacteristic!.value
        peripheralManager?.respond(to: request, withResult: .success)
      }
      else if request.characteristic.uuid == controlPointCharacteristicUUID {
        handleControlPointWrite(request)
      }
      else {
        print("didReceiveWrite Unknown characteristic: \(request.characteristic.uuid)")
        peripheralManager?.respond(to: request, withResult: .requestNotSupported)
      }
    }
  }
  
  private func handleProtocolModeChange(_ request: CBATTRequest) {
    guard let newValue = request.value?.first else {
      peripheralManager?.respond(to: request, withResult: .invalidAttributeValueLength)
      return
    }
    
    if newValue == 0x01 {
      currentProtocolMode = newValue
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else if newValue == 0x00 {
      currentProtocolMode = newValue
      peripheralManager?.respond(to: request, withResult: .success)
    }
    else {
      print("Invalid protocol mode value")
      peripheralManager?.respond(to: request, withResult: .invalidPdu)
    }
  }
  
  private func handleReportWrite(_ request: CBATTRequest) {
    guard let data = request.value else {
      peripheralManager?.respond(to: request, withResult: .invalidAttributeValueLength)
      return
    }
    peripheralManager?.respond(to: request, withResult: .success)
  }
  
  private func handleControlPointWrite(_ request: CBATTRequest) {
    guard let value = request.value, let command = value.first else {
      peripheralManager?.respond(to: request, withResult: .invalidAttributeValueLength)
      return
    }
    
    peripheralManager?.respond(to: request, withResult: .success)
  }
  
  func startAdvertising() {
    let advertisementData: [String: Any] = [
      CBAdvertisementDataLocalNameKey: advertiseLocalName,
      CBAdvertisementDataServiceUUIDsKey: [hidServiceUUID],
    ]
    
    peripheralManager?.startAdvertising(advertisementData)
  }
  
  private func setupServices() {
    
    let deviceInfoService = CBMutableService(type: deviceInfoServiceUUID, primary: false)
    
    let pnpValue = Data(NSData(bytes: [0x0002, 0x10C4, 0x0001, 0x0001] as [UInt16], length: 8))
    let pnpIDCharacteristic = CBMutableCharacteristic(type: pnpIDCharacteristicUUID, properties: [.read], value: pnpValue, permissions: [.readable])
    
    let manufacturerNameCharacteristic = CBMutableCharacteristic(
      type: manufacturerNameCharacteristicUUID,
      properties: [.read],
      value: Data("HassanBleKeyboard".utf8),
      permissions: [.readable]
    )
    
    deviceInfoService.characteristics = [pnpIDCharacteristic, manufacturerNameCharacteristic]
    peripheralManager?.add(deviceInfoService)
    
    batteryLevelCharacteristic = CBMutableCharacteristic(
      type: batteryLevelCharacteristicUUID,
      properties: [.read, .notify],
      value: nil, // Battery level set to 100%
      permissions: [.readable]
    )
    
    let batteryService = CBMutableService(type: batteryServiceUUID, primary: true)
    batteryService.characteristics = [batteryLevelCharacteristic!]
    peripheralManager?.add(batteryService)
    
    let hidInformationCharacteristic = CBMutableCharacteristic(
      type: hidInformationCharacteristicUUID,
      properties: [.read],
      value: Data(NSData(bytes: [0x01, 0x11, 0x00, 0x02] as [UInt8], length: 4)),
      permissions: [.readable]
    )
    
    protocolModeCharacteristic = CBMutableCharacteristic(
      type: protocolModeCharacteristicUUID,
      properties: [.read, .notify, .writeWithoutResponse],
      value: nil,
      permissions: [.readable, .writeable]
    )
    
    reportMapCharacteristic = CBMutableCharacteristic(
      type: reportMapCharacteristicUUID,
      properties: [.read],
      value: Data(HID_REPORT_DESCRIPTOR),
      permissions: [.readable]
    )
    
    controlPointCharacteristic = CBMutableCharacteristic(
      type: controlPointCharacteristicUUID,
      properties: [.read, .writeWithoutResponse],
      value: nil,
      permissions: [.readable, .writeable]
    )
    
    bootKeyboardInputReportCharacteristic = CBMutableCharacteristic(
      type: bootKeyboardInputReportCharacteristicUUID,
      properties: [.read, .notify, .write],
      value: nil,
      permissions: [.readable, .writeable]
    )
    
    bootKeyboardOutputReportCharacteristic = CBMutableCharacteristic(
      type: bootKeyboardOutputReportCharacteristicUUID,
      properties: [.read, .write, .writeWithoutResponse],
      value: nil,
      permissions: [.readable, .writeable]
    )
    
    BReport = CBMutableCharacteristic(type: reportCharacteristicUUID, properties: [.read, .notify], value: nil, permissions: [.readable])
    BReport!.descriptors = [CBMutableDescriptor(type: reportReferenceDiscriptorUUID, value: Data([0x01, 0x01]) )]
    
    AReport = CBMutableCharacteristic(type: reportCharacteristicUUID, properties: [.read, .notify], value: nil, permissions: [.readable])
    AReport!.descriptors = [CBMutableDescriptor(type: reportReferenceDiscriptorUUID, value: Data([0x02, 0x01]) )]
    
    CReport = CBMutableCharacteristic(type: reportCharacteristicUUID, properties: [.read, .write], value: nil, permissions: [.readable, .writeable])
    CReport!.descriptors = [CBMutableDescriptor(type: reportReferenceDiscriptorUUID, value: Data([0x03, 0x02]) )]
    
    let hidService = CBMutableService(type: hidServiceUUID, primary: true)
    
    hidService.characteristics = [
      hidInformationCharacteristic,
      protocolModeCharacteristic!,
      reportMapCharacteristic!,
      BReport!,
      AReport!,
      CReport!,
      controlPointCharacteristic!
    ]
    peripheralManager?.add(hidService)
  }
  
  func updateBatteryLevel() {
    let AReportSampleData = Data( [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    let BReportSampleData = Data([0x00, 0x00, 0x00, 0x00])
    let CReportSampleData = Data([0x00])
    
    protocolModeCharacteristic!.value = Data(bytes: [currentProtocolMode] as [UInt8], count: 1)
    AReport!.value = AReportSampleData
    BReport!.value = BReportSampleData
    CReport!.value = CReportSampleData
    
    let batteryLevel = getSystemBatteryLevel()
    peripheralManager?.updateValue(Data([batteryLevel]), for: batteryLevelCharacteristic!, onSubscribedCentrals: nil)
  }
  
  func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
    print("BLE HID Keyboard advertising started")
  }
  
  @objc(sendKeys:)
  func sendKeys(_ key: String) -> Void {
    if(key == "A"){
      sendKeyPress(keyCode: 0x04)
    }
    else if(key == "B"){
      sendKeyPress(keyCode: 0x05)
    }
  }
  
  @objc(moveMouse:)
  func moveMouse(_ direction: String) -> Void {
    switch direction {
      case "right":
        peripheralManager?.updateValue(
          Data(
            [
              0x00,
              0x0A,
              0x00,
              0x00
            ]),
          for: BReport!,
          onSubscribedCentrals: nil)
      case "left":
        peripheralManager?.updateValue(
          Data(
            [
              0x00,
              0xF6,
              0x00,
              0x00
            ]),
          for: BReport!,
          onSubscribedCentrals: nil)
      case "up":
        peripheralManager?.updateValue(
          Data(
            [
              0x00, // 0x01 is left 0x02 right click
              0x00, // x
              0xF6, // y
              0x00  // related to something else
            ]),
          for: BReport!,
          onSubscribedCentrals: nil)
      case "down":
        peripheralManager?.updateValue(
          Data(
            [
              0x00,
              0x00,
              0x0A,
              0x00
            ]),
          for: BReport!,
          onSubscribedCentrals: nil)
      default:
        print("Invalid direction")
    }
  }
  
  @objc(mouseClick:)
  func mouseClick(_ button: String) -> Void {
    if(button == "left") {
      peripheralManager?.updateValue(
        Data(
          [
            0x01,
            0x00,
            0x00,
            0x00
          ]),
        for: BReport!,
        onSubscribedCentrals: nil)
      usleep(50000)
      peripheralManager?.updateValue(
        Data(
          [
            0x00,
            0x00,
            0x00,
            0x00]
        ),
        for: BReport!,
        onSubscribedCentrals: nil)
    }
    else if(button == "right") {
      peripheralManager?.updateValue(
        Data(
          [
            0x02,
            0x00,
            0x00,
            0x00
          ]),
        for: BReport!,
        onSubscribedCentrals: nil)
      usleep(50000)
      peripheralManager?.updateValue(
        Data(
          [
            0x00,
            0x00,
            0x00,
            0x00
          ]),
        for: BReport!,
        onSubscribedCentrals: nil)
    }
  }
  
  //below not in use
  func sendKeyPress(keyCode: UInt8) {
    peripheralManager?.updateValue(
      Data(
        [
          0x00,
          0x00,
          keyCode,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00
        ]),
      for: AReport!,
      onSubscribedCentrals: nil)
    usleep(50000)
    peripheralManager?.updateValue(
      Data(
        [
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00
        ]),
      for: AReport!,
      onSubscribedCentrals: nil)
  }
  
  func sendKeyRelease() {
    peripheralManager?.updateValue(
      Data([
        0x00,
        0x00,
        0x00,
        0x00, 0x00, 0x00, 0x00, 0x00
      ]),
      for: AReport!,
      onSubscribedCentrals: nil)
  }
  
  func moveMouse() {
    peripheralManager?.updateValue(
      Data([
        0x00,
        0x0A,
        0x00,
        0x00
      ]),
      for: BReport!,
      onSubscribedCentrals: nil)
  }
}
