---
templateKey: blog-post
path: /debug-logging
title: Debug Logging
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511556843/pc-setup_qawyye.jpg
featuredVideo: youtube.com
tags:
  - beginner
uev: 4.18.1
date: 2017-11-24T23:28:08.852Z
description: Debug Log
---
** Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/ConsoleLog](https://github.com/Harrison1/unrealcpp/tree/master/ConsoleLog) **

Create a new actor called ConsoleLog

### ConsoleLog.h

```cpp

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ConsoleLog.generated.h"

UCLASS()
class UNREALCPP_API AConsoleLog : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AConsoleLog();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
	
};

```

### ConsoleLog.cpp
```cpp

// define a print message function to print to screen
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Magenta, FString::Printf(TEXT(text), fstring))
#include "ConsoleLog.h"

// Sets default values
AConsoleLog::AConsoleLog()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void AConsoleLog::BeginPlay()
{
	Super::BeginPlay();

	// Standard way to log to console.
	UE_LOG(LogTemp, Warning, TEXT("I just started running"));

	// Log to Screen
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, TEXT("Screen Message"));

	FVector MyVector = FVector(200,100,900);

	// log vector
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Orange, FString::Printf(TEXT("My Location is: %s"), *GetActorLocation().ToString()));

	// Use the shortcut defined above
	print("Hello Unreal");	
	printFString("My Variable Vector is: %s", *MyVector.ToString());
	
}

// Called every frame
void AConsoleLog::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

```
