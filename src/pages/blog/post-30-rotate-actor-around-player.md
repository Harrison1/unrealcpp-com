---
templateKey: blog-post
path: /rotate-actor-around-player
title: Rotate Actor Around Player
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1512221876/rotating-object-around-player_getlvl.jpg
tags:
  - rotation
  - location
uev: 4.18.1
date: 2017-12-02T13:55:44.226Z
description: Learn how to rotate an actor around your player.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/RotateActorAroundPlayer](https://github.com/Harrison1/unrealcpp/tree/master/RotateActorAroundPlayer)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we will be rotating an actor around the player. Start by creating a new `C++` actor class and call it **RotateActorAroundPlayer**. In the header file we'll create two `float` variables and two `FVector` variables and make them `EditAnywhere` so we can edit them later on inside the editor. Below is the final header file code.

### RotateActorAroundPlayer
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RotateActorAroundPlayer.generated.h"

UCLASS()
class UNREALCPP_API ARotateActorAroundPlayer : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ARotateActorAroundPlayer();

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
ARotateActorAroundPlayer::ARotateActorAroundPlayer()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;
}
```

All of our logic is going to go in the `Tick` function. Every frame we want to get the actor's location by using `GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation()`. Next want to add to our `AngleAxis` variable which will indicate the degree around the player the actor should move to. We add `DeltaTime` multiplied by our `Multiplier` for smooth movement. If `AngleAxis` is greater than or equal to 360 we re-set the `AngleAxis` to 0.

Next, we'll set `RotateValue` from using the `RotateAngleAxis` functions from our `Dimensions` vector. This will return the amount of units needed to move the actor to its next location. Add `RotateValue`'s X, Y, and Z values to our `NewLocation` variable accordingly. Finally, set the actor's location with `SetActorLocation` to our `NewLocation`.

#### Tick function
```cpp
// Called every frame
void ARotateActorAroundPlayer::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FVector NewLocation = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();
			
	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	SetActorLocation(NewLocation, false, 0, ETeleportType::None);

}
```

Compile the code. Drag and drop the new actor into the game world. Add a static mesh component to the actor. Now when you push play the actor will find and cirlce around the player. Below is the final `.cpp` file.

### RotateActorAroundPlayer.cpp
```cpp
#include "RotateActorAroundPlayer.h"


// Sets default values
ARotateActorAroundPlayer::ARotateActorAroundPlayer()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;
}

// Called when the game starts or when spawned
void ARotateActorAroundPlayer::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ARotateActorAroundPlayer::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FVector NewLocation = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();
			
	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}

	FVector myCharacter = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	SetActorLocation(NewLocation, false, 0, ETeleportType::None);

}
```