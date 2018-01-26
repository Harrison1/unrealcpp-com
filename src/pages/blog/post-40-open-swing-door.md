---
templateKey: blog-post
path: /open-swing-door
title: Open Swing Door
image: https://res.cloudinary.com/several-levels/image/upload/v1516801153/swing-door_jh0rhn.jpg
video: s_MPerD24cI
tags: ["intermediate"]
uev: 4.18.3
date: 2018-01-27T15:00:00.226Z
description: In this tutorial we'll learn how to open a door depending on which way the player is facing when a user presses an action key.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/SwingDoor](https://github.com/Harrison1/unrealcpp/tree/master/SwingDoor)**

*For this tutorial we are using the standard first person C++ template with starter content.*

In this Unreal Engine 4 C++ tutorial we will learn how to open a door depending on which way the player is facing and when a user presses an action key. Create a new **actor** class and call it whatever you want, in this tutorial I will call it `SwingDoor`.

First, in the `.h` file we will create our variables. We'll create three `bool` variables to determine the state of the door and four`float` variables to set different numbers for the door. Next, we'll add in functions for toggling the door and building the door itself with a `UStaticMeshComponent` and `UBoxComponent`. All elements to the `public` section of the header file.

#### header variables and functions.
```cpp
...
UFUNCTION()
void OpenDoor(float dt);

UFUNCTION()
void CloseDoor(float dt);

class UStaticMeshComponent* Door;

// declare sphere comp
UPROPERTY(VisibleAnywhere, Category = "BoxComp")
class UBoxComponent* BoxComp;

UFUNCTION()
void ToggleDoor(FVector ForwardVector);

bool Opening;
bool Closing;
bool isClosed;

float DotP;
float MaxDegree;
float AddRotation;
float PosNeg;
float DoorCurrentRotation;
```

Next, move into the `.cpp` file and `#include` the the following header files so we can access their properties later in the script.

#### include files
```cpp
#include "ConstructorHelpers.h"
#include "DrawDebugHelpers.h"
#include "Kismet/GameplayStatics.h"
```

In the constructor function we will set our default variables, grab our door mesh and set up our box component. We are grabbing the door from the file name using `ConstructorHelpers::FObjectFinder` and then if we successfully grab the mesh we set its properties. We create the Box Component with `CreateDefaultSubobject` and then set its values.

#### constructor function
```cpp
ASwingDoor::ASwingDoor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	BoxComp = CreateDefaultSubobject<UBoxComponent>(TEXT("MyBoxComponent"));
	BoxComp->InitBoxExtent(FVector(150,100,100));
	BoxComp->SetCollisionProfileName("Trigger");
	RootComponent = BoxComp;

	Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Door"));
    Door->SetupAttachment(RootComponent);

	static ConstructorHelpers::FObjectFinder<UStaticMesh> DoorAsset(TEXT("/Game/StarterContent/Props/SM_Door.SM_Door"));

	if (DoorAsset.Succeeded())
    {
        Door->SetStaticMesh(DoorAsset.Object);
        Door->SetRelativeLocation(FVector(0.0f, 50.0f, -100.0f));
        Door->SetWorldScale3D(FVector(1.f));
	}

	isClosed = true;

	Opening = false;
	Closing = false;

	DotP = 0.0f;
	MaxDegree = 0.0f;
	AddRotation = 0.0f;
	PosNeg = 0.0f;
	DoorCurrentRotation = 0.0f;

}
```

In the `BeginPlay()` function we will simply just draw our debug box with `DrawDebugBox`.

#### BeginPlay function
```cpp
void ASwingDoor::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), BoxComp->GetScaledBoxExtent(), FQuat(GetActorRotation()), FColor::Turquoise, true, -1, 0, 2);
}
```

In the `Tick` function we will check if the door is opening or closing and depending on what is true we will run the `OpenDoor` or `CloseDoor` function. Both functions will take in the `DeltaTime` float for a smoots rotation.

#### tick function
```cpp
void ASwingDoor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if(Opening) 
	{
		OpenDoor(DeltaTime);
	}

	if(Closing)
	{
		CloseDoor(DeltaTime);
	}

}
```

Next, we will create our `OpenDoor` function. We pass the `DeltaTime` float from the `Tick` function. First, grab the Door's `Yaw` value with `Door->RelativeRotation.Yaw`. Then, we'll create our `AddRotation` float that will be how much rotation we add to the door on each frame. `PosNeg` is to determine a positive or negative value based on the player's locatoin. We Set `PosNeg` later on the `ToggleDoor` function. If the the door's `Yaw` roation value is nearly at our `MaxDegree` (we set the max degree varialbe later on), we want to set our `bool`s to false and prevent any further movement. but if the `Opening` is true, then add and set the relative rotation with for the door.

#### OpenDoor function
```cpp
void ASwingDoor::OpenDoor(float dt)
{
	DoorCurrentRotation = Door->RelativeRotation.Yaw;

	AddRotation = PosNeg*dt*80;

	if(FMath::IsNearlyEqual(DoorCurrentRotation, MaxDegree, 1.5f))
	{
		Closing = false;
		Opening = false;
	} 
	else if (Opening)
	{
		FRotator NewRotation = FRotator(0.0f, AddRotation, 0.0f);
		Door->AddRelativeRotation(FQuat(NewRotation), false, 0, ETeleportType::None);
	}
}

```

The `CloseDoor` function is very similar to the `OpenDoor` function with main different being that we need to check the door's current rotation first to determine how much rotation to add to the door.

#### CloseDoor function
```cpp
void ASwingDoor::CloseDoor(float dt)
{
	DoorCurrentRotation = Door->RelativeRotation.Yaw;

	if(DoorCurrentRotation > 0) 
	{
		AddRotation = -dt*80;
	} 
	else 
	{
		AddRotation = dt*80;
	}

	if(FMath::IsNearlyEqual(DoorCurrentRotation, 0.0f, 1.5f))
	{
		Closing = false;
		Opening = false;
	} 
	else if (Closing)
	{
		FRotator NewRotation = FRotator(0.0f, AddRotation, 0.0f);
		Door->AddRelativeRotation(FQuat(NewRotation), false, 0, ETeleportType::None);
	}
}
```

The `ToggleDoor` function will be called from the character's script and set our `bool` variables and also determine if our player if in front or behind the door. We pass in the character's camera `ForwardVector` from the character script and fro that we `DotProduct` from the `BoxComponent Forward Vector` and the `Camera Forward Vector`. If the `DotProduct` is positive, the player is in front of the door, if negative, the player is behind the door. Next, set `PosNeg` with `FMath::Sign` to return `1` or `-1` depending on whether the `DotProduct` is positive or negative. Next, set our `MaxDegree` to 90 or -90 depending on which direction we want the door to open. 

#### ToggleDoor function
```cpp
void ASwingDoor::ToggleDoor(FVector ForwardVector) 
{

	// is the chacter in front or behind the door
	DotP = FVector::DotProduct(BoxComp->GetForwardVector(), ForwardVector);

	// get 1 or -1 from the the dot product
	PosNeg = FMath::Sign(DotP);

	// degree to clamp at
	MaxDegree = PosNeg*90.0f;

	// toggle bools
	if(isClosed) {
		isClosed = false;
		Closing = false;
		Opening = true;

	} else {
		Opening = false;
		isClosed = true;
		Closing = true;
	}
	
}
```

Now we have to move into the `Character.h` file. In this tutorial my file is called `UnrealCPPCharacter.h`. Include the `SwingDoor.h` file.

#### include SwingDoor
```cpp
...
#include "SwingDoor.h"
#include "UnrealCPPCharacter.generated.h"
```

Then add in a `TriggerCapsule` and in `public` add a `SwingDoor` class and overlap functions. In `protected` add in an `OnAction` function.

```cpp
...
// create trigger capsule
UPROPERTY(VisibleAnywhere, Category = "Trigger Capsule")
class UCapsuleComponent* TriggerCapsule;
...

public:
...
// declare overlap begin function
UFUNCTION()
void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

// declare overlap end function
UFUNCTION()
void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

class ASwingDoor* CurrentDoor;
...

protected:
...
void OnAction();
```

Next move into the character `.cpp` file, my file is called `UnrealCPPCharacter.cpp`. In the constructor function, setup the `TriggerCapsule` and set the `CurrentDoor` to `NULL`.

#### add to constructor function
```cpp
...
TriggerCapsule = CreateDefaultSubobject<UCapsuleComponent>(TEXT("Trigger Capsule"));
TriggerCapsule->InitCapsuleSize(55.f, 96.0f);;
TriggerCapsule->SetCollisionProfileName(TEXT("Trigger"));
TriggerCapsule->SetupAttachment(RootComponent);

// bind trigger events
TriggerCapsule->OnComponentBeginOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapBegin); 
TriggerCapsule->OnComponentEndOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapEnd); 

CurrentDoor = NULL;
```

In the `SetupPlayerInputComponent` we want to bind our `Action` button to the `OnAction` function.

#### Setup action bind
```cpp
void AUnrealCPPCharacter::SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent)
{
	// Bind action event
	PlayerInputComponent->BindAction("Action", IE_Pressed, this, &AUnrealCPPCharacter::OnAction);
}
```

Next, let's create the `OnAction` function. If `CurrentDoor` is not `Null` get the first person camera's forward vector and then run the `CurrentDoor`'s `ToggleDoor` function.

#### OnAction function
```cpp
void AUnrealCPPCharacter::OnAction() 
{
	FVector ForwardVector = FirstPersonCameraComponent->GetForwardVector();

	if(CurrentDoor) 
	{
		CurrentDoor->ToggleDoor(ForwardVector);
	}
}
```

Next, setup the overlap functions to check and set `CurrentDoor`.

#### Overlap functions
```cpp
// overlap on begin function
void AUnrealCPPCharacter::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if (OtherActor && (OtherActor != this) && OtherComp && OtherActor->GetClass()->IsChildOf(ASwingDoor::StaticClass())) 
	{
		CurrentDoor = Cast<ASwingDoor>(OtherActor);
	}
} 

// overlap on end function
void AUnrealCPPCharacter::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	if (OtherActor && (OtherActor != this) && OtherComp) 
	{
		CurrentDoor = NULL;
	}
}
```

We are done with the code. Go into the editor and compile the code. Go to project settings and add in `Action` as in Engine Input and bind it your key choice. You will also wantt to add a collision box to the door mesh.

The door is now active. Drag and drop the door into the gameworld and you are good to go.

Below is the final code.

### SwingDoor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SwingDoor.generated.h"

UCLASS()
class UNREALCPP_API ASwingDoor : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ASwingDoor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UFUNCTION()
	void OpenDoor(float dt);

	UFUNCTION()
	void CloseDoor(float dt);

	class UStaticMeshComponent* Door;

	// declare sphere comp
	UPROPERTY(VisibleAnywhere, Category = "BoxComp")
	class UBoxComponent* BoxComp;

	UFUNCTION()
	void ToggleDoor(FVector ForwardVector);

	bool Opening;
	bool Closing;
	bool isClosed;

	float DotP;
	float MaxDegree;
	float AddRotation;
	float PosNeg;
	float DoorCurrentRotation;
};
```

### SwingDoor.cpp
```cpp
#include "SwingDoor.h"
// include header files
#include "ConstructorHelpers.h"
#include "DrawDebugHelpers.h"
#include "Kismet/GameplayStatics.h"

// Sets default values
ASwingDoor::ASwingDoor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	BoxComp = CreateDefaultSubobject<UBoxComponent>(TEXT("MyBoxComponent"));
	BoxComp->InitBoxExtent(FVector(150,100,100));
	BoxComp->SetCollisionProfileName("Trigger");
	RootComponent = BoxComp;

	Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Door"));
    Door->SetupAttachment(RootComponent);

	static ConstructorHelpers::FObjectFinder<UStaticMesh> DoorAsset(TEXT("/Game/StarterContent/Props/SM_Door.SM_Door"));

	if (DoorAsset.Succeeded())
    {
        Door->SetStaticMesh(DoorAsset.Object);
        Door->SetRelativeLocation(FVector(0.0f, 50.0f, -100.0f));
        Door->SetWorldScale3D(FVector(1.f));
	}

	isClosed = true;

	Opening = false;
	Closing = false;

	DotP = 0.0f;
	MaxDegree = 0.0f;
	AddRotation = 0.0f;
	PosNeg = 0.0f;
	DoorCurrentRotation = 0.0f;

}

// Called when the game starts or when spawned
void ASwingDoor::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), BoxComp->GetScaledBoxExtent(), FQuat(GetActorRotation()), FColor::Turquoise, true, -1, 0, 2);
	
}

// Called every frame
void ASwingDoor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if(Opening) 
	{
		OpenDoor(DeltaTime);
	}

	if(Closing)
	{
		CloseDoor(DeltaTime);
	}

}

void ASwingDoor::OpenDoor(float dt)
{
	DoorCurrentRotation = Door->RelativeRotation.Yaw;

	AddRotation = PosNeg*dt*80;

	if(FMath::IsNearlyEqual(DoorCurrentRotation, MaxDegree, 1.5f))
	{
		Closing = false;
		Opening = false;
	} 
	else if (Opening)
	{
		FRotator NewRotation = FRotator(0.0f, AddRotation, 0.0f);
		Door->AddRelativeRotation(FQuat(NewRotation), false, 0, ETeleportType::None);
	}
}

void ASwingDoor::CloseDoor(float dt)
{
	DoorCurrentRotation = Door->RelativeRotation.Yaw;

	if(DoorCurrentRotation > 0) 
	{
		AddRotation = -dt*80;
	} 
	else 
	{
		AddRotation = dt*80;
	}

	if(FMath::IsNearlyEqual(DoorCurrentRotation, 0.0f, 1.5f))
	{
		Closing = false;
		Opening = false;
	} 
	else if (Closing)
	{
		FRotator NewRotation = FRotator(0.0f, AddRotation, 0.0f);
		Door->AddRelativeRotation(FQuat(NewRotation), false, 0, ETeleportType::None);
	}
}

void ASwingDoor::ToggleDoor(FVector ForwardVector) 
{

	// alternatively you can grab the froward vector from the character inside theis function, remember to #include "GameFramework/Character.h" and #include "Camera/CameraComponent.h" at the top of the script
	// ACharacter* OurPlayerController = UGameplayStatics::GetPlayerCharacter(this, 0);

	// UCameraComponent* PlayerCamera = OurPlayerController->FindComponentByClass<UCameraComponent>();

	// FVector ForwardVector = PlayerCamera->GetForwardVector();

	// is the chacter in front or behind the door
	DotP = FVector::DotProduct(BoxComp->GetForwardVector(), ForwardVector);

	// get 1 or -1 from the the dot product
	PosNeg = FMath::Sign(DotP);

	// degree to clamp at
	MaxDegree = PosNeg*90.0f;

	// toggle bools
	if(isClosed) {
		isClosed = false;
		Closing = false;
		Opening = true;

	} else {
		Opening = false;
		isClosed = true;
		Closing = true;
	}
	
}
```

### UnrealCPPCharacter.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "SwingDoor/SwingDoor.h"
#include "UnrealCPPCharacter.generated.h"

class UInputComponent;

UCLASS(config=Game)
class AUnrealCPPCharacter : public ACharacter
{
	GENERATED_BODY()

	/** Pawn mesh: 1st person view (arms; seen only by self) */
	UPROPERTY(VisibleDefaultsOnly, Category=Mesh)
	class USkeletalMeshComponent* Mesh1P;

	/** Gun mesh: 1st person view (seen only by self) */
	UPROPERTY(VisibleDefaultsOnly, Category = Mesh)
	class USkeletalMeshComponent* FP_Gun;

	/** Location on gun mesh where projectiles should spawn. */
	UPROPERTY(VisibleDefaultsOnly, Category = Mesh)
	class USceneComponent* FP_MuzzleLocation;

	/** First person camera */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class UCameraComponent* FirstPersonCameraComponent;

	// create trigger capsule
	UPROPERTY(VisibleAnywhere, Category = "Trigger Capsule")
	class UCapsuleComponent* TriggerCapsule;

public:
	AUnrealCPPCharacter();

protected:
	virtual void BeginPlay();

public:

	// Called every frame
	virtual void Tick(float DeltaTime) override;

	/** Base turn rate, in deg/sec. Other scaling may affect final turn rate. */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category=Camera)
	float BaseTurnRate;

	/** Base look up/down rate, in deg/sec. Other scaling may affect final rate. */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category=Camera)
	float BaseLookUpRate;

	/** Gun muzzle's offset from the characters location */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category=Gameplay)
	FVector GunOffset;

	/** Projectile class to spawn */
	UPROPERTY(EditDefaultsOnly, Category=Projectile)
	TSubclassOf<class AUnrealCPPProjectile> ProjectileClass;

	/** Sound to play each time we fire */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category=Gameplay)
	class USoundBase* FireSound;

	/** AnimMontage to play each time we fire */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Gameplay)
	class UAnimMontage* FireAnimation;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	class ASwingDoor* CurrentDoor;

protected:
	
	/** Fires a projectile. */
	void OnFire();

	// on action 
	void OnAction();

	/** Handles moving forward/backward */
	void MoveForward(float Val);

	/** Handles stafing movement, left and right */
	void MoveRight(float Val);

	/**
	 * Called via input to turn at a given rate.
	 * @param Rate	This is a normalized rate, i.e. 1.0 means 100% of desired turn rate
	 */
	void TurnAtRate(float Rate);

	/**
	 * Called via input to turn look up/down at a given rate.
	 * @param Rate	This is a normalized rate, i.e. 1.0 means 100% of desired turn rate
	 */
	void LookUpAtRate(float Rate);
	
protected:
	// APawn interface
	virtual void SetupPlayerInputComponent(UInputComponent* InputComponent) override;
	// End of APawn interface
	FORCEINLINE class USkeletalMeshComponent* GetMesh1P() const { return Mesh1P; }
	/** Returns FirstPersonCameraComponent subobject **/
	FORCEINLINE class UCameraComponent* GetFirstPersonCameraComponent() const { return FirstPersonCameraComponent; }

};
```

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

	// create trigger capsule
	TriggerCapsule = CreateDefaultSubobject<UCapsuleComponent>(TEXT("Trigger Capsule"));
	TriggerCapsule->InitCapsuleSize(55.f, 96.0f);;
	TriggerCapsule->SetCollisionProfileName(TEXT("Trigger"));
	TriggerCapsule->SetupAttachment(RootComponent);

	// bind trigger events
	TriggerCapsule->OnComponentBeginOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapBegin); 
	TriggerCapsule->OnComponentEndOverlap.AddDynamic(this, &AUnrealCPPCharacter::OnOverlapEnd); 

	CurrentDoor = NULL;

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
	FVector ForwardVector = FirstPersonCameraComponent->GetForwardVector();

	if(CurrentDoor) 
	{
		CurrentDoor->ToggleDoor(ForwardVector);
	}
}

// overlap on begin function
void AUnrealCPPCharacter::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if (OtherActor && (OtherActor != this) && OtherComp && OtherActor->GetClass()->IsChildOf(ASwingDoor::StaticClass())) 
	{
		CurrentDoor = Cast<ASwingDoor>(OtherActor);
	}
} 

// overlap on end function
void AUnrealCPPCharacter::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	if (OtherActor && (OtherActor != this) && OtherComp) 
	{
		CurrentDoor = NULL;
	}
}
```