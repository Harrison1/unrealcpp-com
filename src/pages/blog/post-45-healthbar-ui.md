---
templateKey: blog-post
path: /health-bar-ui-hud
title: Health Bar and UI HUD
image: https://res.cloudinary.com/several-levels/image/upload/v1522321112/camera-shake_vlecnv.jpg
video: bkdXcjZZq7Y
tags: ["Advanced"]
uev: 4.19.2
date: 2018-05-12T12:00:00.226Z
description: In this tutorial we'll learn how to create a health bar while applying damage.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/HealthBar](https://github.com/Harrison1/unrealcpp/tree/master/HealthBar)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we'll learn how to create a health bar on the user's Heads Up Display while applying and receiving damage using the `ReceivePointDamage` and the `ApplyPointDamage` functions. We will create a fire object that applies damage on overlap and when the user receives damage the health bar will respond accordingly. We will also make a magic bar and bind it to the player's `OnFire` method. We'll also create **MedKits** for player and a magic meter that automatically refills the magic bar after 5 seconds. Let's begin.

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

The next two functions will deal with the Magic's timeline curve. The `SetMagicValue` function will run in conjunction with the timline changing the `Magic` and `MagicPercentage` values as the timeline progressess. The `SetMagicState` function is called after the timeline finishes, this will revert the desired values and gun material back to their respective default values.

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

The next two functions will affect the player's health. The `ReceivePointDamage` funciton will run each time the player interacters with an element that calls the `ApplyPointDamage` function. In our example we'll create a fire actor later on that will run `ApplyPointDamage`. In our `ReceivePointDamage` function we are simply toggling our `bCanBeDamaged` bool to trigger our invincibility, toggleing our `redFlash` bool to trigger the animation, running the `UpdateHealth` function with the `Damage` value passed through as a parameter, and then calling `DamageTimer` to revert the `bCanBeDamaged` bool back to `true`. The `UpdateHealth` function immedietly changes and clamps the `Health` value then it sets `PreviousHealth` and `HealthPercentage`.

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

The final two functions are magic related and are similar to the health functions. `UpdateMagic` sets the `Magic` values and starts the timeline to get the player's magic meter back to 100%. `UpdateMagic` will run after 5 seconds of no magic firing to fill up the player's magic bar. `SetMagicChange` will toggle `bCanUseMagic` bool, set `PreviousMagic`, set `MagicValue`, change the gun's material to indicate overehating, the call `PlayFromStart` on the magic float timeline curve.

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

Next, in the `GameMode` `.cpp` file we first find the plaery in the `BeginPlay` function then in the `Tick` function we always check if the player's health is above 0. If the player's health is below 0 we will simply restart the level.

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
file. Some things in the `.h` file include the overlap functions, a particle compenent that will be set to our fire partilce later on in the tutorial, properties necessary for tha `ApplyPointDamage` function. Below is the final `CampFire.h` file.

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

Next, we'll move into the `CampFire.cpp` file. Include both `Kismet/GameplayStatics.h` and `TimerManager.h`. In `constructor` function we'll setup our `BoxComponent`, `ParticleComponent`, and connect the overlap functions to the `BoxComponent`. Next, we'll create the `OnOverlapBegin` function, if the conditions pass as `true`, we'll set the necessary parameters to and then trigger our the fire timer to run and loop the `ApplyFireDamage` function after **2.2s**. The reason why the timer is set to 2.2 seconds is because our player has invincibily that lasts 2 seconds so we want the `ApplyFireDamage` function to run right after the invicibiliy is turned off, so the extra 0.2 seconds is a buffer to prevent conflicts. `OnOverlapEnd` is where we clear the timer and set `bCanApplyDamage` indicating the fire cannot apply damage to the player. The `ApplyFireDamage` function first checks if `bCanApplyDamage` and then runs `ApplyPointDamage` with `MyCharcter` as the actor to apply damage and the fire will deal **200.0f** points of damage. `ApplyPointDamage` is a function inherited from **GameplayStatics**. Below is the final `CampFire.cpp` file.

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

Next, inside the `MedKit.cpp`, in the constructor function we'll setup the `OnOverlap` delegate. Every actor has an `OnOverlap` delegate. Next, create the `OnOverlap` function. In the `OnOverlap` funciton we check if the the overlaped actor is inherets from our character class (is the actor our player), then we check if the player's health less than 100%, then we run the character's function `UpdateHealth` with specified amount, in this exmaple I added in `100.0f` point of health, then we destroy the actor. Earlier in the tutorial, I set the character's `FullHealth` variable to `1000.0f`, so `100.0f` is 10% of the player's health. Below is the final `MedKit.cpp`. You'll notice in the below code that I omit the `BeginPlay` and `Tick` functions because they are not needed in this actor.

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

Next, inside the 	`HUD`'s `.cpp` file, in the `BeginPlay` function we'll set our `CurrentWidget` property and if we're successful in creating the widget we'll run `AddToViewport`. Below is the final `HUD` `.cpp` file.

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
