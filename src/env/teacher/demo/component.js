component.header = function (data = {}) {
    let DM = component.create(`<div>${lang("__PAGE__")}</div>`, {
        name: 111,
        list: [
            {
                id: 1,
                name: "投递员"
            }
        ],
        formSet: {
            id: 20,
            auths: [1,3,4]
        },
        
    });

    return DM;
};

export default component;