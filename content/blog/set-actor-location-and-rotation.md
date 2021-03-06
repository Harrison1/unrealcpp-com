---
templateKey: blog-post
title: Set Actor Location and Rotation
image: https://res.cloudinary.com/several-levels/image/upload/v1512124932/set-actor-location-rotation_exukw7.jpg
video: g5EQOzkpWbc
tags: ["location", "rotation"]
uev: 4.18.3
date: 2017-11-30T20:30:13.628Z
description: Learn how to set the actor's location and rotation.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/SetActorLocationAndRotation](https://github.com/Harrison1/unrealcpp/tree/master/SetActorLocationAndRotation)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we will learn how to use the `SetActorLocationAndRotation` function. Create a new `C++` actor class and call it **SetActorLocationAndRotation**. In the header file make a `FVector` and `FQuat` variable and make them editable anywhere by setting `UPROPERTY` to `EditAnywhere`. We'll put all of the variables inside the **Location** category to keep them together and separate from other attributes. Below is the final header script.

### SetActorLocationAndRotation.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SetActorLocationAndRotation.generated.h"

UCLASS()
class UNREALCPP_API ASetActorLocationAndRotation : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ASetActorLocationAndRotation();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere, Category = Location)
	FVector NewLocation;

	UPROPERTY(EditAnywhere, Category = Location)
	FQuat NewRotation;
	
};
```

In this example we will call the `SetActorLocationAndRotation` function in the `BeginPlay` function. To learn more about the `SetActorLocationAndRotation` function, click [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/GameFramework/AActor/SetActorLocationAndRotation/). Below is the final `.cpp` file.

### SetActorLocationAndRotation.cpp
```cpp
#include "SetActorLocationAndRotation.h"


// Sets default values
ASetActorLocationAndRotation::ASetActorLocationAndRotation()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void ASetActorLocationAndRotation::BeginPlay()
{
	Super::BeginPlay();

	SetActorLocationAndRotation(NewLocation, NewRotation, false, 0, ETeleportType::None);	
	
}

// Called every frame
void ASetActorLocationAndRotation::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```

Compile the code. Drag and drop your new actor into your game. Add a static mesh component to the actor. In the editor, set a value for `NewLocation` and `NewRotation` and then when you push play the actor will locate and rotate to those coordinates. 