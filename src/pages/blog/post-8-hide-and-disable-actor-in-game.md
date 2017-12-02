---
templateKey: blog-post
path: /hide-and-disable-actor
title: Hide and Disable Actor in Game
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1512222942/hide-actor_oqlvf7.jpg
featuredVideo: youtube.com
tags:
  - beginner
uev: 4.18.1
date: 2017-11-30T18:30:13.628Z
description: You have to do three things to completely hide an actor in game
---
<iframe width="560" height="315" src="https://www.youtube.com/embed/lIY6zFL95hE" frameborder="0" allowfullscreen></iframe>

**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/HideActor](https://github.com/Harrison1/unrealcpp/tree/master/HideActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

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
