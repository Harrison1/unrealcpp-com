---
templateKey: blog-post
title: Destroy Actor on Overlap
image: https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/destory-on-overlap_b7f8b3.jpg
video: W-vP-tCQcDY
tags: ["beginner"]
uev: 4.18.3
date: 2018-01-27T12:00:00.226Z
description: In this tutorial we'll use the destroy method to remove actors from the game world.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/DestroyActorOnOverlap](https://github.com/Harrison1/unrealcpp/tree/master/DestroyActorOnOverlap)**

*For this tutorial we are using the standard first person C++ template with starter content.*

In this tutorial we will use the destroy method to remove actors from the game world. Create a new **actor** class and call it whatever you want, in this tutorial I will call it `DestroyActorOnOverlap`.

First, in the `.h` file we will create an `OnOverlapBegin` function, a `float` variable, a `UStaticMeshComponent`, and a `USphereComponent`. Add the elements to the `public` section of the header file.


#### add to the header file
```cpp
...
// declare collision component
UPROPERTY(VisibleAnywhere)
class USphereComponent* MyCollisionSphere;

// declare mesh component
UPROPERTY(VisibleAnywhere)
class UStaticMeshComponent* MyMesh;

float SphereRadius;

// declare overlap begin function
UFUNCTION()
void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
```

Now let's move into the **actor's** `.cpp` file. In the `constructor` function we will set our default values. Set `SphereRadius` to `100.0f` and setup the static mesh by using `CreateDefaultSubobject` and attach it to the `RootComponent`. Next, we'll setup the collision sphere, `MyCollisionSphere`. Create the component with `CreateDefaultSubobject`, initialize its size with `InitSphereRadius`, set the collision settings with `SetCollisionProfileName`, and then set it as the `RootComponent`. Finally, in the constructor connect the actor to the overlap function with `OnComponentBeginOverlap.AddDynamic`. Below is the code for the default value.

#### Constructor default value
```cpp
ADestroyActorOnOverlap::ADestroyActorOnOverlap()
{
	PrimaryActorTick.bCanEverTick = true;

	SphereRadius = 100.0f;

	MyCollisionSphere = CreateDefaultSubobject<USphereComponent>(TEXT("My Sphere Component"));
	MyCollisionSphere->InitSphereRadius(SphereRadius);
	MyCollisionSphere->SetCollisionProfileName("Trigger");
	RootComponent = MyCollisionSphere;

	MyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
	MyMesh->SetupAttachment(RootComponent);

	MyCollisionSphere->OnComponentBeginOverlap.AddDynamic(this, &ADestroyActorOnOverlap::OnOverlapBegin);

}
```

Include `DrawDebugHelpers.h` at the top of the file so we can visualize our collision sphere.

#### include debug helpers
```cpp
#include "DestroyActorOnOverlap.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"
```

In the `Tick` function we'll draw a debug sphere so we can see where the collision is on the actor.

#### Tick function
```cpp
void ADestroyActorOnOverlap::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	DrawDebugSphere(GetWorld(), GetActorLocation(), SphereRadius, 20, FColor::Purple, false, -1, 0, 1);	
}
```

Next, create the overlap function that will destroy the actor when an overlap is triggered. We will check if the `OtherActor` is not `null`, and if the `OtherActor` is not the same actor, and if the `OtherComp` is not null. If everything passes, we will call `Destroy()`. Below is the overlap function.


#### overlap function
```cpp
void ADestroyActorOnOverlap::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
	{
		Destroy();
	}
}
```

Compile the code. Drag and drop the actor into the game world. Add a mesh in the details panel. Now when you push play the actor will be destroyed when you get near it. Below is the final code.

### DestroyActorOnOverlap.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "DestroyActorOnOverlap.generated.h"

UCLASS()
class UNREALCPP_API ADestroyActorOnOverlap : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ADestroyActorOnOverlap();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare collision component
	UPROPERTY(VisibleAnywhere)
	class USphereComponent* MyCollisionSphere;

	// declare mesh component
	UPROPERTY(VisibleAnywhere)
	class UStaticMeshComponent* MyMesh;

	float SphereRadius;

	// declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

};
```

### DestroyActorOnOverlap.cpp
```cpp
#include "DestroyActorOnOverlap.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"

// Sets default values
ADestroyActorOnOverlap::ADestroyActorOnOverlap()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	SphereRadius = 100.0f;

	MyCollisionSphere = CreateDefaultSubobject<USphereComponent>(TEXT("My Sphere Component"));
	MyCollisionSphere->InitSphereRadius(SphereRadius);
	MyCollisionSphere->SetCollisionProfileName("Trigger");
	RootComponent = MyCollisionSphere;

	MyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Mesh"));
	MyMesh->SetupAttachment(RootComponent);

	MyCollisionSphere->OnComponentBeginOverlap.AddDynamic(this, &ADestroyActorOnOverlap::OnOverlapBegin);

}

// Called when the game starts or when spawned
void ADestroyActorOnOverlap::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ADestroyActorOnOverlap::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	DrawDebugSphere(GetWorld(), GetActorLocation(), SphereRadius, 20, FColor::Purple, false, -1, 0, 1);	

}

void ADestroyActorOnOverlap::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
	{
		Destroy();
	}
}
```