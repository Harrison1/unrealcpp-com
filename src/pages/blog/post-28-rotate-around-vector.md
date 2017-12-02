---
templateKey: blog-post
path: /rotate-around-vector
title: Rotate Around Vector
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1511657694/rotate-around-vector_sufcb7.jpg
tags:
  - rotation
uev: 4.18.1
date: 2017-12-02T11:55:44.226Z
description: >-
  Learn how to use the rotate an actor around a vector point.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/RotateAroundVector](https://github.com/Harrison1/unrealcpp/tree/master/RotateAroundVector)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we'll learn how to rotate an actor around a vector point. Start by creating a new `C++` actor class and call it **RotateAroundVector**. In the header file we'll create onr `float` variables and make it `EditAnywhere` so we can edit it later inside the editor. Below is the final header file code.

### RotateAroundVector.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RotateAroundVector.generated.h"

UCLASS()
class UNREALCPP_API ARotateAroundVector : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ARotateAroundVector();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare our variable for the angle axis
	float AngleAxis;
	
};
```

In the `.cpp` let's start by setting the default value of our `AngleAxis` variable to 0.

#### default values
```cpp
// Called when the game starts or when spawned
void ARotateAroundVector::BeginPlay()
{
	Super::BeginPlay();

	// init variable AngleAxis to 0 on begin play
	AngleAxis = 0;
	
}
```

All of our logic is going inside the `Tick` function. For this example we are going to use a fixed vector point, so every frame we want to set our fixed location by setting our `NewLocation` to a fixed `FVector`. Then declare how far way you want your actor be from the `NewLocation`. I set the `Radius` at 200 so the actor will always remain 200 unreal units away from the `NewLocation` point.

Next, we want increase `AngleAxis` by one every frame. This will increase the degree around the point the actor should move to. If `AngleAxis` is greater than 360 we re-set the `AngleAxis` to 1. You can look alternative ways of managing `AngleAxis` [here](rotate-angle-axis) and [here](rotate-actor-around-player-with-rotation).

Next, we'll set `RotateValue` by using the `RotateAngleAxis` functions from our `Radius` vector. This will return the amount of units needed to move the actor to its next location. Add `RotateValue`'s X, Y, and Z values to our `NewLocation` variable accordingly. To learn more about the `RotateAngleAxis` function from the Unreal Engine 4 documentation you can click [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Core/Math/FVector/RotateAngleAxis/). 

Finally, set the actor's location with `SetActorLocation` to our `NewLocation`.

#### Tick function
```cpp
// Called every frame
void ARotateAroundVector::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	// declare arbitrary vector point in the world to circle around
	FVector NewLocation = FVector (0,0,800);

	// declare size of radius to move around
	FVector Radius = FVector(200,0,0);

	// angle increases by 1 every frame
	AngleAxis++;

	// prevent number from growind indefinitely
	if(AngleAxis > 360.0f) {

		AngleAxis = 1;
	}

	FVector RotateValue = Radius.RotateAngleAxis(AngleAxis, FVector (0,0,1));

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;
	
	SetActorLocation(NewLocation);

}
```

Compile the code. Drag and drop the new actor into the game world. Add a static mesh component to the actor. Now when you push play the actor will find and cirlce around the given vector point and always point. Below is the final `.cpp` file.

### RotateAroundVector.cpp
```cpp
#include "RotateAroundVector.h"


// Sets default values
ARotateAroundVector::ARotateAroundVector()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void ARotateAroundVector::BeginPlay()
{
	Super::BeginPlay();

	// init variable AngleAxis to 0 on begin play
	AngleAxis = 0;
	
}

// Called every frame
void ARotateAroundVector::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	// declare arbitrary vector point in the world to circle around
	FVector NewLocation = FVector (0,0,800);

	// declare size of radius to move around
	FVector Radius = FVector(200,0,0);

	// angle increases by 1 every frame
	AngleAxis++;

	// prevent number from growind indefinitely
	if(AngleAxis > 360.0f) {

		AngleAxis = 1;
	}

	FVector RotateValue = Radius.RotateAngleAxis(AngleAxis, FVector (0,0,1));

	NewLocation.X += RotateValue.X;
	NewLocation.Y += RotateValue.Y;
	NewLocation.Z += RotateValue.Z;
	
	SetActorLocation(NewLocation);

}
```