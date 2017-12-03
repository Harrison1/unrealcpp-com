---
templateKey: blog-post
path: /trigger-volume
title: Trigger Volume
image: https://res.cloudinary.com/several-levels/image/upload/v1512221876/trigger-volume_uw7r5i.jpg
tags:
  - trigger
uev: 4.18.1
date: 2017-12-02T05:55:44.226Z
description: A tutorial on how to trigger overlap events using a TriggerVolume.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/TriggerVolume](https://github.com/Harrison1/unrealcpp/tree/master/TriggerVolume)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial will trigger an event when the character overlaps a `TriggerVolume`.

Create a new `C++` `TriggerVolume` class and call it `MyTriggerVolume`. In the header file add `OnOverlapBegin` and `OnOverlapEnd` functions. Below is the final header file.

### MyTriggerVolume.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Engine/TriggerVolume.h"
#include "MyTriggerVolume.generated.h"

/**
 * 
 */
UCLASS()
class UNREALCPP_API AMyTriggerVolume : public ATriggerVolume
{
	GENERATED_BODY()

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	
public:

	// constructor sets default values for this actor's properties
	AMyTriggerVolume();

	// overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor);

	// overlap end function
	UFUNCTION()
	void OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor);
	
};
	
```

In the `.cpp` file to help us visualize the trigger volume, we will have to `#include` the `DrawDebugHelpers.h` file.

#### include files
```cpp
#include "MyTriggerVolume.h"
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
AMyTriggerVolume::AMyTriggerVolume()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &AMyTriggerVolume::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &AMyTriggerVolume::OnOverlapEnd);
}
```

On `BeginPlay` we will draw the debug box using `DrawDebugBox`.

#### DrawDebugBox
```cpp
void AMyTriggerVolume::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), GetActorScale()*100, FColor::Cyan, true, -1, 0, 5);
	
}
```

Next, we will write our overlap functions that simply print a message to the screen indicating the actor that that entered and exited the `TriggerVolume`.

#### overlap functions
```cpp
void AMyTriggerVolume::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor enters trigger volume
        print("Overlap Begin");
        printFString("Other Actor = %s", *OtherActor->GetName());
    }
}

void AMyTriggerVolume::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor leaves trigger volume
        print("Overlap Ended");
        printFString("%s has left the Trigger Volume", *OtherActor->GetName());
    }
}
```

Compile the code. Drag and drop your new actor into your game. Push play and walk in and out of the trigger volume. Below is the final `.cpp` file.

### MyTriggerVolume.cpp
```cpp
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT(text), fstring))

#include "MyTriggerVolume.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"

AMyTriggerVolume::AMyTriggerVolume()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &AMyTriggerVolume::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &AMyTriggerVolume::OnOverlapEnd);
}

// Called when the game starts or when spawned
void AMyTriggerVolume::BeginPlay()
{
	Super::BeginPlay();

	DrawDebugBox(GetWorld(), GetActorLocation(), GetActorScale()*100, FColor::Cyan, true, -1, 0, 5);
	
}

void AMyTriggerVolume::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor enters trigger volume
        print("Overlap Begin");
        printFString("Other Actor = %s", *OtherActor->GetName());
    }
}

void AMyTriggerVolume::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor leaves trigger volume
        print("Overlap Ended");
        printFString("%s has left the Trigger Volume", *OtherActor->GetName());
    }
}
```