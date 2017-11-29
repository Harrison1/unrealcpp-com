---
templateKey: blog-post
path: /actor-line-trace
title: Actor Line Trace
author: Harrison McGuire
authorImage: 'https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511643423/actor-line-trace_gxvwmt.jpg
featuredVideo: youtube.com
tags:
  - intermediate
  - line trace
  - ray cast
uev: 4.18.1
date: 2017-11-25T14:57:13.628Z
description: How to draw a line trace from an actor
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/ActorLineTrace](https://github.com/Harrison1/unrealcpp/tree/master/ActorLineTrace)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

Create a new actor, for this example we will call our actor `ActorLineTrace`.

We don't have to do anything in the header file. Just in case, below is the header file was created by default.

### ActorLineTrace.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ActorLineTrace.generated.h"

UCLASS()
class UNREALCPP_API AActorLineTrace : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AActorLineTrace();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
};
```

To help us visualize the raycast we are going to include the `DrawDebugHelpers` script. This will allow us to draw a line highlighting the raycast. We are also going to include the `ConstructorHelpers.h` to immedietly add a mesh to our actor for a visual representation. It's typically preferred to add a mesh in the editor without the help of `ConstructoHelpers.h`, but we should continue trying new things in C++.

#### include DrawDebugHelpers and ConstructorHelpers
```cpp
#include "ActorLineTrace.h"
// add these scripts to use their functions
#include "ConstructorHelpers.h"
#include "DrawDebugHelpers.h"
```

We add a cube to the actor by createing a `DefaultSubobject` of `UStaticMeshComponent`. We then make our new cube the root component of our actor. We programatically add a mesh to to our actor by calling `FObjectFinder` from `ConstructorHelpers`. In our `FObjectFinder` we provide the path to our mesh. From here we need to check if we successfully got the mesh. If we successfully got the mesh we then set the actors `StaticMesh`, `RelativeLocation`, and `Scale`. Below is the code we put in our actor's init function.

#### use constructor to add mesh to actor
```cpp
AActorLineTrace::AActorLineTrace()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// add cube to root
    UStaticMeshComponent* Cube = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    Cube->SetupAttachment(RootComponent);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

	if (CubeAsset.Succeeded())
    {
        Cube->SetStaticMesh(CubeAsset.Object);
        Cube->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
        Cube->SetWorldScale3D(FVector(1.f));
	}
	
	// add another component in the editor to the actor to overlap with the line trace to get the event to fire

}
```

Next, on our actor's tick fucntion we want to draw the raycast and see if it hits anything. For this example, we will check if it any other objects inside the same actor. Let's create variables for our `HitResult` and our `StartingPosition`

#### first two variables
```cpp
void AActorLineTrace::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult OutHit;
	FVector Start = GetActorLocation();
}
```

The start location is vector which means it has X,Y,Z variables. I want to move the raycast up more towards the center of the mesh and I want to move it away from the mesh to it doesn't collide with itself.

#### position line trace
```cpp
void AActorLineTrace::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult OutHit;
	FVector Start = GetActorLocation();

	Start.Z += 50.f;
	Start.X += 200.f;

}
```

After that let's get the forward vector of mesh by using `GetActorForwardVector()` to make sure the raycast is moving out from the front of the mesh. We will then make and `End` variable to tell the raycast where to end. In this example the raycast will start 50 units above and 200 units forward and will end 500 units from it starting point. Also, we create collision param variable for our raycast function.

#### forward vector, end, and collision params
```cpp
void AActorLineTrace::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult OutHit;
	FVector Start = GetActorLocation();

	Start.Z += 50.f;
	Start.X += 200.f;

	FVector ForwardVector = GetActorForwardVector();
	FVector End = ((ForwardVector * 500.f) + Start);
	FCollisionQueryParams CollisionParams;

}
```
While developing we want to see our line trace. Using the variables we made above we'll use our `DrawDebugLine` function to draw a green line. If the line trace touches any other object inside the same actor, we will print a message to the screen.

#### DrawDebugLine, check hit result, and print message to screen
```cpp
void AActorLineTrace::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult OutHit;
	FVector Start = GetActorLocation();

	Start.Z += 50.f;
	Start.X += 200.f;

	FVector ForwardVector = GetActorForwardVector();
	FVector End = ((ForwardVector * 500.f) + Start);
	FCollisionQueryParams CollisionParams;

	DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1, 0, 5);

	if(ActorLineTraceSingle(OutHit, Start, End, ECC_WorldStatic, CollisionParams))
	{
		GEngine->AddOnScreenDebugMessage(-1, 1.f, FColor::Green, FString::Printf(TEXT("The Component Being Hit is: %s"), *OutHit.GetComponent()->GetName()));
	}

}
```

Below is the final `.cpp` file

### ActorLinetrace.cpp
```cpp
#include "ActorLineTrace.h"
#include "ConstructorHelpers.h"
#include "DrawDebugHelpers.h"

// Sets default values
AActorLineTrace::AActorLineTrace()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// add cube to root
    UStaticMeshComponent* Cube = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    Cube->SetupAttachment(RootComponent);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cube.Shape_Cube"));

	if (CubeAsset.Succeeded())
    {
        Cube->SetStaticMesh(CubeAsset.Object);
        Cube->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
        Cube->SetWorldScale3D(FVector(1.f));
	}
	
	// add another component in the editor to the actor to overlap with the line trace to get the event to fire

}

// Called when the game starts or when spawned
void AActorLineTrace::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AActorLineTrace::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult OutHit;
	FVector Start = GetActorLocation();

	Start.Z += 50.f;
	Start.X += 200.f;

	FVector ForwardVector = GetActorForwardVector();
	FVector End = ((ForwardVector * 500.f) + Start);
	FCollisionQueryParams CollisionParams;

	DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1, 0, 5);

	if(ActorLineTraceSingle(OutHit, Start, End, ECC_WorldStatic, CollisionParams))
	{
		GEngine->AddOnScreenDebugMessage(-1, 1.f, FColor::Green, FString::Printf(TEXT("The Component Being Hit is: %s"), *OutHit.GetComponent()->GetName()));
	}

}
```