function init() {
    let HeaderDM = component.header();
    
    let Container = component.getContainer();
    Container.append(HeaderDM);
    Container.render();
}

export default init;
