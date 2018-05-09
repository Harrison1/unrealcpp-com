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
