---
templateKey: blog-post
path: /receive-player-input
title: Receive Player Input
image: https://res.cloudinary.com/several-levels/image/upload/v1512222398/moving-pawn_vstq9s.jpg
video: youtube.com
tags:
  - intermediate
  - pawn
  - input
uev: 4.18.1
date: 2017-12-03T05:15:44.226Z
description: Learn how to add input to a pawn and move it around the scene.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/MyPawn](https://github.com/Harrison1/unrealcpp/tree/master/MyPawn)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

The main logic of this code is from Epic's Unreal Engine 4 documentation's tutorial titled **Player Input and Pawns** and you can see the full tutorial [here](https://docs.unrealengine.com/latest/INT/Programming/Tutorials/PlayerInput/index.html). 

In this example we will add inputs to a pawn and move it around our game. Create a new `C++` actor class and call it **MyPawn**. In the header file we'll create variables for our 'Axis' movements, functions, and `bool`. Below is the final header code.

### MyPawn.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "MyPawn.generated.h"

UCLASS()
class UNREALCPP_API AMyPawn : public APawn
{
	GENERATED_BODY()

public:
	// Sets default values for this pawn's properties
	AMyPawn();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
    // Called every frame
    virtual void Tick(float DeltaSeconds) override;

    // Called to bind functionality to input
    virtual void SetupPlayerInputComponent(class UInputComponent* InputComponent) override;

    UPROPERTY(EditAnywhere)
    USceneComponent* OurVisibleComponent;

    // Input functions
    void Move_XAxis(float AxisValue);
    void Move_YAxis(float AxisValue);
    void StartGrowing();
    void StopGrowing();

    // Input variables
    FVector CurrentVelocity;
    bool bGrowing;
};
```

In editor let's create an `Action` mapping called **Grow** and bind it to the `G` key. Then make two `Axis` mappings and call them `MoveX` and `MoveY`. Set the axis scales to 1 and -1 respectively.

// TODO get images and scales

#### project settings
[![project settings](https://res.cloudinary.com/several-levels/image/upload/v1512036314/pawn-project-settings_scb9ke.jpg "project settings")](https://res.cloudinary.com/several-levels/image/upload/v1512036314/pawn-project-settings_scb9ke.jpg)

#### add inputs
[![new pawn movement comp](https://res.cloudinary.com/several-levels/image/upload/v1512036314/pawn-movement-input_uejdk8.png "new pawn movement comp")](https://res.cloudinary.com/several-levels/image/upload/v1512036314/pawn-movement-input_uejdk8.png)

1. `MoveX`   
    I: *Scale* 1.0  
    K: *Scale* -1.0  

2. `MoveY`   
    J: *Scale* -1.0  
    L: *Scale* 1.0  

3. `Grow`   
    G

In the `.cpp` file make sure to `#include` `Camera/CameraComponent.h`, `Components/InputComponent.h`, and `Components/StaticMeshComponent.h`.

#### include files
```cpp
#include "MyPawn.h"
#include "Camera/CameraComponent.h"
#include "Components/InputComponent.h"
#include "Components/StaticMeshComponent.h"
```

Next, we'll set the default values. First, we want automatically possess the player by doing `AutoPossessPlayer = EAutoReceiveInput::Player0;`. Next we create and add a visual component and camera to our dummy `RootComponent`. 

#### set default values
```cpp
// Sets default values
AMyPawn::AMyPawn()
{
    // Set this pawn to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
    PrimaryActorTick.bCanEverTick = true;

    // Set this pawn to be controlled by the lowest-numbered player
    AutoPossessPlayer = EAutoReceiveInput::Player0;

    // Create a dummy root component we can attach things to.
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent"));
    // Create a camera and a visible object
    UCameraComponent* OurCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("OurCamera"));
    OurVisibleComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("OurVisibleComponent"));
    // Attach our camera and visible object to our root component. Offset and rotate the camera.
    OurCamera->SetupAttachment(RootComponent);
    OurCamera->SetRelativeLocation(FVector(-250.0f, 0.0f, 250.0f));
    OurCamera->SetRelativeRotation(FRotator(-45.0f, 0.0f, 0.0f));
    OurVisibleComponent->SetupAttachment(RootComponent);

}
```

In the `Tick` function we'll want to always check the state of growing for the pawn and always position the pawn correctly. Every frame we get the `VisualComponent`'s scale and if the player is pressing `G` we will add `DeltaTime` to the scale. When the key is not pressed, the scale will shrink back to normal size all while clamping it's size so it doesn't go above 2 (double the size) or below 1 (initial size).

#### Tick function
```cpp
// Called every frame
void AMyPawn::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	
    // Handle growing and shrinking based on our "Grow" action
    {
        float CurrentScale = OurVisibleComponent->GetComponentScale().X;
        if (bGrowing)
        {
            // Grow to double size over the course of one second
            CurrentScale += DeltaTime;
        }
        else
        {
            // Shrink half as fast as we grow
            CurrentScale -= (DeltaTime * 0.5f);
        }
        // Make sure we never drop below our starting size, or increase past double size.
        CurrentScale = FMath::Clamp(CurrentScale, 1.0f, 2.0f);
        OurVisibleComponent->SetWorldScale3D(FVector(CurrentScale));
    }

    // Handle movement based on our "MoveX" and "MoveY" axes
    {
        if (!CurrentVelocity.IsZero())
        {
            FVector NewLocation = GetActorLocation() + (CurrentVelocity * DeltaTime);
            SetActorLocation(NewLocation);
        }
    }

}
```

Now, let's bind our actions and axes to our functions. We'll create the functions in the next steps.

#### Bind Input
```cpp
// Called to bind functionality to input
void AMyPawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(InputComponent);

    // Respond when our "Grow" key is pressed or released.
    InputComponent->BindAction("Grow", IE_Pressed, this, &AMyPawn::StartGrowing);
    InputComponent->BindAction("Grow", IE_Released, this, &AMyPawn::StopGrowing);

    // Respond every frame to the values of our two movement axes, "MoveX" and "MoveY".
    InputComponent->BindAxis("MoveX", this, &AMyPawn::Move_XAxis);
    InputComponent->BindAxis("MoveY", this, &AMyPawn::Move_YAxis);

}
```

Create two axis functions that will handle moving our Pawn. These functions will clamp movement between 1 and -1 and move us at a rate of 100 unreal units.

#### axis functions
```cpp
void AMyPawn::Move_XAxis(float AxisValue)
{
    // Move at 100 units per second forward or backward
    CurrentVelocity.X = FMath::Clamp(AxisValue, -1.0f, 1.0f) * 100.0f;
}

void AMyPawn::Move_YAxis(float AxisValue)
{
    // Move at 100 units per second right or left
    CurrentVelocity.Y = FMath::Clamp(AxisValue, -1.0f, 1.0f) * 100.0f;
}
```

Next, we'll create two functions that simpley toggle our `bGrowing` bool.

#### growing functions
```cpp
void AMyPawn::StartGrowing()
{
    bGrowing = true;
}

void AMyPawn::StopGrowing()
{
    bGrowing = false;
}
```

Compile the code. And now drag and drop your newly created pawn into your game and start moving it around.
