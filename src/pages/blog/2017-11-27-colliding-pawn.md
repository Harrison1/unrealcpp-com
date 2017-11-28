---
templateKey: blog-post
path: /colliding-pawn
title: Colliding Pawn UE4 Tutorial
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657692/colliding-pawn_uu9gao.jpg
featuredVideo: youtube.com
tags:
  - intermediate
  - pawn
  - ue4 tutorial
uev: 4.18.1
date: 2017-11-27T08:15:13.628Z
description: How to do the Components and Collision tutorial in the UE4 documentation.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/CollidingPawn](https://github.com/Harrison1/unrealcpp/tree/master/CollidingPawn)**

*For this tutorial we are using the standard first person C++ template with starter content.*

This is a tutorial going over how to do the Components and Collision tutorial provided in the UE4 documentation. You can find the tutorial link [here](https://docs.unrealengine.com/latest/INT/Programming/Tutorials/Components/index.html)

Create a new `C++` class that inherents from the parent class of `UPawnMovementComponent` and call it `CollidingPawnMovementComponent`. We will use this component in the pawn we create later.

#### new cpp movement comp class
[![new c++ movement comp class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg "new c++ movement comp class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg.jpg)

#### new pawn movement comp
[![new pawn movement comp](https://res.cloudinary.com/several-levels/image/upload/v1511788356/pawn-movement-comp_u6zzmz.jpg "new pawn movement comp")](https://res.cloudinary.com/several-levels/image/upload/v1511788356/pawn-movement-comp_u6zzmz.jpg)


#### save new movement comp
[![save new movement comp](https://res.cloudinary.com/several-levels/image/upload/v1511788356/save-pawn-movement-comp_ukuxtv.jpg "save new movement comp")](https://res.cloudinary.com/several-levels/image/upload/v1511788356/save-pawn-movement-comp_ukuxtv.jpg)

The header file should like the code below.

### CollidingPawnMovementComponent.h
```cpp

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PawnMovementComponent.h"
#include "CollidingPawnMovementComponent.generated.h"

UCLASS()
class UNREALCPP_API UCollidingPawnMovementComponent : public UPawnMovementComponent
{
	GENERATED_BODY()

public:
    virtual void TickComponent(float DeltaTime, enum ELevelTick TickType, FActorComponentTickFunction *ThisTickFunction) override;

};
```

In the `.cpp` file are going to put all the logic inside the `Tick` function to check if we hit anythin. First, make sure that it is still valid to move. Add the below `if` statement to the `Tick` function.

#### valid to move
```cpp
void UCollidingPawnMovementComponent::TickComponent(float DeltaTime, enum ELevelTick TickType, FActorComponentTickFunction *ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    // Make sure that everything is still valid, and that we are allowed to move.
    if (!PawnOwner || !UpdatedComponent || ShouldSkipUpdate(DeltaTime))
    {
        return;
    }
};
```

Next, we want to get the vector produced by our pawn. We create our Pawn actor later, but the pawn will generate a location vector every frame. First we will want to get the frame's vector by using the `ConsumeInputVector` function. Clamp the the vector `1.0f` and then multiply it by `DeltaTime` and `150.f`. This ensures the pawn moves smoothly across the world at a maximum rate of 150 units per second. We then check if movement is clost to zero, if `true`, we move our pawn unless it is hitting a blocking component. Below is Epic's explanation of the component code, they can explain it much better than I can.

### Epics explanation of the component Tick code.
>This code will move our Pawn smoothly around the world, sliding off of surfaces where appropriate. There is no gravity applied to our Pawn, and its maximum speed is hard-coded to 150 Unreal Units per second.

>This **TickComponent** function makes use of a few of the powerful features offered by the **UPawnMovementComponent** class.

>**ConsumeInputVector** reports and clears the value of a built-in variable that we will use to store our movement inputs.

>**SafeMoveUpdatedComponent** uses Unreal Engine physics to move our Pawn Movement Component while respecting solid barriers.

>**SlideAlongSurface** handles the calculations and physics involved with sliding smoothly along collision surfaces like walls and ramps when a move results in a collision, rather than simply stopping in place and sticking to the wall or ramp.

>There are more features included in Pawn Movement Components that are worthy of examination, but they are not needed for the scope of this tutorial. Looking at other classes, such as **Floating Pawn Movement**, **Spectator Pawn Movement**, or **Character Movement Component**, could provide additional usage examples and ideas.

*you can visit the tutorial page [here](https://docs.unrealengine.com/latest/INT/Programming/Tutorials/Components/3/index.html) where Epic goes into depth about the colliding component*

Below is the final `CollidingPawnMovementComponent.cpp` file.

### CollidingPawnMovementComponent.cpp
```cpp
void UCollidingPawnMovementComponent::TickComponent(float DeltaTime, enum ELevelTick TickType, FActorComponentTickFunction *ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    // Make sure that everything is still valid, and that we are allowed to move.
    if (!PawnOwner || !UpdatedComponent || ShouldSkipUpdate(DeltaTime))
    {
        return;
    }

    // Get (and then clear) the movement vector that we set in ACollidingPawn::Tick
    FVector DesiredMovementThisFrame = ConsumeInputVector().GetClampedToMaxSize(1.0f) * DeltaTime * 150.0f;
    if (!DesiredMovementThisFrame.IsNearlyZero())
    {
        FHitResult Hit;
        SafeMoveUpdatedComponent(DesiredMovementThisFrame, UpdatedComponent->GetComponentRotation(), true, Hit);

        // If we bumped into something, try to slide along it
        if (Hit.IsValidBlockingHit())
        {
            SlideAlongSurface(DesiredMovementThisFrame, 1.f - Hit.Time, Hit.Normal, Hit);
        }
    }
};

```

Now, moving on, Create a new `C++` class that inherents from the parent `Pawn` class and call it `CollidingPawn`.

#### new cpp class
[![new c++ class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg "new c++ class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg.jpg)

#### new pawn
[![parent pawn class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/parent-pawn_sncmyb.jpg "parent pawn class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/parent-pawn_sncmyb.jpg)

#### save it
[![save CollidingPawn](https://res.cloudinary.com/several-levels/image/upload/v1511787005/save-colliding-pawn_g5ktxl.jpg "save CollidingPawn")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/save-colliding-pawn_g5ktxl.jpg)

In the header file we want to declare the variable we going to be using in the `.cpp` file. We will declare our movementment functions along with our particle system and newly created `UCollidingPawnMovementComponent`.

#### add to the header file
```cpp
public:	

    ...

    UParticleSystemComponent* OurParticleSystem;
    class UCollidingPawnMovementComponent* OurMovementComponent;

    virtual UPawnMovementComponent* GetMovementComponent() const override;

    void MoveForward(float AxisValue);
    void MoveRight(float AxisValue);
    void Turn(float AxisValue);
    void ParticleToggle();
};
```

We will trigger the partlice on a key press. We will setup the input options later in the post. Below is the final `CollidingPawn.h` file.

### CollidingPawn.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "CollidingPawn.generated.h"

UCLASS()
class UNREALCPP_API ACollidingPawn : public APawn
{
	GENERATED_BODY()

public:
	// Sets default values for this pawn's properties
	ACollidingPawn();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	

	// Called every frame
    virtual void Tick( float DeltaSeconds ) override;

    // Called to bind functionality to input
    virtual void SetupPlayerInputComponent(class UInputComponent* InputComponent) override;

    UParticleSystemComponent* OurParticleSystem;
    class UCollidingPawnMovementComponent* OurMovementComponent;

    virtual UPawnMovementComponent* GetMovementComponent() const override;

    void MoveForward(float AxisValue);
    void MoveRight(float AxisValue);
    void Turn(float AxisValue);
    void ParticleToggle();

};
```

In the `.cpp` file, first we want to make sure we `#include` all the necessary scripts that are going to be used throughout our code. Below you will see the components and the helper scripts that we add to the top our `.cpp` file below pawn named header file.

```cpp
#include "CollidingPawn.h"
// include these in your file
#include "Camera/CameraComponent.h"
#include "CollidingPawnMovementComponent.h"
#include "Components/InputComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SphereComponent.h"
#include "ConstructorHelpers.h"
#include "GameFramework/SpringArmComponent.h"
#include "Particles/ParticleSystemComponent.h"

```

In our pawn's init function we will set up our pawn will all the necessary components. First, add a `USphereComponent` as the `RootComponent`.

#### add USphereComponent
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...
	  // Our root component will be a sphere that reacts to physics
    USphereComponent* SphereComponent = CreateDefaultSubobject<USphereComponent>(TEXT("RootComponent"));
    RootComponent = SphereComponent;
    SphereComponent->InitSphereRadius(40.0f);
    SphereComponent->SetCollisionProfileName(TEXT("Pawn"));
}
```

Next, we'll add a sphere mesh to represent and visualize our pawn. In the code we are using the `ConstructorHelper` to find the sphere mesh by providing it a path.

#### add visual sphere
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...
    // Create and position a mesh component so we can see where our sphere is
    UStaticMeshComponent* SphereVisual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    SphereVisual->SetupAttachment(RootComponent);
    static ConstructorHelpers::FObjectFinder<UStaticMesh> SphereVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Sphere.Shape_Sphere"));
    if (SphereVisualAsset.Succeeded())
    {
        SphereVisual->SetStaticMesh(SphereVisualAsset.Object);
        SphereVisual->SetRelativeLocation(FVector(0.0f, 0.0f, -40.0f));
        SphereVisual->SetWorldScale3D(FVector(0.8f));
    }

}
```

Next, we add the particle system to our pawn. By default, we are going to set its `bAutoActivate` to `false` so it doesn't start the flames when we start playing. We will control it with a key press. Also, notice that we are attaching this particle system to the `SphereVisual` mesh and not the `RootComponent`.

#### add particle system
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...

    // Create a particle system that we can activate or deactivate
    OurParticleSystem = CreateDefaultSubobject<UParticleSystemComponent>(TEXT("MovementParticles"));
    OurParticleSystem->SetupAttachment(SphereVisual);
    OurParticleSystem->bAutoActivate = false;
    OurParticleSystem->SetRelativeLocation(FVector(-20.0f, 0.0f, 20.0f));
    static ConstructorHelpers::FObjectFinder<UParticleSystem> ParticleAsset(TEXT("/Game/StarterContent/Particles/P_Fire.P_Fire"));
    if (ParticleAsset.Succeeded())
    {
        OurParticleSystem->SetTemplate(ParticleAsset.Object);
    }

}
```

Next, add a `USpringArmComponent` for camera motion control and attach it to the `RootComponent`

#### add USpringArmComponent
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...
    // Use a spring arm to give the camera smooth, natural-feeling motion.
    USpringArmComponent* SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraAttachmentArm"));
    SpringArm->SetupAttachment(RootComponent);
    SpringArm->RelativeRotation = FRotator(-45.f, 0.f, 0.f);
    SpringArm->TargetArmLength = 400.0f;
    SpringArm->bEnableCameraLag = true;
    SpringArm->CameraLagSpeed = 3.0f;
}
```

Next, We'll create a `UCameraComponent` and attach it to our `SpringArm` 

#### create and attach camera
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...

    // Create a camera and attach to our spring arm
    UCameraComponent* Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("ActualCamera"));
    Camera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
}
```

Next, allow this pawn to immediately posses take control of the player.

#### posses the player
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...
    // Take control of the default player
    AutoPossessPlayer = EAutoReceiveInput::Player0;
}
```

Next, add our `UCollidingPawnMovementComponent` to our pawn.

#### add UCollidingPawnMovementComponent
```cpp
ACollidingPawn::ACollidingPawn()
{
    ...

    // Create an instance of our movement component, and tell it to update our root component.
    OurMovementComponent = CreateDefaultSubobject<UCollidingPawnMovementComponent>(TEXT("CustomMovementComponent"));
    OurMovementComponent->UpdatedComponent = RootComponent;
}
```

Below is the final `ACollidingPawn()` funciton.

#### ACollidingPawn::ACollidingPawn()
```cpp
// Sets default values
ACollidingPawn::ACollidingPawn()
{
 	// Set this pawn to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	    // Our root component will be a sphere that reacts to physics
    USphereComponent* SphereComponent = CreateDefaultSubobject<USphereComponent>(TEXT("RootComponent"));
    RootComponent = SphereComponent;
    SphereComponent->InitSphereRadius(40.0f);
    SphereComponent->SetCollisionProfileName(TEXT("Pawn"));

    // Create and position a mesh component so we can see where our sphere is
    UStaticMeshComponent* SphereVisual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    SphereVisual->SetupAttachment(RootComponent);
    static ConstructorHelpers::FObjectFinder<UStaticMesh> SphereVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Sphere.Shape_Sphere"));
    if (SphereVisualAsset.Succeeded())
    {
        SphereVisual->SetStaticMesh(SphereVisualAsset.Object);
        SphereVisual->SetRelativeLocation(FVector(0.0f, 0.0f, -40.0f));
        SphereVisual->SetWorldScale3D(FVector(0.8f));
    }

    // Create a particle system that we can activate or deactivate
    OurParticleSystem = CreateDefaultSubobject<UParticleSystemComponent>(TEXT("MovementParticles"));
    OurParticleSystem->SetupAttachment(SphereVisual);
    OurParticleSystem->bAutoActivate = false;
    OurParticleSystem->SetRelativeLocation(FVector(-20.0f, 0.0f, 20.0f));
    static ConstructorHelpers::FObjectFinder<UParticleSystem> ParticleAsset(TEXT("/Game/StarterContent/Particles/P_Fire.P_Fire"));
    if (ParticleAsset.Succeeded())
    {
        OurParticleSystem->SetTemplate(ParticleAsset.Object);
    }

    // Use a spring arm to give the camera smooth, natural-feeling motion.
    USpringArmComponent* SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraAttachmentArm"));
    SpringArm->SetupAttachment(RootComponent);
    SpringArm->RelativeRotation = FRotator(-45.f, 0.f, 0.f);
    SpringArm->TargetArmLength = 400.0f;
    SpringArm->bEnableCameraLag = true;
    SpringArm->CameraLagSpeed = 3.0f;

    // Create a camera and attach to our spring arm
    UCameraComponent* Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("ActualCamera"));
    Camera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);

    // Take control of the default player
    AutoPossessPlayer = EAutoReceiveInput::Player0;

    // Create an instance of our movement component, and tell it to update our root component.
    OurMovementComponent = CreateDefaultSubobject<UCollidingPawnMovementComponent>(TEXT("CustomMovementComponent"));
    OurMovementComponent->UpdatedComponent = RootComponent;

}
```

After setting up our pawn with all the necessary components let's go ahead and bind the input to our pawn in the `SetupPlayerInputComponent` function. But, first let's go inside the editor and create our `Action` and `Axis` inputs. In `Action Mappings`, add a button called `ParticleToggle` and bind it to the `P` key. In Axis Mappings create a `MoveForward`, `MoveRight`, and `Turn` inputs. Below are their corresponding values.

1. `MoveForward`   
    W: *Scale* 1.0  
    S: *Scale* -1.0  
    Up: *Scale* 1.0    
    Down: *Scale* -1.0  
    Gamepad Left Thumstick Y-Axis: Scale 1.0  

2. `MoveRight`   
    A: *Scale* -1.0  
    D: *Scale* 1.0  
    Left: *Scale* -1.0    
    Right: *Scale* 1.0  
    Gamepad Left Thumstick X-Axis: Scale 1.0  

3. `Turn`   
    Mouse X: *Scale* 1.0  

#### enter project settings
[![go into project settings](https://res.cloudinary.com/several-levels/image/upload/v1511728487/project-settings_twfimr.jpg "go into project settings")](https://res.cloudinary.com/several-levels/image/upload/v1511728487/project-settings_twfimr.jpg)

#### add action and axis inputs
[![action and axis inputs](https://res.cloudinary.com/several-levels/image/upload/v1511869303/pawn-input-settings_o5ubnc.jpg "action and axis inputs")](https://res.cloudinary.com/several-levels/image/upload/v1511869303/pawn-input-settings_o5ubnc.jpg)


Let's go ahead and bind the input to our pawn in the `SetupPlayerInputComponent` function. Our inputs will be bound to functions defined later in the code.

#### SetupPlayerInputComponent(class UInputComponent* InputComponent)
```cpp
void ACollidingPawn::SetupPlayerInputComponent(class UInputComponent* InputComponent)
{
    Super::SetupPlayerInputComponent(InputComponent);

    InputComponent->BindAction("ParticleToggle", IE_Pressed, this, &ACollidingPawn::ParticleToggle);

    InputComponent->BindAxis("MoveForward", this, &ACollidingPawn::MoveForward);
    InputComponent->BindAxis("MoveRight", this, &ACollidingPawn::MoveRight);
    InputComponent->BindAxis("Turn", this, &ACollidingPawn::Turn);
}
```

Next, create the `GetMovementComponent()` componet function to return our movement comp.

#### GetMovementComponent()
```cpp
UPawnMovementComponent* ACollidingPawn::GetMovementComponent() const
{
    return OurMovementComponent;
}
```

Now, we are going to set up our action and axis functions. The `MoveForward` function moves our pawn forward based on its `ForwardVector`. The `MoveRight` function moves our pawn forward based on its `RightVector`. The `Turn` function rotates the camera around the pawn. The `ParticleToggle` function is simple function that will toggle the fire particle's active state between `true` and `false`.

#### action and axis functions
```cpp
void ACollidingPawn::MoveForward(float AxisValue)
{
    if (OurMovementComponent && (OurMovementComponent->UpdatedComponent == RootComponent))
    {
        OurMovementComponent->AddInputVector(GetActorForwardVector() * AxisValue);
    }
}

void ACollidingPawn::MoveRight(float AxisValue)
{
    if (OurMovementComponent && (OurMovementComponent->UpdatedComponent == RootComponent))
    {
        OurMovementComponent->AddInputVector(GetActorRightVector() * AxisValue);
    }
}

void ACollidingPawn::Turn(float AxisValue)
{
    FRotator NewRotation = GetActorRotation();
    NewRotation.Yaw += AxisValue;
    SetActorRotation(NewRotation);
}

void ACollidingPawn::ParticleToggle()
{
    if (OurParticleSystem && OurParticleSystem->Template)
    {
        OurParticleSystem->ToggleActive();
    }
}
```

Finally, drag and drop your pawn into the game scene and you should be able to move the sphere around the world.

Final code is below.

### CollidingPawn.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "CollidingPawn.generated.h"

UCLASS()
class UNREALCPP_API ACollidingPawn : public APawn
{
	GENERATED_BODY()

public:
	// Sets default values for this pawn's properties
	ACollidingPawn();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	

	// Called every frame
    virtual void Tick( float DeltaSeconds ) override;

    // Called to bind functionality to input
    virtual void SetupPlayerInputComponent(class UInputComponent* InputComponent) override;

    UParticleSystemComponent* OurParticleSystem;
    class UCollidingPawnMovementComponent* OurMovementComponent;

    virtual UPawnMovementComponent* GetMovementComponent() const override;

    void MoveForward(float AxisValue);
    void MoveRight(float AxisValue);
    void Turn(float AxisValue);
    void ParticleToggle();

};
```

### CollidingPawn.cpp
```cpp
#include "CollidingPawn.h"
#include "Camera/CameraComponent.h"
#include "CollidingPawnMovementComponent.h"
#include "Components/InputComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SphereComponent.h"
#include "ConstructorHelpers.h"
#include "GameFramework/SpringArmComponent.h"
#include "Particles/ParticleSystemComponent.h"


// Sets default values
ACollidingPawn::ACollidingPawn()
{
 	// Set this pawn to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	    // Our root component will be a sphere that reacts to physics
    USphereComponent* SphereComponent = CreateDefaultSubobject<USphereComponent>(TEXT("RootComponent"));
    RootComponent = SphereComponent;
    SphereComponent->InitSphereRadius(40.0f);
    SphereComponent->SetCollisionProfileName(TEXT("Pawn"));

    // Create and position a mesh component so we can see where our sphere is
    UStaticMeshComponent* SphereVisual = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    SphereVisual->SetupAttachment(RootComponent);
    static ConstructorHelpers::FObjectFinder<UStaticMesh> SphereVisualAsset(TEXT("/Game/StarterContent/Shapes/Shape_Sphere.Shape_Sphere"));
    if (SphereVisualAsset.Succeeded())
    {
        SphereVisual->SetStaticMesh(SphereVisualAsset.Object);
        SphereVisual->SetRelativeLocation(FVector(0.0f, 0.0f, -40.0f));
        SphereVisual->SetWorldScale3D(FVector(0.8f));
    }

    // Create a particle system that we can activate or deactivate
    OurParticleSystem = CreateDefaultSubobject<UParticleSystemComponent>(TEXT("MovementParticles"));
    OurParticleSystem->SetupAttachment(SphereVisual);
    OurParticleSystem->bAutoActivate = false;
    OurParticleSystem->SetRelativeLocation(FVector(-20.0f, 0.0f, 20.0f));
    static ConstructorHelpers::FObjectFinder<UParticleSystem> ParticleAsset(TEXT("/Game/StarterContent/Particles/P_Fire.P_Fire"));
    if (ParticleAsset.Succeeded())
    {
        OurParticleSystem->SetTemplate(ParticleAsset.Object);
    }

    // Use a spring arm to give the camera smooth, natural-feeling motion.
    USpringArmComponent* SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraAttachmentArm"));
    SpringArm->SetupAttachment(RootComponent);
    SpringArm->RelativeRotation = FRotator(-45.f, 0.f, 0.f);
    SpringArm->TargetArmLength = 400.0f;
    SpringArm->bEnableCameraLag = true;
    SpringArm->CameraLagSpeed = 3.0f;

    // Create a camera and attach to our spring arm
    UCameraComponent* Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("ActualCamera"));
    Camera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);

    // Take control of the default player
    AutoPossessPlayer = EAutoReceiveInput::Player0;

    // Create an instance of our movement component, and tell it to update our root component.
    OurMovementComponent = CreateDefaultSubobject<UCollidingPawnMovementComponent>(TEXT("CustomMovementComponent"));
    OurMovementComponent->UpdatedComponent = RootComponent;

}

// Called when the game starts or when spawned
void ACollidingPawn::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ACollidingPawn::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

// Called to bind functionality to input
void ACollidingPawn::SetupPlayerInputComponent(class UInputComponent* InputComponent)
{
    Super::SetupPlayerInputComponent(InputComponent);

    InputComponent->BindAction("ParticleToggle", IE_Pressed, this, &ACollidingPawn::ParticleToggle);

    InputComponent->BindAxis("MoveForward", this, &ACollidingPawn::MoveForward);
    InputComponent->BindAxis("MoveRight", this, &ACollidingPawn::MoveRight);
    InputComponent->BindAxis("Turn", this, &ACollidingPawn::Turn);
}

UPawnMovementComponent* ACollidingPawn::GetMovementComponent() const
{
    return OurMovementComponent;
}

void ACollidingPawn::MoveForward(float AxisValue)
{
    if (OurMovementComponent && (OurMovementComponent->UpdatedComponent == RootComponent))
    {
        OurMovementComponent->AddInputVector(GetActorForwardVector() * AxisValue);
    }
}

void ACollidingPawn::MoveRight(float AxisValue)
{
    if (OurMovementComponent && (OurMovementComponent->UpdatedComponent == RootComponent))
    {
        OurMovementComponent->AddInputVector(GetActorRightVector() * AxisValue);
    }
}

void ACollidingPawn::Turn(float AxisValue)
{
    FRotator NewRotation = GetActorRotation();
    NewRotation.Yaw += AxisValue;
    SetActorRotation(NewRotation);
}

void ACollidingPawn::ParticleToggle()
{
    if (OurParticleSystem && OurParticleSystem->Template)
    {
        OurParticleSystem->ToggleActive();
    }
}
```

### CollidingPawnMovementComponent.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PawnMovementComponent.h"
#include "CollidingPawnMovementComponent.generated.h"

UCLASS()
class UNREALCPP_API UCollidingPawnMovementComponent : public UPawnMovementComponent
{
	GENERATED_BODY()

public:
    virtual void TickComponent(float DeltaTime, enum ELevelTick TickType, FActorComponentTickFunction *ThisTickFunction) override;

};
```

### CollidingPawnMovementComponent.cpp
```cpp
#include "CollidingPawnMovementComponent.h"

void UCollidingPawnMovementComponent::TickComponent(float DeltaTime, enum ELevelTick TickType, FActorComponentTickFunction *ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    // Make sure that everything is still valid, and that we are allowed to move.
    if (!PawnOwner || !UpdatedComponent || ShouldSkipUpdate(DeltaTime))
    {
        return;
    }

    // Get (and then clear) the movement vector that we set in ACollidingPawn::Tick
    FVector DesiredMovementThisFrame = ConsumeInputVector().GetClampedToMaxSize(1.0f) * DeltaTime * 150.0f;
    if (!DesiredMovementThisFrame.IsNearlyZero())
    {
        FHitResult Hit;
        SafeMoveUpdatedComponent(DesiredMovementThisFrame, UpdatedComponent->GetComponentRotation(), true, Hit);

        // If we bumped into something, try to slide along it
        if (Hit.IsValidBlockingHit())
        {
            SlideAlongSurface(DesiredMovementThisFrame, 1.f - Hit.Time, Hit.Normal, Hit);
        }
    }
};
```