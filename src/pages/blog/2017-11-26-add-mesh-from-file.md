---
templateKey: blog-post
path: /add-mesh-from-file
title: Add Mesh From File
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657692/add-mesh-from-filejpg_bkcla5.jpg
featuredVideo: youtube.com
tags:
  - beginner
  - helpers
uev: 4.18.1
date: 2017-11-26T11:18:13.628Z
description: How to add a mesh to an actor programatically through using the ConstructorHelpers script.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/AddMeshFromFile](https://github.com/Harrison1/unrealcpp/tree/master/AddMeshFromFile)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

Let's start by creating a new actor named `AddMeshFromFile`. We don't have to do anything inside the header file. Below is the default header we generated when we created a new class.

### AddMeshFromFile.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "AddMeshFromFile.generated.h"

UCLASS()
class UNREALCPP_API AAddMeshFromFile : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AAddMeshFromFile();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
};
```

In order to programatically add a specific mesh we must include the `ConstructorHelpers.h` file. Include the file below your actor's named header file

#### include ConstructorHelpers.h
```cpp
#include "AddMeshFromFile.h"
// add constructor header
#include "ConstructorHelpers.h"
``` 

Next in our actor's init function we will set the default values of the mesh we want to add to the actor. Create a `UStaticMeshComponent` pointer and set it as your `RootComponent`.

#### create UStaticMeshComp and set root
```cpp
AAddMeshFromFile::AAddMeshFromFile()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// add Cylinder to root
    UStaticMeshComponent* Cylinder = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    Cylinder->SetupAttachment(RootComponent);

}
```

After our initial setup our next step is to add the mesh we want to our actor. We are going to use the `ConstructorHelpers` method `FObjectFinder` to locate our mesh. In this example I am calling the variable `CylinderAsset` and passing in the path to the cylinder shape provided by the starter content. The path we pass in is `/Game/StarterContent/Shapes/Shape_Cylinder.Shape_Cylinder`.

#### FObjectFinder method

```cpp
AAddMeshFromFile::AAddMeshFromFile()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// add Cylinder to root
    UStaticMeshComponent* Cylinder = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    Cylinder->SetupAttachment(RootComponent);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CylinderAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cylinder.Shape_Cylinder"));

}
```

Next, let's do an error check to ensure we successfully get the mesh. If the statement passes let's `SetStaticMesh`, `SetRelativeLocation`, `SetWorldScale3D` on our `Cylinder` component.

#### if asset succeeded
```cpp
if (CylinderAsset.Succeeded()) {}
```

#### SetStaticMesh
```cpp
if (CylinderAsset.Succeeded()) 
{
    Cylinder->SetStaticMesh(CylinderAsset.Object);
}
```

#### SetRelativeLocation
```cpp
if (CylinderAsset.Succeeded()) 
{
    Cylinder->SetStaticMesh(CylinderAsset.Object);
    Cylinder->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
}
```

#### SetWorldScale3D
```cpp
if (CylinderAsset.Succeeded()) 
{
    Cylinder->SetStaticMesh(CylinderAsset.Object);
    Cylinder->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
    Cylinder->SetWorldScale3D(FVector(1.f));
}
```

Below is the final `.cpp` file.

### AddMeshFromFile.cpp
```cpp
#include "AddMeshFromFile.h"
// add constructor header
#include "ConstructorHelpers.h"


// Sets default values
AAddMeshFromFile::AAddMeshFromFile()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// add Cylinder to root
    UStaticMeshComponent* Cylinder = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VisualRepresentation"));
    Cylinder->SetupAttachment(RootComponent);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CylinderAsset(TEXT("/Game/StarterContent/Shapes/Shape_Cylinder.Shape_Cylinder"));

	if (CylinderAsset.Succeeded())
    {
        Cylinder->SetStaticMesh(CylinderAsset.Object);
        Cylinder->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
        Cylinder->SetWorldScale3D(FVector(1.f));
	}

}

// Called when the game starts or when spawned
void AAddMeshFromFile::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AAddMeshFromFile::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```
