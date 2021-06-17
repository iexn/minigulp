"use strict";

function init() {
  var HeaderDM = component.header();
  var Container = component.getContainer();
  Container.append(HeaderDM);
  Container.render();
}

init();