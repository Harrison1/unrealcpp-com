---
templateKey: blog-post
path: /pickup-rotate-and-trhow-object
title: Pickup, Rotate, and Throw Object Like Gone Home
image: https://res.cloudinary.com/several-levels/image/upload/v1520943148/pikcup-rotate-actor_lebmpn.jpg
video: KsvUYzrTwBw
tags: ["intermediate"]
uev: 4.19.0
date: 2018-03-17T12:00:00.226Z
description: In this tutorial we'll learn how to pickup and inspect an object similar to Gone Home.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/PickupAndRotateActor](https://github.com/Harrison1/unrealcpp/tree/master/PickupAndRotateActor)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we'll learn how to pickup and inspect an object similar to Gone Home's mechanic. In Gone Home, while using a keyboard, when you push `Shift` or `Right Click` you can zoom in to inspect an object. If you're looking at a pickup object, you pick up and hold the object using `E`. If you're hodling an object, now when you push `Shift` or `Right Click` to rotate the object using your mouse. WHen you're done with the object, you push `E` to throw it.

The first thing we'll do is setup our **Input Actions**. Go to Edit > Project Settings > Input. Under Action Mappings add an Action and title it **Action**. Bind the new action to whatever buttons you want, for this tutorial I will be binding the **Action** button to the `E` key and the `Gamepad Face Button Left`. Next, add a new Action and title it **Inspect**. Bind the **Inspect** action to the `Left Shift` key, the `Right Mouse Button`, and the `Gamepad Right Trigger`.

### Action Bindings
[![action bindings](https://res.cloudinary.com/several-levels/image/upload/v1521112199/action-mappings-inspect_ohwadj.jpg
 "action bindings")](https://res.cloudinary.com/several-levels/image/upload/v1521112199/action-mappings-inspect_ohwadj.jpg)

Next, create a new **actor** class and call it whatever you want, in this tutorial I will call it `PickupAndRotateActor`.

In the new actor's header file, first add in the camera component because we'll be using a camera variable in the script.

#### include camera component
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
// include camera component
#include "Camera/CameraComponent.h"
``` 

Next, we'll create the variables we will be using in the actor. We will need to create a `StaticMeshComponent`, a `USceneComponent`, two functions, two `bools`, and four variables to track our player's forward vector and placement were we want to place the `actor` while it's being held.

#### header variables
```cpp
...
public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* MyMesh;

	UPROPERTY(EditAnywhere)
	USceneComponent* HoldingComp;

	UFUNCTION()
	void RotateActor();

	UFUNCTION()
	void Pickup();

	bool bHolding;
	bool bGravity;

	FRotator ControlRotation;
	ACharacter* MyCharacter;
	UCameraComponent* PlayerCamera;
	FVector ForwardVector;
```

Next, let's move into the actor's `.cpp` file. First we'll define our default values. Declare the mesh component by using `CreateDefaultSubobject` and then set it to the `RootComponent`. Then, set `bHolding` to `false` and `bGravity` to `true`. These will be our default values that our actor starts with. We will set the mesh for the actor later on inside the editor. Below is the constructor function

#### Constructor function
```cpp
APickupAndRotateActor::APickupAndRotateActor()
{
	PrimaryActorTick.bCanEverTick = true;

	MyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
	RootComponent = MyMesh;

	bHolding = false;
	bGravity = true;
}
```
Moving into the `BeginPlay` function, we will start by getting the player's **Holding Component**. The player's **Holding Component** will serve as a dummy placement for where we want to hold the object. To get the **Holding Component**, we will loop through the player's componetns and set our `HoldingComp` variable to the **Holding Component** `USceneComponent`. Also, in `BeginPlay` we will get the player's `UCameraComponent` so we can get the `ForwardVector` when we want to throw the object when we're done. Below is the `BeginPlay` function. 

#### BeginPlay function
```cpp
void APickupAndRotateActor::BeginPlay()
{
	Super::BeginPlay();

	MyCharacter = UGameplayStatics::GetPlayerCharacter(this, 0);
	PlayerCamera = MyCharacter->FindComponentByClass<UCameraComponent>();

	TArray<USceneComponent*> Components;
 
	MyCharacter->GetComponents(Components);

	if(Components.Num() > 0)
	{
		for (auto& Comp : Components)
		{
			if(Comp->GetName() == "HoldingComponent")
			{
				HoldingComp = Cast<USceneComponent>(Comp);
			}
		}
	}

}
```

In the `Tick` function, we will set the pickup actor's location and rotation if it meets our contraints. Below is the `Tick` function.

#### Tick function
```cpp
void APickupAndRotateActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if(bHolding && HoldingComp)
	{
		SetActorLocationAndRotation(HoldingComp->GetComponentLocation(), HoldingComp->GetComponentRotation());
	}

}
```

Next, we'll create our `RotateActor` function. This function will set the Pickup `Actor`'s location and rotation based `FirstPlayerController`'s `Control Rotation`.

#### RotateActor function
```cpp
void APickupAndRotateActor::RotateActor()
{
	ControlRotation = GetWorld()->GetFirstPlayerController()->GetControlRotation();
	SetActorRotation(FQuat(ControlRotation));
}
```

The last fuction we'll create in our `PickupAndRotateActor` will be the `Pickup` function. This function will toggle `bools`, pyhsics, gravity, and collisions. And if we don't want to hold the object anymore, we'll add force to the actor to throw the actor in the direction of the player camera's forward vector.

#### Pickup function
```cpp
void APickupAndRotateActor::Pickup()
{
	bHolding = !bHolding;	
	bGravity = !bGravity;
	MyMesh->SetEnableGravity(bGravity);
	MyMesh->SetSimulatePhysics(bHolding ? false : true);
	MyMesh->SetCollisionEnabled(bHolding ? ECollisionEnabled::NoCollision : ECollisionEnabled::QueryAndPhysics);

	if(!bHolding) 
	{
		ForwardVector = PlayerCamera->GetForwardVector();
		MyMesh->AddForce(ForwardVector*100000*MyMesh->GetMass());
	}

}
```
We're done with the `PickupAndRotateActor`, let's move into the character files. First let's go into the character's `.h` file and setup our variables that we'll be using in the script. At the top of the `.h` file include the new pickup actor's `.h` file we just created. This will allow us to set a variable to that kind of class.

#### Character header file inlucde pickup actor class
```cpp

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
// add in the pickup actor class, it needs to be above the character generated include file.
#include "PickupAndRotateActor/PickupAndRotateActor.h"
#include "UnrealCPPCharacter.generated.h"
``` 

Next, under where the file declares the player's components, let's declare a new `USceneComponent`, this component will be dummy component that will hold the location of where in the game world we want to hold the actor. 

#### Declare scene component
```cpp
...
	/** Location on gun mesh where projectiles should spawn. */
	UPROPERTY(VisibleDefaultsOnly, Category = Mesh)
	class USceneComponent* FP_MuzzleLocation;

	/** First person camera */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class UCameraComponent* FirstPersonCameraComponent;

	/** Holding Component */
	UPROPERTY(EditAnywhere)
	class USceneComponent* HoldingComponent;
```

In the `protected` section of the script, under the `BeginPlay` function, we'll add in the ability to `override` the `Tick` function.

#### Override Tick
```cpp
...
protected:
	virtual void BeginPlay();

	virtual void Tick(float DeltaSeconds) override;
``` 

Next, in the `public` section let's declare our variables that we will be using throughout our player's script. We'll create a `APickupAndRotateActor` `class` called **CurrentItem** to represent an object that can picked up in the game world. Then we'll create `bools` to determine if our player can move, is holding an item, or inspecting an item. Create two `floats` to hold the Min and Max our player camera's `Pitch` value. Create a vector for our `HoldingComp` and an `FRotator` to hold our players last rotation so when we start rotating the object we don't lose track of where our player was last looking. The final set of variables will help set up our `line` trace.

```cpp
public:

	...

	UPROPERTY(EditAnywhere)
	class APickupAndRotateActor* CurrentItem;

	bool bCanMove;
	bool bHoldingItem;
	bool bInspecting;

	float PitchMax;
	float PitchMin;

	FVector HoldingComp;
	FRotator LastRotation;

	FVector Start;
	FVector ForwardVector;
	FVector End;

	FHitResult Hit;
	
	FComponentQueryParams DefaultComponentQueryParams;
	FCollisionResponseParams DefaultResponseParam;
```

Next, let's move into the character's `.cpp` file. First, at the top include `DrawDebugHelpers` so we can visuallize the line trace.

#### include DrawDebugHelpers
```cpp
#include "UnrealCPPCharacter.h"
#include "UnrealCPPProjectile.h"
#include "Animation/AnimInstance.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/SphereComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/InputSettings.h"
#include "HeadMountedDisplayFunctionLibrary.h"
#include "Kismet/GameplayStatics.h"
#include "MotionControllerComponent.h"
// include DrawDebugHelpers
#include "DrawDebugHelpers.h"
```

Moving into our constructor function we'll set default values for our variables. We'll create our `HoldingComponent` with `CreateDefaultSubobject`, set its relative locatoion and then attach it to the `FP_MuzzleLocation` as a sub component.

#### constructor function
```cpp
AUnrealCPPCharacter::AUnrealCPPCharacter()
{
	...

	HoldingComponent = CreateDefaultSubobject<USceneComponent>(TEXT("HoldingComponent"));
	HoldingComponent->RelativeLocation.X = 50.0f;
	HoldingComponent->SetupAttachment(FP_MuzzleLocation);

	CurrentItem = NULL;
	bCanMove = true;
	bInspecting = false;

}
```

In the `BeginPlay` function we're going to set our `PitchMax` and `PitchMin` variables to the player's default `Pitch` values. 

#### BeginPlay
```cpp
void AUnrealCPPCharacter::BeginPlay()
{
	...

	PitchMax = GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMax;
	PitchMin = GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMin;

}
```

In the `Tick` function we will draw a line trace every frame that is 200 unreal units long. If the line trace hits an actor that is a class of `PickupAndRotateActor`, we will set our `CurrentItem` variable to that actor. Now, depending on if we are holding an object or not, will determine if we zoom in to inspect an object or to put the object in front of our camera to rotate it. So if the player is not holding an object we will increase the `FirstPersonCameraComponent`'s `FieldOfView` to `45.0f`. We will use `Lerp` to smoothly transition between `90.f` and `45.0f`. However, if our player *is* holding a pickup actor, when the players presses the `Inspect` button the actor will change locations to be in front of the player. Furthermore we will have to change the `PlayerCameraManager`'s `ViewPitchMax` and `ViewPitchMin` values to `179.9000002f` and `-179.9000002f` respectively to have full rotational movement for our actor. Lastly, while the `Inpect` button is being held we will call the `CurrentItem`'s `RotateActor` function to set the rotation of the actor. We will player and camera movement later on. Below is the `Tick` function.

#### Tick function
```cpp
void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	Start = FirstPersonCameraComponent->GetComponentLocation();
	ForwardVector = FirstPersonCameraComponent->GetForwardVector();
	End = ((ForwardVector * 200.f) + Start);

	DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1, 0, 1);

	if(!bHoldingItem)
	{
		if(GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, DefaultComponentQueryParams, DefaultResponseParam)) 
		{
			if(Hit.GetActor()->GetClass()->IsChildOf(APickupAndRotateActor::StaticClass())) 
			{				
				CurrentItem = Cast<APickupAndRotateActor>(Hit.GetActor());
			}
		}
		else
		{
			CurrentItem = NULL;
		}
	}

	if(bInspecting)
	{
		if(bHoldingItem)
		{
			FirstPersonCameraComponent->SetFieldOfView(FMath::Lerp(FirstPersonCameraComponent->FieldOfView, 90.0f, 0.1f));
			HoldingComponent->SetRelativeLocation(FVector(0.0f, 50.0f, 50.0f));
			GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMax = 179.9000002f;
			GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMin = -179.9000002f;
			CurrentItem->RotateActor();
		}
		else
		{
			FirstPersonCameraComponent->SetFieldOfView(FMath::Lerp(FirstPersonCameraComponent->FieldOfView, 45.0f, 0.1f));
		}
	}
	else 
	{
		FirstPersonCameraComponent->SetFieldOfView(FMath::Lerp(FirstPersonCameraComponent->FieldOfView, 90.0f, 0.1f));

		if(bHoldingItem)
		{
			HoldingComponent->SetRelativeLocation(FVector(50.0f, 0.0f, 0.f));
		}
	}
}
```

In the `SetupPlayerInputComponent` function we will bind the `Action` to the `OnAction` function and then bind the pressed and released actions for the `Inspect` button to their respective functions.

#### Bind input
```cpp
void AUnrealCPPCharacter::SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent)
{
	...

	// Bind action event
	PlayerInputComponent->BindAction("Action", IE_Pressed, this, &AUnrealCPPCharacter::OnAction);

	// Bind Inspect event
	PlayerInputComponent->BindAction("Inspect", IE_Pressed, this, &AUnrealCPPCharacter::OnInspect);
	PlayerInputComponent->BindAction("Inspect", IE_Released, this, &AUnrealCPPCharacter::OnInspectReleased);
}
```

Since the player won't be able to move when rotating an object, we need to add `bCanMove` to the `MoveForward` and `MoveRight` functions to disable movement when `bCanMove` is false.

#### add bCanMove to movement functions
```cpp
void AUnrealCPPCharacter::MoveForward(float Value)
{
	if (Value != 0.0f && bCanMove)
	{
		// add movement in that direction
		AddMovementInput(GetActorForwardVector(), Value);
	}
}

void AUnrealCPPCharacter::MoveRight(float Value)
{
	if (Value != 0.0f && bCanMove)
	{
		// add movement in that direction
		AddMovementInput(GetActorRightVector(), Value);
	}
}
```
Next we'll create the `OnAction`, `OnInspect`, and `OnInspectReleased` functions. `OnAction` will run the `ToggleItemPickup` function when `CurrentItem` is not `NULL` and `bInspecting` is false. The `OnInspect` will set `bInspecting` to `true`, but if the player is holding an object then the function will set `LastRotation` and then toggle the object's location. `OnInspectReleased` returns things to normal by reverting the controller rotation to `LastRotation`, resetting the camera pitch values, and giving mvoment back to the player. Below is functions in code. 

#### Action and Inspect functions
```cpp
void AUnrealCPPCharacter::OnAction()
{
	if(CurrentItem && !bInspecting)
	{
		ToggleItemPickup();
	}
	else 
	{
		return;
	}
}

void AUnrealCPPCharacter::OnInspect()
{
	if(bHoldingItem)
	{
		LastRotation = GetControlRotation();
		ToggleMovement();
	}
	else 
	{
		bInspecting = true;
	}
}

void AUnrealCPPCharacter::OnInspectReleased()
{
	if (bInspecting && bHoldingItem) 
	{
		GetController()->SetControlRotation(LastRotation);
		GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMax = PitchMax;
		GetWorld()->GetFirstPlayerController()->PlayerCameraManager->ViewPitchMin = PitchMin;
		ToggleMovement();
	}
	else 
	{
		bInspecting = false;
	}
}
```

Next, we we'll create two more functions that are referred to above that will toggle our player's movment and pickup/throw objects. `ToggleMovement` will simply toggle bools used throughout the player code. `ToggleItemPickup` will run the `CurrentItem`'s pickup function that will either be held or thrown. 

#### ToggleMovemnt and ToggleItemPickup
```cpp
void AUnrealCPPCharacter::ToggleMovement()
{
	bCanMove = !bCanMove;
	bInspecting = !bInspecting;
	FirstPersonCameraComponent->bUsePawnControlRotation = !FirstPersonCameraComponent->bUsePawnControlRotation;
	bUseControllerRotationYaw = !bUseControllerRotationYaw;
}

void AUnrealCPPCharacter::ToggleItemPickup()
{
	if(CurrentItem)
	{
		bHoldingItem = !bHoldingItem;
		CurrentItem->Pickup();

		if(!bHoldingItem)
		{
			CurrentItem = NULL;
		}
	}
}
```