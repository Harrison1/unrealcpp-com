---
templateKey: blog-post
path: /hide-and-disable-actor
title: Hide and Disable Actor in Game
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511555757/landscape_d6swvp.jpg
featuredVideo: youtube.com
tags:
  - beginner
uev: 4.18.1
date: 2017-11-25T01:57:04.893Z
description: You have to do three things to completely hide an actor in game
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/HideActor](https://github.com/Harrison1/unrealcpp/tree/master/HideActor)**

To completely hide an actor in game you have to do three things. You have to disable it's collision, disable it from ticking, and hide it in game.

You can add the code to any actor. For this example I created a separate actor demonstrate its purpose.

Create an actor called `HideActor`. If you call your actor another name, be sure to change it throughout the code. In the header file I create two variables; `bool HideInGame` to track if we want to disable the actor and `void DisableActor` to run through all the elements we need to disable.
We put both variables in the `Disable` category to keep them separate from the actor's other attributes.

### HideActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "HideActor.generated.h"

UCLASS()
class UNREALCPP_API AHideActor : public AActor
{
	GENERATED_BODY()

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere, Category = "Disable")
	bool HideInGame;

	UFUNCTION(BlueprintCallable, Category = "Disable")
	void DisableActor(bool toHide);
	
};

```

On `BeginPlay()` we check to see if `HideInGame` is true. If `true` we run `DisableActor()`. `DisableActor()` hides the actor, disable it's collisions, and disable ti from running every frame.

### HideActor.cpp
```cpp
#include "HideActor.h"

// Called when the game starts or when spawned
void AHideActor::BeginPlay()
{
	Super::BeginPlay();

	if (HideInGame)
	{ 
		DisableActor(HideInGame); 
	}
	
}

// Called every frame
void AHideActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AHideActor::DisableActor(bool toHide) 
{
	// Hides visible components
	SetActorHiddenInGame(toHide);

	// Disables collision components
	SetActorEnableCollision(false);

	// Stops the Actor from ticking
	SetActorTickEnabled(false);
}
```
