---
templateKey: blog-post
path: /pickup-rotate-and-trhow-object
title: Pickup, Rotate, and Throw Object Like Gone Home
image: https://res.cloudinary.com/several-levels/image/upload/v1520943148/pikcup-rotate-actor_lebmpn.jpg
video: KsvUYzrTwBw
tags: ["intermediate"]
uev: 4.19.0
date: 2018-03-17T12:00:00.226Z
description: In this tutorial we'll learn how to pickup and inspect an object similar to Gone Home.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/PickupAndRotateActor](https://github.com/Harrison1/unrealcpp/tree/master/PickupAndRotateActor)**

*For this tutorial we are using the standard first person C++ template with the starter content.*

In this Unreal Engine 4 C++ tutorial we'll learn how to pickup and inspect an object similar to Gone Home's mechanic. In Gone Home, while using a keyboard, when you push `Shift` or `Right Click` you can zoom in to inspect an object. If you're looking at a pickup object, you pick up and hold the object using `E`. If you're hodling an object, now when you push `Shift` or `Right Click` to rotate the object using your mouse. WHen you're done with the object, you push `E` to throw it.

The first thing we'll do is setup our **Input Actions**. Go to Edit > Project Settings > Input. Under Action Mappings add an Action and title it **Action**. Bind the new action to whatever buttons you want, for this tutorial I will be binding the **Action** button to the `E` key and the `Gamepad Face Button Left`. Next, add a new Action and title it **Inspect**. Bind the **Inspect** action to the `Left Shift` key, the `Right Mouse Button`, and the `Gamepad Right Trigger`.

### Action Bindings
[![action bindings](https://res.cloudinary.com/several-levels/image/upload/v1521112199/action-mappings-inspect_ohwadj.jpg
 "action bindings")](https://res.cloudinary.com/several-levels/image/upload/v1521112199/action-mappings-inspect_ohwadj.jpg)

Next, create a new **actor** class and call it whatever you want, in this tutorial I will call it `PickupAndRotateActor`.

In the new actor's header file, first add in the camera component because we'll be using a camera variable in the script.

#### include camera component
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
// include camera component
#include "Camera/CameraComponent.h"
``` 

Next, we'll create the variables we will be using in the actor. We will need to create a `StaticMeshComponent`, a `USceneComponent`, two functions, two `bools`, and four variables to track our player's forward vector and placement were we want to place the `actor` while it's being held.

#### header variables
```cpp
...
public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere)
	UStaticMeshComponent* MyMesh;

	UPROPERTY(EditAnywhere)
	USceneComponent* HoldingComp;

	UFUNCTION()
	void RotateActor();

	UFUNCTION()
	void Pickup();

	bool bHolding;
	bool bGravity;

	FRotator ControlRotation;
	ACharacter* MyCharacter;
	UCameraComponent* PlayerCamera;
	FVector ForwardVector;
```