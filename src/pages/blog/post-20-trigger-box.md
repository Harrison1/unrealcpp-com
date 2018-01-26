---
templateKey: blog-post
path: /trigger-box
title: Trigger Box
image: https://res.cloudinary.com/several-levels/image/upload/v1512221876/trigger-box_pnwkdo.jpg
video: Ck3OE_olUr0
tags: ["trigger"]
uev: 4.18.3
date: 2017-12-01T15:25:44.226Z
description: >-
  A tutorial on how to trigger overlap events using a TriggerBox.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/TriggerBox](https://github.com/Harrison1/unrealcpp/tree/master/TriggerBox)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

In this tutorial will trigger an event when the character overlaps a `TriggerBox`.

Create a new `C++` `TriggerBox` class and call it `MyTriggerBox`. In the header file add `OnOverlapBegin` and `OnOverlapEnd` functions. Below is the final header file.

### MyTriggerBox.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Engine/TriggerBox.h"
#include "MyTriggerBox.generated.h"

UCLASS()
class UNREALCPP_API AMyTriggerBox : public ATriggerBox
{
	GENERATED_BODY()

protected:

	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:

	// constructor sets default values for this actor's properties
	AMyTriggerBox();

    // declare overlap begin function
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	// declare overlap end function
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);
	
```

In the `.cpp` file to help us visualize the trigger box, we will have to `#include` the `DrawDebugHelpers.h` file.

#### include files
```cpp
#include "MyTriggerBox.h"
// include draw debu helpers header file
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
AMyTriggerBox::AMyTriggerBox()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &AMyTriggerBox::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &AMyTriggerBox::OnOverlapEnd);
}
```

On `BeginPlay` we will draw the debug box using `DrawDebugBox`.

#### DrawDebugBox
```cpp
void AMyTriggerBox::BeginPlay()
{
	Super::BeginPlay();

    DrawDebugBox(GetWorld(), GetActorLocation(), GetComponentsBoundingBox().GetExtent(), FColor::Purple, true, -1, 0, 5);
	
}
```

Next, we will write our overlap functions that simply print a message to the screen indicating the actor that that entered and exited the `TriggerBox`.

#### overlap functions
```cpp
void AMyTriggerBox::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    // check if Actors do not equal nullptr and that 
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor enters trigger box
        print("Overlap Begin");
        printFString("Overlapped Actor = %s", *OverlappedActor->GetName());
    }
}

void AMyTriggerBox::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor leaves trigger box
        print("Overlap Ended");
        printFString("%s has left the Trigger Box", *OtherActor->GetName());
    }
}
```

Compile the code. Drag and drop your new actor into your game. Push play and walk in and out of the trigger box. Below is the final `.cpp` file.

### MyTriggerBox.cpp
```cpp
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT(text), fstring))

#include "MyTriggerBox.h"
// include draw debu helpers header file
#include "DrawDebugHelpers.h"

AMyTriggerBox::AMyTriggerBox()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &AMyTriggerBox::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &AMyTriggerBox::OnOverlapEnd);
}

// Called when the game starts or when spawned
void AMyTriggerBox::BeginPlay()
{
	Super::BeginPlay();

    DrawDebugBox(GetWorld(), GetActorLocation(), GetComponentsBoundingBox().GetExtent(), FColor::Purple, true, -1, 0, 5);
	
}

void AMyTriggerBox::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    // check if Actors do not equal nullptr and that 
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor enters trigger box
        print("Overlap Begin");
        printFString("Overlapped Actor = %s", *OverlappedActor->GetName());
    }
}

void AMyTriggerBox::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    if (OtherActor && (OtherActor != this)) {
        // print to screen using above defined method when actor leaves trigger box
        print("Overlap Ended");
        printFString("%s has left the Trigger Box", *OtherActor->GetName());
    }
}
```