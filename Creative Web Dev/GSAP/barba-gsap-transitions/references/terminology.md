# Terminology

**Barba Wrapper**:
The persistent outer DOM wrapper denoted by `data-barba="wrapper"` that holds both shared UI elements and dynamic content containers.
_Avoid_: page wrapper, outer container, layout root

**Barba Container**:
The dynamic page section denoted by `data-barba="container"` that Barba.js removes and replaces during page navigation.
_Avoid_: content box, view container, page body

**Barba Namespace**:
A unique identifier set on a container via `data-barba-namespace="name"` allowing custom transitions and page-specific logic.
_Avoid_: page id, route name, view key

**Leave Hook**:
The Barba lifecycle hook executed before leaving the current page, responsible for exit animations and asynchronous pausing.
_Avoid_: exit hook, unload handler

**Enter Hook**:
The Barba lifecycle hook executed when the new page container is mounted and ready for entrance animations.
_Avoid_: load hook, mount trigger

**Once Hook**:
The Barba lifecycle hook triggered only once upon the initial website load.
_Avoid_: init hook, bootstrap trigger
