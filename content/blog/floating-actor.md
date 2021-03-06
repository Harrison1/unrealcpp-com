---
templateKey: blog-post
title: Floating Actor
image: https://res.cloudinary.com/several-levels/image/upload/v1512222398/floating-actor_mntqfm.jpg
video: hv-F3BhP1dU
tags: ["intermediate", "ue4 tutorial"]
uev: 4.18.3
date: 2017-12-02T14:55:44.226Z
description: How to make an actor float up and down. This is good for floating platforms or things that need to bob up and down.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/FloatingActor](https://github.com/Harrison1/unrealcpp/tree/master/FloatingActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial the main logic came from one of Epic's Unreal Engine 4 C++ tutorials,  you can find the link [here](https://docs.unrealengine.com/latest/INT/Programming/QuickStart/index.html). Also, [here](https://answers.unrealengine.com/questions/434890/unreal-engine-beginner-fmathsin.html) is great forum discussing the code in greater depth. [Tim](https://answers.unrealengine.com/users/3692/tim-lincoln.html) is rockstar for providing a stellar answer.

Create a new `C++` actor class and call it **Floating Actor**. In the header file will create four `float` variables. We will create `RunningTime`, `XValue`, `YValue`, and `ZValue` variables. Below is the final header code.

### FloatingActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "FloatingActor.generated.h"

UCLASS()
class UNREALCPP_API AFloatingActor : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AFloatingActor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare our float variables 
	float RunningTime;
	
	UPROPERTY(EditAnywhere, Category = Movement)
	float XValue;

	UPROPERTY(EditAnywhere, Category = Movement)
	float YValue;

	UPROPERTY(EditAnywhere, Category = Movement)
	float ZValue;
	
	
};
```

Next, we will be putting all of our logic in our `Tick` function. To start off, let's declare a variable every frame that equals the actor's current location by using `GetActorLocation`. This will allow us to change the X,Y, and Z values of actor and move it on scene. For smooth motion we will be using the `FMath:Sin` to set our `DeltaHeight` variable.

#### DeltaHeight
```cpp
float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
```

Next, we are going get our actor's location X,Y, and Z coordinates and add `DeltaTIme * Value` to them. In the header file we made the variables editable anywhere so in the editor we can easily adjust the amount and direction the actor moves. Next, set `RunningTime` to `DeltaHeight`. Finally set the actor's location to the `NewLocation`. Below is the final `.cpp` final.

### FloatingActor.cpp
```cpp
#include "FloatingActor.h"


// Sets default values
AFloatingActor::AFloatingActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void AFloatingActor::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AFloatingActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// on every frame change location for a smooth floating actor
	FVector NewLocation = GetActorLocation();
	float DeltaHeight = (FMath::Sin(RunningTime + DeltaTime) - FMath::Sin(RunningTime));
	NewLocation.X += DeltaHeight *  XValue;
	NewLocation.Y += DeltaHeight *  YValue;
	NewLocation.Z += DeltaHeight *  ZValue;

	RunningTime += DeltaTime;
	SetActorLocation(NewLocation);

}
```
