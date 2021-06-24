---
templateKey: blog-post
title: Set View Target With Blend
image: https://res.cloudinary.com/dz09rnbhe/image/upload/unrealcpp/set-view-target-with-blend_qdc2za.jpg
video: jv78jI5OD00
tags: ["view target"]
uev: 4.18.3
date: 2017-12-01T07:25:44.226Z
description: A tutorial on how to change the view target of the current player with smooth blending movement.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/SetViewTargetBlend](https://github.com/Harrison1/unrealcpp/tree/master/SetViewTargetBlend)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this simple tutorial we will simply change the view target of the player with smooth blending movement when the game begins. 

Create a new `C++` actor class and call it **SetViewTargetBlend**. In the header file we will declare an actor variable and call it **MyActor**. Make the new actor editable anywhere.

### SetViewTargetBlend.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SetViewTargetBlend.generated.h"

UCLASS()
class UNREALCPP_API ASetViewTargetBlend : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ASetViewTargetBlend();

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
#include "SetViewTargetBlend.h"
// include gameplay statics header file
#include "Kismet/GameplayStatics.h"
```

In this example all of our logic will go inside the `BeginPlay` function. We need to possess the current player by doing `UGameplayStatics::GetPlayerController(this, 0)`. This will get the first player in the game scene. Next we are going to set our possessed player's view target with to our `MyActor` variable by using `SetViewTargetWithBlend(MyActor, 2.f)`. We set the blending time to 2 seconds, this will indicate how long it will take for the camera to move to the new target. Below is the final `.cpp` file.

### SetViewTargetBlend.cpp
```cpp
#include "SetViewTargetBlend.h"
// include gameplay statics header file
#include "Kismet/GameplayStatics.h"


// Sets default values
ASetViewTargetBlend::ASetViewTargetBlend()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void ASetViewTargetBlend::BeginPlay()
{
	Super::BeginPlay();

	//Find the actor that handles control for the local player.
	APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
	
	//Smoothly transition to our actor on begin play.
	OurPlayerController->SetViewTargetWithBlend(MyActor, 2.f);
	
}

// Called every frame
void ASetViewTargetBlend::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}
```

Compile the code. Drag and drop your new actor into your game. In the editor add a static mesh to the `MyActor` variable in the actor's detail's panel. Push play and the player's camera will move over to the new actor in 2 seconds. 