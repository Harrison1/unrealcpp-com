---
templateKey: blog-post
path: /draw-debug-helpers
title: Draw Debug Helpers
image: https://res.cloudinary.com/several-levels/image/upload/v1512222397/draw-debug-helpers_hiskxe.jpg
video: XPzkCafs1rU
tags:
  - beginner
  - debug
uev: 4.18.2
date: 2017-11-30T15:30:13.628Z
description: Draw multiple variations of debug shapes provided by DrawDebugHelpers.h.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/MyDrawDebugHelpers](https://github.com/Harrison1/unrealcpp/tree/master/MyDrawDebugHelpers)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we will be drawing multiple debug shapes provided by `DrawDebugHelpers.h`. You can see everything `DrawDebugHelpers.h` has to offer to looking at the file provided by UE4 [here](https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Source/Runtime/Engine/Public/DrawDebugHelpers.h).

Create a new `C++` actor class and call it **MyDrawDebugHelpers**. In the header file we'll declare multiple variables that we will use in the `.cpp` file and they will also be editable inside the editor. We'll create `FVector`s, a `FMatrix`, a `FBox`, and a `FTransform`. Below is the final header file code. 

### MyDrawDebugHelpers.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyDrawDebugHelpers.generated.h"

UCLASS()
class UNREALCPP_API AMyDrawDebugHelpers : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AMyDrawDebugHelpers();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare location variables
	UPROPERTY(EditAnywhere, Category = "Locations")
	FVector LocationOne;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FVector LocationTwo;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FVector LocationThree;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FVector LocationFour;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FVector LocationFive;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FMatrix CircleMatrix;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FBox MyBox;

	UPROPERTY(EditAnywhere, Category = "Locations")
	FTransform MyTransform;
	
};
```

In order to use `DrawDebugHelpers.h` you must `#include` it in the file.

#### include DrawDebughHelpers.h
```cpp
#include "MyDrawDebugHelpers.h"
// include draw debu helpers header file
#include "DrawDebugHelpers.h"
```

In the `.cpp` file we'll start by giving our variables default values. It took me a few minutes to play around with the default values, but I think for the most part the values should be good starting point. Below is the init code we'll add for our default values.

```cpp
// Sets default values
AMyDrawDebugHelpers::AMyDrawDebugHelpers()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// init variables with values
	LocationOne = FVector(0,0,600);
	LocationTwo = FVector(0,-600,600);
	LocationThree = FVector(0,600,600);
	LocationFour = FVector(-300,0,600);
	LocationFive = FVector(-400,-600,600);
	
	MyBox = FBox(FVector(0,0,0), FVector(200,200,200));
}
```

Next, we'll draw many different shapes in the `BeginPlay()` function. Below are all the functions we'll add to `BeginPlay()` to draw all of our shapes.

#### draw shapes in BeginPlay
```cpp
// Called when the game starts or when spawned
void AMyDrawDebugHelpers::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugPoint(GetWorld(), LocationOne, 200, FColor(52,220,239), true);

	DrawDebugSphere(GetWorld(), LocationTwo, 200, 26, FColor(181,0,0), true, -1, 0, 2);

	DrawDebugCircle(GetWorld(), CircleMatrix, 200, 50, FColor(0,104,167), true, -1, 0, 10);

	DrawDebugCircle(GetWorld(), LocationFour, 200, 50, FColor(0,0,0), true, -1, 0, 10);

	DrawDebugSolidBox(GetWorld(), MyBox, FColor(20, 100, 240), MyTransform, true);

	DrawDebugBox(GetWorld(), LocationFive, FVector(100,100,100), FColor::Purple, true, -1, 0, 10);

	DrawDebugLine(GetWorld(), LocationTwo, LocationThree, FColor::Emerald, true, -1, 0, 10);

	DrawDebugDirectionalArrow(GetWorld(), FVector(-300, 600, 600), FVector(-300, -600, 600), 120.f, FColor::Magenta, true, -1.f, 0, 5.f);
	
	DrawDebugCrosshairs(GetWorld(), FVector(0,0,1000), FRotator(0,0,0), 500.f, FColor::White, true, -1.f, 0);
	
}
```

Compile the code. Drag and drop your new actor into your scened and shapes will be drawn in the game. You can edit variables in Actor's details panel. Below is the final `.cpp` code.

### MyDrawDebugHelpers.cpp
```cpp
#include "MyDrawDebugHelpers.h"
// include draw debu helpers header file
#include "DrawDebugHelpers.h"


// Sets default values
AMyDrawDebugHelpers::AMyDrawDebugHelpers()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// init variables with values
	LocationOne = FVector(0,0,600);
	LocationTwo = FVector(0,-600,600);
	LocationThree = FVector(0,600,600);
	LocationFour = FVector(-300,0,600);
	LocationFive = FVector(-400,-600,600);
	
	MyBox = FBox(FVector(0,0,0), FVector(200,200,200));
}

// Called when the game starts or when spawned
void AMyDrawDebugHelpers::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugPoint(GetWorld(), LocationOne, 200, FColor(52,220,239), true);

	DrawDebugSphere(GetWorld(), LocationTwo, 200, 26, FColor(181,0,0), true, -1, 0, 2);

	DrawDebugCircle(GetWorld(), CircleMatrix, 200, 50, FColor(0,104,167), true, -1, 0, 10);

	DrawDebugCircle(GetWorld(), LocationFour, 200, 50, FColor(0,0,0), true, -1, 0, 10);

	DrawDebugSolidBox(GetWorld(), MyBox, FColor(20, 100, 240), MyTransform, true);

	DrawDebugBox(GetWorld(), LocationFive, FVector(100,100,100), FColor::Purple, true, -1, 0, 10);

	DrawDebugLine(GetWorld(), LocationTwo, LocationThree, FColor::Emerald, true, -1, 0, 10);

	DrawDebugDirectionalArrow(GetWorld(), FVector(-300, 600, 600), FVector(-300, -600, 600), 120.f, FColor::Magenta, true, -1.f, 0, 5.f);
	
	DrawDebugCrosshairs(GetWorld(), FVector(0,0,1000), FRotator(0,0,0), 500.f, FColor::White, true, -1.f, 0);
	
}

// Called every frame
void AMyDrawDebugHelpers::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```