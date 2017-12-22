---
templateKey: blog-post
path: /timer-actor
title: Timer Actor
image: https://res.cloudinary.com/several-levels/image/upload/v1512222942/timer_pmunrb.jpg
video: bNW5dcZwAb8
tags:
  - beginner
  - timer
uev: 4.18.2
date: 2017-12-01T08:25:44.226Z
description: How to set a log message to print to screen every 2 seconds
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/TimerActor](https://github.com/Harrison1/unrealcpp/tree/master/TimerActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

We'll create a new actor called `TimerActor`. 

In the header file we will add a function to repeat every 2 seconds a `FTimerHandle` class to manage the function in the world's time.

### TimerActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "TimerActor.generated.h"

UCLASS()
class UNREALCPP_API ATimerActor : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ATimerActor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	void RepeatingFunction();
	
	FTimerHandle MemberTimerHandle;
	
};
```

In the `.cpp` file, it is necessary to include the `TimerManager.h` file. The `TimerManager.h` is necessary if we want use the engines World Time Manager. You add `TimerManager.h` by adding `#include "TimManager.h"` below the actor's header file.

On `BeginPlay()` set our world timer to play our `RepeatingFunction()` every 2 seconds after 5 seconds of play. So when you push play, wait 5 seconds and the function will then play every 2 seconds. The repeating function is very simple function that prints to the screen.

### TimerActor.cpp
```cpp
#include "TimerActor.h"
#include "TimerManager.h"


// Sets default values
ATimerActor::ATimerActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;	

}

// Called when the game starts or when spawned
void ATimerActor::BeginPlay()
{
	Super::BeginPlay();

	// connect timer function to actor. After 5 seconds run RepeatingFunction every 2 seconds 
	GetWorldTimerManager().SetTimer(MemberTimerHandle, this, &ATimerActor::RepeatingFunction, 2.0f, true, 5.0f);
}

// Called every frame
void ATimerActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void ATimerActor::RepeatingFunction()
{
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, TEXT("Hello Timer"));
}
```
