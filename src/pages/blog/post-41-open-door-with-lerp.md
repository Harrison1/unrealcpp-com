---
templateKey: blog-post
path: /open-door-with-lerp
title: Open Door With Lerp and Overlap
image: https://res.cloudinary.com/several-levels/image/upload/v1518171209/open-door-with-lerp_wl3xyn.jpg
video: 15k_QiMYyas
tags: ["intermediate"]
uev: 4.18.3
date: 2018-02-10T12:00:00.226Z
description: In this tutorial we'll learn how to open a door using the lerp function and overlap events.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/OpenDoorWithLerp](https://github.com/Harrison1/unrealcpp/tree/master/OpenDoorWithLerp)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we will learn how to automatically open a door depending on which way the player is facing using the lerp function and overlap events. Create a new **actor** class and call it whatever you want, in this tutorial I will call it `OpenDoorWithLerp`.

First, in the `.h` file let's `#include` the `BoxComponent` at the top of the file. Make sure it comes before your **Actor's** `generated.h` file.

#### include BoxComponent
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"

// include before generated file
#include "Components/BoxComponent.h"

#include "OpenDoorWithLerp.generated.h"
```

Next, we will create our variables. We'll declare the **Door** `UStaticMeshComponent`, the `UBoxComponent`, our overlap functions, a `bool`, a `float`, and an `FRotator` variable for the **Door's** rotation. 

three `bool` variables to determine the state of the door and four`float` variables to set different numbers for the door. Next, we'll add in functions for toggling the door and building the door itself with a `UStaticMeshComponent` and `UBoxComponent`. All elements will go under the `public` section of the header file.

#### Our Header Variables
```cpp
...
public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* Door;

	UPROPERTY(EditAnywhere)
	UBoxComponent* MyBoxComponent;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	bool Open;
	float RotateValue;
	FRotator DoorRotation;
```

Next, we'll move into the **Actor's** `.cpp` file. We'll first want to `#include` the the KismetMathLibrary header file. We'll use a math function in the overlap function.

#### Include the KismetMathLibrary header file
```cpp
#include "Kismet/KismetMathLibrary.h"
```

In the constructor function we will set our default variables. We'll first set our **Door's** `Open` bool to `false`. Next, we'll setup our `UBoxComponent` and `UStaticMeshComponent`. We will set the `UBoxComponent` will be our `RootComponent`. Then, connect the overlap functions to the `UBoxComponent`. Later, We will create the overlap functions that they are calling.

#### constructor function
```cpp
AOpenDoorWithLerp::AOpenDoorWithLerp()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Open = false;

    MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("My Box Component"));
    MyBoxComponent->InitBoxExtent(FVector(50,50,50));
    RootComponent = MyBoxComponent;

    Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
    Door->SetRelativeLocation(FVector(0.0f, 50.0f, -50.0f));
    Door->SetupAttachment(RootComponent);

    MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &AOpenDoorWithLerp::OnOverlapBegin);
    MyBoxComponent->OnComponentEndOverlap.AddDynamic(this, &AOpenDoorWithLerp::OnOverlapEnd);
}
```

In the `Tick` function we will check if the door is open and and run our `lerp` function. A `lerp` function must be run in the `Tick` function. We will grab the **Door's** rotation by using `Door->RelativeRotation` to return the rotation of the door on every frame. After getting the `Door's` rotation we will smoothley move the `Yaw` value to 90, -90, or 0.

#### Tick function
```cpp
void AOpenDoorWithLerp::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	DoorRotation = Door->RelativeRotation;

    if(Open)
    {
        Door->SetRelativeRotation(FMath::Lerp(FQuat(DoorRotation), FQuat(FRotator(0.0f, RotateValue, 0.0f)), 0.01f));   
    } 
    else
    {
        Door->SetRelativeRotation(FMath::Lerp(FQuat(DoorRotation), FQuat(FRotator(0.0f, 0.0f, 0.0f)), 0.01f));
    }

}
```

Next, let's create the overlap functions. `OnOverlapBegin` will first do conditional checks for `null` values to see if the function should proceed. Then, the function checks which direction the player and actor are facing depedning on their location and rotation. In this function the our player which is our **Pawn** is the `OtherActor` parameter being passed into the function. We subtract the **Pawn's** location from the **Actor's** location to get a direction FVector. We then need to account for the rotation of the parent component so we run `UKismetMathLibrary::LessLess_VectorRotator`. This method was taken from Unreal Engine 4's Content Examples. If the player is in front of the door then the `RotateValue` will equal `90.0f`, if not the `RotateValue` will equal `-90.0f`. Then, finally we will set `Open` to `true`.

`OnOnverlapEnd` simply sets `Open` to `false`.

#### Overlap Functions
```cpp
void AOpenDoorWithLerp::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
    {
        FVector PawnLocation = OtherActor->GetActorLocation();
        FVector Direction = GetActorLocation() - PawnLocation;
        Direction = UKismetMathLibrary::LessLess_VectorRotator(Direction, GetActorRotation());

        if(Direction.X > 0.0f)
        {
            RotateValue = 90.0f;
        }
        else
        {
            RotateValue = -90.0f;
        }

        Open = true;
    }
}

void AOpenDoorWithLerp::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) )  
    {
        Open = false;
    }
}
```

We are done with the code. Go into the editor and compile. Drag and drop the actor into the game world. Set the `BoxComponent`'s collision presets to `Trigger` and add in the door static mesh from the starter content as the `UStaticMeshComponent`.

Below is the final code.

### OpenDoorWithLerp.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/BoxComponent.h"
#include "OpenDoorWithLerp.generated.h"

UCLASS()
class UNREALCPP_API AOpenDoorWithLerp : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AOpenDoorWithLerp();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* Door;

	UPROPERTY(EditAnywhere)
	UBoxComponent* MyBoxComponent;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	bool Open;
	float RotateValue;
	FRotator DoorRotation;
	
};
```

###OpenDoorWithLerp.cpp
```cpp
#include "OpenDoorWithLerp.h"
#include "Kismet/KismetMathLibrary.h"


// Sets default values
AOpenDoorWithLerp::AOpenDoorWithLerp()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Open = false;

    MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("My Box Component"));
    MyBoxComponent->InitBoxExtent(FVector(50,50,50));
    RootComponent = MyBoxComponent;

    Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
    Door->SetRelativeLocation(FVector(0.0f, 50.0f, -50.0f));
    Door->SetupAttachment(RootComponent);

    MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &AOpenDoorWithLerp::OnOverlapBegin);
    MyBoxComponent->OnComponentEndOverlap.AddDynamic(this, &AOpenDoorWithLerp::OnOverlapEnd);

}

// Called when the game starts or when spawned
void AOpenDoorWithLerp::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void AOpenDoorWithLerp::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	DoorRotation = Door->RelativeRotation;

    if(Open)
    {
        Door->SetRelativeRotation(FMath::Lerp(FQuat(DoorRotation), FQuat(FRotator(0.0f, RotateValue, 0.0f)), 0.01f));   
    } 
    else
    {
        Door->SetRelativeRotation(FMath::Lerp(FQuat(DoorRotation), FQuat(FRotator(0.0f, 0.0f, 0.0f)), 0.01f));
    }

}

void AOpenDoorWithLerp::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
    {
        FVector PawnLocation = OtherActor->GetActorLocation();
        FVector Direction = GetActorLocation() - PawnLocation;
        Direction = UKismetMathLibrary::LessLess_VectorRotator(Direction, GetActorRotation());

        if(Direction.X > 0.0f)
        {
            RotateValue = 90.0f;
        }
        else
        {
            RotateValue = -90.0f;
        }

        Open = true;
    }
}

void AOpenDoorWithLerp::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) )  
    {
        Open = false;
    }
}
```