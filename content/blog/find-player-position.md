---
templateKey: blog-post
title: Find Player Position
image: https://res.cloudinary.com/several-levels/image/upload/v1512222398/get-player-position_rd1bss.jpg
video: SovEiHzHlqU
tags: ["beginner", "location"]
uev: 4.18.3
date: 2017-11-30T17:30:13.628Z
description: How to find the player's location.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/FindPlayerPosition](https://github.com/Harrison1/unrealcpp/tree/master/FindPlayerPosition)**

*For this tutorial we are using the standard first person C++ template with starter content. If you don't know how to add a new actor class to your project, please visit the [Add C++ Actor Class](/add-actor-class) post.*

This is a simple tutorial on how to get the player's current vector location from another `actor`. Create a new class called **FindPlayerLocation** inheriting from the `Actor` parent class. We don't have to do anything in header file. Below is the default header file generated for our class.]

### FindPlayerPosition.h
```cpp
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "FindPlayerPosition.generated.h"

UCLASS()
class UNREALCPP_API AFindPlayerPosition : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AFindPlayerPosition();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

};
```

In the `.cpp` file we will be putting our logic in the actor's `Tick` function. The get the player's location use the `GetWorld()` function that every actor has access to, then use `GetFirstPlayerController()`, then `GetPawn()`, and then `GetActorLocation()`. Below is the final function we will be calling. We are passing the return `Vector` to a variable called **MyCharacter**.

#### GetActorLocation()
```cpp
FVector MyCharacter = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();
```

Below is the final `.cpp` file. I added in a `DebugMessage` to print out our player's location to screen on every frame.

### FindPlayerPosition.cpp
```cpp
#include "FindPlayerPosition.h"


// Sets default values
AFindPlayerPosition::AFindPlayerPosition()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void AFindPlayerPosition::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AFindPlayerPosition::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// get first player pawn location
	FVector MyCharacter = GetWorld()->GetFirstPlayerController()->GetPawn()->GetActorLocation();

	// screen log player location
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Blue, FString::Printf(TEXT("Player Location: %s"), *MyCharacter.ToString()));	

}
```


