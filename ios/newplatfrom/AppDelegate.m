//
//  AppDelegate.m
//
//  Copyright (c) 2014-2015 egret. All rights reserved.
//

#import "AppDelegate.h"
#import "WXApiManager.h"
#include "WebService.h"
#import <AdSupport/AdSupport.h>
#import "UMMobClick/MobClick.h"
#import <AlipaySDK/AlipaySDK.h>
#import "AliPayManager.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	// Override point for customization after application launch.
	
	// [ GTSdk ]：是否允许APP后台运行
	//    [GeTuiSdk runBackgroundEnable:YES];

    NSUserDefaults *TimeOfBootCount = [NSUserDefaults standardUserDefaults];
    if (![TimeOfBootCount valueForKey:@"time"]) {
        [TimeOfBootCount setValue:@"sd" forKey:@"time"];
        NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
        if (adId == nil) {
            adId = [[NSUUID UUID] UUIDString];
        }
        [[WebService getInstance] fisrtLaunchNotify:adId
                                           callback:^(NSMutableDictionary *response) {
                                           }];
        //NSLog(@"第一次启动");
    }else{
        NSLog(@"不是第一次启动");
    }
    [self LoadUMMobClick];
	// [ GTSdk ]：是否运行电子围栏Lbs功能和是否SDK主动请求用户定位
	[GeTuiSdk lbsLocationEnable:YES andUserVerify:YES];
	
	// [ GTSdk ]：自定义渠道
	[GeTuiSdk setChannelId:@"GT-Channel"];
	
	// [ GTSdk ]：使用APPID/APPKEY/APPSECRENT创建个推实例
	[GeTuiSdk startSdkWithAppId:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret delegate:self];
	
	// 注册APNs - custom method - 开发者自定义的方法
	[self registerRemoteNotification];
	
	[GeTuiSdk resetBadge];
	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
	
	[NSThread sleepForTimeInterval:2.0];
	
	return YES;
}

/*友盟*/
-(void) LoadUMMobClick
{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    [MobClick setAppVersion:version];
    UMConfigInstance.appKey = @"59ba34ee310c930a1100001a";
    UMConfigInstance.channelId = @"official";
    UMConfigInstance.eSType = E_UM_GAME; //仅适用于游戏场景，应用统计不用设置
    [MobClick startWithConfigure:UMConfigInstance];//配置以上参数后调用此方法初始化SDK！
}

/** 注册 APNs */
- (void)registerRemoteNotification {
	/*
	 警告：Xcode8 需要手动开启"TARGETS -> Capabilities -> Push Notifications"
	 */
	
	/*
	 警告：该方法需要开发者自定义，以下代码根据 APP 支持的 iOS 系统不同，代码可以对应修改。
	 以下为演示代码，注意根据实际需要修改，注意测试支持的 iOS 系统都能获取到 DeviceToken
	 */
	if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0 // Xcode 8编译会调用
		UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
		center.delegate = self;
		[center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionCarPlay) completionHandler:^(BOOL granted, NSError *_Nullable error) {
			if (!error) {
				NSLog(@"request authorization succeeded!");
			}
		}];
		
		[[UIApplication sharedApplication] registerForRemoteNotifications];
#else // Xcode 7编译会调用
		UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge);
		UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
		[[UIApplication sharedApplication] registerForRemoteNotifications];
		[[UIApplication sharedApplication] registerUserNotificationSettings:settings];
#endif
	} else if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
		UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeSound | UIUserNotificationTypeBadge);
		UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
		[[UIApplication sharedApplication] registerForRemoteNotifications];
		[[UIApplication sharedApplication] registerUserNotificationSettings:settings];
	} else {
		UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert |
																																	 UIRemoteNotificationTypeSound |
																																	 UIRemoteNotificationTypeBadge);
		[[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
	}
}

#pragma mark - 远程通知(推送)回调

/** 远程通知注册成功委托 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
	NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
	token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
	NSLog(@"\n>>>[DeviceToken Success]:%@\n\n", token);
	
	// [ GTSdk ]：向个推服务器注册deviceToken
	[GeTuiSdk registerDeviceToken:token];
}

/** 远程通知注册失败委托 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
	NSLog(@"\n>>>[DeviceToken Error]:%@\n\n", error.description);
}

#pragma mark - APP运行中接收到通知(推送)处理 - iOS 10以下版本收到推送

/** APP已经接收到“远程”通知(推送) - 透传推送消息  */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
	
	// [ GTSdk ]：将收到的APNs信息传给个推统计
	[GeTuiSdk handleRemoteNotification:userInfo];
	
	// 控制台打印接收APNs信息
	NSLog(@"\n>>>[Receive RemoteNotification]:%@\n\n", userInfo);
	
	completionHandler(UIBackgroundFetchResultNewData);
}

#pragma mark - iOS 10中收到推送消息

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
//  iOS 10: App在前台获取到通知
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
	
	NSLog(@"willPresentNotification：%@", notification.request.content.userInfo);
	
	// 根据APP需要，判断是否要提示用户Badge、Sound、Alert
	completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}

//  iOS 10: 点击通知进入App时触发
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
	
	NSLog(@"didReceiveNotification：%@", response.notification.request.content.userInfo);
	
	// [ GTSdk ]：将收到的APNs信息传给个推统计
	[GeTuiSdk handleRemoteNotification:response.notification.request.content.userInfo];
	
	completionHandler();
}
#endif

#pragma mark - GeTuiSdkDelegate

/** SDK启动成功返回cid */
- (void)GeTuiSdkDidRegisterClient:(NSString *)clientId {
	// [4-EXT-1]: 个推SDK已注册，返回clientId
	NSLog(@"\n>>[GTSdk RegisterClient]:%@\n\n", clientId);
}

/** SDK遇到错误回调 */
- (void)GeTuiSdkDidOccurError:(NSError *)error {
	// [EXT]:个推错误报告，集成步骤发生的任何错误都在这里通知，如果集成后，无法正常收到消息，查看这里的通知。
	NSLog(@"\n>>[GTSdk error]:%@\n\n", [error localizedDescription]);
}


/** SDK收到透传消息回调 */
- (void)GeTuiSdkDidReceivePayloadData:(NSData *)payloadData andTaskId:(NSString *)taskId andMsgId:(NSString *)msgId andOffLine:(BOOL)offLine fromGtAppId:(NSString *)appId {
	// [ GTSdk ]：汇报个推自定义事件(反馈透传消息)
	[GeTuiSdk sendFeedbackMessage:90001 andTaskId:taskId andMsgId:msgId];
	
	// 数据转换
	NSString *payloadMsg = nil;
	if (payloadData) {
		payloadMsg = [[NSString alloc] initWithBytes:payloadData.bytes length:payloadData.length encoding:NSUTF8StringEncoding];
	}
	
	// 控制台打印日志
	NSString *msg = [NSString stringWithFormat:@"taskId=%@,messageId:%@,payloadMsg:%@%@", taskId, msgId, payloadMsg, offLine ? @"<离线消息>" : @""];
	NSLog(@"\n>>[GTSdk ReceivePayload]:%@\n\n", msg);
}

/** SDK收到sendMessage消息回调 */
- (void)GeTuiSdkDidSendMessage:(NSString *)messageId result:(int)result {
	// 发送上行消息结果反馈
	NSString *msg = [NSString stringWithFormat:@"sendmessage=%@,result=%d", messageId, result];
	NSLog(@"\n>>[GTSdk DidSendMessage]:%@\n\n", msg);
}

/** SDK运行状态通知 */
- (void)GeTuiSDkDidNotifySdkState:(SdkStatus)aStatus {
	// 通知SDK运行状态
	NSLog(@"\n>>[GTSdk SdkState]:%u\n\n", aStatus);
}

/** SDK设置推送模式回调 */
- (void)GeTuiSdkDidSetPushMode:(BOOL)isModeOff error:(NSError *)error {
	if (error) {
		NSLog(@"\n>>[GTSdk SetModeOff Error]:%@\n\n", [error localizedDescription]);
		return;
	}
	
	NSLog(@"\n>>[GTSdk SetModeOff]:%@\n\n", isModeOff ? @"开启" : @"关闭");
}

/** SDK绑定别名回调 */
- (void)GeTuiSdkDidAliasAction:(NSString *)action result:(BOOL)isSuccess sequenceNum:(NSString *)aSn error:(NSError *)aError {
	if ([kGtResponseBindType isEqualToString:action]) {
		NSLog(@"绑定结果 ：%@ !, sn : %@", isSuccess ? @"成功" : @"失败", aSn);
		if (!isSuccess) {
			NSLog(@"失败原因: %@", aError);
		}
	} else if ([kGtResponseUnBindType isEqualToString:action]) {
		NSLog(@"绑定结果 ：%@ !, sn : %@", isSuccess ? @"成功" : @"失败", aSn);
		if (!isSuccess) {
			NSLog(@"失败原因: %@", aError);
		}
	}
}

-(UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
	if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone)
		return UIInterfaceOrientationMaskAll;
	else
		return UIInterfaceOrientationMaskAllButUpsideDown;
}

- (void)applicationWillResignActive:(UIApplication *)application {
	// Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
	// Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
	// Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
	// If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
	// Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
	// Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
	// Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
	return  [WXApi handleOpenURL:url delegate:[WXApiManager getInstance]];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    if ([url.host isEqualToString:@"safepay"]) {
        //跳转支付宝钱包进行支付，处理支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"result = %@",resultDic);
            [[AliPayManager getInstance] onPayResult:resultDic withCallback:nil];
        }];
        return YES;
    }
    
	return [WXApi handleOpenURL:url delegate:[WXApiManager getInstance]];
}

@end
