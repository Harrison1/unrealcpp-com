---
templateKey: blog-post
path: /add-force-to-mesh
title: Add Force to Mesh
image: https://res.cloudinary.com/several-levels/image/upload/v1515966105/add-force-to-mesh_yxngcj.jpg
video: s_MPerD24cI
tags: ["intermediate"]
uev: 4.18.3
date: 2018-01-14T18:00:00.226Z
description: In this tutorial we'll add force to actors and static meshes each time we fire the gun.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/AddForceOnFire](https://github.com/Harrison1/unrealcpp/tree/master/AddForceOnFire)**

*For this tutorial we are using the standard first person C++ template with starter content.*

In this tutorial we will add force to an actor each time we shoot the gun. All of our logic is going to be put inside the Charcter's `.cpp` file.

First, include `DrawDebugHelpers.h` at the top of the script so we can visualize the line trace.

#### include DrawDebugHelpers
```cpp
// include draw debug helpers header file
#include "DrawDebugHelpers.h"
```

We are going to shoot out the line trace every time we fire the gun. Find the `OnFire()` method inside the character's `.cpp` file and the first thing we want to do is delete the projectile code. For this tutorial we will not be using the below code. Your code might be slightly different due to project naming conventions.

#### delete this code
```cpp
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
```

Next, Create a `FHitResult` variable to see if our line trace hits anything. In this example our line trace will start from the Character's gun mesh. To get the Gun's location we do `FP_Gun->GetComponentLocation()`. We always want the forward vector of where the player is looking so we get the forward vector from the camera using `FirstPersonCameraComponent->GetForwardVector()`. We are going to End the line trace `2000.0f` unreal units from the the start. 

#### first set of variables
```cpp
void AUnrealCPPCharacter::OnFire()
{
    FHitResult Hit;
    FVector CameraForward = FVector(FirstPersonCameraComponent->GetForwardVector());
    float LineLength = 2000;
}
```
Next we need to grap the control rotation from the actor character using the `GetControlRotation()`. We will use this `FRotator` variable when we set our `StartLocation`. The `StartLocation` is an `FVector` point in front of the gun. The same is used in the projectile code that we delted earlier. Next, create the `EndLocation` which is the `StartLocatoin` plus the Camera Forward Vector multiplied by `LineLength`.

#### spawn rotation and start location
```cpp
...
    FRotator SpawnRotation = GetControlRotation();
	FVector StartLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);
    FVector EndLocation = StartLocation + (FirstPersonCameraComponent->GetForwardVector() * LineLength);
```

Next, create a `FCollisionQueryParams` varaible to handle collisoin events in the line trace. Add the debug line to visualize the line trace by using `DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1, 0, 1.f);`. Then, add the line trace with `GetWorld()->LineTraceSingleByChannel(Hit, StartLocation, EndLocation, ECollisionChannel::ECC_PhysicsBody, CollisionParameters);` and if we successfully hit something our `FHitResult` will get a successfull actor.

#### Collision Parameters, Line Trace, Debug Line
```cpp
...
	FCollisionQueryParams CollisionParameters;
	GetWorld()->LineTraceSingleByChannel(Hit, StartLocation, EndLocation, ECollisionChannel::ECC_PhysicsBody, CollisionParameters);
	DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1, 0, 1.f);
```

Now let's create an `if` statement that will trigger true if `Hit.GetActor()` returns `true`. If we are successful, then we must check if the **Actor's** root component is movable. If it is not movable then we cannot add force to it. If the root component is movable we will then cast the **Actor's** root component to a new variable called `MeshRootComp`. Finally we add force to `MeshRootComp` with `AddForce(CameraForward*100000*MeshRootComp->GetMass());`. Feel free to change the numbers to anything you like. 

#### Conditional Statement
```cpp
...
	if (Hit.GetActor()) 
	{
		if(Hit.GetActor()->IsRootComponentMovable()) {

			UStaticMeshComponent* MeshRootComp = Cast<UStaticMeshComponent>(Hit.GetActor()->GetRootComponent());

			MeshRootComp->AddForce(CameraForward*100000*MeshRootComp->GetMass());
		}

	}
```

Below is the final `OnFire()` code with some extra debug loggin methods. Now, go back inside the editor, click compile, and you should be blowing stuff around the game world. Actors must have their **Mobility** set to Movable and their phyiscs must also be turned on to accept the `AddForce` method.

#### OnFire() Method
```cpp
void AUnrealCPPCharacter::OnFire()
{

	//Hit contains information about what the line trace hit.
	FHitResult Hit;
	FVector CameraForward = FVector(FirstPersonCameraComponent->GetForwardVector());

	//The length of the line trace in units.
	//For more flexibility you can expose a public variable in the editor
	float LineLength = 2000;

	FRotator SpawnRotation = GetControlRotation();
	FVector StartLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);

    // log helpful information
	UE_LOG(LogClass, Log, TEXT("Start Location: %s"), *StartLocation.ToString());
	UE_LOG(LogClass, Log, TEXT("Spawn Rotation: %s"), *SpawnRotation.ToString());
	UE_LOG(LogClass, Log, TEXT("Forward Vector: %s"), *FirstPersonCameraComponent->GetForwardVector().ToString());

	//The EndLocation of the line trace
	FVector EndLocation = StartLocation + (FirstPersonCameraComponent->GetForwardVector() * LineLength);

	//Collision parameters. The following syntax means that we don't want the trace to be complex
	FCollisionQueryParams CollisionParameters;

	GetWorld()->LineTraceSingleByChannel(Hit, StartLocation, EndLocation, ECollisionChannel::ECC_PhysicsBody, CollisionParameters);

	//DrawDebugLine is used in order to see the line cast we performed
	//The boolean parameter used here means that we want the lines to be persistent so we can see the actual linecast forever
	//The last parameter is the width of the lines.
	DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1, 0, 1.f);

	if (Hit.GetActor()) 
	{
		if(Hit.GetActor()->IsRootComponentMovable()) {

			UStaticMeshComponent* MeshRootComp = Cast<UStaticMeshComponent>(Hit.GetActor()->GetRootComponent());

			UE_LOG(LogClass, Log, TEXT("I Hit: %s"), *Hit.GetActor()->GetName());
			UE_LOG(LogClass, Log, TEXT("Mesh Mass: %f"), MeshRootComp->GetMass());

			MeshRootComp->AddForce(CameraForward*100000*MeshRootComp->GetMass());
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
```

Below is the **Charcter's** final `.cpp` code to add force to actors evertime the gun fires.

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
// include draw debug helpers header file
#include "DrawDebugHelpers.h"

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

}

void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	Mesh1P->SetHiddenInGame(false, true);

}

//Called every frame
void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

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

	//Hit contains information about what the line trace hit.
	FHitResult Hit;
	FVector CameraForward = FVector(FirstPersonCameraComponent->GetForwardVector());

	//The length of the line trace in units.
	//For more flexibility you can expose a public variable in the editor
	float LineLength = 2000;

	FRotator SpawnRotation = GetControlRotation();
	FVector StartLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);

    // log helpful information
	UE_LOG(LogClass, Log, TEXT("Start Location: %s"), *StartLocation.ToString());
	UE_LOG(LogClass, Log, TEXT("Spawn Rotation: %s"), *SpawnRotation.ToString());
	UE_LOG(LogClass, Log, TEXT("Forward Vector: %s"), *FirstPersonCameraComponent->GetForwardVector().ToString());

	//The EndLocation of the line trace
	FVector EndLocation = StartLocation + (FirstPersonCameraComponent->GetForwardVector() * LineLength);

	//Collision parameters. The following syntax means that we don't want the trace to be complex
	FCollisionQueryParams CollisionParameters;

	GetWorld()->LineTraceSingleByChannel(Hit, StartLocation, EndLocation, ECollisionChannel::ECC_PhysicsBody, CollisionParameters);

	//DrawDebugLine is used in order to see the line cast we performed
	//The boolean parameter used here means that we want the lines to be persistent so we can see the actual linecast forever
	//The last parameter is the width of the lines.
	DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1, 0, 1.f);

	if (Hit.GetActor()) 
	{
		if(Hit.GetActor()->IsRootComponentMovable()) {

			UStaticMeshComponent* MeshRootComp = Cast<UStaticMeshComponent>(Hit.GetActor()->GetRootComponent());

			UE_LOG(LogClass, Log, TEXT("I Hit: %s"), *Hit.GetActor()->GetName());
			UE_LOG(LogClass, Log, TEXT("Mesh Mass: %f"), MeshRootComp->GetMass());

			MeshRootComp->AddForce(CameraForward*100000*MeshRootComp->GetMass());
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
```