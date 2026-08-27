# Terminology

**Barba Wrapper**:
The persistent outer DOM boundary (annotated via `data-barba="wrapper"`) that maintains global state, scripts, and persistent visual layers across navigations.
_Avoid_: page wrapper, site container, app shell

**Barba Container**:
The contextual DOM segment (annotated via `data-barba="container"`) that Barba extracts from incoming pages and swaps into the current DOM.
_Avoid_: route view, dynamic template, swappable div

**Barba Namespace**:
A unique attribute value (`data-barba-namespace="[name]"`) defining page identity to permit targeted transition rules.
_Avoid_: page identifier, route tag

**Sync Mode**:
Barba initialization configuration (`sync: true`) enabling incoming and outgoing page transitions to execute concurrently rather than strictly sequentially.
_Avoid_: parallel routing, async mode

**Curtain Overlay**:
A multi-segment overlay element residing outside the Barba container used to visually mask the DOM replacement process.
_Avoid_: loading screen, transition mask
