---
templateKey: blog-post
path: /trigger-box-specific-actor
title: Trigger Box With Specific Actor
author: Harrison McGuire
authorImage: https://res.cloudinary.com/several-levels/image/upload/v1511952457/harrison-mcguire_c8hczw.jpg
authorTwitter: HarryMcGueeze
featuredImage: https://res.cloudinary.com/several-levels/image/upload/v1512221876/trigger-box-specific-actor_jtm9pb.jpg
tags:
  - trigger
  - overlap
uev: 4.18.1
date: 2017-12-01T14:43:44.226Z
description: Trigger overlap events only when a specific actor enters the TriggerBox.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/TriggerBoxSpecificActor](https://github.com/Harrison1/unrealcpp/tree/master/TriggerBoxSpecificActor)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

For this tutorial will trigger overlap events by a specific actor. 

Create a new `C++` `TriggerBox` class and call it **TriggerBoxSpecificActor**. In the header file we will declare two `void` overlap functions and `AActor` class for our specific actor. Below is the final header code.

### TriggerBoxSpecificActor.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Engine/TriggerBox.h"
#include "TriggerBoxSpecificActor.generated.h"


UCLASS()
class UNREALCPP_API ATriggerBoxSpecificActor : public ATriggerBox
{
	GENERATED_BODY()

protected:

	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	
public:

	// constructor sets default values for this actor's properties
	ATriggerBoxSpecificActor();

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

In the `.cpp` file to help us visualize the trigger box, we will have to `#include` the `DrawDebugHelpers.h` file.

#### include files
```cpp
#include "TriggerBoxSpecificActor.h"
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
ATriggerBoxSpecificActor::ATriggerBoxSpecificActor()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &ATriggerBoxSpecificActor::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &ATriggerBoxSpecificActor::OnOverlapEnd);
}
```

On `BeginPlay` we will draw the debug box using `DrawDebugBox`.

#### DrawDebugBox
```cpp
// Called when the game starts or when spawned
void ATriggerBoxSpecificActor::BeginPlay()
{
	Super::BeginPlay();

    DrawDebugBox(GetWorld(), GetActorLocation(), GetComponentsBoundingBox().GetExtent(), FColor::Green, true, -1, 0, 5);
	
}
```

Next, we will write our overlap functions that simply print a message to the screen when our specift actor enters the and exits the `TriggerBox`. In the overlap function we put `OtherActor == SpecificActor` to check if the actor in the `TriggerBox` is our specific actor.

#### overlap functions
```cpp
void ATriggerBoxSpecificActor::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap Begin");
        printFString("Overlapping Actor = %s", *OtherActor->GetName());
    }
}

void ATriggerBoxSpecificActor::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap End");
        printFString("%s has left the Trigger Box", *OtherActor->GetName());
    }
}
```

Compile the code. Drag and drop your new actor into your game. Add an actor the **Specific Actor** in the actor's details panel. Push play and push or shoot the specific actor into the `TriggerBox` to trigger the overlap events. Below is the final `.cpp` file.

### TriggerBoxSpecificActor.cpp
```cpp
#define print(text) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 1.5, FColor::Green,text)
#define printFString(text, fstring) if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, FString::Printf(TEXT(text), fstring))

#include "TriggerBoxSpecificActor.h"
// include draw debug helpers header file
#include "DrawDebugHelpers.h"

ATriggerBoxSpecificActor::ATriggerBoxSpecificActor()
{
    //Register Events
    OnActorBeginOverlap.AddDynamic(this, &ATriggerBoxSpecificActor::OnOverlapBegin);
    OnActorEndOverlap.AddDynamic(this, &ATriggerBoxSpecificActor::OnOverlapEnd);
}

// Called when the game starts or when spawned
void ATriggerBoxSpecificActor::BeginPlay()
{
	Super::BeginPlay();

    DrawDebugBox(GetWorld(), GetActorLocation(), GetComponentsBoundingBox().GetExtent(), FColor::Green, true, -1, 0, 5);
	
}

void ATriggerBoxSpecificActor::OnOverlapBegin(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap Begin");
        printFString("Overlapping Actor = %s", *OtherActor->GetName());
    }
}

void ATriggerBoxSpecificActor::OnOverlapEnd(class AActor* OverlappedActor, class AActor* OtherActor)
{
    //if the overlapping actor is the specific actor we identified in the editor
    if (OtherActor && (OtherActor != this) && OtherActor == SpecificActor )
    {
        print("Overlap End");
        printFString("%s has left the Trigger Box", *OtherActor->GetName());
    }
}
```