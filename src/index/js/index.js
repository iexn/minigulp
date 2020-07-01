let Header = component.header();

let Container = component.getContainer();
Container.append(Header);

Container.render();

let componentHeaderListener__name = function (val) {
    debug(1111111111)
}

// Header.on("name", componentHeaderListener__name)
// Header.on("list", componentHeaderListener__name)
Header.on("formSet.id", componentHeaderListener__name)

// Header.onDataChange(function (name, value) {
//     debug(name, value);
// });

console.log(Header)

Header.data.name = 222
Header.data.list.push(123, 222)
Header.data.formSet.id = 49;