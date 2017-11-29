---
templateKey: blog-post
path: /light-switch-push-button
title: Light Switch on Button Press
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657693/light-switch-button_zn1ggd.jpg
featuredVideo: youtube.com
tags:
  - intermediate
uev: 4.18.1
date: 2017-11-29T02:02:12.146Z
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

