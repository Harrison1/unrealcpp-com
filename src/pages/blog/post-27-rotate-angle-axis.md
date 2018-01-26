---
templateKey: blog-post
path: /rotate-angle-axis
title: Rotate Angle Axis
image: https://res.cloudinary.com/several-levels/image/upload/v1512221876/rotating-angle-axis_rkpyse.jpg
video: ZoMoG0yhwg8
tags: ["rotation", "location"]
uev: 4.18.3
date: 2017-12-02T10:55:44.226Z
description: Learn how to use the RotateAngleAxis function.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/RotateAngleAxis](https://github.com/Harrison1/unrealcpp/tree/master/RotateAngleAxis)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we'll learn how to use the `RotateAngleAxis` function. Start by creating a new `C++` actor class and call it **RotateAngleAxis**. In the header file we'll create two `float` variables and two `FVector` variables and make them `EditAnywhere` so we can edit them later inside the editor. Below is the final header file code.

### RotateAngleAxis.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RotatingAngleAxis.generated.h"

UCLASS()
class UNREALCPP_API ARotatingAngleAxis : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ARotatingAngleAxis();

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
ARotatingAngleAxis::ARotatingAngleAxis()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;

}
```

All of our logic is going inside the `Tick` function. For this example we are going to use a fixed vector point, so every frame we want to set our fixed location by setting our `NewLocation` to a fixed `FVector`.

Next, we want to add to our `AngleAxis` variable which will indicate the degree around the point the actor should move to. We add `DeltaTime` multiplied by our `Multiplier` for smooth movement. If `AngleAxis` is greater than or equal to 360 we re-set the `AngleAxis` to 0.

Next, we'll set `RotateValue` by using the `RotateAngleAxis` functions from our `Dimensions` vector. This will return the amount of units needed to move the actor to its next location. Add `RotateValue`'s X, Y, and Z values to our `NewLocation` variable accordingly. We will print to the screen the `RotateValue` and `AngleAxis` variables to see the values in real time.

Finally, set the actor's location with `SetActorLocation` to our `NewLocation`. To learn more about the `RotateAngleAxis` function from the Unreal Engine 4 documentation you can click [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Core/Math/FVector/RotateAngleAxis/).

#### Tick function
```cpp
// Called every frame
void ARotatingAngleAxis::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FVector NewLocation = FVector (0,0,800);

	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, FString::Printf(TEXT("RotateValue: %s"), *RotateValue.ToString()));	
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("AngleAxis: %f"), AngleAxis));

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	SetActorLocation(NewLocation, false, 0, ETeleportType::None);
	
}
```

Compile the code. Drag and drop the new actor into the game world. Add a static mesh component to the actor. Now when you push play the actor will find and cirlce around the given vector point. Below is the final `.cpp` file.

### RotatingAngleAxis.cpp
```cpp
#include "RotatingAngleAxis.h"

// Sets default values
ARotatingAngleAxis::ARotatingAngleAxis()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Dimensions = FVector (300, 0, 0);
	AxisVector = FVector (0, 0, 1);
	Multiplier = 50.f;

}

// Called when the game starts or when spawned
void ARotatingAngleAxis::BeginPlay()
{
	Super::BeginPlay();	
	
}

// Called every frame
void ARotatingAngleAxis::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FVector NewLocation = FVector (0,0,800);

	AngleAxis += DeltaTime * Multiplier;

	if(AngleAxis >= 360.0f) 
	{
		AngleAxis = 0;
	}


	FVector myCharacter = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();

	FVector RotateValue = Dimensions.RotateAngleAxis(AngleAxis, AxisVector);

	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, FString::Printf(TEXT("RotateValue: %s"), *RotateValue.ToString()));	
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("AngleAxis: %f"), AngleAxis));

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;

	SetActorLocation(NewLocation, false, 0, ETeleportType::None);
	
}
```

