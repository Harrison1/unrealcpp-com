---
templateKey: blog-post
path: /light-switch-trigger
title: Light Switch Overlap Trigger
author: Harrison McGuire
authorImage: https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg
authorTwitter: HarryMcGueeze
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1512222398/light-switch-overlap_tkekfo.jpg
featuredVideo: youtube.com
tags:
  - beginner
  - light
  - ue4 tutorial
uev: 4.18.1
date: 2017-11-29T07:29:13.628Z
description: Create a light that turns on and off when a user enters the actor's USphereComponent
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/LightSwitchTrigger](https://github.com/Harrison1/unrealcpp/tree/master/LightSwitchTrigger)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

The main logic of this code is from Epic's Unreal Engine 4 documentation and you can see it [here](https://docs.unrealengine.com/latest/INT/Gameplay/ClassCreation/CodeOnly/). 

In this tutorial we are going to make a light that turns on and off when a user enters the actor's USphereComponent. Create a new `C++` actor class and call it **LightSwitchTrigger**. In the header we will define our `PointLight`, `USphereComponent`, `Overlap` functions, and `ToggleLight` function.

#### LightSwitchTrigger.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "LightSwitchTrigger.generated.h"

UCLASS()
class UNREALCPP_API ALightSwitchTrigger : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ALightSwitchTrigger();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare point light comp
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	class UPointLightComponent* PointLight;

	// declare sphere comp
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	class USphereComponent* LightSphere;

	// declare light intensity variable
	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	float LightIntensity;
	
	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	// declare ToggleLight function
	UFUNCTION()
	void ToggleLight();
};
```
Next, in the `.cpp` we will `#include` `DrawDebuHelpers` to help us visualize the collision sphere.

```cpp
#include "LightSwitchTrigger.h"
#include "Components/PointLightComponent.h"
#include "Components/SphereComponent.h"
// include draw debu helpers header file
#include "DrawDebugHelpers.h"
```

In the `LightSwitchTrigger` init function we will set our `LightIntensity` to `3000.0f`. Next, we'll add a `PointLight` as our `RootComponent`. Then we'll add a `USphereComponent` to our actor for a trigger sphere and attach it to the `RootComponent`. Then connect `USphereComponent` to our `Overlap` functions that we will create later.

#### setup up trigger light
```cpp
ALightSwitchTrigger::ALightSwitchTrigger()
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
	LightSphere->SetupAttachment(RootComponent);

	LightSphere->OnComponentBeginOverlap.AddDynamic(this, &ALightSwitchTrigger::OnOverlapBegin);
	LightSphere->OnComponentEndOverlap.AddDynamic(this, &ALightSwitchTrigger::OnOverlapEnd); 

}
```   

In the `BeginPlay()` add a debug sphere with sama radius as our `LightSphere`.

#### draw debug sphere
```cpp
void ALightSwitchTrigger::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugSphere(GetWorld(), GetActorLocation(), 300.f, 50, FColor::Green, true, -1, 0, 2);
	
}
```

Create a function called `ToggleLight()` that toggles the `PointLight's` visibility. Visit [this page](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/Components/USceneComponent/index.html) in the documentation to view all of the `USceneComponent`'s functions and properties.

```cpp
void ALightSwitchTrigger::ToggleLight()
{
    PointLight->ToggleVisibility();
}
```

Next, we'll create two overlap functions that both call the `ToggleLight` function to toggle the visibility of the light.

#### overlap functions
```cpp
void ALightSwitchTrigger::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (OtherActor && (OtherActor != this) && OtherComp)
    {
        ToggleLight();
    }
}

void ALightSwitchTrigger::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    if (OtherActor && (OtherActor != this) && OtherComp)
    {
        ToggleLight();
    }
}
```

Finally, compile the code and drag the `LightSwitchTrigger` into the scene. Now whenever the player enters the sphere comp the light will toggle. Below is the final `.cpp` file.

### LightSwitchTrigger.cpp
```cpp
#include "LightSwitchTrigger.h"
#include "Components/PointLightComponent.h"
#include "Components/SphereComponent.h"
// include draw debu helpers header file
#include "DrawDebugHelpers.h"

// Sets default values
ALightSwitchTrigger::ALightSwitchTrigger()
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
	LightSphere->SetupAttachment(RootComponent);

	LightSphere->OnComponentBeginOverlap.AddDynamic(this, &ALightSwitchTrigger::OnOverlapBegin);
	LightSphere->OnComponentEndOverlap.AddDynamic(this, &ALightSwitchTrigger::OnOverlapEnd); 

}

// Called when the game starts or when spawned
void ALightSwitchTrigger::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugSphere(GetWorld(), GetActorLocation(), 300.f, 50, FColor::Green, true, -1, 0, 2);
	
}

// Called every frame
void ALightSwitchTrigger::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void ALightSwitchTrigger::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (OtherActor && (OtherActor != this) && OtherComp)
    {
        ToggleLight();
    }
}

void ALightSwitchTrigger::OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    if (OtherActor && (OtherActor != this) && OtherComp)
    {
        ToggleLight();
    }
}

void ALightSwitchTrigger::ToggleLight()
{
    PointLight->ToggleVisibility();
}
```