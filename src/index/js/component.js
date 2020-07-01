//= extend common/component.js

/* ^ block:main */
component.header = function () {
    let DOMMAP = component.create(`<div>${lang("__PAGE__")}</div>`, {
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

    return DOMMAP;
};
/* $ block:main */