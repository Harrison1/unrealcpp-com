---
templateKey: blog-post
path: /health-bar-ui-hud
title: Health Bar and UI HUD
image: https://res.cloudinary.com/several-levels/image/upload/v1526032191/health-bar-ui_ypjozf.jpg
video: Nt4W1B8cKy8
tags: ["Advanced"]
uev: 4.19.2
date: 2018-05-16T12:00:00.226Z
description: In this tutorial we'll learn how to create a health bar while applying damage.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/HealthBar](https://github.com/Harrison1/unrealcpp/tree/master/HealthBar)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we'll learn how to create a health bar on the user's Heads Up Display while applying and receiving damage using the `ReceivePointDamage` and the `ApplyPointDamage` functions. We will create a fire object that applies damage on overlap and when the user receives damage the health bar will respond accordingly. We will also make a magic bar and bind it to the player's `OnFire` method. We'll also create **MedKits** for the player and a magic meter that automatically refills the magic bar after 5 seconds. Let's begin.

Before going any further, since we'll be using **UMGs** and **UserWidgets** in our game, we need to update our build file. In the `PublicDependencyModuleNames` we need to add `UMG`, `Slate`, and `SlateCore`. Below is my final build file.

### UnrealBuild.cs
```cpp
using UnrealBuildTool;

public class UnrealCPP : ModuleRules
{
	public UnrealCPP(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "HeadMountedDisplay", "UMG", "Slate", "SlateCore" });
	}
}
```

Next, we'll work on updating our `Character` file. Let's go ahead and jump right into the `Character's` header file. My file is titled `UnrealCPPCharacter.h`.

The first thing we'll do is include the `TimelineComponent.h` and the `BoxComponent.h` at the top of the file. We'll be referenceing these elements throughout the tutorial.

#### include files
```cpp
#include "Components/TimelineComponent.h"
#include "Components/BoxComponent.h"
```

Next we'll override the `Tick` function, we'll put it right below where we override the `BeginPlay` function inside the `header` file.

#### Override BeginPlay and Tick
```cpp
protected:
	virtual void BeginPlay();

	virtual void Tick(float DeltaTime) override;
```

Next we'll define all of our variables and functions. There's a lot of them, so I won't cover all of them in depth here, but we will be using them all throughout our program. The variables we are defining are going to be used to define **Health** and **Magic** numbers and percentages that help us bind the variables to the UI.

```cpp
  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float FullHealth;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float Health;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float HealthPercentage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float PreviousHealth;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float FullMagic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float Magic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float MagicPercentage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float PreviousMagic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float MagicValue;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float redFlash;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	UCurveFloat *MagicCurve;

	FTimeline MyTimeline;
	float CurveFloatValue;
	float TimelineValue;
	FTimerHandle MemberTimerHandle;

	bool bCanUseMagic;

	/** Get Health */
	UFUNCTION(BlueprintPure, Category = "Health")
	float GetHealth();

	/** Get Magic */
	UFUNCTION(BlueprintPure, Category = "Magic")
	float GetMagic();

  /** Update Health */
	UFUNCTION(BlueprintCallable, Category = "Health")
	void UpdateHealth(float HealthChange);

  /** Update Magic */
	UFUNCTION(BlueprintCallable, Category = "Magic")
	void UpdateMagic(float MagicChange);

	/** Get Health Text */
	UFUNCTION(BlueprintPure, Category = "Health")
	FText GetHealthIntText();

	/** Get Magic Text */
	UFUNCTION(BlueprintPure, Category = "Magic")
	FText GetMagicIntText();

	/** Damage Timer */
	UFUNCTION()
	void DamageTimer();

	/** Set Damage State */
	UFUNCTION()
	void SetDamageState();

	/** Set Magic Value */
	UFUNCTION()
	void SetMagicValue();

	/** Set Damage State */
	UFUNCTION()
	void SetMagicState();

	/** Set Damage State */
	UFUNCTION()
	void SetMagicChange(float MagicChange);

	/** Play Flash */
	UFUNCTION(BlueprintPure, Category = "Health")
	bool PlayFlash();

	UPROPERTY(EditAnywhere, Category = "Magic")
	class UMaterialInterface* GunDefaultMaterial;

	UPROPERTY(EditAnywhere, Category = "Magic")
	class UMaterialInterface* GunOverheatMaterial;

	UFUNCTION()
	void ReceivePointDamage(float Damage, const UDamageType * DamageType, FVector HitLocation, FVector HitNormal, UPrimitiveComponent * HitComponent, FName BoneName, FVector ShotFromDirection, AController * InstigatedBy, AActor * DamageCauser, const FHitResult & HitInfo);

```
Next, we'll move in the **Character's** `.cpp` file.

First at the top of the file include `KistmetMathLibrary.h` and `TimeManager.h` 

#### include files in the character's .cpp file
```cpp
#include "UnrealCPPCharacter.h"
#include "UnrealCPPProjectile.h"
#include "Animation/AnimInstance.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/InputSettings.h"
#include "HeadMountedDisplayFunctionLibrary.h"
#include "Kismet/GameplayStatics.h"
#include "MotionControllerComponent.h"
#include "XRMotionControllerBase.h" // for FXRMotionControllerBase::RightHandSourceId
#include "Kismet/KismetMathLibrary.h"
#include "TimerManager.h"
```

Next, in the `BeginPlay` function we will set our values for character and establish our timeline. A lot of this can be done in the `Constructor` function, but for this tutorial it will be easier to test the on the player when it is done in the `BeginPlay` function. We'll establish our character's health and magic attributes to track how much of each the character has and what percentage that represents. The HUD's health bar will always represent a percentage of the players current health so we need to always track the percentage of the player's current health to what the full health can potentially be. The same can be said for magic. Also, in the `BeginPlay` function we will establish our functions and callbacks for our `FTimeline` by using `FOnTimelineFloat` and `FOnTimelineEventStatic`.

#### BeginPlay function
```cpp
void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	FullHealth = 1000.0f;
	Health = FullHealth;
	HealthPercentage = 1.0f;
	PreviousHealth = HealthPercentage;
	bCanBeDamaged = true;

	FullMagic = 100.0f;
	Magic = FullMagic;
	MagicPercentage = 1.0f;
	PreviousMagic = MagicPercentage;
	MagicValue = 0.0f;
	bCanUseMagic = true;

	if (MagicCurve)
    {
        FOnTimelineFloat TimelineCallback;
        FOnTimelineEventStatic TimelineFinishedCallback;

        TimelineCallback.BindUFunction(this, FName("SetMagicValue"));
        TimelineFinishedCallback.BindUFunction(this, FName{ TEXT("SetMagicState") });
        MyTimeline.AddInterpFloat(MagicCurve, TimelineCallback);
        MyTimeline.SetTimelineFinishedFunc(TimelineFinishedCallback);
    }

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	// Show or hide the two versions of the gun based on whether or not we're using motion controllers.
	if (bUsingMotionControllers)
	{
		VR_Gun->SetHiddenInGame(false, true);
		Mesh1P->SetHiddenInGame(true, true);
	}
	else
	{
		VR_Gun->SetHiddenInGame(true, true);
		Mesh1P->SetHiddenInGame(false, true);
	}
}
```

In the `Tick` function we need to connect the `MyTimeline` to each frame represented by `DeltaTime`.

#### Tick function
```cpp
void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	MyTimeline.TickTimeline(DeltaTime);
}
```

Since I want to add in a **Magic** function to the game, I am going to use the `OnFire` method already provided to say that the player can only shoot once every two seconds. I want this to kind of be like the gun overheating preventing another shot before the gun cools down. So we'll add extra conditions to the `if` statement which is wrapping the function preventing the player from firing when `bCanUseMagic` is `false` and when `Magic` is at **0**. When the condition passes as `true` the player can then successfully fire (or use their magic, in our test example). When the gun is fired we `Stop()` the timeline, `Clear` the automatic timer that will replenish the magic meter after 5 seconds, run `SetMagicChange` (we'll create the function later), and then restart our replenish timer. Below is my final `OnFire` function.

#### OnFire function
```cpp
void AUnrealCPPCharacter::OnFire()
{
	// try and fire a projectile
	if (ProjectileClass != NULL && !FMath::IsNearlyZero(Magic, 0.001f) && bCanUseMagic)
	{
		UWorld* const World = GetWorld();
		if (World != NULL)
		{
			if (bUsingMotionControllers)
			{
				const FRotator SpawnRotation = VR_MuzzleLocation->GetComponentRotation();
				const FVector SpawnLocation = VR_MuzzleLocation->GetComponentLocation();
				World->SpawnActor<AUnrealCPPProjectile>(ProjectileClass, SpawnLocation, SpawnRotation);
			}
			else
			{
				const FRotator SpawnRotation = GetControlRotation();
				// MuzzleOffset is in camera space, so transform it to world space before offsetting from the character location to find the final muzzle position
				const FVector SpawnLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);

				//Set Spawn Collision Handling Override
				FActorSpawnParameters ActorSpawnParams;
				ActorSpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButDontSpawnIfColliding;

				// spawn the projectile at the muzzle
				World->SpawnActor<AUnrealCPPProjectile>(ProjectileClass, SpawnLocation, SpawnRotation, ActorSpawnParams);

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

				MyTimeline.Stop();
				GetWorldTimerManager().ClearTimer(MagicTimerHandle);
				SetMagicChange(-20.0f);
				GetWorldTimerManager().SetTimer(MagicTimerHandle, this, &AUnrealCPPCharacter::UpdateMagic, 5.0f, false);
			
			}
		}
	}
}
```

Next, we'll create two functions that will simply return the `HealthPercetange` and `MagicPercentage` respectively. This functions will allow the UI to bind themselves to these numbers thus always watching and reacting to when these numbers change.

#### return HealthPercentage and MagicPercentage
```cpp
float AUnrealCPPCharacter::GetHealth()
{
	return HealthPercentage;
}

float AUnrealCPPCharacter::GetMagic()
{
	return MagicPercentage;
}
```

The next two functions are necessary for the same reasons as the previous two functions, but instead of returning a `float`, we'll return `FText` so the UI can display the number as text. I'm rounding the numbers then creating strings to make the text more readable.

#### return FText
```cpp
FText AUnrealCPPCharacter::GetHealthIntText()
{
	int32 HP = FMath::RoundHalfFromZero(HealthPercentage * 100);
	FString HPS = FString::FromInt(HP);
	FString HealthHUD = HPS + FString(TEXT("%"));
	FText HPText = FText::FromString(HealthHUD);
	return HPText;
}

FText AUnrealCPPCharacter::GetMagicIntText()
{
	int32 MP = FMath::RoundHalfFromZero(MagicPercentage*FullMagic);
	FString MPS = FString::FromInt(MP);
	FString FullMPS = FString::FromInt(FullMagic);
	FString MagicHUD = MPS + FString(TEXT("/")) + FullMPS;
	FText MPText = FText::FromString(MagicHUD);
	return MPText;
}
```
Next we'll create one tow functions that toggle the player's invicibility state. In our game, when a player is receives damage they have 2 seconds of invincibility. Each actor by default has the `bCanBeDamaged` bool attached to them. When `bCanBeDamaged` is true allows the `ReceivePointDamage` function to run, when it's false, the `ReceivePointDamage` will not trigger.

#### toggle player's invicibility state
```cpp
void AUnrealCPPCharacter::SetDamageState()
{
	bCanBeDamaged = true;
}

void AUnrealCPPCharacter::DamageTimer()
{
	GetWorldTimerManager().SetTimer(MemberTimerHandle, this, &AUnrealCPPCharacter::SetDamageState, 2.0f, false);
}
```

The next two functions will deal with the Magic's timeline curve. The `SetMagicValue` function will run in conjunction with the timeline changing the `Magic` and `MagicPercentage` values as the timeline progresses. The `SetMagicState` function is called after the timeline finishes, this will revert the desired values and gun material back to their respective default values.

#### magic functions
```cpp
void AUnrealCPPCharacter::SetMagicValue()
{
	TimelineValue = MyTimeline.GetPlaybackPosition();
    CurveFloatValue = PreviousMagic + MagicValue*MagicCurve->GetFloatValue(TimelineValue);
	Magic = CurveFloatValue*FullHealth;
	Magic = FMath::Clamp(Magic, 0.0f, FullMagic);
    MagicPercentage = CurveFloatValue;
	MagicPercentage = FMath::Clamp(MagicPercentage, 0.0f, 1.0f);
}

void AUnrealCPPCharacter::SetMagicState()
{
	bCanUseMagic = true;
	MagicValue = 0.0;
	if(GunDefaultMaterial)
	{
		FP_Gun->SetMaterial(0, GunDefaultMaterial);
	}
}

```

The `PlayFlash` function simply returns a bool that lets our UI know if it should play the red flash animation (we'll set up the UI and animation later in the tutorial). 

#### PlayFlash
```cpp
{
	if(redFlash)
	{
		redFlash = false;
		return true;
	}

	return false;
}
```

The next two functions will affect the player's health. The `ReceivePointDamage` function will run each time the player interacts with an element that calls the `ApplyPointDamage` function. In our example we'll create a fire actor later on that will run `ApplyPointDamage`. In our `ReceivePointDamage` function we are simply toggling our `bCanBeDamaged` bool to trigger our invincibility, toggling our `redFlash` bool to trigger the animation, running the `UpdateHealth` function with the `Damage` value passed through as a parameter, and then calling `DamageTimer` to revert the `bCanBeDamaged` bool back to `true`. The `UpdateHealth` function immediately changes and clamps the `Health` value then it sets `PreviousHealth` and `HealthPercentage`.

#### ReceiveDamage and UpdateHealth
```cpp
void AUnrealCPPCharacter::ReceivePointDamage(float Damage, const UDamageType * DamageType, FVector HitLocation, FVector HitNormal, UPrimitiveComponent * HitComponent, FName BoneName, FVector ShotFromDirection, AController * InstigatedBy, AActor * DamageCauser, const FHitResult & HitInfo)
{
	bCanBeDamaged = false;
	redFlash = true;
	UpdateHealth(-Damage);
	DamageTimer();
}

void AUnrealCPPCharacter::UpdateHealth(float HealthChange)
{
	Health += HealthChange;
	Health = FMath::Clamp(Health, 0.0f, FullHealth);
	PreviousHealth = HealthPercentage;
	HealthPercentage = Health/FullHealth;
}
```

The final two functions are magic related and are similar to the health functions. `UpdateMagic` sets the `Magic` values and starts the timeline to get the player's magic meter back to 100%. `UpdateMagic` will run after 5 seconds of no magic firing to fill up the player's magic bar. `SetMagicChange` will toggle `bCanUseMagic` bool, set `PreviousMagic`, set `MagicValue`, change the gun's material to indicate overheating, the call `PlayFromStart` on the magic float timeline curve.

#### UpdateMagic and SetMagicChange
```cpp
void AUnrealCPPCharacter::UpdateMagic()
{
	PreviousMagic = MagicPercentage;
	MagicPercentage = Magic/FullMagic;
	MagicValue = 1.0f;
	MyTimeline.PlayFromStart();
}

void AUnrealCPPCharacter::SetMagicChange(float MagicChange)
{
	bCanUseMagic = false;
	PreviousMagic = MagicPercentage;
	MagicValue = (MagicChange/FullMagic);
	if(GunOverheatMaterial)
	{
		FP_Gun->SetMaterial(0, GunOverheatMaterial);
	}

	MyTimeline.PlayFromStart();
}
```

We are done with the character's `.cpp` file. Let's quickly move into the `GameMode` files.

In the `GameMode` header file we'll create an `enum` class and create player state functions to track player state. We will override the `Tick` function because we need to always check if the player is dead or not. Below is the final `GameMode` `.cpp` file.

#### UnrealCPPGameMode.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "UnrealCPPCharacter.h"
#include "UnrealCPPGameMode.generated.h"

//enum to store the current state of gameplay
UENUM()
enum class EGamePlayState
{
	EPlaying,
	EGameOver,
	EUnknown
};

UCLASS(minimalapi)
class AUnrealCPPGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AUnrealCPPGameMode();

	virtual void BeginPlay() override;

	virtual void Tick(float DeltaTime) override;

	AUnrealCPPCharacter* MyCharacter;
	
	/** Returns the current playing state */
	UFUNCTION(BlueprintPure, Category = "Health")
	EGamePlayState GetCurrentState() const;

	/** Sets a new playing state */
	void SetCurrentState(EGamePlayState NewState);

private: 
	/**Keeps track of the current playing state */
	EGamePlayState CurrentState;

	/**Handle any function calls that rely upon changing the playing state of our game */
	void HandleNewState(EGamePlayState NewState);
};
```

Next, in the `GameMode` `.cpp` file we first find the player in the `BeginPlay` function then in the `Tick` function we always check if the player's health is above 0. If the player's health is below 0 we will simply restart the level.

#### UnrealCPPGameMode.cpp
```cpp
#include "UnrealCPPGameMode.h"
#include "UnrealCPPHUD.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "UObject/ConstructorHelpers.h"

AUnrealCPPGameMode::AUnrealCPPGameMode()
	: Super()
{
	PrimaryActorTick.bCanEverTick = true;

	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnClassFinder(TEXT("/Game/FirstPersonCPP/Blueprints/FirstPersonCharacter"));
	DefaultPawnClass = PlayerPawnClassFinder.Class;

	// use our custom HUD class
	HUDClass = AUnrealCPPHUD::StaticClass();
}

void AUnrealCPPGameMode::BeginPlay()
{
	Super::BeginPlay();

	SetCurrentState(EGamePlayState::EPlaying);

	MyCharacter = Cast<AUnrealCPPCharacter>(UGameplayStatics::GetPlayerPawn(this, 0));
}

void AUnrealCPPGameMode::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	GetWorld()->GetMapName();

	if (MyCharacter)
	{
		if (FMath::IsNearlyZero(MyCharacter->GetHealth(), 0.001f))
		{
			SetCurrentState(EGamePlayState::EGameOver);
		}
	}
}

EGamePlayState AUnrealCPPGameMode::GetCurrentState() const
{
	return CurrentState;
}

void AUnrealCPPGameMode::SetCurrentState(EGamePlayState NewState)
{
	CurrentState = NewState;
	HandleNewState(CurrentState);
}

void AUnrealCPPGameMode::HandleNewState(EGamePlayState NewState)
{
	switch (NewState)
	{
		case EGamePlayState::EPlaying:
		{
			// do nothing
		}
		break;
		// Unknown/default state
		case EGamePlayState::EGameOver:
		{
			UGameplayStatics::OpenLevel(this, FName(*GetWorld()->GetName()), false);
		}
		break;
		// Unknown/default state
		default:
		case EGamePlayState::EUnknown:
		{
			// do nothing
		}
		break;
	}
}
```

We're done with the `GameMode` files.

Next, we'll create our `CampFire` actor that will actually apply damage to the player. Create a new `C++` actor class and call it **CampFire**. In `CampFire.h` we will add our properties and functions that we will be using throughout the `.cpp`
file. Some things in the `.h` file include the overlap functions, a particle component that will be set to our fire particle later on in the tutorial, properties necessary for the `ApplyPointDamage` function. Below is the final `CampFire.h` file.

#### CampFile.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/BoxComponent.h"
#include "Particles/ParticleSystemComponent.h"
#include "CampFire.generated.h"

UCLASS()
class UNREALCPP_API ACampFire : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ACampFire();

public:	

	UPROPERTY(EditAnywhere)
	UParticleSystemComponent* Fire;

	UPROPERTY(EditAnywhere)
	UBoxComponent* MyBoxComponent;

	UPROPERTY(EditAnywhere)
	TSubclassOf<UDamageType> FireDamageType;

	UPROPERTY(EditAnywhere)
	AActor* MyCharacter;

	UPROPERTY(EditAnywhere)
	FHitResult MyHit;

	bool bCanApplyDamage;
	FTimerHandle FireTimerHandle;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	UFUNCTION()
	void ApplyFireDamage();
	
};
```

Next, we'll move into the `CampFire.cpp` file. Include both `Kismet/GameplayStatics.h` and `TimerManager.h`. In `constructor` function we'll setup our `BoxComponent`, `ParticleComponent`, and connect the overlap functions to the `BoxComponent`. Next, we'll create the `OnOverlapBegin` function, if the conditions pass as `true`, we'll set the necessary parameters to and then trigger our the fire timer to run and loop the `ApplyFireDamage` function after **2.2s**. The reason why the timer is set to 2.2 seconds is because our player has invincibility that lasts 2 seconds so we want the `ApplyFireDamage` function to run right after the invincibility is turned off, so the extra 0.2 seconds is a buffer to prevent conflicts. `OnOverlapEnd` is where we clear the timer and set `bCanApplyDamage` indicating the fire cannot apply damage to the player. The `ApplyFireDamage` function first checks if `bCanApplyDamage` and then runs `ApplyPointDamage` with `MyCharcter` as the actor to apply damage and the fire will deal **200.0f** points of damage. `ApplyPointDamage` is a function inherited from **GameplayStatics**. Below is the final `CampFire.cpp` file.

#### CampFire.cpp
```cpp
#include "CampFire.h"
#include "Kismet/GameplayStatics.h"
#include "TimerManager.h"

// Sets default values
ACampFire::ACampFire()
{
	MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("My Box Component"));
    MyBoxComponent->InitBoxExtent(FVector(50.0f,50.0f,50.0f));
    RootComponent = MyBoxComponent;

    Fire = CreateDefaultSubobject<UParticleSystemComponent>(TEXT("My Fire"));
    Fire->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
    Fire->SetupAttachment(RootComponent);

    MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &ACampFire::OnOverlapBegin);
    MyBoxComponent->OnComponentEndOverlap.AddDynamic(this, &ACampFire::OnOverlapEnd);

    bCanApplyDamage = false;
}

void ACampFire::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) )
    {
        bCanApplyDamage = true;
        MyCharacter = Cast<AActor>(OtherActor);
        MyHit = SweepResult;
        GetWorldTimerManager().SetTimer(FireTimerHandle, this, &ACampFire::ApplyFireDamage, 2.2f, true, 0.0f);
    }
}

void ACampFire::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    bCanApplyDamage = false;
    GetWorldTimerManager().ClearTimer(FireTimerHandle);
}

void ACampFire::ApplyFireDamage()
{
    if(bCanApplyDamage)
    {
        UGameplayStatics::ApplyPointDamage(MyCharacter, 200.0f, GetActorLocation(), MyHit, nullptr, this, FireDamageType);
    }
}
```

Next, we'll create the **MedKit** for players to pick up to regain health. Create a new actor and call it `MedKit`. In the `.h` file include the character `.h` file, in my example my character file is called `UnrealCPPCharacter.h`. Then add `OnOverlap` `UFUNCTION()`, then add a character `UPROPERTY`. Below is the final `MedKit.h` file.

#### MedKit.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "UnrealCPPCharacter.h"
#include "MedKit.generated.h"

UCLASS()
class UNREALCPP_API AMedKit : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AMedKit();

public:	

	UFUNCTION()
	void OnOverlap(AActor* MyOverlappedActor, AActor* OtherActor);

	UPROPERTY(EditAnywhere)
	AUnrealCPPCharacter* MyCharacter;
	
};
```

Next, inside the `MedKit.cpp`, in the constructor function we'll setup the `OnOverlap` delegate. Every actor has an `OnOverlap` delegate. Next, create the `OnOverlap` function. In the `OnOverlap` function we check if the the overlapped actor is inherits from our character class (is the actor our player), then we check if the player's health less than 100%, then we run the character's function `UpdateHealth` with specified amount, in this example I added in `100.0f` point of health, then we destroy the actor. Earlier in the tutorial, I set the character's `FullHealth` variable to `1000.0f`, so `100.0f` is 10% of the player's health. Below is the final `MedKit.cpp`. You'll notice in the below code that I omit the `BeginPlay` and `Tick` functions because they are not needed in this actor.

#### MedKit.cpp
```cpp
#include "MedKit.h"

// Sets default values
AMedKit::AMedKit()
{
	OnActorBeginOverlap.AddDynamic(this, &AMedKit::OnOverlap);
}

void AMedKit::OnOverlap(AActor* MyOverlappedActor, AActor* OtherActor)
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) ) 
	{
		MyCharacter = Cast<AUnrealCPPCharacter>(OtherActor);

		if (MyCharacter && MyCharacter->GetHealth() < 1.0f)
		{
			MyCharacter->UpdateHealth(100.0f);
			Destroy();
		}	
	}
}
```

//////// AFTER the UUSERWIDGET is created ////////

Now let's go into the main file that establishes the HUD, in my project the HUD file is called `UnrealCPPHUD.h`. Inside this header file we'll add two `USERWIDGET` properties that we'll use in the `.cpp` file. We'll also `override` the `BeginPlay` function because we will be adding the `UserWidget` to the viewport in that function. Below is the final HUD `header` file.

#### UnrealCPPHUD.h
```cpp
#pragma once 

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "UnrealCPPHUD.generated.h"

UCLASS()
class AUnrealCPPHUD : public AHUD
{
	GENERATED_BODY()

public:
	AUnrealCPPHUD();

	/** Primary draw call for the HUD */
	virtual void DrawHUD() override;

	virtual void BeginPlay() override;

private:
	/** Crosshair asset pointer */
	class UTexture2D* CrosshairTex;

	UPROPERTY(EditAnywhere, Category = "Health")
	TSubclassOf<class UUserWidget> HUDWidgetClass;

	UPROPERTY(EditAnywhere, Category = "Health")
	class UUserWidget* CurrentWidget;
};
```

Next, inside the `HUD`'s `.cpp` file, in `constructor` function we will find the `Health_UI` that will create and set it to the `HUDWidgetClass`. In the `BeginPlay` function we'll set our `CurrentWidget` property and if we're successful in creating the widget we'll run `AddToViewport`. Below is the final `HUD` `.cpp` file.

#### UnrealCPPHUD.cpp
```cpp
#include "UnrealCPPHUD.h"
#include "Engine/Canvas.h"
#include "Engine/Texture2D.h"
#include "TextureResource.h"
#include "CanvasItem.h"
#include "UObject/ConstructorHelpers.h"
#include "Blueprint/UserWidget.h"


AUnrealCPPHUD::AUnrealCPPHUD()
{
	// Set the crosshair texture
	static ConstructorHelpers::FObjectFinder<UTexture2D> CrosshairTexObj(TEXT("/Game/FirstPerson/Textures/FirstPersonCrosshair"));
	CrosshairTex = CrosshairTexObj.Object;

	static ConstructorHelpers::FClassFinder<UUserWidget> HealthBarObj(TEXT("/Game/FirstPerson/UI/Health_UI"));
	HUDWidgetClass = HealthBarObj.Class;
}


void AUnrealCPPHUD::DrawHUD()
{
	Super::DrawHUD();

	// Draw very simple crosshair

	// find center of the Canvas
	const FVector2D Center(Canvas->ClipX * 0.5f, Canvas->ClipY * 0.5f);

	// offset by half the texture's dimensions so that the center of the texture aligns with the center of the Canvas
	const FVector2D CrosshairDrawPosition( (Center.X),
										   (Center.Y + 20.0f));

	// draw the crosshair
	FCanvasTileItem TileItem( CrosshairDrawPosition, CrosshairTex->Resource, FLinearColor::White);
	TileItem.BlendMode = SE_BLEND_Translucent;
	Canvas->DrawItem( TileItem );
}

void AUnrealCPPHUD::BeginPlay()
{
	Super::BeginPlay();

	if (HUDWidgetClass != nullptr)
	{
		CurrentWidget = CreateWidget<UUserWidget>(GetWorld(), HUDWidgetClass);

		if (CurrentWidget)
		{
			CurrentWidget->AddToViewport();
		}
	}
}
```
Inside the UE4 editor we have to create a Float Curve Timeline. The timeline will be used for smooth transitions for the magic meter. In your content folder, right click, go to Miscellaneous > Curve and create new Curve Float. Open the curve float and create a new key by right clicking and selecting new key. In the top left set the values of the first key to have the values of 0 for Time and Value. Create a second key and set its Time value to 2.0 and its Value property to 1.0. Hold SHIFT, select both keys and then click Auto in the top bar to give the curve a smooth beginning and end.

### Magic Float Curve
[![magic float curve](https://res.cloudinary.com/several-levels/image/upload/v1526027060/float-curve-two-seconds_qyux5a.png "magic float curve")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/float-curve-two-seconds_qyux5a.png)

Next, in your content folder, right click then > User Interface then > select Widget Blueprint. Inside the Widget Blueprint drag and drop an progress bar property into the viewport. Put it in the top left corner. We are going to mimic the Wither 3 health bar. Below are the images we will be using. There is a background image with black fill and a full health bar with a red fill. Drag both images into your content folder, then convert them to sprites. These two images can be placed in the progress bar's details panel where both images can be placed respectively. 

### Health Bar Empty
[![health bar empty](https://res.cloudinary.com/several-levels/image/upload/v1526023393/health-bar-empty_za1pqd.png "health bar empty")](https://res.cloudinary.com/several-levels/image/upload/v1526023393/health-bar-empty_za1pqd.png)

### Health Bar Full
[![health bar full](https://res.cloudinary.com/several-levels/image/upload/v1526023393/health-bar-full_uahmmd.png "health bar full")](https://res.cloudinary.com/several-levels/image/upload/v1526023393/health-bar-full_uahmmd.png)

Also, provided is the Wither 3 symbol which can be placed to the left of the health bar, this is only for style and aesthetics.

### Witcher Symbol
[![Witcher Symbol](https://res.cloudinary.com/several-levels/image/upload/v1526023393/witcher-symbol_x69wji.png "Witcher Symbol")](https://res.cloudinary.com/several-levels/image/upload/v1526023393/witcher-symbol_x69wji.png)

### Create Sprites
[![Create Sprites](https://res.cloudinary.com/several-levels/image/upload/v1526027060/convert-to-sprite_vydmyq.png "Create Sprites")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/convert-to-sprite_vydmyq.png)

### Health Bar UI 1
[![Health Bar UI 1](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-1_gbl7av.png "Health Bar UI 1")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-1_gbl7av.png)

### Health Bar UI 2
[![Health Bar UI 2](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-2_hy4m31.png "Health Bar UI 2")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-2_hy4m31.png)

### Health Bar UI 3
[![Health Bar UI 3](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-3_a114hj.png "Health Bar UI 3")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/health-bar-ui-3_a114hj.png)


Drag and drop a text element next to the health bar. This will represent the health in percentage

### Health Bar UI 4
[![Health Bar UI 4](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-4_beajld.png "Health Bar UI 4")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-4_beajld.png)

### Health Bar UI 5
[![Health Bar UI 5](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-5_fq0v6z.png "Health Bar UI 5")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-5_fq0v6z.png)

Drag in a second progress bar and put it above the health bar. Make it skinnier and design it as you wish. This will be the magic meter. Then drag in another text element and rest it next to the magic meter. This will represent the magic as numbers.

### Health Bar UI 6
[![Health Bar UI 6](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-6_tihnin.png "Health Bar UI 6")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-6_tihnin.png)

### Health Bar UI 7
[![Health Bar UI 7](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-7_tfzzhh.png "Health Bar UI 7")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-7_tfzzhh.png)

In the content folder drag the red image provided image below into your content folder. Covert the image to a sprite. Drag an image element into your UserWidget. Set the image as the red image. Anchor the image to bee full screen. We are going to create a red flash animation. Use the animation tools below to create a 2 second animation that changes the alpha of the red image from 0 to 0.5 every half second. We will use this animation to indicate that the player is receiving damage.

### Red Image
[![Red Image](https://res.cloudinary.com/several-levels/image/upload/v1526023393/red_wvyvum.png "Red Image")](https://res.cloudinary.com/several-levels/image/upload/v1526023393/red_wvyvum.png)

### Health Bar UI 8
[![Health Bar UI 8](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-8_eq9tsp.png "Health Bar UI 8")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-8_eq9tsp.png)

### Health Bar UI 9
[![Health Bar UI 9](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-9_lqp9eh.png "Health Bar UI 9")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/health-bar-ui-9_lqp9eh.png)

For this next part we have to do some very quick work in blueprints to bind these UI elements to our C++ functions. Select the Health Bar UI element and under the **Progress** tab for percent attribute select **Bind**, then **Create Binding**. This will open the UI's bind function graph. In the event graph we will simply find the player, cast to the player and then run the function to return the desired value. Make the blueprint cast function pure by right clicking it and clicking **Convert to Pure Cast**. Follow this same process for text elements and the magic elements. Below are images of the blueprint functions for the four UI elements.

### Bind Health Bar Percentage
[![Health Bar BP](https://res.cloudinary.com/several-levels/image/upload/v1526027060/bp-get-health_hhyouh.png "Health Bar BP")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/bp-get-health_hhyouh.png)

### Bind Health Bar Text
[![Health Bar BP Text](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-health-text_jqgqtf.png "Health Bar BP Text")](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-health-text_jqgqtf.png)

### Bind Magic Bar Percentage
[![Magic Bar BP](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-magic_la1l93.png "Magic Bar BP")](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-magic_la1l93.png)

### Bind Magic Bar Text
[![Magic Bar BP Text](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-magic-text_izzjwt.png "Magic Bar Text")](https://res.cloudinary.com/several-levels/image/upload/v1526027059/bp-get-magic-text_izzjwt.png)

Next, we will bind the animation in the User Widget's Event Graph. We will use the `Tick` function to check if we need to run the animation. We'll use a simple to bool to determine if we need to play the animation. The animation created in the UI, I called it **Flash** will be a variable under the Animation variables section.

### Animation bind to Tick Function
[![Event Graph Animation BP](https://res.cloudinary.com/several-levels/image/upload/v1526027060/bp-get-red-flash_ffyq9w.png "Event Graph Animation BP")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/bp-get-red-flash_ffyq9w.png)

Inside the editor, compile the code. Drag in the camp fire. Set the particle component to have the fire particle effect, set overlap events to true, then set collision presets name to Trigger. Then drag in the MedKit, add a mesh component, resize it if necessary, set overlap events to true, then set collision presets name to Trigger. 

### Generate Overlap Events
[![Generate Overlap Events](https://res.cloudinary.com/several-levels/image/upload/v1526027060/generate-overlap-events_ex2vzh.png "Generate Overlap Events")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/generate-overlap-events_ex2vzh.png)

### Set Collision Presets
[![Set Collision Presets](https://res.cloudinary.com/several-levels/image/upload/v1526027060/collision-presets_zisyqo.png "Set Collision Presets")](https://res.cloudinary.com/several-levels/image/upload/v1526027060/collision-presets_zisyqo.png)


In the Player character set the materials to two materials you want to use to switch between.

### Set Gun Materials
[![Event Graph Animation BP](https://res.cloudinary.com/several-levels/image/upload/v1526027061/set-gun-materials_ojv5jx.png "Event Graph Animation BP")](https://res.cloudinary.com/several-levels/image/upload/v1526027061/set-gun-materials_ojv5jx.png)

### Simple BP for Making a Glowing Red Material
[![Glowing Red BP](https://res.cloudinary.com/several-levels/image/upload/v1526135437/red-glow-material_jtrrjh.png "Glowing Red BP")](https://res.cloudinary.com/several-levels/image/upload/v1526135437/red-glow-material_jtrrjh.png)

Everything should be set. Compile the code and you should have working UI. Below is the final code.

### CampFire.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/BoxComponent.h"
#include "Particles/ParticleSystemComponent.h"
#include "CampFire.generated.h"

UCLASS()
class UNREALCPP_API ACampFire : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ACampFire();

public:	

	UPROPERTY(EditAnywhere)
	UParticleSystemComponent* Fire;

	UPROPERTY(EditAnywhere)
	UBoxComponent* MyBoxComponent;

	UPROPERTY(EditAnywhere)
	TSubclassOf<UDamageType> FireDamageType;

	UPROPERTY(EditAnywhere)
	AActor* MyCharacter;

	UPROPERTY(EditAnywhere)
	FHitResult MyHit;

	bool bCanApplyDamage;
	FTimerHandle FireTimerHandle;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	UFUNCTION()
	void ApplyFireDamage();
	
};
```

### CampFire.cpp
```cpp
#include "CampFire.h"
#include "Kismet/GameplayStatics.h"
#include "TimerManager.h"

// Sets default values
ACampFire::ACampFire()
{
	MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("My Box Component"));
    MyBoxComponent->InitBoxExtent(FVector(50.0f,50.0f,50.0f));
    RootComponent = MyBoxComponent;

    Fire = CreateDefaultSubobject<UParticleSystemComponent>(TEXT("My Fire"));
    Fire->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
    Fire->SetupAttachment(RootComponent);

    MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &ACampFire::OnOverlapBegin);
    MyBoxComponent->OnComponentEndOverlap.AddDynamic(this, &ACampFire::OnOverlapEnd);

    bCanApplyDamage = false;
}

void ACampFire::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) )
    {
        bCanApplyDamage = true;
        MyCharacter = Cast<AActor>(OtherActor);
        MyHit = SweepResult;
        GetWorldTimerManager().SetTimer(FireTimerHandle, this, &ACampFire::ApplyFireDamage, 2.2f, true, 0.0f);
    }
}

void ACampFire::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    bCanApplyDamage = false;
    GetWorldTimerManager().ClearTimer(FireTimerHandle);
}

void ACampFire::ApplyFireDamage()
{
    if(bCanApplyDamage)
    {
        UGameplayStatics::ApplyPointDamage(MyCharacter, 200.0f, GetActorLocation(), MyHit, nullptr, this, FireDamageType);
    }
}
```

### MedKit.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "UnrealCPPCharacter.h"
#include "MedKit.generated.h"

UCLASS()
class UNREALCPP_API AMedKit : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AMedKit();

public:	

	UFUNCTION()
	void OnOverlap(AActor* MyOverlappedActor, AActor* OtherActor);

	UPROPERTY(EditAnywhere)
	AUnrealCPPCharacter* MyCharacter;
	
};
```

### MedKit.cpp
```cpp
#include "MedKit.h"

// Sets default values
AMedKit::AMedKit()
{
	OnActorBeginOverlap.AddDynamic(this, &AMedKit::OnOverlap);
}

void AMedKit::OnOverlap(AActor* MyOverlappedActor, AActor* OtherActor)
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) ) 
	{
		MyCharacter = Cast<AUnrealCPPCharacter>(OtherActor);

		if (MyCharacter && MyCharacter->GetHealth() < 1.0f)
		{
			MyCharacter->UpdateHealth(100.0f);
			Destroy();
		}	
	}
}
```

### UnrealCPP.Build.cs
```cpp
using UnrealBuildTool;

public class UnrealCPP : ModuleRules
{
	public UnrealCPP(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "HeadMountedDisplay", "UMG", "Slate", "SlateCore" });
	}
}
```

### UnrealCPPCharacter.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Components/TimelineComponent.h"
#include "Components/BoxComponent.h"
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

	/** Gun mesh: VR view (attached to the VR controller directly, no arm, just the actual gun) */
	UPROPERTY(VisibleDefaultsOnly, Category = Mesh)
	class USkeletalMeshComponent* VR_Gun;

	/** Location on VR gun mesh where projectiles should spawn. */
	UPROPERTY(VisibleDefaultsOnly, Category = Mesh)
	class USceneComponent* VR_MuzzleLocation;

	/** First person camera */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class UCameraComponent* FirstPersonCameraComponent;

	/** Motion controller (right hand) */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, meta = (AllowPrivateAccess = "true"))
	class UMotionControllerComponent* R_MotionController;

	/** Motion controller (left hand) */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, meta = (AllowPrivateAccess = "true"))
	class UMotionControllerComponent* L_MotionController;

public:
	AUnrealCPPCharacter();

protected:
	virtual void BeginPlay();

	virtual void Tick(float DeltaTime) override;

	// virtual float TakeDamage(float DamageAmount, struct FDamageEvent const & DamageEvent, class AController * EventInstigator, AActor * DamageCauser);

public:
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

	/** Whether to use motion controller location for aiming. */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Gameplay)
	uint32 bUsingMotionControllers : 1;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float FullHealth;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float Health;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float HealthPercentage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float PreviousHealth;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float FullMagic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float Magic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float MagicPercentage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float PreviousMagic;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	float MagicValue;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
	float redFlash;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Magic")
	UCurveFloat *MagicCurve;

	FTimeline MyTimeline;
	float CurveFloatValue;
	float TimelineValue;
	FTimerHandle MemberTimerHandle;

	bool bCanUseMagic;

	/** Get Health */
	UFUNCTION(BlueprintPure, Category = "Health")
	float GetHealth();

	/** Get Magic */
	UFUNCTION(BlueprintPure, Category = "Magic")
	float GetMagic();

	/** Get Health Text */
	UFUNCTION(BlueprintPure, Category = "Health")
	FText GetHealthIntText();

	/** Get Magic Text */
	UFUNCTION(BlueprintPure, Category = "Magic")
	FText GetMagicIntText();

	/** Damage Timer */
	UFUNCTION()
	void DamageTimer();

	/** Set Damage State */
	UFUNCTION()
	void SetDamageState();

	/** Set Magic Value */
	UFUNCTION()
	void SetMagicValue();

	/** Set Damage State */
	UFUNCTION()
	void SetMagicState();

	/** Set Damage State */
	UFUNCTION()
	void SetMagicChange(float MagicChange);

	/** Set Damage State */
	UFUNCTION()
	void UpdateMagic(float MagicChange);

	/** Play Flash */
	UFUNCTION(BlueprintPure, Category = "Health")
	bool PlayFlash();

	UPROPERTY(EditAnywhere, Category = "Magic")
	class UMaterialInterface* GunDefaultMaterial;

	UPROPERTY(EditAnywhere, Category = "Magic")
	class UMaterialInterface* GunOverheatMaterial;

	UFUNCTION()
	void ReceivePointDamage(float Damage, const UDamageType * DamageType, FVector HitLocation, FVector HitNormal, UPrimitiveComponent * HitComponent, FName BoneName, FVector ShotFromDirection, AController * InstigatedBy, AActor * DamageCauser, const FHitResult & HitInfo);

	UFUNCTION(BlueprintCallable, Category = "Power")
	void UpdateHealth(float HealthChange);

protected:
	
	/** Fires a projectile. */
	void OnFire();

	/** Resets HMD orientation and position in VR. */
	void OnResetVR();

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

	struct TouchData
	{
		TouchData() { bIsPressed = false;Location=FVector::ZeroVector;}
		bool bIsPressed;
		ETouchIndex::Type FingerIndex;
		FVector Location;
		bool bMoved;
	};
	void BeginTouch(const ETouchIndex::Type FingerIndex, const FVector Location);
	void EndTouch(const ETouchIndex::Type FingerIndex, const FVector Location);
	void TouchUpdate(const ETouchIndex::Type FingerIndex, const FVector Location);
	TouchData	TouchItem;
	
protected:
	// APawn interface
	virtual void SetupPlayerInputComponent(UInputComponent* InputComponent) override;
	// End of APawn interface

	/* 
	 * Configures input for touchscreen devices if there is a valid touch interface for doing so 
	 *
	 * @param	InputComponent	The input component pointer to bind controls to
	 * @returns true if touch controls were enabled.
	 */
	bool EnableTouchscreenMovement(UInputComponent* InputComponent);

public:
	/** Returns Mesh1P subobject **/
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
#include "Components/InputComponent.h"
#include "GameFramework/InputSettings.h"
#include "HeadMountedDisplayFunctionLibrary.h"
#include "Kismet/GameplayStatics.h"
#include "MotionControllerComponent.h"
#include "XRMotionControllerBase.h" // for FXRMotionControllerBase::RightHandSourceId
#include "Kismet/KismetMathLibrary.h"
#include "TimerManager.h"

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

	// Create VR Controllers.
	R_MotionController = CreateDefaultSubobject<UMotionControllerComponent>(TEXT("R_MotionController"));
	R_MotionController->MotionSource = FXRMotionControllerBase::RightHandSourceId;
	R_MotionController->SetupAttachment(RootComponent);
	L_MotionController = CreateDefaultSubobject<UMotionControllerComponent>(TEXT("L_MotionController"));
	L_MotionController->SetupAttachment(RootComponent);

	// Create a gun and attach it to the right-hand VR controller.
	// Create a gun mesh component
	VR_Gun = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("VR_Gun"));
	VR_Gun->SetOnlyOwnerSee(true);			// only the owning player will see this mesh
	VR_Gun->bCastDynamicShadow = false;
	VR_Gun->CastShadow = false;
	VR_Gun->SetupAttachment(R_MotionController);
	VR_Gun->SetRelativeRotation(FRotator(0.0f, -90.0f, 0.0f));

	VR_MuzzleLocation = CreateDefaultSubobject<USceneComponent>(TEXT("VR_MuzzleLocation"));
	VR_MuzzleLocation->SetupAttachment(VR_Gun);
	VR_MuzzleLocation->SetRelativeLocation(FVector(0.000004, 53.999992, 10.000000));
	VR_MuzzleLocation->SetRelativeRotation(FRotator(0.0f, 90.0f, 0.0f));		// Counteract the rotation of the VR gun model.

	// Uncomment the following line to turn motion controllers on by default:
	//bUsingMotionControllers = true;

}

void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	FullHealth = 1000.0f;
	Health = FullHealth;
	HealthPercentage = 1.0f;
	PreviousHealth = HealthPercentage;
	bCanBeDamaged = true;

	FullMagic = 100.0f;
	Magic = FullMagic;
	MagicPercentage = 1.0f;
	PreviousMagic = MagicPercentage;
	MagicValue = 0.0f;
	bCanUseMagic = true;

	if (MagicCurve)
    {
        FOnTimelineFloat TimelineCallback;
        FOnTimelineEventStatic TimelineFinishedCallback;

        TimelineCallback.BindUFunction(this, FName("SetMagicValue"));
        TimelineFinishedCallback.BindUFunction(this, FName{ TEXT("SetMagicState") });
        MyTimeline.AddInterpFloat(MagicCurve, TimelineCallback);
        MyTimeline.SetTimelineFinishedFunc(TimelineFinishedCallback);
    }

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	// Show or hide the two versions of the gun based on whether or not we're using motion controllers.
	if (bUsingMotionControllers)
	{
		VR_Gun->SetHiddenInGame(false, true);
		Mesh1P->SetHiddenInGame(true, true);
	}
	else
	{
		VR_Gun->SetHiddenInGame(true, true);
		Mesh1P->SetHiddenInGame(false, true);
	}
}

void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	MyTimeline.TickTimeline(DeltaTime);
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

	// Enable touchscreen input
	EnableTouchscreenMovement(PlayerInputComponent);

	PlayerInputComponent->BindAction("ResetVR", IE_Pressed, this, &AUnrealCPPCharacter::OnResetVR);

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
	if (ProjectileClass != NULL && !FMath::IsNearlyZero(Magic, 0.001f) && bCanUseMagic)
	{
		UWorld* const World = GetWorld();
		if (World != NULL)
		{
			if (bUsingMotionControllers)
			{
				const FRotator SpawnRotation = VR_MuzzleLocation->GetComponentRotation();
				const FVector SpawnLocation = VR_MuzzleLocation->GetComponentLocation();
				World->SpawnActor<AUnrealCPPProjectile>(ProjectileClass, SpawnLocation, SpawnRotation);
			}
			else
			{
				const FRotator SpawnRotation = GetControlRotation();
				// MuzzleOffset is in camera space, so transform it to world space before offsetting from the character location to find the final muzzle position
				const FVector SpawnLocation = ((FP_MuzzleLocation != nullptr) ? FP_MuzzleLocation->GetComponentLocation() : GetActorLocation()) + SpawnRotation.RotateVector(GunOffset);

				//Set Spawn Collision Handling Override
				FActorSpawnParameters ActorSpawnParams;
				ActorSpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButDontSpawnIfColliding;

				// spawn the projectile at the muzzle
				World->SpawnActor<AUnrealCPPProjectile>(ProjectileClass, SpawnLocation, SpawnRotation, ActorSpawnParams);

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

				SetMagicChange(-20.0f);

			}
		}
	}
}

void AUnrealCPPCharacter::OnResetVR()
{
	UHeadMountedDisplayFunctionLibrary::ResetOrientationAndPosition();
}

void AUnrealCPPCharacter::BeginTouch(const ETouchIndex::Type FingerIndex, const FVector Location)
{
	if (TouchItem.bIsPressed == true)
	{
		return;
	}
	if ((FingerIndex == TouchItem.FingerIndex) && (TouchItem.bMoved == false))
	{
		OnFire();
	}
	TouchItem.bIsPressed = true;
	TouchItem.FingerIndex = FingerIndex;
	TouchItem.Location = Location;
	TouchItem.bMoved = false;
}

void AUnrealCPPCharacter::EndTouch(const ETouchIndex::Type FingerIndex, const FVector Location)
{
	if (TouchItem.bIsPressed == false)
	{
		return;
	}
	TouchItem.bIsPressed = false;
}

//Commenting this section out to be consistent with FPS BP template.
//This allows the user to turn without using the right virtual joystick

//void AUnrealCPPCharacter::TouchUpdate(const ETouchIndex::Type FingerIndex, const FVector Location)
//{
//	if ((TouchItem.bIsPressed == true) && (TouchItem.FingerIndex == FingerIndex))
//	{
//		if (TouchItem.bIsPressed)
//		{
//			if (GetWorld() != nullptr)
//			{
//				UGameViewportClient* ViewportClient = GetWorld()->GetGameViewport();
//				if (ViewportClient != nullptr)
//				{
//					FVector MoveDelta = Location - TouchItem.Location;
//					FVector2D ScreenSize;
//					ViewportClient->GetViewportSize(ScreenSize);
//					FVector2D ScaledDelta = FVector2D(MoveDelta.X, MoveDelta.Y) / ScreenSize;
//					if (FMath::Abs(ScaledDelta.X) >= 4.0 / ScreenSize.X)
//					{
//						TouchItem.bMoved = true;
//						float Value = ScaledDelta.X * BaseTurnRate;
//						AddControllerYawInput(Value);
//					}
//					if (FMath::Abs(ScaledDelta.Y) >= 4.0 / ScreenSize.Y)
//					{
//						TouchItem.bMoved = true;
//						float Value = ScaledDelta.Y * BaseTurnRate;
//						AddControllerPitchInput(Value);
//					}
//					TouchItem.Location = Location;
//				}
//				TouchItem.Location = Location;
//			}
//		}
//	}
//}

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

bool AUnrealCPPCharacter::EnableTouchscreenMovement(class UInputComponent* PlayerInputComponent)
{
	if (FPlatformMisc::SupportsTouchInput() || GetDefault<UInputSettings>()->bUseMouseForTouch)
	{
		PlayerInputComponent->BindTouch(EInputEvent::IE_Pressed, this, &AUnrealCPPCharacter::BeginTouch);
		PlayerInputComponent->BindTouch(EInputEvent::IE_Released, this, &AUnrealCPPCharacter::EndTouch);

		//Commenting this out to be more consistent with FPS BP template.
		//PlayerInputComponent->BindTouch(EInputEvent::IE_Repeat, this, &AUnrealCPPCharacter::TouchUpdate);
		return true;
	}
	
	return false;
}

float AUnrealCPPCharacter::GetHealth()
{
	return HealthPercentage;
}

float AUnrealCPPCharacter::GetMagic()
{
	return MagicPercentage;
}

FText AUnrealCPPCharacter::GetHealthIntText()
{
	int32 HP = FMath::RoundHalfFromZero(HealthPercentage * 100);
	FString HPS = FString::FromInt(HP);
	FString HealthHUD = HPS + FString(TEXT("%"));
	FText HPText = FText::FromString(HealthHUD);
	return HPText;
}

FText AUnrealCPPCharacter::GetMagicIntText()
{
	int32 MP = FMath::RoundHalfFromZero(MagicPercentage*FullMagic);
	FString MPS = FString::FromInt(MP);
	FString FullMPS = FString::FromInt(FullMagic);
	FString MagicHUD = MPS + FString(TEXT("/")) + FullMPS;
	FText MPText = FText::FromString(MagicHUD);
	return MPText;
}

void AUnrealCPPCharacter::SetDamageState()
{
	bCanBeDamaged = true;
}

void AUnrealCPPCharacter::DamageTimer()
{
	GetWorldTimerManager().SetTimer(MemberTimerHandle, this, &AUnrealCPPCharacter::SetDamageState, 2.0f, false);
}

void AUnrealCPPCharacter::SetMagicValue()
{
	TimelineValue = MyTimeline.GetPlaybackPosition();
    CurveFloatValue = PreviousMagic + MagicValue*MagicCurve->GetFloatValue(TimelineValue);
    MagicPercentage = CurveFloatValue;
	MagicPercentage = FMath::Clamp(MagicPercentage, 0.0f, 1.0f);
}

void AUnrealCPPCharacter::SetMagicState()
{
	bCanUseMagic = true;
	MagicValue = 0.0;
	if(GunDefaultMaterial)
	{
		FP_Gun->SetMaterial(0, GunDefaultMaterial);
	}
}

bool AUnrealCPPCharacter::PlayFlash()
{
	if(redFlash)
	{
		redFlash = false;
		return true;
	}

	return false;
}

void AUnrealCPPCharacter::ReceivePointDamage(float Damage, const UDamageType * DamageType, FVector HitLocation, FVector HitNormal, UPrimitiveComponent * HitComponent, FName BoneName, FVector ShotFromDirection, AController * InstigatedBy, AActor * DamageCauser, const FHitResult & HitInfo)
{
	bCanBeDamaged = false;
	redFlash = true;
	UpdateHealth(-Damage);
	DamageTimer();
}

void AUnrealCPPCharacter::UpdateHealth(float HealthChange)
{
	Health += HealthChange;
	Health = FMath::Clamp(Health, 0.0f, FullHealth);
	PreviousHealth = HealthPercentage;
	HealthPercentage = Health/FullHealth;
}

void AUnrealCPPCharacter::UpdateMagic(float MagicChange)
{
	Magic += MagicChange;
	Magic = FMath::Clamp(Magic, 0.0f, FullMagic);
	PreviousMagic = MagicPercentage;
	MagicPercentage = Magic/FullMagic;
}

void AUnrealCPPCharacter::SetMagicChange(float MagicChange)
{
	bCanUseMagic = false;
	Magic += MagicChange ;
	Magic = FMath::Clamp(Magic, 0.0f, FullMagic);
	PreviousMagic = MagicPercentage;
	MagicValue += (MagicChange/FullMagic);
	if(GunOverheatMaterial)
	{
		FP_Gun->SetMaterial(0, GunOverheatMaterial);
	}

	MyTimeline.PlayFromStart();
}
```

### UnrealCPPGameMode.h
```cpp
//enum to store the current state of gameplay
UENUM()
enum class EGamePlayState
{
	EPlaying,
	EGameOver,
	EUnknown
};

UCLASS(minimalapi)
class AUnrealCPPGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AUnrealCPPGameMode();

	virtual void BeginPlay() override;

	virtual void Tick(float DeltaTime) override;

	AUnrealCPPCharacter* MyCharacter;
	
	/** Returns the current playing state */
	UFUNCTION(BlueprintPure, Category = "Health")
	EGamePlayState GetCurrentState() const;

	/** Sets a new playing state */
	void SetCurrentState(EGamePlayState NewState);

private: 
	/**Keeps track of the current playing state */
	EGamePlayState CurrentState;

	/**Handle any function calls that rely upon changing the playing state of our game */
	void HandleNewState(EGamePlayState NewState);
};
```

### UnrealCPPGameMode.cpp
```cpp
#include "UnrealCPPGameMode.h"
#include "UnrealCPPHUD.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "UObject/ConstructorHelpers.h"

AUnrealCPPGameMode::AUnrealCPPGameMode()
	: Super()
{
	PrimaryActorTick.bCanEverTick = true;

	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnClassFinder(TEXT("/Game/FirstPersonCPP/Blueprints/FirstPersonCharacter"));
	DefaultPawnClass = PlayerPawnClassFinder.Class;

	// use our custom HUD class
	HUDClass = AUnrealCPPHUD::StaticClass();
}

void AUnrealCPPGameMode::BeginPlay()
{
	Super::BeginPlay();

	SetCurrentState(EGamePlayState::EPlaying);

	MyCharacter = Cast<AUnrealCPPCharacter>(UGameplayStatics::GetPlayerPawn(this, 0));
}

void AUnrealCPPGameMode::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	GetWorld()->GetMapName();

	if (MyCharacter)
	{
		if (FMath::IsNearlyZero(MyCharacter->GetHealth(), 0.001f))
		{
			SetCurrentState(EGamePlayState::EGameOver);
		}
	}
}

EGamePlayState AUnrealCPPGameMode::GetCurrentState() const
{
	return CurrentState;
}

void AUnrealCPPGameMode::SetCurrentState(EGamePlayState NewState)
{
	CurrentState = NewState;
	HandleNewState(CurrentState);
}

void AUnrealCPPGameMode::HandleNewState(EGamePlayState NewState)
{
	switch (NewState)
	{
		case EGamePlayState::EPlaying:
		{
			// do nothing
		}
		break;
		// Unknown/default state
		case EGamePlayState::EGameOver:
		{
			UGameplayStatics::OpenLevel(this, FName(*GetWorld()->GetName()), false);
		}
		break;
		// Unknown/default state
		default:
		case EGamePlayState::EUnknown:
		{
			// do nothing
		}
		break;
	}
}
```

### UnrealCPPHUD.h
```cpp
#pragma once 

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "UnrealCPPHUD.generated.h"

UCLASS()
class AUnrealCPPHUD : public AHUD
{
	GENERATED_BODY()

public:
	AUnrealCPPHUD();

	/** Primary draw call for the HUD */
	virtual void DrawHUD() override;

	virtual void BeginPlay() override;

private:
	/** Crosshair asset pointer */
	class UTexture2D* CrosshairTex;

	UPROPERTY(EditAnywhere, Category = "Health")
	TSubclassOf<class UUserWidget> HUDWidgetClass;

	UPROPERTY(EditAnywhere, Category = "Health")
	class UUserWidget* CurrentWidget;
};
```

### UnrealCPPHUD.cpp
```cpp
#include "UnrealCPPHUD.h"
#include "Engine/Canvas.h"
#include "Engine/Texture2D.h"
#include "TextureResource.h"
#include "CanvasItem.h"
#include "UObject/ConstructorHelpers.h"
#include "Blueprint/UserWidget.h"


AUnrealCPPHUD::AUnrealCPPHUD()
{
	// Set the crosshair texture
	static ConstructorHelpers::FObjectFinder<UTexture2D> CrosshairTexObj(TEXT("/Game/FirstPerson/Textures/FirstPersonCrosshair"));
	CrosshairTex = CrosshairTexObj.Object;

	static ConstructorHelpers::FClassFinder<UUserWidget> HealthBarObj(TEXT("/Game/FirstPerson/UI/Health_UI"));
	HUDWidgetClass = HealthBarObj.Class;
}


void AUnrealCPPHUD::DrawHUD()
{
	Super::DrawHUD();

	// Draw very simple crosshair

	// find center of the Canvas
	const FVector2D Center(Canvas->ClipX * 0.5f, Canvas->ClipY * 0.5f);

	// offset by half the texture's dimensions so that the center of the texture aligns with the center of the Canvas
	const FVector2D CrosshairDrawPosition( (Center.X),
										   (Center.Y + 20.0f));

	// draw the crosshair
	FCanvasTileItem TileItem( CrosshairDrawPosition, CrosshairTex->Resource, FLinearColor::White);
	TileItem.BlendMode = SE_BLEND_Translucent;
	Canvas->DrawItem( TileItem );
}

void AUnrealCPPHUD::BeginPlay()
{
	Super::BeginPlay();

	if (HUDWidgetClass != nullptr)
	{
		CurrentWidget = CreateWidget<UUserWidget>(GetWorld(), HUDWidgetClass);

		if (CurrentWidget)
		{
			CurrentWidget->AddToViewport();
		}
	}
}
```