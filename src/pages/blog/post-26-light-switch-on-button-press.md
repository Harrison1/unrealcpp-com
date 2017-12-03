---
templateKey: blog-post
path: /light-switch-push-button
title: Light Switch on Button Press
image: https://res.cloudinary.com/several-levels/image/upload/v1512222398/light-switch-button_cvzh0l.jpg
video: youtube.com
tags:
  - intermediate
uev: 4.18.1
date: 2017-12-02T09:55:44.226Z
description: How to toggle a light switch when you press a button or a key.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/LightSwitchPushButton](https://github.com/Harrison1/unrealcpp/tree/master/LightSwitchPushButton)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

Create a new `C++` actor class and call it `LightSwitchPushButton`. We are going to define four variables in the header file. We are going to define a `UPointLightComponent`, `USphereComponent`, `float`, and `void` function. Below is the final header code.

### LightSwitchPushButton.h
```cpp

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "LightSwitchPushButton.generated.h"

UCLASS()
class UNREALCPP_API ALightSwitchPushButton : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ALightSwitchPushButton();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	// virtual void Tick(float DeltaTime) override;

	// declare point light comp
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	class UPointLightComponent* PointLight;

	// declare sphere comp
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	class USphereComponent* LightSphere;

	// declare light intensity variable
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	float LightIntensity;

	// declare ToggleLight function
	UFUNCTION(BlueprintCallable, Category = "Light Switch")
	void ToggleLight();
	
};

```

Next, in our `.cpp` file let's first `#include` the necessary scripts we'll be using in our code. Include the `Components/PointLightComponent.h` and `Components/SphereComponent.h` files.


#### include header files
```cpp
#include "LightSwitchPushButton.h"
// include these header files
#include "Components/PointLightComponent.h"
#include "Components/SphereComponent.h"
```

We'll setup all the default properties of the actor in its init function. First let's set our float, `LightIntensity` to `3000.0f`, it will make the light bright enough to see it against objects. Next, we'll create our `UPointLightComponent` and set it as our `RootComponent`. After that we'll create our `USphereComponent` that will serve as the collision sphere for when our player get's inside the radius. Then, we'll create the simple `ToggleLight()` function that will toggle the light's visibility state. We'll call the the function from the the character script later on. Below is the final `.cpp` file for the `LightSwitchPushButton` actor.

### LightSwitchPushButton.cpp
```cpp
#include "LightSwitchPushButton.h"
#include "Components/PointLightComponent.h"
#include "Components/SphereComponent.h"

// Sets default values
ALightSwitchPushButton::ALightSwitchPushButton()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	LightIntensity = 3000.0f;

	PointLight = CreateDefaultSubobject<UPointLightComponent>(TEXT("Point Light"));
	PointLight->Intensity = LightIntensity;
	PointLight->bVisible = true;
	RootComponent = PointLight;

	LightSphere = CreateDefaultSubobject<USphereComponent>(TEXT("Light Sphere Component"));
	LightSphere->InitSphereRadius(300.0f);
	LightSphere->SetCollisionProfileName(TEXT("Trigger"));
	LightSphere->SetCollisionResponseToChannel(ECC_Pawn, ECR_Ignore);
	LightSphere->SetupAttachment(RootComponent);
}

// Called when the game starts or when spawned
void ALightSwitchPushButton::BeginPlay()
{
	Super::BeginPlay();
}

void ALightSwitchPushButton::ToggleLight()
{
    PointLight->ToggleVisibility();
}
```

Next, let's add an `Action` input to our project. In this case we are going to bind the `Action` input to our keyboard's `E` key. Go to Edit > Project Settings. Then select the Input option. Click the plus sign next to `Action Mappings`. Call the new input `Action` and select `E` from the dropdown menu.


#### open Edit > Project Settings
[![project settings](https://res.cloudinary.com/several-levels/image/upload/v1511728487/project-settings_twfimr.jpg "Project Settings")](https://res.cloudinary.com/several-levels/image/upload/v1511728487/settings-input_bj3avm.jpg)


#### go to the Input options and a button press
[![input settings](https://res.cloudinary.com/several-levels/image/upload/v1511728487/settings-input_bj3avm.jpg "Input Settings")](https://res.cloudinary.com/several-levels/image/upload/v1511728487/settings-input_bj3avm.jpg)

In our Character.h file add the `OnAction` method under the `OnFire` method. My header file in this tutorial is called `UnrealCPPCharacter.h`, your file might be called something different.

#### add OnAction to the header file
```cpp
protected:
	
	/** Fires a projectile. */
	void OnFire();

	// on action 
	void OnAction();
```

We will have to also include our `LightSwitchPushButton` header file so our character can access its functions.

#### include LightSwitchPushButton
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
// include our new LightSwitchPushButton header file
#include "LightSwitchPushButton/LightSwitchPushButton.h"
#include "UnrealCPPCharacter.generated.h"
```

Then declare a variable for the light switch the player is currently overlapping. Also, we will need to declare overlap events to trigger the functions we want to run when the player is inside the radius of the light's sphere component.

```cpp
// declare overlap begin function
UFUNCTION()
void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

// declare overlap end function
UFUNCTION()
void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);
// declare current light switch
class ALightSwitchPushButton* CurrentLightSwitch;
```

We are also going to have to declare a `UCapsuleComponent` to handle our trigger events.

```cpp
UPROPERTY(VisibleAnywhere, Category = "Trigger Capsule")
class UCapsuleComponent* TriggerCapsule;
```

Inside the init function add the trigger capsule and connect bind it to the overlap events. Them, set the variable `CurrentLightSwitch` to `NULL`.

#### setup up trigger capsule and variable
```cpp
AUnrealCPPCharacter::AUnrealCPPCharacter()
{
    ...
    // create trigger capsule
    TriggerCapsule = CreateDefaultSubobject<UCapsuleComponent>(TEXT("Trigger Capsule"));
    TriggerCapsule->InitCapsuleSize(55.f, 96.0f);;
    TriggerCapsule->SetCollisionProfileName(TEXT("Trigger"));
    TriggerCapsule->SetupAttachment(RootComponent);

    // bind trigger events
    TriggerCapsule->OnComponentBeginOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapBegin); 
    TriggerCapsule->OnComponentEndOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapEnd); 

     // set current light switch to null
     CurrentLightSwitch = NULL;
}
```

Connect the `Action` input to the character

#### bind action input
```cpp
void AUnrealCPPCharacter::SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent)
{
    ...
    // Bind action event
    PlayerInputComponent->BindAction("Action", IE_Pressed, this, &AUnrealCPPCharacter::OnAction);

}

```

Add the `OnAction()` function to the character script. The function will check if a `CurrentLightSwitch` is `NULL` or not. If the `CurrentLightSwicth` is not `NULL`, then when the player presses the `Action` key, `E`, the light will toggle the light's visibility. Then, add the Overlap functions to set and unset `CurrentLightSwitch`

#### OnAction and Overlap functions
```cpp
void AUnrealCPPCharacter::OnAction() 
{
	if(CurrentLightSwitch) 
	{
		CurrentLightSwitch->ToggleLight();
	}
}

// overlap on begin function
void AUnrealCPPCharacter::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if (OtherActor && (OtherActor != this) && OtherComp && OtherActor->GetClass()->IsChildOf(ALightSwitchPushButton::StaticClass())) 
	{
		CurrentLightSwitch = Cast<ALightSwitchPushButton>(OtherActor);
	}
} 

// overlap on end function
void AUnrealCPPCharacter::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	if (OtherActor && (OtherActor != this) && OtherComp) 
	{
		CurrentLightSwitch = NULL;
	}
}
```

Compile the code. Drag and drop the actor into the scene and when the character enter's the radius and pushes `E` the light will turn off and on.

### UnrealCPPCharacter.cpp
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

DEFINE_LOG_CATEGORY_STATIC(LogFPChar, Warning, All);

//////////////////////////////////////////////////////////////////////////
// AUnrealCPPCharacter

AUnrealCPPCharacter::AUnrealCPPCharacter()
{
	// Set size for collision capsule
	GetCapsuleComponent()->InitCapsuleSize(55.f, 96.0f);

	// set our turn rates for input
	BaseTurnRate = 45.f;
	BaseLookUpRate = 45.f;

	// Create a CameraComponent	
	FirstPersonCameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	FirstPersonCameraComponent->SetupAttachment(GetCapsuleComponent());
	FirstPersonCameraComponent->RelativeLocation = FVector(-39.56f, 1.75f, 64.f); // Position the camera
	FirstPersonCameraComponent->bUsePawnControlRotation = true;

	// Create a mesh component that will be used when being viewed from a '1st person' view (when controlling this pawn)
	Mesh1P = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("CharacterMesh1P"));
	Mesh1P->SetOnlyOwnerSee(true);
	Mesh1P->SetupAttachment(FirstPersonCameraComponent);
	Mesh1P->bCastDynamicShadow = false;
	Mesh1P->CastShadow = false;
	Mesh1P->RelativeRotation = FRotator(1.9f, -19.19f, 5.2f);
	Mesh1P->RelativeLocation = FVector(-0.5f, -4.4f, -155.7f);

	// Create a gun mesh component
	FP_Gun = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("FP_Gun"));
	FP_Gun->SetOnlyOwnerSee(true);			// only the owning player will see this mesh
	FP_Gun->bCastDynamicShadow = false;
	FP_Gun->CastShadow = false;
	// FP_Gun->SetupAttachment(Mesh1P, TEXT("GripPoint"));
	FP_Gun->SetupAttachment(RootComponent);

	FP_MuzzleLocation = CreateDefaultSubobject<USceneComponent>(TEXT("MuzzleLocation"));
	FP_MuzzleLocation->SetupAttachment(FP_Gun);
	FP_MuzzleLocation->SetRelativeLocation(FVector(0.2f, 48.4f, -10.6f));

	// Default offset from the character location for projectiles to spawn
	GunOffset = FVector(100.0f, 0.0f, 10.0f);

	// Note: The ProjectileClass and the skeletal mesh/anim blueprints for Mesh1P, FP_Gun, and VR_Gun 
	// are set in the derived blueprint asset named MyCharacter to avoid direct content references in C++.

	// create trigger capsule
	TriggerCapsule = CreateDefaultSubobject<UCapsuleComponent>(TEXT("Trigger Capsule"));
	TriggerCapsule->InitCapsuleSize(55.f, 96.0f);;
	TriggerCapsule->SetCollisionProfileName(TEXT("Trigger"));
	TriggerCapsule->SetupAttachment(RootComponent);

	// bind trigger events
	TriggerCapsule->OnComponentBeginOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapBegin); 
	TriggerCapsule->OnComponentEndOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapEnd); 

	// set current light switch to null
	CurrentLightSwitch = NULL;
}

void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	Mesh1P->SetHiddenInGame(false, true);

}

//////////////////////////////////////////////////////////////////////////
// Input

void AUnrealCPPCharacter::SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent)
{
	// set up gameplay key bindings
	check(PlayerInputComponent);

	// Bind jump events
	PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ACharacter::Jump);
	PlayerInputComponent->BindAction("Jump", IE_Released, this, &ACharacter::StopJumping);

	// Bind fire event
	PlayerInputComponent->BindAction("Fire", IE_Pressed, this, &AUnrealCPPCharacter::OnFire);

	// Bind action event
	PlayerInputComponent->BindAction("Action", IE_Pressed, this, &AUnrealCPPCharacter::OnAction);

	// Bind movement events
	PlayerInputComponent->BindAxis("MoveForward", this, &AUnrealCPPCharacter::MoveForward);
	PlayerInputComponent->BindAxis("MoveRight", this, &AUnrealCPPCharacter::MoveRight);

	// We have 2 versions of the rotation bindings to handle different kinds of devices differently
	// "turn" handles devices that provide an absolute delta, such as a mouse.
	// "turnrate" is for devices that we choose to treat as a rate of change, such as an analog joystick
	PlayerInputComponent->BindAxis("Turn", this, &APawn::AddControllerYawInput);
	PlayerInputComponent->BindAxis("TurnRate", this, &AUnrealCPPCharacter::TurnAtRate);
	PlayerInputComponent->BindAxis("LookUp", this, &APawn::AddControllerPitchInput);
	PlayerInputComponent->BindAxis("LookUpRate", this, &AUnrealCPPCharacter::LookUpAtRate);
}

void AUnrealCPPCharacter::OnFire()
{
	// try and fire a projectile
	if (ProjectileClass != NULL)
	{
		UWorld* const World = GetWorld();
		if (World != NULL)
		{
			const FRotator SpawnRotation = GetControlRotation();
			// MuzzleOffset is in camera space, so transform it to world space before offsetting from the character location to find the final muzzle position
			const FVector SpawnLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);

			//Set Spawn Collision Handling Override
			FActorSpawnParameters ActorSpawnParams;
			ActorSpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButDontSpawnIfColliding;

			// spawn the projectile at the muzzle
			World->SpawnActor<AUnrealCPPProjectile>(ProjectileClass, SpawnLocation, SpawnRotation, ActorSpawnParams);
		}
	}

	// try and play the sound if specified
	if (FireSound != NULL)
	{
		UGameplayStatics::PlaySoundAtLocation(this, FireSound, GetActorLocation());
	}

	// try and play a firing animation if specified
	if (FireAnimation != NULL)
	{
		// Get the animation object for the arms mesh
		UAnimInstance* AnimInstance = Mesh1P->GetAnimInstance();
		if (AnimInstance != NULL)
		{
			AnimInstance->Montage_Play(FireAnimation, 1.f);
		}
	}
}

void AUnrealCPPCharacter::MoveForward(float Value)
{
	if (Value != 0.0f)
	{
		// add movement in that direction
		AddMovementInput(GetActorForwardVector(), Value);
	}
}

void AUnrealCPPCharacter::MoveRight(float Value)
{
	if (Value != 0.0f)
	{
		// add movement in that direction
		AddMovementInput(GetActorRightVector(), Value);
	}
}

void AUnrealCPPCharacter::TurnAtRate(float Rate)
{
	// calculate delta for this frame from the rate information
	AddControllerYawInput(Rate * BaseTurnRate * GetWorld()->GetDeltaSeconds());
}

void AUnrealCPPCharacter::LookUpAtRate(float Rate)
{
	// calculate delta for this frame from the rate information
	AddControllerPitchInput(Rate * BaseLookUpRate * GetWorld()->GetDeltaSeconds());
}

void AUnrealCPPCharacter::OnAction() 
{
	if(CurrentLightSwitch) 
	{
		CurrentLightSwitch->ToggleLight();
	}
}

// overlap on begin function
void AUnrealCPPCharacter::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if (OtherActor && (OtherActor != this) && OtherComp && OtherActor->GetClass()->IsChildOf(ALightSwitchPushButton::StaticClass())) 
	{
		CurrentLightSwitch = Cast<ALightSwitchPushButton>(OtherActor);
	}
} 

// overlap on end function
void AUnrealCPPCharacter::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	if (OtherActor && (OtherActor != this) && OtherComp) 
	{
		CurrentLightSwitch = NULL;
	}
}
```
