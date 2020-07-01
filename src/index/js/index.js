let Header = component.header();

let Container = component.getContainer();
Container.append(Header);

Container.render();

let componentHeaderListener__name = function (val) {
    debug(val)
}

// Header.on("name", componentHeaderListener__name)
Header.on("list", componentHeaderListener__name)
Header.on("list.0.id", componentHeaderListener__name)
// Header.on("formSet.id", componentHeaderListener__name)

// Header.onDataChange(function (name, value) {
//     debug(name, value);
// });

console.log(Header)

Header.data.list.push(123, 222)
Header.data.list[0].id = 3;