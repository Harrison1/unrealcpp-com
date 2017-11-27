---
templateKey: blog-post
path: /colliding-pawn
title: Colliding Pawn UE4 Tutorial
author: Harrison McGuire
authorImage: 'https://avatars1.githubusercontent.com/u/5263612?s=460&v=4'
authorTwitter: HarryMcGueeze
featuredImage: >-
  https://res.cloudinary.com/several-levels/image/upload/v1511657692/colliding-pawn_uu9gao.jpg
featuredVideo: youtube.com
tags:
  - intermediate
  - pawn
  - ue4 tutorial
uev: 4.18.1
date: 2017-11-27T08:15:13.628Z
description: How to do the Components and Collision tutorial in the UE4 documentation.
---
**Github Link: [https://github.com/Harrison1/unrealcpp/tree/master/CollidingPawn](https://github.com/Harrison1/unrealcpp/tree/master/CollidingPawn)**

*For this tutorial we are using the standard first person C++ template with starter content.*

This is a tutorial going over how to do the Components and Collision tutorial provided in the UE4 documentation. You can find the tutorial link [here](https://docs.unrealengine.com/latest/INT/Programming/Tutorials/Components/index.html)

Create a new `C++` class that inherents from the parent class of `UPawnMovementComponent` anc call it `CollidingPawnMovementComponent`. We will use this component in the pawn we create later.

#### new cpp movement comp class
[![new c++ movement comp class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg "new c++ movement comp class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg.jpg)

#### new pawn movement comp
[![new pawn movement comp](https://res.cloudinary.com/several-levels/image/upload/v1511788356/pawn-movement-comp_u6zzmz.jpg "new pawn movement comp")](https://res.cloudinary.com/several-levels/image/upload/v1511788356/pawn-movement-comp_u6zzmz.jpg)


#### save new movement comp
[![save new movement comp](https://res.cloudinary.com/several-levels/image/upload/v1511788356/save-pawn-movement-comp_ukuxtv.jpg "save new movement comp")](https://res.cloudinary.com/several-levels/image/upload/v1511788356/save-pawn-movement-comp_ukuxtv.jpg)

Create a new `C++` class that inherents from the parent `Pawn` class and call it `CollidingPawn`.

#### new cpp class
[![new c++ class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg "new c++ class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/new-pawn-class_dgifxq.jpg.jpg)

#### new pawn
[![parent pawn class](https://res.cloudinary.com/several-levels/image/upload/v1511787005/parent-pawn_sncmyb.jpg "parent pawn class")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/parent-pawn_sncmyb.jpg)

#### save it
[![save CollidingPawn](https://res.cloudinary.com/several-levels/image/upload/v1511787005/save-colliding-pawn_g5ktxl.jpg "save CollidingPawn")](https://res.cloudinary.com/several-levels/image/upload/v1511787005/save-colliding-pawn_g5ktxl.jpg)

In the header file we want to declare the variable we going to be using in the `.cpp` file. We will declare our movementment variables 

#### add to the header file
```cpp
public:	

    ...

    UParticleSystemComponent* OurParticleSystem;
    class UCollidingPawnMovementComponent* OurMovementComponent;

    virtual UPawnMovementComponent* GetMovementComponent() const override;

    void MoveForward(float AxisValue);
    void MoveRight(float AxisValue);
    void Turn(float AxisValue);
    void ParticleToggle();
};
```