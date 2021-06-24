---
templateKey: blog-post
title: Get Number of Pawns
image: https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/number-of-pawns_mmkrig.jpg
video: FfsEpboXAxw
tags: ["beginner"]
uev: 4.18.3
date: 2017-11-30T19:30:13.628Z
description: How to get the total number of pawns in the scene
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/GetNumberOfPawns](https://github.com/Harrison1/unrealcpp/tree/master/GetNumberOfPawns)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

This is a simple tutorial on how to get the total number of pawns in a scene. Create a new `C++` actor class that and call it **GetNumberOfPawns**. We are not going to do anything in the header file, below is the final header file.

### GetNumberOfPawns.h
```cpp

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GetNumberOfPawns.generated.h"

UCLASS()
class UNREALCPP_API AGetNumberOfPawns : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AGetNumberOfPawns();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

};
```

Next, in our `BeginPlay()` function we are going to add `GetWorld()->GetNumPawns()`. All actors have access to the `GetWorld()` function. You can see all of the world's functions [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/Engine/UWorld/index.html). Below is our final `.cpp` file.

### 
```cpp
#include "GetNumberOfPawns.h"


// Sets default values
AGetNumberOfPawns::AGetNumberOfPawns()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void AGetNumberOfPawns::BeginPlay()
{
	Super::BeginPlay();

	int32 MyPawns = GetWorld()->GetNumPawns();

	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("Number of Pawns: %d"), MyPawns));
	
}

// Called every frame
void AGetNumberOfPawns::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
``` 
