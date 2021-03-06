---
templateKey: blog-post
title: Trigger Volume With Specific Actor
image: https://res.cloudinary.com/several-levels/image/upload/v1512221876/trigger-box-specific-actor_jtm9pb.jpg
video: rvf6uOT5Abs
tags: ["trigger"]
uev: 4.18.3
date: 2017-12-02T06:55:44.226Z
description: Trigger overlap events only when a specific actor enters the TriggerVolume.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/TriggerVolumeSpecificActor](https://github.com/Harrison1/unrealcpp/tree/master/TriggerVolumeSpecificActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

For this tutorial will trigger overlap events by a specific actor. The tutorial video uses a *TriggerBox*, but the process should be similar.

Create a new `C++` `TriggerVolume` class and call it **TriggerVolumeSpecificActor**. In the header file we will declare two `void` overlap functions and `AActor` class for our specific actor. Below is the final header code.

### TriggerVolumeSpecificActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Engine/TriggerVolume.h"
#include "TriggerVolumeSpecificActor.generated.h"

UCLASS()
class UNREALCPP_API ATriggerVolumeSpecificActor : public ATriggerVolume
{
	GENERATED_BODY()

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	
	// constructor sets default values for this actor's properties
	ATriggerVolumeSpecificActor();

	// overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor);

	// overlap end function
	UFUNCTION()
	void OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor);

	// specific actor for overlap
	UPROPERTY(EditAnywhere)
	class AActor* SpecificActor;

};
```

In the `.cpp` file to help us visualize the trigger volume, we will have to `#include` the `DrawDebugHelpers.h` file.

#### include files
```cpp
#include "TriggerVolumeSpecificActor.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"
```

We can also `#define` some shortcuts for debug logging.

#### shortcuts for debug logging
```cpp
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT(text), fstring))
```

In the actor's init function we will register the overlap events with `OnActorBeginOverlap.AddDynamic` and `OnActorEndOverlap.AddDynamic`. 

##### register overlap events
```cpp
ATriggerVolumeSpecificActor::ATriggerVolumeSpecificActor()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &ATriggerVolumeSpecificActor::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &ATriggerVolumeSpecificActor::OnOverlapEnd);
}
```

On `BeginPlay` we will draw the debug box using `DrawDebugBox`.

#### DrawDebugBox
```cpp
// Called when the game starts or when spawned
void ATriggerVolumeSpecificActor::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), GetActorScale()*100, FColor::Turquoise, true, -1, 0, 5);
	
}
```

Next, we will write our overlap functions that simply print a message to the screen when our specific actor enters and exits the `TriggerVolume`. In the overlap function we put `OtherActor == SpecificActor` to check if the actor in the `TriggerVolume` is our specific actor.

#### overlap functions
```cpp
void ATriggerVolumeSpecificActor::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap Begin");
        printFString("Overlapping Actor = %s", *OtherActor->GetName());
    }
}

void ATriggerVolumeSpecificActor::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap End");
        printFString("%s has left the Trigger Volume", *OtherActor->GetName());
    }
}
```

Compile the code. Drag and drop your new actor into your game. Add an actor the **Specific Actor** in the actor's details panel. Push play and push or shoot the specific actor into the `TriggerVolume` to trigger the overlap events. Below is the final `.cpp` file.

### TriggerVolumeSpecificActor.cpp
```cpp
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT(text), fstring))

#include "TriggerVolumeSpecificActor.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"

ATriggerVolumeSpecificActor::ATriggerVolumeSpecificActor()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &ATriggerVolumeSpecificActor::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &ATriggerVolumeSpecificActor::OnOverlapEnd);
}

// Called when the game starts or when spawned
void ATriggerVolumeSpecificActor::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), GetActorScale()*100, FColor::Turquoise, true, -1, 0, 5);
	
}

void ATriggerVolumeSpecificActor::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap Begin");
        printFString("Overlapping Actor = %s", *OtherActor->GetName());
    }
}

void ATriggerVolumeSpecificActor::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap End");
        printFString("%s has left the Trigger Volume", *OtherActor->GetName());
    }
}

```