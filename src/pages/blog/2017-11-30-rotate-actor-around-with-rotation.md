---
templateKey: blog-post
path: /rotate-actor-around-player-with-rotation
title: Rotate Actor Around Player With Rotation
author: Harrison McGuire
authorImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657694/rotate-object-with-rotation_lnv9tc.jpg
tags:
  - rotation
  - location
uev: 4.18.1
date: 2017-11-30T06:06:44.226Z
description: >-
  Tutorial on how to rotate an actor around a point while always having the actor face the origin.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/RotateActorAroundWithRotation](https://github.com/Harrison1/unrealcpp/tree/master/RotateActorAroundWithRotation)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we will be rotating an actor around a set point in the game world with it always facing the origin. Start by creating a new `C++` actor class and call it **RotateActorAroundWithRotation**. In the header file we'll create two `float` variables and two `FVector` variables and make them `EditAnywhere` so we can edit them later on inside the editor. Below is the final header file code.

### RotateActorAroundWithRotation.cpp
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RotateActorAroundWithRotation.generated.h"

UCLASS()
class UNREALCPP_API ARotateActorAroundWithRotation : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ARotateActorAroundWithRotation();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare our float variables
	UPROPERTY(EditAnywhere, Category = Movement)
	float AngleAxis;

	UPROPERTY(EditAnywhere, Category = Movement)
	FVector Dimensions;

	UPROPERTY(EditAnywhere, Category = Movement)
	FVector AxisVector;

	UPROPERTY(EditAnywhere, Category = Movement)
	float Multiplier;
	
};
```

In the `.cpp` let's start by setting some default values for our actor. I took some time playing around with the variables so I think my default should suffice to get us going, but feel free to change them to whatever you want.

#### default values
```cpp
// Sets default values
ARotateActorAroundWithRotation::ARotateActorAroundWithRotation()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;

}
```

All of our logic is going to go in the `Tick` function. Every frame we want to set our fixed location by setting our `NewLocation` to a fixed `FVector` variable. In your game you might want to connect the `NewLocation` to another actor or at least make it `EditAnywhere` in the editor, but for this tutorial let's just set it and move on. Alternatively, you can set `NewLocation` to the player location so the actor always rotates around the player.

Next, we want to add to our `AngleAxis` variable which will indicate the degree around the point the actor should move to. We add `DeltaTime` multiplied by our `Multiplier` for smooth movement. If `AngleAxis` is greater than or equal to 360 we re-set the `AngleAxis` to 0.

Next, we'll set `RotateValue` by using the `RotateAngleAxis` functions from our `Dimensions` vector. This will return the amount of units needed to move the actor to its next location. Add `RotateValue`'s X, Y, and Z values to our `NewLocation` variable accordingly. Next, we'll configure our new ration by makeing a `FRotator` value and setting the value to `FRotator(0, AngleAxis, 0)`. Then we'll make a `FQuat` using the `NewRotation` value.

Finally, set the actor's location and rotation with `SetActorLocationAndRotation` to our `NewLocation`. 

### Tick function
```cpp
// Called every frame
void ARotateActorAroundWithRotation::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	FVector NewLocation = FVector (0,0,400);

	// rotate around player
	// FVector NewLocation = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();
	
	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	FRotator NewRotation = FRotator(0, AngleAxis, 0);
	
	FQuat QuatRotation = FQuat(NewRotation);

	SetActorLocationAndRotation(NewLocation, QuatRotation, false, 0, ETeleportType::None);

}
```

Compile the code. Drag and drop the new actor into the game world. Add a static mesh component to the actor. Now when you push play the actor will find and cirlce around the given vector point and always point towards the origin. Below is the final `.cpp` file.

### RotateActorAroundWithRotation.cpp
```cpp
#include "RotateActorAroundWithRotation.h"


// Sets default values
ARotateActorAroundWithRotation::ARotateActorAroundWithRotation()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;

}

// Called when the game starts or when spawned
void ARotateActorAroundWithRotation::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ARotateActorAroundWithRotation::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	FVector NewLocation = FVector (0,0,400);

	// rotate around player
	// FVector NewLocation = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();
	
	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	FRotator NewRotation = FRotator(0, AngleAxis, 0);
	
	FQuat QuatRotation = FQuat(NewRotation);

	SetActorLocationAndRotation(NewLocation, QuatRotation, false, 0, ETeleportType::None);

}
```