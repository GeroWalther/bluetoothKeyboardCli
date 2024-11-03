//
//  BLEHIDManager.m
//  ble
//
//  Created by Hassan Ahmad on 01/11/2024.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(BLEHIDManager, NSObject)

RCT_EXTERN_METHOD(sendKeys:(NSString *)key)
RCT_EXTERN_METHOD(moveMouse:(NSString *)direction)
RCT_EXTERN_METHOD(mouseClick:(NSString *)button)

@end
