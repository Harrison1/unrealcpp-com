---
templateKey: blog-post
title: Change Material Mesh
image: https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/change-material-mesh_jko1xl.jpg
video: YDbN-3M1v9g
tags: ["beginner", "material"]
uev: 4.18.3
date: 2018-01-27T13:00:00.226Z
description: In this tutorial we'll change a static mesh's material on overlap.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/ChangeMaterialMesh](https://github.com/Harrison1/unrealcpp/tree/master/ChangeMaterialMesh)**

*For this tutorial we are using the standard first person C++ template with starter content.*

In this tutorial we will change a static mesh's material on overlap. Create a new **actor** class and call it whatever you want, in this tutorial I will call it `ChangeMaterialMesh`.

First, in the `.h` file we will create a `UStaticMeshComponent`, two `UMaterial` classes, and a `UBoxComponent`. Add the elements to the `public` section of the header file.


#### setup header file.
```cpp
...
UPROPERTY(VisibleAnywhere)
class UStaticMeshComponent* MyMesh;

UPROPERTY(EditAnywhere)
class UMaterial* OnMaterial;

UPROPERTY(EditAnywhere)
class UMaterial* OffMaterial;

UPROPERTY()
class UBoxComponent* MyBoxComponent;

UFUNCTION()
void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
```

Now we'll move into the `.cpp` file. First, include `DrawDebugHelpers.h` and `Components/BoxComponent.h` files at the top so we can visualize and use our collision box.

#### include debug helpers
```cpp
// include draw debug helpers header file
#include "DrawDebugHelpers.h"
#include "Components/BoxComponent.h"
```

Next, we'll set up our constructor function and set our default values. Create the static mesh using `CreateDefaultSubobject<UStaticMeshComponent>` and set it as the `RootComponent`. Then, create the box component by using `CreateDefaultSubobject<UBoxComponent>` and we'll set it's extent to `FVector(100,100,100)` by using `InitBoxExtent`. The box component will init with a collision profile name of `Trigger` and will be attached to the `RootComponent`. Next, create two materials for the mesh to switch between, establish a default value for the bool, and finally connect the overlap function. Below is the constructor code.

#### Constructor
```cpp
AChangeMaterialMesh::AChangeMaterialMesh()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	MyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MyMesh"));
	RootComponent = MyMesh;

	MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("MyBoxComponent"));
	MyBoxComponent->InitBoxExtent(FVector(100,100,100));
	MyBoxComponent->SetCollisionProfileName("Trigger");
	MyBoxComponent->SetupAttachment(RootComponent);

	OnMaterial = CreateDefaultSubobject<UMaterial>(TEXT("OnMaterial"));
	OffMaterial = CreateDefaultSubobject<UMaterial>(TEXT("OffMaterial"));

	MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &AChangeMaterialMesh::OnOverlapBegin);

}
```

Next, in the `BeginPlay()` method we will draw our debug box with `DrawDebugBox` and set the first material for our mesh with `SetMaterial`. Below is the `BeginPlay()` code.

#### BeginPlay()
```cpp
void AChangeMaterialMesh::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), FVector(100,100,100), FColor::White, true, -1, 0, 10);

	MyMesh->SetMaterial(0, OffMaterial);
	
}
```

Now, we'll create the overlap function that will change the mesh's material. We will check if the `OtherActor` is not `null`, and if the `OtherActor` is not the same actor, and if the `OtherComp` is not null. If everything passes, we will call `SetMaterial` and pass in the new material and set it as the first material for the mesh. Below is the overlap function.

#### overlap function
```cpp
void AChangeMaterialMesh::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult) 
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
	{
		MyMesh->SetMaterial(0, OnMaterial);
	}
}
```

Compile the code. Drag and drop the actor into the game world. Add a mesh in the details panel and add two materials to the **Actor** (the materials are set in the parent's (Instance) details panel. Now when you push play the mesh will change materials when overlapped. Below is the final code.

### ChangeMaterialMesh.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ChangeMaterialMesh.generated.h"

UCLASS()
class UNREALCPP_API AChangeMaterialMesh : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AChangeMaterialMesh();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(VisibleAnywhere)
	class UStaticMeshComponent* MyMesh;

	UPROPERTY(EditAnywhere)
	class UMaterial* OnMaterial;

	UPROPERTY(EditAnywhere)
	class UMaterial* OffMaterial;

	UPROPERTY()
	class UBoxComponent* MyBoxComponent;

	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
	
};
```

### ChangeMaterialMesh.cpp
```cpp
#include "ChangeMaterialMesh.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"
#include "Components/BoxComponent.h"



// Sets default values
AChangeMaterialMesh::AChangeMaterialMesh()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	MyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MyMesh"));
	RootComponent = MyMesh;

	MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("MyBoxComponent"));
	MyBoxComponent->InitBoxExtent(FVector(100,100,100));
	MyBoxComponent->SetCollisionProfileName("Trigger");
	MyBoxComponent->SetupAttachment(RootComponent);

	OnMaterial = CreateDefaultSubobject<UMaterial>(TEXT("OnMaterial"));
	OffMaterial = CreateDefaultSubobject<UMaterial>(TEXT("OffMaterial"));

	MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &AChangeMaterialMesh::OnOverlapBegin);

}

// Called when the game starts or when spawned
void AChangeMaterialMesh::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), FVector(100,100,100), FColor::White, true, -1, 0, 10);

	MyMesh->SetMaterial(0, OffMaterial);
	
}

// Called every frame
void AChangeMaterialMesh::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void AChangeMaterialMesh::OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult) 
{
	if ( (OtherActor != nullptr ) && (OtherActor != this) && ( OtherComp != nullptr ) ) 
	{
		MyMesh->SetMaterial(0, OnMaterial);
	}
}
```