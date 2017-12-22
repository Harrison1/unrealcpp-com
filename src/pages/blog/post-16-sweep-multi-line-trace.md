---
templateKey: blog-post
path: /sweep-multi-line-trace
title: Sweep Multi Line Trace
image: https://res.cloudinary.com/several-levels/image/upload/v1512222399/sweep-actor_ht78xh.jpg
video: Gu5f3-hFFfY
tags:
  - sweep
  - multi
  - line trace
  - raycast
uev: 4.18.2
date: 2017-12-01T10:25:44.226Z
description: How to create a sweep multi line trace that returns all the actors that the
  sphere hits.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/MySweepActor](https://github.com/Harrison1/unrealcpp/tree/master/MySweepActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

This tutorial will illustrate how to use the `SweepMultiByChannel` to return the results hit inside a given radius.

Create a new `C++` actor class and call it **MySweepActor**. We are not going to do anything to the header file. Below is the final header file script.

### MySweepActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MySweepActor.generated.h"

UCLASS()
class UNREALCPP_API AMySweepActor : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AMySweepActor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
	
};
```

Before we get the logic of the code we have to first `#include` the `DrawDebugHelpers.h` file help us visualize our actor.

#### include helpers
```cpp
#include "MySweepActor.h"
// include debug helpers
#include "DrawDebugHelpers.h"
```

For this example we are going to perform all of our logic in our `BeginPlay()` function. First we'll create a `TArray` of `FHitResults` and call it **OutHits**.  We want the sphere to start and stop in the same location and will make it equal the actor's location by using `GetActorLocation`. The Collision sphere can be different shapes, in this example we will make it a sphere by using `FCollisionShape::MakeSphere` and we'll set it's radius set to `500` unreal units. Next, run the `DrawDebugSphere` to visualize the sweeping sphere. Then, we want to set a `bool` called **isHit** to check if our sweep hit anything. We run `GetWorld()->SweepMultiByChannel` to perform the sweep channel trace and return the hit to the `OutHits` array. You can learn more about the `SweepMultiByChannel` function [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/Engine/UWorld/SweepMultiByChannel/). If `isHit` is true we will loop through the `TArray` and print out the hit actor's name and other relevant information. You can learn more about `TArrays` [here](https://docs.unrealengine.com/latest/INT/Programming/UnrealArchitecture/TArrays/).

Below is the final `.cpp` file.

### MySweepActor.cpp
```cpp
#include "MySweepActor.h"
#include "DrawDebugHelpers.h"


// Sets default values
AMySweepActor::AMySweepActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void AMySweepActor::BeginPlay()
{
	Super::BeginPlay();

	// create tarray for hit results
	TArray<FHitResult> OutHits;
	
	// start and end locations
	FVector SweepStart = GetActorLocation();
	FVector SweepEnd = GetActorLocation();

	// create a collision sphere
	FCollisionShape MyColSphere = FCollisionShape::MakeSphere(500.0f);

	// draw collision sphere
	DrawDebugSphere(GetWorld(), GetActorLocation(), MyColSphere.GetSphereRadius(), 50, FColor::Purple, true);
	
	// check if something got hit in the sweep
	bool isHit = GetWorld()->SweepMultiByChannel(OutHits, SweepStart, SweepEnd, FQuat::Identity, ECC_WorldStatic, MyColSphere);

	if (isHit)
	{
		// loop through TArray
		for (auto& Hit : OutHits)
		{
			if (GEngine) 
			{
				// screen log information on what was hit
				GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("Hit Result: %s"), *Hit.Actor->GetName()));
				// uncommnet to see more info on sweeped actor
				// GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, FString::Printf(TEXT("All Hit Information: %s"), *Hit.ToString()));
			}						
		}
	}
	
}

// Called every frame
void AMySweepActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

```

Compile the code. Drag and drop the actor into your game and the sweep will output the results.
