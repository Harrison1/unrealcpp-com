---
templateKey: blog-post
path: /create-static-mesh
title: Create Static Mesh
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657693/create-static-mesh_xyqeat.jpg
featuredVideo: youtube.com
tags:
  - beginner
  - mesh
uev: 4.18.1
date: 2017-11-28T07:27:13.628Z
description: How to add a static mesh to an actor.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/CreateStaticMesh](https://github.com/Harrison1/unrealcpp/tree/master/CreateStaticMesh)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

Create a new `C++` actor class and call it **CreateStaticMesh**. In the header file add `UStaticMeshComponent` and call it anything you like. In this example I am calling the mesh **SuperMesh**. We will set the variable's `UPROPERTY` to `VisibleAnywhere` so we can easily add a mesh in the editor. Below is the final header code.

### CreateStaticMesh.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CreateStaticMesh.generated.h"

UCLASS()
class UNREALCPP_API ACreateStaticMesh : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ACreateStaticMesh();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(VisibleAnywhere)
	UStaticMeshComponent* SuperMesh;
};
```

In our `.cpp` file let's a simple static mesh component to our actor in our actor's init function. Use `CreateDefaultSubobject` to create a new `UStaticMeshComponent` can call it anything you like. In this example I called the mesh `My Super Mesh`. Below is the final `.cpp` code.

### CreateStaticMesh.cpp
```cpp
#include "CreateStaticMesh.h"


// Sets default values
ACreateStaticMesh::ACreateStaticMesh()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Add static mesh component to actor
	SuperMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("My Super Mesh"));

}

// Called when the game starts or when spawned
void ACreateStaticMesh::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ACreateStaticMesh::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```

Compile the code.

Now inside the editor, drag and drop in your new actor. In the actor's Details Panels, select the static mesh you want to add to the actor.

#### add static mesh
[![add static mesh](https://res.cloudinary.com/several-levels/image/upload/v1511871984/add-static-mesh-screenshot_oodbx3.jpg "add static mesh")](https://res.cloudinary.com/several-levels/image/upload/v1511871984/add-static-mesh-screenshot_oodbx3.jpg)


