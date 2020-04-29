#import <Foundation/Foundation.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
#import <React/RCTBridgeModule.h>
#import <Firebase/Firebase.h>

@interface FCM: NSObject<RCTBridgeModule>
@end

@implementation FCM

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getToken:(RCTPromiseResolveBlock) resolve:(RCTPromiseRejectBlock) reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([UIApplication sharedApplication].isRegisteredForRemoteNotifications == NO) {
      reject(@"error", @"error", nil);
      return;
    }

    [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result, NSError * _Nullable error) {
      if (error) {
        reject(@"error", @"error", nil);
      } else {
        resolve(result.token);
      }
    }];
  });
}

@end