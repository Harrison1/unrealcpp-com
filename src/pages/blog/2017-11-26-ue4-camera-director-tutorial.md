---
templateKey: blog-post
path: /ue4-camera-director-tutorial
title: Unreal Engine 4 Camera Director Tutorial
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657693/camera-director_wpndap.jpg
featuredVideo: youtube.com
tags:
  - intermediate
  - ue4 tutorial
  - camera
uev: 4.18.1
date: 2017-11-26T14:13:13.628Z
description: This is a walkthrough on how to complete Epic's Game-Controlled Cameras Tutorial
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/CameraDirector](https://github.com/Harrison1/unrealcpp/tree/master/CameraDirector)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

This is a walkthrough tutorial for Epic's [Game-Controlled Camers tutorial](https://docs.unrealengine.com/latest/INT/Programming/Tutorials/AutoCamera/index.html).

Create a new actor called `CameraDirector`. Then add three variables to the header file. Add two camera actors that inherent from the actor class. Make the `UPROPERTY` `EditAnywhere` so we can add in actors in the editor. These two camers will be the actors our view will switch between. Add a `float` variable so I can use it in the `.cpp` file. Below is the header file.

### CameraDirector.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CameraDirector.generated.h"

UCLASS()
class UNREALCPP_API ACameraDirector : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ACameraDirector();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// declare variables
	UPROPERTY(EditAnywhere)
	AActor* CameraOne;

	UPROPERTY(EditAnywhere)
	AActor* CameraTwo;

	float TimeToNextCameraChange;
	
};
```

First we want to add in the `Kismet/GameplayStatics.h` script to allow us to access the player controller.

```cpp
#include "CameraDirector.h"
// include Kismet/GameplayStatics.h
#include "Kismet/GameplayStatics.h"
```

The rest of the logic for this actor will be added to `Tick` function. Declare two float variables. These two float variables will manage the time between camera changes and the amount of time to smootly blend between views.

#### add float variables
```cpp
void ACameraDirector::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	const float TimeBetweenCameraChanges = 2.0f;
    const float SmoothBlendTime = 0.75f;

}
```

Next, remove `DeltaTime` from the float variable we declared in our header file, `TimeToNextCameraChange`.

#### subtract DeltaTime from TimeToNextCameraChange
```cpp
// Called every frame
void ACameraDirector::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
	const float TimeBetweenCameraChanges = 2.0f;
    const float SmoothBlendTime = 0.75f;
	TimeToNextCameraChange -= DeltaTime;

}
```

Aftwards, we want to check if `TimeToNextCameraChange` is less than or equal to 0. If `true` set `TimeToNextCameraChange` back to  2 seconds by adding `TimeBetweenCameraChanges` to it. Get the `PlayerController` by using the `UGameplayStatics` method `GetPlayerController`. By getting the `PlayerController`, we can set its view target. We check if the view target is `CameraOne` and depedning on our result will switch cameras appropriately. 

#### GetPlayerController
```cpp
APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
```

#### SetTargetWithBlend
```cpp
OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
```

#### SetViewTargert
```cpp
OurPlayerController->SetViewTarget(CameraOne);
``` 
Below is the full `.cpp` file.

### CameraDirector.cpp
```cpp
// Called every frame
void ACameraDirector::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	const float TimeBetweenCameraChanges = 2.0f;
    const float SmoothBlendTime = 0.75f;
	TimeToNextCameraChange -= DeltaTime;
	
    if (TimeToNextCameraChange <= 0.0f)
    {
        TimeToNextCameraChange += TimeBetweenCameraChanges;

        //Find the actor that handles control for the local player.
        APlayerController* OurPlayerController = UGameplayStatics::GetPlayerController(this, 0);
        if (OurPlayerController)
        {
            if (CameraTwo && (OurPlayerController->GetViewTarget() == CameraOne))
            {
                //Blend smoothly to camera two.
                OurPlayerController->SetViewTargetWithBlend(CameraTwo, SmoothBlendTime);
            }
            else if (CameraOne)
            {
                //Cut instantly to camera one.
                OurPlayerController->SetViewTarget(CameraOne);
            }
        }
    }

}
```

Drag and drop the CameraDirector actor into the scene. Drag in two cameras (or any actors) into the scene and set them as `CameraOne` and `CameraTwo`. Now push play and see your view target go from one camera to the other.