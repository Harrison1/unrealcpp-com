---
templateKey: blog-post
path: /set-view-target
title: Set View Target
image: https://res.cloudinary.com/several-levels/image/upload/v1512221876/set-view-target_xnz2ah.jpg
video: DzJasz19EnA
tags:
  - view target
uev: 4.18.1
date: 2017-12-01T06:25:44.226Z
description: A tutorial on how to change the view target of the current player.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/SetViewTarget](https://github.com/Harrison1/unrealcpp/tree/master/SetViewTarget)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this simple tutorial we will simply change the view target of the player when the game begins. 

Create a new `C++` actor class and call it **SetViewTarget**. In the header file we will declare an actor variable and call it **MyActor**. Make the new actor editable anywhere.

### SetViewTarget.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SetViewTarget.generated.h"

UCLASS()
class UNREALCPP_API ASetViewTarget : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ASetViewTarget();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare variables
	UPROPERTY(EditAnywhere)
	AActor* MyActor;
	
};
```

First, in order to possess the player we need to `#include` the `Kismet/GameplayStatics.h` file.

#### include files
```cpp
#include "SetViewTarget.h"
// include gameplay statics header file
#include "Kismet/GameplayStatics.h"
```

In this example all of our logic will go inside the `BeginPlay` function. We need to possess the current player by doing `UGameplayStatics::GetPlayerController(this, 0)`. This will get the first player in the game scene. Next we are going to set our possessed player's view target with to our `MyActor` variable by using `SetViewTarget(MyActor)`. Below is the final `.cpp` file.

### SetViewTarget.cpp
```cpp
#include "SetViewTarget.h"
// include gameplay statics header file
#include "Kismet/GameplayStatics.h"


// Sets default values
ASetViewTarget::ASetViewTarget()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void ASetViewTarget::BeginPlay()
{
	Super::BeginPlay();

	//Find the actor that handles control for the local player.
	APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);

	//Cut instantly to our actor on begin play.
	OurPlayerController->SetViewTarget(MyActor);
	
}

// Called every frame
void ASetViewTarget::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```

Compile the code. Drag and drop your new actor into your game. In the editor add a staic mesh to the `MyActor` variable in the actor's detail's panel. Push play and the player's camera will be on the new actor. 