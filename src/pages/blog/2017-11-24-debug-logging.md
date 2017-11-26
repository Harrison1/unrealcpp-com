---
templateKey: blog-post
path: /debug-logging
title: Debug Logging
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511648024/console-log_gcudmg.jpg
featuredVideo: youtube.com
tags:
  - beginner
  - log
uev: 4.18.1
date: 2017-11-24T23:28:08.852Z
description: >-
  Logging out commands is helpful to debug a game. UE4 offers a variety of ways
  to log out messages. Let's go through a few types of ways of logging out
  commands.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/ConsoleLog](https://github.com/Harrison1/unrealcpp/tree/master/ConsoleLog)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

Create a new actor called ConsoleLog.

We don't have to do anything in the header file, but below is the default code that should appear when you create a new actor. I called my actor `ConsoleLog`, if you choose a different name be sure to change it where necessary.

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

The .cpp file is where we will log out our messages. For this example we will be logging out the messages in the `BeginPlay` message. So, when the game is started the messages will print out. Below are three ways of how to log messages. 

#### Log to console
```cpp
UE_LOG(LogTemp, Warning, TEXT("I just started running"));
```

#### Print to Screen
```cpp
GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, TEXT("Screen Message"));
```

#### Print Vector
```cpp
GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Orange, FString::Printf(TEXT("My Location is: %s"), *GetActorLocation().ToString()));
```

Below is the full .cpp file. The top two `define` calls are shortcuts to make logging messages easier. 

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
