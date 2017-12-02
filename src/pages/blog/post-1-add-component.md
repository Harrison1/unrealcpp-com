---
templateKey: blog-post
path: /add-component
title: Add Component
author: Harrison McGuire
authorImage: https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg
authorTwitter: HarryMcGueeze
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1511648024/add-billboard-component_yhhmzf.jpg
featuredVideo: youtube.com
tags:
  - beginner
  - component
  - billboard
uev: 4.18.1
date: 2017-11-24T23:30:08.852Z
description: In this tutorial we are going to programatically add a Billboard Component to our actor.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/AddBillboardComp](https://github.com/Harrison1/unrealcpp/tree/master/AddBillboardComp)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial we are going to add a `Billboard Component` to our actor. Adding components can also be easly added in the UE4 editor, but let's go ahead and do it programatically.

First we'll create a new actor named `AddBillboardComp`. Remember, if you call your actor something different, be sure to change the name everywhere in the header and cpp file.

In the header file we will create one variable that inherents from the `UBillboardComponent` class. This will allow us to add a billboard component and use it's attributes.

### AddBillboardComp.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "AddBillboardComp.generated.h"

UCLASS()
class UNREALCPP_API AAddBillboardComp : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AAddBillboardComp();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare point light comp
	UPROPERTY(VisibleAnywhere)
	class UBillboardComponent* MyBillboardComp;
	
};
```

In the `.cpp` file we are going to add the `Billboard Component` to our actor. This process is very similar to adding any component to an actor. 

If you want to use any component class with you actor, you have to to include the component header file in the `.cpp` file. So, let's add the `Billboard Component` file to our code. Add all necessary scripts under the named components header include call.

#### Add BillboardComponent.h
```cpp
#include "Components/BillboardComponent.h"
```

For this tutorial we are going to add the component in the actor's init function. This will ensure the component is added to the actor whenever it is added to a scene.

#### Create a default sub object of the billboard component
```cpp
MyBillboardComp = CreateDefaultSubobject<UBillboardComponent>(TEXT("Root Billboard Comp"));
```

#### For this tutorial let's make it so we can see the billboard sprite in game
```cpp
MyBillboardComp->SetHiddenInGame(false, true);
```

#### Make the billboard component the root component
```cpp
RootComponent = MyBillboardComp;
```

Below is the final `.cpp` file.

### AddBillboardComp.h
```cpp
#include "AddBillboardComp.h"
// include billboard comp
#include "Components/BillboardComponent.h"


// Sets default values
AAddBillboardComp::AAddBillboardComp()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	MyBillboardComp = CreateDefaultSubobject<UBillboardComponent>(TEXT("Root Billboard Comp"));
	MyBillboardComp->SetHiddenInGame(false, true);
	RootComponent = MyBillboardComp;

}

// Called when the game starts or when spawned
void AAddBillboardComp::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AAddBillboardComp::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```