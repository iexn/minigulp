let Header = component.header();

let Container = component.getContainer();
Container.append(Header);

Container.render();

debug(Container, Header);
