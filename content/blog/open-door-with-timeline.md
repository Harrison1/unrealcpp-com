---
templateKey: blog-post
title: Open Door With Timeline and Curve Float
image: https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/open-door-with-timeline_z3ha4z.jpg
video: KsvUYzrTwBw
tags: ["intermediate"]
uev: 4.18.3
date: 2018-02-20T12:00:00.226Z
description: In this tutorial we'll learn how to open a door using a timeline and a curve float.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/OpenDoorTimelineCurve](https://github.com/Harrison1/unrealcpp/tree/master/OpenDoorTimelineCurve)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we will learn how to open a door using a timeline and curve float when the player presses a key. The door will open depending on which way the player is facing.

First, inside the editor add an Action key by going to Edit > Project Settins > Input > Action Mappings. Add an an action and call it `Action` and bind it to to the **E** key.

Next, in your content folder, right click, go to Miscellaneous > Curve and create new Curve Float. Open the curve float and create a new key by right clicking and selecting new key. In the top left set the values of the first key to have the values of `0` for **Time** and **Value**. Create a second key and set its **Time** value to `1.0` and its **Value** property to `90.0`. Hold **SHIFT**, select both keys and then click `Auto` in the top bar to give the curve a smooth beginning and end.

Next, in your content folder, right click, go to User Interface and select **Widget Blueprint**. Inside the **Widget Blueprint** drag and drop an image property into the viewport. For the source you can add the image below or any image you want. At the top of the details panel for the image name the property `helpimage`.

#### feel free to use this image you want
[![press e to open](https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/press-e-to-use_vcn3pq.png "press e to open")](https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/press-e-to-use_vcn3pq.png)  


Before we create a new actor, let's add to out build file so we can use `UMG` widgets. In your `Build.cs` file add `UMG`, `Slate`, and `SlateCore`;

### UnrealCpp.Build.cs
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

Next, create a new **actor** class and call it whatever you want, in this tutorial I will call it `OpenDoorTimelineCurve`.

First, in the `.h` file let's `#include` the `TimelineComponent.h"` at the top of the file. Make sure it comes before your **Actor's** `generated.h` file.

#### include TimelineComponent
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"

// include before generated file
#include "Components/TimelineComponent.h"

#include "OpenDoorWithLerp.generated.h"
```

Next, we'll setup our variables. We'll create some variables and functions to use and track throughout our `.cpp` file.

#### Our Header Properties and Functions
```cpp
...
	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* Door;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* DoorFrame;

	UPROPERTY(EditAnywhere)
	UCurveFloat *DoorCurve;

	UFUNCTION()
    void ControlDoor();

	UFUNCTION()
    void ToggleDoor();

	UFUNCTION()
    void SetState();

	bool Open;
	bool ReadyState;
	float RotateValue;
	float CurveFloatValue;
	float TimelineValue;
	FRotator DoorRotation;
	FTimeline MyTimeline;
```

Next, we'll move into the **Actor's** `.cpp` file. We'll first want to `#include` the the `KismetMathLibrary` and `GameplayStatics"` header file. We'll use Kismet functions in the toggle function.

#### include files
```cpp
#include "Kismet/KismetMathLibrary.h"
#include "Kismet/GameplayStatics.h"
```
In the constructor function we will set our default variables. First, we'll set our `Open` bool to `false` and our `ReadyState` to `true`. Then we'll setup our `DoorFrame` as the `RootComponent` and then attach our `Door` mesh to it.

#### constructor function
```cpp
AOpenDoorTimelineCurve::AOpenDoorTimelineCurve()
{
	PrimaryActorTick.bCanEverTick = true;

    Open = false;
    ReadyState = true;

    DoorFrame = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DoorFrame"));
    RootComponent = DoorFrame;

    Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
    Door->SetupAttachment(RootComponent);
}
```

Next, in the `BeginPlay` function we will setup our `Timeline` component. In the editor we'll set our `DoorCurve` to be the float curve we created earlier. So, if the `DoorCurve` is not `NULL`, we'll setup our callback functions and connect them to our timeline. When the timeline is moving through the `DoorCurve` we will call the `ControlDoor` function and when the timeline is finished we will call the `SetState` function.

#### BeginPlay function
```cpp
void AOpenDoorTimelineCurve::BeginPlay()
{
	Super::BeginPlay();

    RotateValue = 1.0f;

    if (DoorCurve)
    {
        FOnTimelineFloat TimelineCallback;
        FOnTimelineEventStatic TimelineFinishedCallback;

        TimelineCallback.BindUFunction(this, FName("ControlDoor"));
        TimelineFinishedCallback.BindUFunction(this, FName{ TEXT("SetState") });
        MyTimeline.AddInterpFloat(DoorCurve, TimelineCallback);
        MyTimeline.SetTimelineFinishedFunc(TimelineFinishedCallback);
    }

}
```

In the `Tick` function we have to connect our Timeline to `DeltaTime`;

#### Tick function
```cpp
void AOpenDoorTimelineCurve::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

    MyTimeline.TickTimeline(DeltaTime);
}
```
Next, let's create the `ControlDoor` function. This function will get the playback position of the timeline, then grab the value that number has on the float curve, and then set the relative rotation for the door. The `RotateValue` is set in `ToggleDoor` function that we'll create later, but the `RotateValue` will determine the direction in which the door opens.

#### ControlDoor function
```cpp
void AOpenDoorTimelineCurve::ControlDoor()
{
    TimelineValue = MyTimeline.GetPlaybackPosition();
    CurveFloatValue = RotateValue*DoorCurve->GetFloatValue(TimelineValue);

    FQuat NewRotation = FQuat(FRotator(0.f, CurveFloatValue, 0.f));

    Door->SetRelativeRotation(NewRotation);
}
```

Next, we'll create the `SetState` function to simply set `ReadyState` to `true`. We will only be able to open or close the door when `ReadyState` is `true`.

#### SetState function
```cpp
void AOpenDoorTimelineCurve::SetState()
{
    ReadyState = true;
}
```

Next, we'll create the `ToggleDoor` function. First, we'll check if `ReadyState` is true. If `ReadyState` is `true` we will toggle `Open` and get the `Door`'s current rotation. Next, we will get the direction the player is facing, determining if they are in front or behind the door. We will use the KismetMathLibrary's function `LessLess_VectorRotator` to get an `X` coordinate that is either positive or negative. If `Open` is `true` we will set `RotateValue` to `1.0f` or `-1.0f` depending on the direction and then set `ReadyState` to `false` and then play the timeline from the start. If `Open` is `false` we will set `ReadyState` to `false` and reverse the timeline.


#### ToggleDoor function
```cpp
void AOpenDoorTimelineCurve::ToggleDoor() 
{
    if(ReadyState) 
    {
        Open = !Open;
        DoorRotation = Door->RelativeRotation;

        APawn* OurPawn = UGameplayStatics::GetPlayerPawn(this, 0);
        FVector PawnLocation = OurPawn->GetActorLocation();
        FVector Direction = GetActorLocation() - PawnLocation;
        Direction = UKismetMathLibrary::LessLess_VectorRotator(Direction, GetActorRotation());

        if(Open)
        {
                
            if(Direction.X > 0.0f)
            {
                RotateValue = 1.0f;
            }
            else
            {
                RotateValue = -1.0f;
            }

            ReadyState = false;
            MyTimeline.PlayFromStart();
        }
        else 
        {
            ReadyState = false;
            MyTimeline.Reverse();
        }
    }

}
```

Next, let's move into the character `header` file. at the tope include the new door class the `UserWidget` header file.

#### include in the character header file. The path to your door class might be different, so use your path.
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Character.h"

// include these two
#include "OpenDoorTimelineCurve/OpenDoorTimelineCurve.h"
#include "Blueprint/UserWidget.h"

#include "UnrealCPPCharacter.generated.h"
```

Then, we will be using the `Tick` function so we need to override it and then add our properties and add our `OnAction` function.

#### character setup
```cpp
...
protected:
	virtual void BeginPlay();

    // add tick override
	virtual void Tick(float DeltaSeconds) override;

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

    // declare float curve
	UPROPERTY(EditAnywhere)
	class AOpenDoorTimelineCurve* CurrentDoor;

	// Reference UMG Asset in the Editor
	UPROPERTY(EditAnywhere)
	TSubclassOf<class UUserWidget> HelpWidgetClass;

    // declare widget
	class UUserWidget* InfoWidget;

protected:
	
	/** Fires a projectile. */
	void OnFire();

	/** Action Function */
	void OnAction();
``` 

Next, in the character `.cpp` file `#include` `DrawDebugHelpers.h` to so we can visualize the line trace.

#### include DrawDebugHelpers.h
```cpp
#include "DrawDebugHelpers.h"
```

In the constructor function set `CurrentDoor` to `NULL`.

#### constructor function
```cpp
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

	CurrentDoor = NULL;

}
```

In the `BeginPlay` function, we will setup the `UserWidget` and add it to the viewport.

#### BeginPlay function
```cpp
void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	Mesh1P->SetHiddenInGame(false, true);

	if (HelpWidgetClass)
	{
		InfoWidget = CreateWidget<UUserWidget>(GetWorld(), HelpWidgetClass);
 
		if (InfoWidget)
		{
			InfoWidget->AddToViewport();
		}
 
	}	

}
```

In the `Tick` function we will draw a line trace every frame to see if we are returning a door. If the `Hit` actor is a door then we will set `CurrentDoor` to the current actor and display our help image.

#### Tick function
```cpp
void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult Hit;
	FVector Start = FirstPersonCameraComponent->GetComponentLocation();

	FVector ForwardVector = FirstPersonCameraComponent->GetForwardVector();
	FVector End = ((ForwardVector * 200.f) + Start);
	FCollisionQueryParams CollisionParams;

	DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1, 0, 1);

	if(GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, CollisionParams)) 
	{
		if(Hit.bBlockingHit)
		{
			if(Hit.GetActor()->GetClass()->IsChildOf(AOpenDoorTimelineCurve::StaticClass())) 
			{
				InfoWidget->GetWidgetFromName("helpimage")->SetVisibility(ESlateVisibility::Visible);
					
				CurrentDoor = Cast<AOpenDoorTimelineCurve>(Hit.GetActor());
				
			}
		}
	}
	else
	{
		InfoWidget->GetWidgetFromName("helpimage")->SetVisibility(ESlateVisibility::Hidden);
		CurrentDoor = NULL;
	}
}
```

Next, bind the `OnAction` event in the `SetupPlayerInputComponent` function.

```cpp
...
	// Bind action event
	PlayerInputComponent->BindAction("Action", IE_Pressed, this, &AUnrealCPPCharacter::OnAction);
```

Next, create the `OnAction` function to run the door's toggle function;

#### OnAction
```cpp
void AUnrealCPPCharacter::OnAction()
{
	if(CurrentDoor)
	{
		CurrentDoor->ToggleDoor();
	}

}
```

Save and compile. Go into the editor, select the character and add the user widget class to them in the details panel. Drag and drop the door actor into the game world. Add the float curve to the actor in the details panel. Add the door frame and and door meshes. Now when you push play the door will open and close the player pushes the `Action` key while in range.

Below is the final code.

### UnrealCpp.Build.cs
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

### OpenDoorTimelineCurve.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/TimelineComponent.h"
#include "Components/BoxComponent.h"
#include "OpenDoorTimelineCurve.generated.h"

UCLASS()
class UNREALCPP_API AOpenDoorTimelineCurve : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AOpenDoorTimelineCurve();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* Door;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* DoorFrame;

	UPROPERTY(EditAnywhere)
	UCurveFloat *DoorCurve;

	UFUNCTION()
    void ControlDoor();

	UFUNCTION()
    void ToggleDoor();

	UFUNCTION()
    void SetState();

	bool Open;
	bool ReadyState;
	float RotateValue;
	float CurveFloatValue;
	float TimelineValue;
	FRotator DoorRotation;
	FTimeline MyTimeline;

};
```

### OpenDoorTimelineCurve.cpp
```cpp
#include "OpenDoorTimelineCurve.h"
#include "Kismet/KismetMathLibrary.h"

// Sets default values
AOpenDoorTimelineCurve::AOpenDoorTimelineCurve()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

    Open = false;
    ReadyState = true;

    DoorFrame = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("DoorFrame"));
    RootComponent = DoorFrame;

    Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
    Door->SetupAttachment(RootComponent);

}

// Called when the game starts or when spawned
void AOpenDoorTimelineCurve::BeginPlay()
{
	Super::BeginPlay();

    RotateValue = 1.0f;

    if (DoorCurve)
    {
        FOnTimelineFloat TimelineCallback;
        FOnTimelineEventStatic TimelineFinishedCallback;

        TimelineCallback.BindUFunction(this, FName("ControlDoor"));
        TimelineFinishedCallback.BindUFunction(this, FName{ TEXT("SetState") });
        MyTimeline.AddInterpFloat(DoorCurve, TimelineCallback);
        MyTimeline.SetTimelineFinishedFunc(TimelineFinishedCallback);
    }

}

// Called every frame
void AOpenDoorTimelineCurve::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

    MyTimeline.TickTimeline(DeltaTime);
}

void AOpenDoorTimelineCurve::ControlDoor()
{
    TimelineValue = MyTimeline.GetPlaybackPosition();
    CurveFloatValue = RotateValue*DoorCurve->GetFloatValue(TimelineValue);

    FQuat NewRotation = FQuat(FRotator(0.f, CurveFloatValue, 0.f));

    Door->SetRelativeRotation(NewRotation);
}

void AOpenDoorTimelineCurve::SetState()
{
    ReadyState = true;
}

void AOpenDoorTimelineCurve::ToggleDoor() 
{
    if(ReadyState) 
    {
        Open = !Open;

        // alternative way to get pawn position
        // GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation()
        APawn* OurPawn = UGameplayStatics::GetPlayerPawn(this, 0);
        FVector PawnLocation = OurPawn->GetActorLocation();
        FVector Direction = GetActorLocation() - PawnLocation;
        Direction = UKismetMathLibrary::LessLess_VectorRotator(Direction, GetActorRotation());

        DoorRotation = Door->RelativeRotation;

        if(Open)
        {
                
            if(Direction.X > 0.0f)
            {
                RotateValue = 1.0f;
            }
            else
            {
                RotateValue = -1.0f;
            }

            ReadyState = false;
            MyTimeline.PlayFromStart();
        }
        else 
        {
            ReadyState = false;
            MyTimeline.Reverse();
        }
    }

}
```

### UnrealCPPCharacter.h
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "OpenDoorTimelineCurve/OpenDoorTimelineCurve.h"
#include "Blueprint/UserWidget.h"
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


public:
	AUnrealCPPCharacter();

protected:
	virtual void BeginPlay();

	virtual void Tick(float DeltaSeconds) override;

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

	UPROPERTY(EditAnywhere)
	class AOpenDoorTimelineCurve* CurrentDoor;

	// Reference UMG Asset in the Editor
	UPROPERTY(EditAnywhere)
	TSubclassOf<class UUserWidget> HelpWidgetClass;

	// UPROPERTY(EditAnywhere)
	class UUserWidget* InfoWidget;

protected:
	
	/** Fires a projectile. */
	void OnFire();

	/** Action Function */
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

	CurrentDoor = NULL;

}

void AUnrealCPPCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	//Attach gun mesh component to Skeleton, doing it here because the skeleton is not yet created in the constructor
	FP_Gun->AttachToComponent(Mesh1P, FAttachmentTransformRules(EAttachmentRule::SnapToTarget, true), TEXT("GripPoint"));

	Mesh1P->SetHiddenInGame(false, true);

	if (HelpWidgetClass)
	{
		InfoWidget = CreateWidget<UUserWidget>(GetWorld(), HelpWidgetClass);
 
		if (InfoWidget)
		{
			InfoWidget->AddToViewport();
		}
 
	}	

}

//Called every frame
void AUnrealCPPCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	FHitResult Hit;
	FVector Start = FirstPersonCameraComponent->GetComponentLocation();

	FVector ForwardVector = FirstPersonCameraComponent->GetForwardVector();
	FVector End = ((ForwardVector * 200.f) + Start);
	FCollisionQueryParams CollisionParams;

	DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 1, 0, 1);

	if(GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, CollisionParams)) 
	{
		if(Hit.bBlockingHit)
		{
			if(Hit.GetActor()->GetClass()->IsChildOf(AOpenDoorTimelineCurve::StaticClass())) 
			{
				InfoWidget->GetWidgetFromName("helpimage")->SetVisibility(ESlateVisibility::Visible);
					
				CurrentDoor = Cast<AOpenDoorTimelineCurve>(Hit.GetActor());
				
			}
		}
	}
	else
	{
		InfoWidget->GetWidgetFromName("helpimage")->SetVisibility(ESlateVisibility::Hidden);
		CurrentDoor = NULL;
	}
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
	if(CurrentDoor)
	{
		CurrentDoor->ToggleDoor();
	}

}
```