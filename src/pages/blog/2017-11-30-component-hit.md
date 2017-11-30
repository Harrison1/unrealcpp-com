---
templateKey: blog-post
path: /on-component-hit
title: Register Component Hit
author: Harrison McGuire
authorImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657694/on-hit-component_etggr8.jpg
tags:
  - component
  - hit
uev: 4.18.1
date: 2017-11-30T05:28:40.226Z
description: >-
  Learn how to register a hit event on your component.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/OnComponentHit](https://github.com/Harrison1/unrealcpp/tree/master/OnComponentHit)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we will learn how to register a hit event on a component. Create a new `C++` actor class and call it **OnComponentHit**.  In the header file will declare a `UBoxComponent` variable and a `void` function to run when the component registers a hit. Below is the final header file.

### OnHitComponent.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "OnComponentHit.generated.h"

UCLASS()
class UNREALCPP_API AOnComponentHit : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AOnComponentHit();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(VisibleAnywhere)
	class UBoxComponent* MyComp;

	UFUNCTION()
	void OnCompHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit);
	
};
```

In `.cpp` file first `#include` the `BoxComponent` header file.

#### include files
```cpp
#include "OnComponentHit.h"
// include files
#include "Components/BoxComponent.h"
```

Next, we'll set the default values for our actor in the actor's init function. We'll initialize the actor with a `UBoxComponent` and set it as the `RootComponent`. Then, we'll add `OnComponentHit` to the component and connnect it to our function `OnCompHit`. We'll make `OnCompHit` in the next step. I'm also setting the default `CollisionProfileName` to `BlockAllDynamic`, this can be changed later in the editor.

#### init function
```cpp
// Sets default values
AOnComponentHit::AOnComponentHit()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Use a sphere as a simple collision representation
	MyComp = CreateDefaultSubobject<UBoxComponent>(TEXT("BoxComp"));
	MyComp->SetSimulatePhysics(true);
    MyComp->SetNotifyRigidBodyCollision(true);
    
	MyComp->BodyInstance.SetCollisionProfileName("BlockAllDynamic");
	MyComp->OnComponentHit.AddDynamic(this, &AOnComponentHit::OnCompHit);

	// Set as root component
	RootComponent = MyComp;

}
```

Now let's create our simple `OnCompHit` function that will print to screen the other actor's name when our actor hits it. For more information on `OnComponentHit` you can vist some good AnswerHub posts [here](https://answers.unrealengine.com/questions/429353/cpp-on-component-hit-doesnt-fire.html) and [here](https://answers.unrealengine.com/questions/429353/cpp-on-component-hit-doesnt-fire.html) or visit the ue4 documenation [here](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/Components/UPrimitiveComponent/OnComponentHit/) 

#### OnCompHit
```cpp
void AOnComponentHit::OnCompHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit)
{
	if ((OtherActor != NULL) && (OtherActor != this) && (OtherComp != NULL))
	{
		if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("I Hit: %s"), *OtherActor->GetName()));
	}
}
```

Below is the final `.cpp` file.

### OnComponentHit.cpp
```cpp
#include "OnComponentHit.h"
#include "Components/BoxComponent.h"

// Sets default values
AOnComponentHit::AOnComponentHit()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Use a sphere as a simple collision representation
	MyComp = CreateDefaultSubobject<UBoxComponent>(TEXT("BoxComp"));
	MyComp->SetSimulatePhysics(true);
	MyComp->SetNotifyRigidBodyCollision(true);
	MyComp->BodyInstance.SetCollisionProfileName("BlockAllDynamic");
	MyComp->OnComponentHit.AddDynamic(this, &AOnComponentHit::OnCompHit);

	// Set as root component
	RootComponent = MyComp;

}

// Called when the game starts or when spawned
void AOnComponentHit::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AOnComponentHit::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void AOnComponentHit::OnCompHit(UPrimitiveComponent* HitComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, FVector NormalImpulse, const FHitResult& Hit)
{
	if ((OtherActor != NULL) && (OtherActor != this) && (OtherComp != NULL))
	{
		if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT("I Hit: %s"), *OtherActor->GetName()));
	}
}
```

Compile the code. Drag and drop the actor into the game scene. Add a static mesh to the actor and fit inside the hit box. Now when you push play the actor should register the hit events.